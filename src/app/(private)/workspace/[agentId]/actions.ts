'use server'

import { generateSherpaReply, type SherpaMessage } from '@/lib/ai/sherpa-service'
import { createClient } from '@/lib/supabase/server'

const supportedAgents = new Set(['vsl-writer', 'funnel-architect', 'traffic-analyst'])

export async function sendAgentMessage(
  agentId: string,
  submittedMessages: unknown,
) {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) return { error: 'Sua sessão expirou. Entre novamente para continuar.' }
  if (!supportedAgents.has(agentId)) return { error: 'Especialista não encontrado.' }
  if (!Array.isArray(submittedMessages) || submittedMessages.length === 0) {
    return { error: 'Envie uma mensagem para iniciar a missão.' }
  }

  const messages: SherpaMessage[] = submittedMessages
    .slice(-12)
    .filter(
      (message): message is SherpaMessage =>
        typeof message === 'object' &&
        message !== null &&
        'role' in message &&
        (message.role === 'user' || message.role === 'assistant') &&
        'content' in message &&
        typeof message.content === 'string',
    )
    .map(({ role, content }) => ({ role, content: content.trim().slice(0, 4_000) }))
    .filter(({ content }) => content.length > 0)

  if (messages.length === 0 || messages[messages.length - 1]?.role !== 'user') {
    return { error: 'Não foi possível validar a mensagem enviada.' }
  }

  return generateSherpaReply(agentId, messages)
}
