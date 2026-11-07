'use client'

import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowUpRight, Check, Network, ShieldCheck } from 'lucide-react'

export function MetaIntegrationCard({ connected, username }: { connected: boolean; username?: string }) {
  function requestConnection() {
    toast.info('A conexão OAuth da Meta será habilitada na próxima etapa.', {
      description: 'A publicação já pode usar as credenciais configuradas no servidor.',
    })
  }

  return (
    <Card className="gap-0 rounded-xl border border-border bg-card p-0 shadow-none transition-colors hover:border-foreground/20">
      <div className="flex items-start justify-between gap-5 p-5 sm:p-6">
        <div className="flex min-w-0 items-start gap-4">
          <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/70 text-foreground">
            <Network className="size-5" strokeWidth={1.7} />
          </span>
          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-medium text-muted-foreground">Meta</p>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">Instagram &amp; Facebook</span>
            </div>
            <h3 className="text-base font-semibold tracking-tight">Instagram for Business</h3>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              Conecte sua conta profissional para permitir que nossos Sherpas publiquem e agendem postagens diretamente no seu feed.
            </p>
          </div>
        </div>
        <Badge variant="outline" className={connected
          ? 'shrink-0 gap-1.5 border-emerald-600/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
          : 'shrink-0 gap-1.5 border-border bg-muted/60 text-muted-foreground'}>
          <span className={`size-1.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
          {connected ? <><Check className="size-3" />Conectado{username ? ` · @${username.replace(/^@/, '')}` : ''}</> : 'Desconectado'}
        </Badge>
      </div>

      <div className="flex flex-col gap-4 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.75} />
          <span>Conexão para contas profissionais. Suas credenciais são usadas no servidor.</span>
        </div>
        {connected ? (
          <Button variant="outline" size="sm" disabled className="shrink-0"><Check />Conta conectada</Button>
        ) : (
          <Button onClick={requestConnection} size="sm" className="shrink-0 transition-colors">
            Conectar Conta Meta<ArrowUpRight data-icon="inline-end" />
          </Button>
        )}
      </div>
    </Card>
  )
}
