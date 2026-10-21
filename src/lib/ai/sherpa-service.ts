import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'

export type SherpaMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type SherpaReply =
  | { reply: string; provider: 'openrouter' | 'anthropic' }
  | { error: string }

const OPENROUTER_MODEL = 'google/gemma-4-26b-a4b-it:free'
const ANTHROPIC_MODEL = 'claude-haiku-4-5-20251001'
const OPENROUTER_TIMEOUT_MS = 5_000

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
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY não configurada')
    }

    const openRouter = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
      maxRetries: 0,
    })
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), OPENROUTER_TIMEOUT_MS)

    try {
      const completion = await openRouter.chat.completions.create(
        {
          model: OPENROUTER_MODEL,
          messages: [{ role: 'system', content: systemPrompt }, ...messages],
        },
        { signal: controller.signal },
      )
      const reply = completion.choices[0]?.message?.content
      if (typeof reply !== 'string' || !reply.trim()) {
        throw new Error('OpenRouter retornou uma resposta vazia')
      }

      return { reply: reply.trim(), provider: 'openrouter' }
    } finally {
      clearTimeout(timeout)
    }
  } catch (openRouterError) {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('OpenRouter falhou e ANTHROPIC_API_KEY não está configurada', openRouterError)
      return {
        error: 'Não foi possível gerar uma resposta. Verifique as chaves OPENROUTER_API_KEY e ANTHROPIC_API_KEY no ambiente do servidor.',
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
      console.error('Falha nos provedores OpenRouter e Anthropic', {
        openRouterError,
        anthropicError,
      })
      return {
        error: 'Os provedores de IA estão indisponíveis no momento. Tente novamente em instantes.',
      }
    }
  }
}
