import { GoogleGenAI } from '@google/genai'
import { getSystemPrompt } from './prompts'

export type SherpaMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type SherpaReply =
  | { reply: string; provider: 'gemini' | 'openrouter' }
  | { error: string }

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-3-flash-preview'] as const
const OPENROUTER_MODEL = 'google/gemma-4-31b-it:free'
const GEMINI_TIMEOUT_MS = 8_000
const OPENROUTER_TIMEOUT_MS = 10_000

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

export async function generateSherpaReply(
  agentId: string,
  conversation: SherpaMessage[],
): Promise<SherpaReply> {
  const systemPrompt = getSystemPrompt(agentId)
  if (!systemPrompt) return { error: 'Especialista não encontrado.' }

  const messages = conversation.slice(-12).map(({ role, content }) => ({
    role,
    content: content.slice(0, 4_000),
  }))

  let geminiErrorMessage = ''
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY

  try {
    if (!geminiKey) {
      throw new Error('GEMINI_API_KEY ou GOOGLE_API_KEY não configurada')
    }

    const gemini = new GoogleGenAI({ apiKey: geminiKey })
    const controller = new AbortController()
    const timeout = setTimeout(
      () => controller.abort(new Error('Timeout do Gemini após 8 segundos')),
      GEMINI_TIMEOUT_MS,
    )
    const modelErrors: string[] = []

    try {
      for (const model of GEMINI_MODELS) {
        try {
          const response = await gemini.models.generateContent({
            model,
            contents: messages.map(({ role, content }) => ({
              role: role === 'assistant' ? 'model' : 'user',
              parts: [{ text: content }],
            })),
            config: {
              systemInstruction: systemPrompt,
              abortSignal: controller.signal,
              maxOutputTokens: 1_024,
            },
          })
          const reply = response.text?.trim()
          if (!reply) throw new Error('Gemini retornou uma resposta vazia')

          return { reply, provider: 'gemini' }
        } catch (error) {
          if (controller.signal.aborted) {
            throw new Error('Timeout do Gemini após 8 segundos')
          }
          modelErrors.push(`[${model}]: ${getErrorMessage(error)}`)
        }
      }

      throw new Error(modelErrors.join(' | '))
    } finally {
      clearTimeout(timeout)
    }
  } catch (error) {
    geminiErrorMessage = getErrorMessage(error)
    console.warn('Gemini falhou; acionando o fallback OpenRouter.', geminiErrorMessage)
  }

  let openRouterErrorMessage = ''
  try {
    const openRouterKey = process.env.OPENROUTER_API_KEY
    if (!openRouterKey) throw new Error('OPENROUTER_API_KEY não configurada')

    const controller = new AbortController()
    const timeout = setTimeout(
      () => controller.abort(new Error('Timeout do OpenRouter após 10 segundos')),
      OPENROUTER_TIMEOUT_MS,
    )

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openRouterKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
          ],
        }),
        signal: controller.signal,
      })

      const responseBody = await response.text()
      let payload: {
        choices?: Array<{ message?: { content?: unknown } }>
        error?: { message?: string }
      }

      try {
        payload = JSON.parse(responseBody)
      } catch {
        throw new Error(
          `OpenRouter retornou HTTP ${response.status}: ${responseBody || response.statusText}`,
        )
      }

      if (!response.ok) {
        throw new Error(
          `OpenRouter retornou HTTP ${response.status}: ${payload.error?.message || response.statusText}`,
        )
      }

      const reply = payload.choices?.[0]?.message?.content
      if (typeof reply !== 'string' || !reply.trim()) {
        throw new Error('OpenRouter retornou uma resposta vazia')
      }

      return { reply: reply.trim(), provider: 'openrouter' }
    } catch (error) {
      openRouterErrorMessage = controller.signal.aborted
        ? 'Timeout do OpenRouter após 10 segundos'
        : getErrorMessage(error)
    } finally {
      clearTimeout(timeout)
    }
  } catch (error) {
    openRouterErrorMessage = getErrorMessage(error)
  }

  const error = `[Gemini]: ${geminiErrorMessage} | [OpenRouter]: ${openRouterErrorMessage}`
  console.error('Todos os provedores gratuitos falharam.', error)
  return { error }
}
