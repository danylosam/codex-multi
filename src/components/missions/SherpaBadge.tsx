import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Bot } from 'lucide-react'

type SherpaBadgeProps = {
  name: string
  icon?: LucideIcon
  active?: boolean
}

export function SherpaBadge({ name, icon: Icon = Bot, active = false }: SherpaBadgeProps) {
  return (
    <Badge className="h-7 gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-2.5 text-[11px] font-medium text-zinc-200 backdrop-blur-md hover:bg-white/[0.08]">
      <span className={`relative flex size-5 items-center justify-center rounded-full ${active ? 'bg-emerald-400/15 text-emerald-300' : 'bg-white/10 text-zinc-300'}`}>
        <Icon className="size-3" />
      </span>
      {name}
      {active && <span className="ml-0.5 size-1.5 rounded-full bg-emerald-400" />}
    </Badge>
  )
}
