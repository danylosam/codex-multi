import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LibraryBig, LogOut, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { WorkspaceNav } from '@/components/missions/WorkspaceNav'
import { signOut } from './actions'
import { ThemeToggle } from '@/components/ThemeToggle'

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background text-foreground antialiased">
      <aside className="flex w-[68px] shrink-0 flex-col items-center border-r border-border bg-card py-4">
        <Link href="/workspace" aria-label="Workspace IA — início" title="Workspace IA" className="mb-7 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition hover:bg-primary/15">
          <Sparkles className="size-5" />
        </Link>

        <WorkspaceNav />
        <Separator className="my-5 w-9" />
        <Button render={<Link href="/workspace" />} variant="ghost" size="icon" aria-label="Playbooks" title="Playbooks" className="size-11 rounded-xl text-muted-foreground">
          <LibraryBig data-icon="inline-start" />
        </Button>

        <div className="mt-auto flex flex-col items-center gap-3">
          <ThemeToggle />
          <span title={user.email ?? 'Conta'} className="flex size-9 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xs font-semibold text-primary">
            {(user.email?.[0] ?? 'U').toUpperCase()}
          </span>
          <form action={signOut}>
            <Button type="submit" variant="ghost" size="icon" aria-label="Sair" title="Sair" className="size-9 rounded-xl text-muted-foreground">
              <LogOut data-icon="inline-start" />
            </Button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
