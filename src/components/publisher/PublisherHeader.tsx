'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PostScheduleModal } from './PostScheduleModal'
import { AutopilotModal } from './AutopilotModal'
import { Bot, Camera, Plus, Settings2 } from 'lucide-react'

export function PublisherHeader({ instagramConnected, facebookConnected, username }: { instagramConnected: boolean; facebookConnected: boolean; username?: string }) {
  const [open, setOpen] = useState(false)
  const [autopilotOpen, setAutopilotOpen] = useState(false)
  const [intent, setIntent] = useState<'create' | 'schedule'>('create')
  const start = (nextIntent: 'create' | 'schedule') => { setIntent(nextIntent); setOpen(true) }

  return (
    <>
      <header className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><Camera className="size-4" /></span>
            <Badge variant="outline" className={instagramConnected ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' : 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300'}>
              <span className={`size-1.5 rounded-full ${instagramConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              {instagramConnected ? `Instagram conectado${username ? ` · @${username.replace(/^@/, '')}` : ''}` : 'Instagram não configurado'}
            </Badge>
            {facebookConnected && <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"><span className="size-1.5 rounded-full bg-emerald-500" />Facebook Page conectada</Badge>}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Esteira de publicação</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Planeje posts avulsos ou ative o Piloto Automático para gerar e publicar conteúdo todos os dias.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!instagramConnected && <Button variant="outline" onClick={() => document.getElementById('publisher-setup')?.scrollIntoView({ behavior: 'smooth' })}><Settings2 data-icon="inline-start" />Configurar integração</Button>}
          <Button variant="outline" onClick={() => setAutopilotOpen(true)}><Bot data-icon="inline-start" />Piloto Automático</Button>
          <Button variant="outline" onClick={() => start('schedule')}><Plus data-icon="inline-start" />Agendar publicação</Button>
          <Button onClick={() => start('create')}><Plus data-icon="inline-start" />Novo post com Sherpa</Button>
        </div>
      </header>
      <PostScheduleModal open={open} onOpenChange={setOpen} intent={intent} />
      <AutopilotModal open={autopilotOpen} onOpenChange={setAutopilotOpen} />
    </>
  )
}