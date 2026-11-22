import { createClient } from '@/lib/supabase/server'
import { PostCard, type PublisherPost } from '@/components/publisher/PostCard'
import { PublisherHeader } from '@/components/publisher/PublisherHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { deleteAutopilotRule, toggleAutopilotRule } from './actions'
import type { AutopilotRule } from '@/lib/social/autopilot'
import { AlertCircle, Bot, CalendarClock, Clock3, Pause, Play, Trash2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function PublisherPage() {
  const supabase = await createClient()
  const [{ data: postsData }, { data: rulesData }] = await Promise.all([
    supabase.from('social_posts_queue').select('*').order('scheduled_for', { ascending: true }),
    supabase.from('social_autopilot_rules').select('*').order('created_at', { ascending: false }),
  ])

  const posts = (postsData ?? []) as PublisherPost[]
  const rules = (rulesData ?? []) as AutopilotRule[]
  const queue = posts.filter((post) => post.status !== 'published')
  const history = posts.filter((post) => post.status === 'published').reverse()
  const automationReady = Boolean(process.env.AUTOMATION_SECRET_KEY)
  const instagramConnected = automationReady || Boolean(process.env.META_INSTAGRAM_ACCESS_TOKEN && process.env.META_INSTAGRAM_ACCOUNT_ID)
  const facebookConnected = Boolean(process.env.META_FACEBOOK_PAGE_ACCESS_TOKEN && process.env.META_FACEBOOK_PAGE_ID)

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-5 py-8 lg:px-9">
      <PublisherHeader instagramConnected={instagramConnected} facebookConnected={facebookConnected} username={process.env.META_INSTAGRAM_USERNAME || 'workspace.ia'} />

      {!instagramConnected && !facebookConnected && (
        <Card id="publisher-setup" className="flex flex-col gap-3 rounded-2xl border-amber-500/20 bg-amber-500/[0.04] p-5 sm:flex-row sm:items-center">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-300"><AlertCircle className="size-4" /></span>
          <div><p className="font-medium">Integração pendente no servidor</p><p className="mt-1 text-sm text-muted-foreground">Configure a AUTOMATION_SECRET_KEY no ambiente de produção para ativar a esteira do Make.</p></div>
          <Badge variant="outline" className="w-fit shrink-0">Automação Make + Instagram</Badge>
        </Card>
      )}

      {rules.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Geração contínua</p>
              <h2 className="mt-1 text-xl font-semibold">Piloto Automático</h2>
            </div>
            <span className="text-sm text-muted-foreground">{rules.filter((r) => r.is_active).length} ativa(s)</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {rules.map((rule) => (
              <Card key={rule.id} className="flex flex-col justify-between gap-4 rounded-2xl border border-border p-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className={rule.is_active ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' : 'text-muted-foreground'}>
                      <Bot className="mr-1 size-3.5" />
                      {rule.is_active ? 'Ativo' : 'Pausado'} · {rule.platform === 'instagram' ? 'Instagram' : 'Facebook'}
                    </Badge>
                    <span className="text-xs font-medium text-muted-foreground">
                      {String(rule.start_hour).padStart(2, '0')}h às {String(rule.end_hour).padStart(2, '0')}h · a cada {rule.interval_hours}h
                    </span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed">{rule.theme}</p>
                </div>
                <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
                  <form action={async () => { 'use server'; await toggleAutopilotRule(rule.id, !rule.is_active) }}>
                    <Button type="submit" size="sm" variant="outline">
                      {rule.is_active ? <><Pause className="size-3.5" />Pausar</> : <><Play className="size-3.5" />Retomar</>}
                    </Button>
                  </form>
                  <form action={async () => { 'use server'; await deleteAutopilotRule(rule.id) }}>
                    <Button type="submit" size="icon-sm" variant="ghost" className="text-muted-foreground hover:text-destructive" title="Excluir regra">
                      <Trash2 className="size-4" />
                    </Button>
                  </form>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Esteira ativa</p><h2 className="mt-1 text-xl font-semibold">Fila de postagens</h2></div><span className="text-sm text-muted-foreground">{queue.length} {queue.length === 1 ? 'post' : 'posts'}</span></div>
        {queue.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{queue.map((post) => <PostCard key={post.id} post={post} />)}</div> : <Card className="flex flex-col items-center justify-center rounded-2xl border-dashed bg-transparent px-6 py-14 text-center"><span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><CalendarClock className="size-5" /></span><h3 className="font-medium">Sua esteira está livre</h3><p className="mt-1 max-w-sm text-sm text-muted-foreground">Crie um post avulso ou ative o Piloto Automático acima.</p></Card>}
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Arquivo de publicações</p><h2 className="mt-1 text-xl font-semibold">Histórico de posts</h2></div><span className="text-sm text-muted-foreground">{history.length} publicados</span></div>
        {history.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{history.map((post) => <PostCard key={post.id} post={post} history />)}</div> : <div className="flex items-center gap-3 rounded-2xl border border-border px-4 py-5 text-sm text-muted-foreground"><Clock3 className="size-4 shrink-0" />Os posts concluídos pelo Make aparecerão aqui com a imagem gerada.</div>}
      </section>
    </div>
  )
}