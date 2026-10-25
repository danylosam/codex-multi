'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AudioLines, ChartNoAxesColumn, LayoutGrid, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from 'cn'

const navigation = [
  { href: '/workspace', label: 'Missões', icon: LayoutGrid },
  { href: '/workspace/vsl-writer', label: 'Sherpa Copywriter', icon: AudioLines },
  { href: '/workspace/funnel-architect', label: 'Sherpa de Funil', icon: Target },
  { href: '/workspace/traffic-analyst', label: 'Sherpa de Tráfego', icon: ChartNoAxesColumn },
]

export function WorkspaceNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Navegação principal" className="flex flex-col items-center gap-2">
      {navigation.map(({ href, label, icon: Icon }) => {
        const active = href === '/workspace' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
        return (
          <Button
            key={href}
            render={<Link href={href} />}
            variant="ghost"
            size="icon"
            aria-label={label}
            aria-current={active ? 'page' : undefined}
            title={label}
            className={cn('size-11 rounded-xl', active ? 'bg-secondary text-secondary-foreground hover:bg-secondary' : 'text-muted-foreground')}
          >
            <Icon data-icon="inline-start" />
          </Button>
        )
      })}
    </nav>
  )
}
