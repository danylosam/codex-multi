import type { LucideIcon } from 'lucide-react'
import { Bot } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from 'cn'

type SherpaBadgeProps = {
  name: string
  icon?: LucideIcon
  active?: boolean
}

export function SherpaBadge({ name, icon: Icon = Bot, active = false }: SherpaBadgeProps) {
  return (
    <Badge variant="secondary" className="h-7 gap-1.5 rounded-full border border-border/70 bg-secondary/80 px-2.5 text-[11px] font-medium text-secondary-foreground backdrop-blur-md">
      <span className={cn('relative flex size-5 items-center justify-center rounded-full', active ? 'bg-primary/15 text-primary' : 'bg-accent text-accent-foreground')}>
        <Icon className="size-3" />
      </span>
      {name}
      {active && <span className="ml-0.5 size-1.5 rounded-full bg-primary" />}
    </Badge>
  )
}
