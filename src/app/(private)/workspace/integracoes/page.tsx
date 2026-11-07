import { MetaIntegrationCard } from '@/components/integrations/MetaIntegrationCard'
import { Link2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function IntegrationsPage() {
  const connected = Boolean(process.env.META_INSTAGRAM_ACCESS_TOKEN && process.env.META_INSTAGRAM_ACCOUNT_ID)
  const username = connected ? process.env.META_INSTAGRAM_USERNAME : undefined

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-6 py-9 lg:px-10">
      <header className="max-w-3xl space-y-3 border-b border-border pb-7">
        <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          <Link2 className="size-3.5" strokeWidth={1.75} />Workspace · Configurações
        </p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">Integrações &amp; Conexões oficiais</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Conecte os canais que os seus Sherpas usam para preparar e publicar ativos de marketing.
        </p>
      </header>

      <section aria-labelledby="available-integrations" className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 id="available-integrations" className="text-sm font-medium">Redes sociais</h2>
          <span className="text-xs text-muted-foreground">1 integração disponível</span>
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <MetaIntegrationCard connected={connected} username={username} />
        </div>
      </section>
    </div>
  )
}
