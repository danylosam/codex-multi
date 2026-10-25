import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight, Eye, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from 'cn'
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
    <Card className={cn('group relative h-full min-h-[286px] border border-border/70 transition duration-300 hover:-translate-y-1 hover:ring-1 hover:ring-primary/20', featured && 'min-h-[300px]')}>
      <CardHeader className="relative flex-row items-start justify-between gap-4">
        <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-foreground">
          <Icon className="size-5" />
        </div>
        <Badge variant="outline" className="relative border-border/80 bg-background/60 px-2.5 py-1 text-[10px] font-medium tracking-wide text-muted-foreground">
          {mission.category}
        </Badge>
      </CardHeader>

      <CardContent className="relative flex flex-1 flex-col gap-2.5">
        <CardTitle className="max-w-sm text-base font-semibold tracking-tight">{mission.title}</CardTitle>
        <CardDescription className="max-w-sm text-xs leading-5">{mission.description}</CardDescription>
        <p className="mt-1 text-[11px] text-muted-foreground">Entrega: <span className="text-foreground/85">{mission.deliverable}</span></p>
      </CardContent>

      <CardFooter className="relative flex-wrap justify-between gap-3 border-border px-4 py-3">
        <SherpaBadge name={mission.sherpa} />
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="sm" onClick={() => onExample(mission)} className="gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground">
            <Eye data-icon="inline-start" /> Visualizar
          </Button>
          <Button type="button" size="sm" onClick={() => onStart(mission)} className="h-9 gap-1.5 rounded-full px-3 text-xs font-semibold">
            <Sparkles data-icon="inline-start" /> Usar <ArrowUpRight data-icon="inline-end" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
