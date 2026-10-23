import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight, Eye, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SherpaBadge } from './SherpaBadge'

export type Mission = {
  id: string
  title: string
  description: string
  deliverable: string
  agentId: 'vsl-writer' | 'funnel-architect' | 'traffic-analyst'
  sherpa: string
  category: 'Copywriting' | 'Tráfego' | 'Oferta' | 'Funil'
  icon: LucideIcon
  accent: string
  example: string
}

type MissionCardProps = {
  mission: Mission
  featured?: boolean
  onStart: (mission: Mission) => void
  onExample: (mission: Mission) => void
}

export function MissionCard({ mission, featured = false, onStart, onExample }: MissionCardProps) {
  const Icon = mission.icon

  return (
    <article className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-900/55 p-5 transition duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:bg-zinc-900 ${featured ? 'min-h-[265px]' : 'min-h-[230px]'}`}>
      <div className={`pointer-events-none absolute -right-12 -top-16 size-44 rounded-full blur-3xl opacity-[0.09] transition-opacity group-hover:opacity-20 ${mission.accent}`} />
      <div className="relative flex items-start justify-between gap-4">
        <div className={`flex size-11 items-center justify-center rounded-xl border border-white/10 ${mission.accent} text-white`}>
          <Icon className="size-5" />
        </div>
        <span className="rounded-full border border-zinc-700/70 bg-zinc-950/60 px-2.5 py-1 text-[10px] font-medium tracking-wide text-zinc-400">
          {mission.category}
        </span>
      </div>
      <div className="relative mt-5 flex-1">
        <h3 className="max-w-sm text-lg font-semibold tracking-tight text-zinc-100">{mission.title}</h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-400">{mission.description}</p>
        <p className="mt-3 text-xs text-zinc-500">Entrega: <span className="text-zinc-300">{mission.deliverable}</span></p>
      </div>
      <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800/80 pt-4">
        <SherpaBadge name={mission.sherpa} />
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => onExample(mission)} className="h-8 gap-1.5 px-2 text-xs text-zinc-400 hover:text-zinc-100">
            <Eye className="size-3.5" /> Ver exemplo
          </Button>
          <Button type="button" size="sm" onClick={() => onStart(mission)} className="h-8 gap-1.5 rounded-lg bg-zinc-100 px-3 text-xs font-semibold text-zinc-950 hover:bg-white">
            <Sparkles className="size-3.5" /> Iniciar missão <ArrowUpRight className="size-3" />
          </Button>
        </div>
      </div>
    </article>
  )
}
