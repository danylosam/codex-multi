import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { signOut } from './actions'
import { Button } from '@/components/ui/button'
import { Sparkles, Bot, LogOut, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-950 text-zinc-100 antialiased">
      {/* Sidebar de Agentes */}
      <aside className="flex w-64 flex-col justify-between border-r border-zinc-800 bg-zinc-900/50 p-4">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <Sparkles className="h-5 w-5 text-white" />
            <span className="text-sm font-bold tracking-wide uppercase">
              Workspace IA
            </span>
          </div>

          <nav className="space-y-1">
            <Link href="/workspace">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <div className="px-2 pt-4 pb-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase">
              Especialistas
            </div>
            <Link href="/workspace/vsl-writer">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              >
                <Bot className="h-4 w-4" />
                Copywriter VSL
              </Button>
            </Link>
            <Link href="/workspace/funnel-architect">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              >
                <Bot className="h-4 w-4" />
                Arquiteto de Funil
              </Button>
            </Link>
            <Link href="/workspace/traffic-analyst">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              >
                <Bot className="h-4 w-4" />
                Gestor de Tráfego
              </Button>
            </Link>
          </nav>
        </div>

        {/* Rodapé do Usuário */}
        <div className="space-y-3 border-t border-zinc-800 pt-4">
          <div className="truncate px-2 text-xs text-zinc-400">
            {user.email}
          </div>
          <form action={signOut}>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Stage */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
