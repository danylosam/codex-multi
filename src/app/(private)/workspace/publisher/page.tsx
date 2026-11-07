import { createClient } from '@/lib/supabase/server'
import { PostCard, type PublisherPost } from '@/components/publisher/PostCard'
import { PublisherHeader } from '@/components/publisher/PublisherHeader'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { AlertCircle, CalendarClock, Clock3 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function PublisherPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('social_posts').select('*').order('created_at', { ascending: false })
  const posts = (data ?? []) as PublisherPost[]
  const queue = posts.filter((post) => post.status !== 'published')
  const history = posts.filter((post) => post.status === 'published')
  const instagramConnected = Boolean(process.env.META_INSTAGRAM_ACCESS_TOKEN && process.env.META_INSTAGRAM_ACCOUNT_ID)
  const facebookConnected = Boolean(process.env.META_FACEBOOK_PAGE_ACCESS_TOKEN && process.env.META_FACEBOOK_PAGE_ID)

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-5 py-8 lg:px-9">
      <PublisherHeader instagramConnected={instagramConnected} facebookConnected={facebookConnected} username={process.env.META_INSTAGRAM_USERNAME} />
      {!instagramConnected && !facebookConnected && <Card id="publisher-setup" className="flex flex-col gap-3 rounded-2xl border-amber-500/20 bg-amber-500/[0.04] p-5 sm:flex-row sm:items-center">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-300"><AlertCircle className="size-4" /></span>
        <div><p className="font-medium">Integração pendente no servidor</p><p className="mt-1 text-sm text-muted-foreground">Configure as credenciais da Meta e o CRON_SECRET no ambiente de produção. As publicações ficam na fila até a integração estar pronta.</p></div>
        <Badge variant="outline" className="w-fit shrink-0">Instagram profissional / Facebook Page</Badge>
      </Card>}
      <section className="space-y-4">
        <div className="flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Esteira ativa</p><h2 className="mt-1 text-xl font-semibold">Fila de postagens</h2></div><span className="text-sm text-muted-foreground">{queue.length} {queue.length === 1 ? 'post' : 'posts'}</span></div>
        {queue.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{queue.map((post) => <PostCard key={post.id} post={post} />)}</div> : <Card className="flex flex-col items-center justify-center rounded-2xl border-dashed bg-transparent px-6 py-14 text-center"><span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><CalendarClock className="size-5" /></span><h3 className="font-medium">Sua esteira está livre</h3><p className="mt-1 max-w-sm text-sm text-muted-foreground">Crie um post e escolha publicar agora ou agendar para depois.</p></Card>}
      </section>
      <section className="space-y-4">
        <div className="flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Arquivo de publicações</p><h2 className="mt-1 text-xl font-semibold">Histórico de posts</h2></div><span className="text-sm text-muted-foreground">{history.length} publicados</span></div>
        {history.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{history.map((post) => <PostCard key={post.id} post={post} history />)}</div> : <div className="flex items-center gap-3 rounded-2xl border border-border px-4 py-5 text-sm text-muted-foreground"><Clock3 className="size-4 shrink-0" />Os posts concluídos aparecerão aqui com o link permanente da Meta.</div>}
      </section>
      <p className="border-t border-border pt-4 text-xs leading-5 text-muted-foreground">A Meta exige conta profissional Instagram e permissões de publicação aprovadas. O processamento programado usa a rota segura de cron; frequência e timezone dependem do provedor configurado.</p>
    </div>
  )
}
