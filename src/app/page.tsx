import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  BadgeCheck,
  Bot,
  Boxes,
  Check,
  CirclePlay,
  Compass,
  Layers,
  Megaphone,
  MousePointer2,
  Target,
  Workflow,
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { MotionReveal } from '@/components/landing/motion-reveal'
import { createClient } from '@/lib/supabase/server'

const missions = [
  {
    title: 'VSL de Alta Conversão',
    deliverable: 'Roteiro com gancho, argumento e chamada para ação.',
    sherpa: 'Copywriter VSL',
    href: '/workspace/vsl-writer',
    icon: AudioLines,
    area: 'Copywriting',
  },
  {
    title: 'Esteira de Criativos',
    deliverable: 'Ângulos e variações para testar nos seus anúncios.',
    sherpa: 'Gestor de Tráfego',
    href: '/workspace/traffic-analyst',
    icon: Megaphone,
    area: 'Tráfego pago',
  },
  {
    title: 'Página de Captura',
    deliverable: 'Estrutura de copy para converter visitas em leads.',
    sherpa: 'Arquiteto de Funil',
    href: '/workspace/funnel-architect',
    icon: Target,
    area: 'Funil',
  },
  {
    title: 'Oferta Irrecusável',
    deliverable: 'Promessa, composição e ancoragem da sua oferta.',
    sherpa: 'Arquiteto de Funil',
    href: '/workspace/funnel-architect',
    icon: Boxes,
    area: 'Oferta',
  },
]

const pillars = [
  {
    icon: CirclePlay,
    title: 'Zero teoria passiva',
    description: 'O conceito aparece quando você precisa decidir. Você aprende aplicando ao seu projeto.',
  },
  {
    icon: MousePointer2,
    title: 'Micro-ganhos imediatos',
    description: 'Cada etapa termina com uma decisão ou parte do ativo pronta para avançar.',
  },
  {
    icon: BadgeCheck,
    title: 'Ativos reais para sua operação',
    description: 'Construa roteiros, ofertas e estruturas ligados ao desafio que você quer resolver.',
  },
]

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const workspaceHref = user ? '/workspace' : '/login'

  return (
    <main className="min-h-dvh overflow-hidden bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link href="/" aria-label="Workspace IA — início" className="flex items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-ring">
            <span className="flex size-9 items-center justify-center rounded-lg bg-foreground text-background">
              <Layers className="size-[18px]" strokeWidth={1.8} />
            </span>
            <span className="whitespace-nowrap text-sm font-semibold tracking-tight">Workspace IA</span>
          </Link>

          <nav aria-label="Navegação principal" className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a className="transition-colors hover:text-foreground" href="#diferenciais">A virada</a>
            <a className="transition-colors hover:text-foreground" href="#missoes">Missões</a>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href={workspaceHref}
              className="inline-flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-primary px-3 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-primary/80 sm:h-10 sm:px-5 sm:text-sm"
            >
              Acessar Workspace
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid min-h-[650px] max-w-[1320px] content-between gap-14 px-5 pb-14 pt-16 sm:px-8 sm:pb-16 sm:pt-20 lg:min-h-[690px] lg:px-12 lg:pt-24">
        <div>
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3.5 py-2 text-[13px] text-muted-foreground backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-foreground" />
            A Nova Era do Aprendizado por Execução
          </div>
          <h1 className="max-w-[14ch] text-[clamp(3.5rem,10vw,9rem)] leading-[0.9] font-semibold tracking-[-0.075em] text-foreground [text-wrap:balance]">
            Não assista a cursos.
          </h1>
        </div>

        <div className="grid items-end gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:gap-12">
          <div className="max-w-[690px]">
            <p className="text-xl leading-[1.35] tracking-tight text-foreground sm:text-2xl">
              Construa ativos de alta conversão ao lado de Sherpas especialistas.
            </p>
            <p className="mt-4 max-w-[600px] text-base leading-7 text-muted-foreground sm:text-lg">
              Em poucos minutos de alinhamento prático, sua VSL, oferta e criativos saem prontos para o campo de batalha.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <Link href={workspaceHref} className="inline-flex h-12 items-center gap-3 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5">
              Iniciar Primeira Missão
              <ArrowRight className="size-4" />
            </Link>
            <a href="#missoes" className="inline-flex h-12 items-center gap-2 rounded-full border border-border px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              Conhecer os Sherpas
            </a>
          </div>
        </div>
      </section>

      <section id="missoes" className="bg-card py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-[610px]">
              <p className="text-base text-muted-foreground">Seu próximo ativo começa com uma boa pergunta.</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Missões em destaque</h2>
            </div>
            <Link href={workspaceHref} className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground">
              Ver todas as missões <ArrowRight className="size-4" />
            </Link>
          </div>

          <div data-ui="mission-catalog" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {missions.map(({ title, deliverable, sherpa, href, icon: Icon, area }, index) => (
              <MotionReveal key={title} delay={index * 0.04}>
                <article className="group flex h-full min-h-[270px] flex-col rounded-xl bg-background p-5 transition-transform duration-200 hover:-translate-y-1 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex size-11 items-center justify-center rounded-lg bg-muted text-foreground">
                      <Icon className="size-5" strokeWidth={1.7} />
                    </span>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-[13px] text-muted-foreground">{area}</span>
                  </div>
                  <h3 className="mt-7 text-lg font-semibold leading-snug tracking-tight">{title}</h3>
                  <p className="mt-2 text-base leading-6 text-muted-foreground">{deliverable}</p>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                    <span className="inline-flex min-w-0 items-center gap-2 text-[13px] text-muted-foreground">
                      <Bot className="size-4 shrink-0" />
                      <span className="truncate">{sherpa}</span>
                    </span>
                    <Link href={href} aria-label={`Iniciar missão: ${title}`} className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </div>
                </article>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="diferenciais" className="mx-auto max-w-[1320px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="max-w-[390px]">
            <h2 className="mt-3 text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">Aprender fazendo, desde o primeiro passo.</h2>
          </div>
          <div className="grid gap-7">
            {pillars.map(({ icon: Icon, title, description }) => (
              <article key={title} className="grid gap-4 py-6 first:pt-0 last:pb-0 sm:grid-cols-[48px_1fr] sm:gap-6">
                <span className="flex size-10 items-center justify-center rounded-full bg-muted text-foreground">
                  <Icon className="size-[18px]" strokeWidth={1.7} />
                </span>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
                  <p className="mt-2 max-w-[560px] text-base leading-6 text-muted-foreground">{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/60">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-7 px-5 py-14 sm:px-8 md:flex-row md:items-center md:justify-between md:py-16 lg:px-12">
          <div className="flex max-w-[660px] items-start gap-4">
            <span className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-background text-foreground"><Compass className="size-5" /></span>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">A estratégia ganha forma quando você executa.</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Escolha uma missão, alinhe o contexto com seu Sherpa e construa um ativo que pertence ao seu projeto.</p>
            </div>
          </div>
          <Link href={workspaceHref} className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80">
            Começar agora <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-[1320px] flex-col gap-4 px-5 py-8 text-base text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <Link href="/" className="font-semibold text-foreground">Workspace IA</Link>
        <p>Missões práticas. Aprendizado em movimento.</p>
        <Link href={workspaceHref} className="inline-flex items-center gap-2 font-medium text-foreground transition-colors hover:text-muted-foreground">
          Acessar Workspace <Check className="size-4" />
        </Link>
      </footer>
    </main>
  )
}
