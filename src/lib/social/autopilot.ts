import type { SupabaseClient } from '@supabase/supabase-js'
import { generateSherpaReply } from '@/lib/ai/sherpa-service'

export type AutopilotRule = {
  id: string
  user_id: string
  platform: 'instagram' | 'facebook'
  theme: string
  visual_style: string | null
  start_hour: number
  end_hour: number
  interval_hours: number
  is_active: boolean
  last_generated_date: string | null
  created_at: string
}

function getBrazilDateParts(offsetDays = 0) {
  const target = new Date(Date.now() + offsetDays * 86_400_000)
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
  })
  const parts = formatter.formatToParts(target)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '00'
  const dateStr = `${get('year')}-${get('month')}-${get('day')}`
  const currentHour = Number(get('hour'))
  return { dateStr, currentHour }
}

function buildScheduledSlots(rule: AutopilotRule, dateStr: string, minHourExclusive: number | null): string[] {
  const slots: string[] = []
  const step = Math.max(1, rule.interval_hours || 1)
  const start = Math.max(0, Math.min(23, rule.start_hour))
  const end = Math.max(start, Math.min(23, rule.end_hour))

  for (let hour = start; hour <= end; hour += step) {
    if (minHourExclusive !== null && hour <= minHourExclusive) continue
    const hh = String(hour).padStart(2, '0')
    // Horário de Brasília fixo (UTC-03:00)
    slots.push(`${dateStr}T${hh}:00:00-03:00`)
  }
  return slots
}

async function generateBatchPosts(theme: string, visualStyle: string | null, count: number) {
  const styleHint = visualStyle?.trim() || 'Minimalist 3D futuristic dark glass aesthetic, clean editorial lighting, 4k'
  const prompt = `Crie exatamente ${count} ideias distintas e complementares de posts para Instagram sobre o tema: "${theme}".
Regras obrigatórias:
- Responda APENAS com um array JSON válido, sem markdown, sem explicações antes ou depois.
- Formato exato: [{"caption": "legenda em português com gancho forte, conteúdo prático e hashtags relevantes", "visual_prompt": "prompt visual detalhado em inglês no estilo: ${styleHint}"}]
- Cada item deve abordar um ângulo diferente do tema para não haver repetição ao longo do dia.`

  const result = await generateSherpaReply('social-copywriter', [{ role: 'user', content: prompt }])
  if ('error' in result) {
    throw new Error(result.error)
  }

  const raw = result.reply.trim()
  const jsonStart = raw.indexOf('[')
  const jsonEnd = raw.lastIndexOf(']')
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error('A IA não retornou uma lista JSON válida.')
  }

  const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1)) as Array<{ caption?: string; visual_prompt?: string }>
  return parsed.filter((item) => item.caption && item.visual_prompt)
}

export async function generateQueueForRule(
  supabase: SupabaseClient,
  rule: AutopilotRule,
  options: { targetOffsetDays?: number; onlyFutureHoursToday?: boolean } = {}
) {
  const offset = options.targetOffsetDays ?? 0
  const { dateStr, currentHour } = getBrazilDateParts(offset)

  if (rule.last_generated_date === dateStr) {
    return { created: 0, dateStr }
  }

  const minHour = offset === 0 && options.onlyFutureHoursToday !== false ? currentHour : null
  const slots = buildScheduledSlots(rule, dateStr, minHour)

  if (!slots.length) {
    await supabase.from('social_autopilot_rules').update({ last_generated_date: dateStr }).eq('id', rule.id)
    return { created: 0, dateStr }
  }

  const generated = await generateBatchPosts(rule.theme, rule.visual_style, slots.length)
  if (!generated.length) {
    throw new Error('Nenhum conteúdo foi gerado para os horários selecionados.')
  }

  const rows = slots.map((scheduledFor, idx) => {
    const item = generated[idx % generated.length]
    return {
      user_id: rule.user_id,
      platform: rule.platform,
      visual_prompt: item.visual_prompt!.trim(),
      caption: item.caption!.trim(),
      scheduled_for: new Date(scheduledFor).toISOString(),
      status: 'pending',
    }
  })

  const { error: insertError } = await supabase.from('social_posts_queue').insert(rows)
  if (insertError) throw new Error(insertError.message)

  await supabase.from('social_autopilot_rules').update({ last_generated_date: dateStr }).eq('id', rule.id)

  return { created: rows.length, dateStr }
}