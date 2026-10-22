import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenAI } from '@google/genai'

export type SherpaMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type SherpaReply =
  | { reply: string; provider: 'gemini' | 'anthropic' }
  | { error: string }

const GEMINI_MODEL = 'gemini-3.8-flash'
const ANTHROPIC_MODEL = 'claude-haiku-4-5-20251001'
const GEMINI_TIMEOUT_MS = 9_000

const sherpaInstructions: Record<string, string> = {
  'vsl-writer':
    'Você é o Sherpa de Copywriter VSL. Conduza o usuário na construção de uma VSL clara e persuasiva, fazendo perguntas úteis e explicando brevemente o raciocínio por trás das recomendações. Responda em português.',
  'funnel-architect':
    'Você é o Sherpa Arquiteto de Funil. Ajude o usuário a estruturar oferta, etapas do funil, público e pontos de conversão. Faça uma pergunta de cada vez quando faltarem informações e explique as decisões. Responda em português.',
  'traffic-analyst':
    'Você é o Sherpa Gestor de Tráfego. Ajude o usuário a planejar campanhas, públicos, criativos e métricas de tráfego pago. Seja prático, peça contexto quando necessário e explique suas recomendações. Responda em português.',
}

export async function generateSherpaReply(
  agentId: string,
  conversation: SherpaMessage[],
): Promise<SherpaReply> {
  const systemPrompt = sherpaInstructions[agentId]
  if (!systemPrompt) return { error: 'Especialista não encontrado.' }

  const messages = conversation.slice(-12).map(({ role, content }) => ({
    role,
    content: content.slice(0, 4_000),
  }))

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY não configurada')
    }

    const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS)

    try {
      const response = await gemini.models.generateContent({
        model: GEMINI_MODEL,
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
    } finally {
      clearTimeout(timeout)
    }
  } catch (geminiError) {
    console.warn(
      'Gemini falhou; acionando o fallback Anthropic.',
      geminiError instanceof Error ? geminiError.message : geminiError,
    )

    if (!process.env.ANTHROPIC_API_KEY) {
      return {
        error: 'Não foi possível gerar uma resposta. Verifique as chaves GEMINI_API_KEY e ANTHROPIC_API_KEY no ambiente do servidor.',
      }
    }

    try {
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
        maxRetries: 0,
      })
      const response = await anthropic.messages.create({
        model: ANTHROPIC_MODEL,
        max_tokens: 1_024,
        system: systemPrompt,
        messages,
      })
      const reply = response.content
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('\n')
        .trim()

      if (!reply) throw new Error('Anthropic retornou uma resposta vazia')
      return { reply, provider: 'anthropic' }
    } catch (anthropicError) {
      console.error('Falha nos provedores Gemini e Anthropic', {
        geminiError,
        anthropicError,
      })
      return {
        error: 'Os provedores de IA estão indisponíveis no momento. Tente novamente em instantes.',
      }
    }
  }
}
