import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateQueueForRule, type AutopilotRule } from '@/lib/social/autopilot'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const automationHeader = request.headers.get('x-automation-secret')
  const cronValid = process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`
  const makeValid = process.env.AUTOMATION_SECRET_KEY && automationHeader === process.env.AUTOMATION_SECRET_KEY

  if (!cronValid && !makeValid) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: rules, error } = await supabase
    .from('social_autopilot_rules')
    .select('*')
    .eq('is_active', true)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  let totalCreated = 0
  const details: Array<{ rule_id: string; created: number; error?: string }> = []

  for (const rule of (rules ?? []) as AutopilotRule[]) {
    try {
      // Gera os posts para hoje (caso ainda não gerados) e prepara amanhã
      const todayRes = await generateQueueForRule(supabase, rule, { targetOffsetDays: 0, onlyFutureHoursToday: true })
      const tomorrowRes = await generateQueueForRule(supabase, { ...rule, last_generated_date: todayRes.dateStr }, { targetOffsetDays: 1, onlyFutureHoursToday: false })
      const created = todayRes.created + tomorrowRes.created
      totalCreated += created
      details.push({ rule_id: rule.id, created })
    } catch (err) {
      details.push({ rule_id: rule.id, created: 0, error: err instanceof Error ? err.message : 'Erro desconhecido' })
    }
  }

  return NextResponse.json({
    ok: true,
    rules_processed: rules?.length ?? 0,
    total_posts_queued: totalCreated,
    details,
  })
}