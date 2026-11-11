<<<<<<< HEAD
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
=======
import Image from "next/image";
import Link from "next/link";
import { 
  Radio, 
  Megaphone, 
  Target, 
  Box, 
  PlayCircle, 
  Send, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowRight 
} from "lucide-react";
>>>>>>> 5d1d25986f605534ae8548b0a4f30874209effc5

  return (
<<<<<<< HEAD
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
=======
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-indigo-500/30">
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/70 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 rounded bg-white text-zinc-950 flex items-center justify-center font-black">
              W
            </div>
            Workspace IA
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="#visao" className="hover:text-white transition-colors">A virada</Link>
            <Link href="#missoes" className="hover:text-white transition-colors">Missões</Link>
>>>>>>> 5d1d25986f605534ae8548b0a4f30874209effc5
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

<<<<<<< HEAD
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
=======
      <main>
        <section className="relative overflow-hidden pt-16 pb-24 border-b border-zinc-800/40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/15 blur-[130px] rounded-full pointer-events-none" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col items-start space-y-6">
                <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-1.5 text-sm text-zinc-300 backdrop-blur-sm">
                  <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-3 animate-pulse"></span>
                  A Nova Era do Aprendizado por Execução
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08]">
                  Não assista <br />a cursos. <br />
                  <span className="text-zinc-400">Construa seus ativos.</span>
                </h1>
                
                <p className="text-lg text-zinc-400 max-w-lg leading-relaxed">
                  Construa ativos de alta conversão ao lado de Sherpas especialistas. Em poucos minutos de alinhamento prático, sua VSL, oferta e criativos saem prontos para o campo de batalha.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Link 
                    href="/workspace" 
                    className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-zinc-950 transition-all hover:bg-zinc-200"
                  >
                    Iniciar Primeira Missão &rarr;
                  </Link>
                  <Link 
                    href="#missoes" 
                    className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/40 px-8 text-sm font-medium text-zinc-300 transition-all hover:bg-zinc-800"
                  >
                    Conhecer os Sherpas
                  </Link>
                </div>
              </div>

              <div className="relative w-full aspect-[4/3] lg:aspect-[16/10] rounded-2xl overflow-hidden border border-zinc-800/60 shadow-2xl group">
                <Image
                  src="/assets/hero-glow-3d.png"
                  alt="Workspace IA"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section id="missoes" className="py-20 border-b border-zinc-800/40">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <p className="text-sm font-medium text-zinc-400 mb-2">Seu próximo ativo começa com uma boa pergunta.</p>
                <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">Missões em destaque</h2>
              </div>
              <Link href="/workspace" className="inline-flex items-center gap-1 text-sm font-medium text-zinc-400 hover:text-white mt-4 md:mt-0 transition-colors">
                Ver todas as missões <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-300">
                      <Radio className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-800/60 text-zinc-400 border border-zinc-700/40">Copywriting</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">VSL de Alta Conversão</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">Roteiro com gancho, argumento e chamada para ação.</p>
                </div>
                <div className="pt-6 mt-6 border-t border-zinc-800/40 flex items-center justify-between text-xs text-zinc-400">
                  <span>Copywriter VSL</span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-500" />
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-300">
                      <Megaphone className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-800/60 text-zinc-400 border border-zinc-700/40">Tráfego pago</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Esteira de Criativos</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">Ângulos e variações para testar nos seus anúncios.</p>
                </div>
                <div className="pt-6 mt-6 border-t border-zinc-800/40 flex items-center justify-between text-xs text-zinc-400">
                  <span>Gestor de Tráfego</span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-500" />
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-300">
                      <Target className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-800/60 text-zinc-400 border border-zinc-700/40">Funil</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Página de Captura</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">Estrutura de copy para converter visitas em leads.</p>
                </div>
                <div className="pt-6 mt-6 border-t border-zinc-800/40 flex items-center justify-between text-xs text-zinc-400">
                  <span>Arquiteto de Funil</span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-500" />
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-300">
                      <Box className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-800/60 text-zinc-400 border border-zinc-700/40">Oferta</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Oferta Irrecusável</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">Promessa, composição e ancoragem da sua oferta.</p>
                </div>
                <div className="pt-6 mt-6 border-t border-zinc-800/40 flex items-center justify-between text-xs text-zinc-400">
                  <span>Arquiteto de Funil</span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-500" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="visao" className="py-24">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.15]">
                  Aprender fazendo, <br />desde o primeiro passo.
                </h2>
              </div>

              <div className="space-y-10">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 text-zinc-400">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Zero teoria passiva</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      O conceito aparece quando você precisa decidir. Você aprende aplicando ao seu projeto.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 text-zinc-400">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Micro-ganhos imediatos</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      Cada etapa termina com uma decisão ou parte do ativo pronta para avançar.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 text-zinc-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Ativos reais para sua operação</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      Construa roteiros, ofertas e estruturas ligados ao desafio que você quer resolver.
                    </p>
                  </div>
                </div>
              </div>
>>>>>>> 5d1d25986f605534ae8548b0a4f30874209effc5
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
