import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  BrainCircuit,
  Check,
  FileText,
  Layers,
  MessageSquareText,
  Route,
  Sparkles,
  Target,
  WandSparkles,
} from 'lucide-react'
import { MotionReveal } from '@/components/landing/motion-reveal'

const missions = [
  {
    title: 'Sprint de VSL',
    detail: 'Construa uma narrativa de venda com começo, argumento e direção.',
    specialist: 'Copywriter VSL',
    href: '/workspace/vsl-writer',
    icon: FileText,
  },
  {
    title: 'Sprint de Aquisição',
    detail: 'Organize público, criativos e objetivo antes de ativar sua campanha.',
    specialist: 'Gestor de Tráfego',
    href: '/workspace/traffic-analyst',
    icon: Target,
  },
]

function WorkspacePreview() {
  return (
    <div className="relative mx-auto w-full max-w-[670px]">
      <div className="absolute -inset-3 -z-10 rounded-[28px] bg-[radial-gradient(ellipse_at_50%_55%,rgba(235,104,77,0.13),transparent_70%)]" />
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-[0_28px_90px_rgba(0,0,0,0.45)]">
        <div className="flex h-11 items-center justify-between border-b border-white/[0.07] px-4">
          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
            <Layers className="h-3.5 w-3.5 text-[#ed785e]" strokeWidth={1.8} />
            <span>Workspace</span>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-300">Missão de VSL</span>
          </div>
          <span className="rounded-full border border-white/10 px-2.5 py-1 text-[9px] tracking-wide text-zinc-400">
            CO-LEARNING
          </span>
        </div>

        <div className="grid min-h-[310px] grid-cols-[138px_1fr] sm:grid-cols-[160px_1fr]">
          <aside className="border-r border-white/[0.07] bg-zinc-950/55 p-3 sm:p-4">
            <p className="mb-3 px-2 text-[9px] font-medium tracking-[0.13em] text-zinc-600 uppercase">
              Sherpas Digitais
            </p>
            <div className="space-y-1">
              <div className="flex items-center gap-2 rounded-lg bg-white/[0.07] px-2 py-2 text-[10px] text-zinc-100">
                <FileText className="h-3.5 w-3.5 text-[#ed785e]" />
                <span>Copywriter VSL</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg px-2 py-2 text-[10px] text-zinc-500">
                <Route className="h-3.5 w-3.5" />
                <span>Arquiteto de Funil</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg px-2 py-2 text-[10px] text-zinc-500">
                <Target className="h-3.5 w-3.5" />
                <span>Gestor de Tráfego</span>
              </div>
            </div>
            <div className="mt-6 border-t border-white/[0.07] pt-4">
              <p className="px-2 text-[9px] font-medium tracking-[0.13em] text-zinc-600 uppercase">
                Seu projeto
              </p>
              <p className="mt-2 px-2 text-[10px] leading-4 text-zinc-400">
                Nova campanha
              </p>
            </div>
          </aside>

          <div className="flex min-w-0 flex-col">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3 sm:px-5">
              <div>
                <p className="text-[11px] font-medium text-zinc-200">Briefing &amp; Persona</p>
                <p className="mt-0.5 text-[9px] text-zinc-600">Defina o contexto da missão</p>
              </div>
              <span className="rounded-md border border-white/10 px-2 py-1 text-[9px] text-zinc-500">Rascunho</span>
            </div>

            <div className="flex flex-1 flex-col justify-between gap-5 p-4 sm:p-5">
              <div className="space-y-3">
                <div className="max-w-[92%] rounded-xl rounded-tl-sm border border-white/[0.07] bg-zinc-800/75 p-3">
                  <div className="mb-2 flex items-center gap-2 text-[9px] font-medium text-zinc-400">
                    <Bot className="h-3.5 w-3.5 text-[#ed785e]" />
                    Sherpa de Copy
                  </div>
                  <p className="text-[10px] leading-[1.65] text-zinc-300 sm:text-[11px]">
                    Para quem esta campanha precisa fazer sentido, e qual mudança essa pessoa procura?
                  </p>
                </div>
                <div className="ml-auto max-w-[82%] rounded-xl rounded-tr-sm bg-[#ed785e] px-3 py-2.5 text-[10px] leading-[1.6] text-zinc-950 sm:text-[11px]">
                  Quero ajudar profissionais a transformarem conhecimento em uma oferta clara.
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-950/75 px-3 py-2.5">
                <MessageSquareText className="h-3.5 w-3.5 shrink-0 text-zinc-600" />
                <span className="min-w-0 flex-1 truncate text-[10px] text-zinc-600">Continue o briefing com seu Sherpa...</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#ed785e]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <main className="min-h-[100dvh] overflow-hidden bg-zinc-950 font-sans text-zinc-100 selection:bg-[#ed785e] selection:text-zinc-950">
      <header className="border-b border-white/[0.07]">
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link href="/" aria-label="Workspace IA, início" className="group flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-zinc-900 text-[#ed785e] transition-colors group-hover:border-[#ed785e]/40">
              <Layers className="h-4 w-4" strokeWidth={1.8} />
            </span>
            <span className="text-[14px] font-semibold tracking-[-0.04em]">Workspace IA</span>
          </Link>

          <nav aria-label="Navegação principal" className="hidden items-center gap-8 text-[13px] text-zinc-400 md:flex">
            <a className="transition-colors hover:text-white" href="#virada">A virada</a>
            <a className="transition-colors hover:text-white" href="#como-funciona">Como funciona</a>
            <a className="transition-colors hover:text-white" href="#missoes">Missões</a>
          </nav>

          <Link
            href="/login"
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/15 px-3.5 text-[12px] font-medium text-zinc-200 transition-all hover:border-[#ed785e]/60 hover:text-white active:scale-[0.98] sm:h-10 sm:px-4 sm:text-[13px]"
          >
            Entrar
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-[1400px] px-5 pb-16 pt-12 sm:px-8 md:pb-20 md:pt-16 lg:px-12 lg:pt-[72px]">
        <MotionReveal>
          <p className="mb-5 flex items-center gap-2 text-[10px] font-semibold tracking-[0.18em] text-[#ed785e] uppercase sm:text-[11px]">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={1.8} />
            Aprendizado baseado em projetos
          </p>
          <h1 className="max-w-[1200px] text-[clamp(2.7rem,6.1vw,5.15rem)] leading-[0.98] font-semibold tracking-[-0.075em] text-white">
            <span className="block">Pare de assistir a aulas.</span>
            <span className="block text-zinc-400">Comece a executar projetos com IA.</span>
          </h1>
        </MotionReveal>

        <div className="mt-10 grid grid-cols-1 items-center gap-10 lg:mt-12 lg:grid-cols-[0.76fr_1.24fr] lg:gap-14">
          <MotionReveal delay={0.08} className="max-w-[430px]">
            <p className="text-[15px] leading-7 text-zinc-400 sm:text-base">
              Aprenda enquanto constrói. Avance em missões práticas com Sherpas Digitais ao seu lado, transformando decisões em trabalho real.
            </p>
            <Link
              href="/login"
              className="mt-7 inline-flex h-12 items-center justify-center gap-3 rounded-lg bg-[#ed785e] px-5 text-[14px] font-semibold text-zinc-950 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f38a72] active:translate-y-0 active:scale-[0.99]"
            >
              Iniciar Missão
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
            <p className="mt-4 text-[11px] leading-5 text-zinc-600">
              VSL, funis e tráfego. Uma missão de cada vez.
            </p>
          </MotionReveal>

          <MotionReveal delay={0.16}>
            <WorkspacePreview />
          </MotionReveal>
        </div>
      </section>

      <section id="virada" className="border-y border-white/[0.07] bg-zinc-900/45">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-9 px-5 py-16 sm:px-8 md:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-12">
          <MotionReveal className="max-w-[430px]">
            <p className="mb-4 text-[10px] font-semibold tracking-[0.17em] text-[#ed785e] uppercase">A mudança de paradigma</p>
            <h2 className="text-3xl leading-[1.04] font-semibold tracking-[-0.06em] text-white sm:text-[2.7rem]">
              Conhecimento ganha valor quando vira prática.
            </h2>
          </MotionReveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <MotionReveal delay={0.05} className="rounded-xl border border-white/[0.07] bg-zinc-950/55 p-5 sm:p-6">
              <p className="text-[10px] font-semibold tracking-[0.15em] text-zinc-600 uppercase">Antes</p>
              <h3 className="mt-5 text-xl font-medium tracking-[-0.04em] text-zinc-400">Assista. Memorize. Tente sozinho.</h3>
              <p className="mt-3 text-[13px] leading-6 text-zinc-600">
                A teoria fica de um lado. O desafio real começa quando o vídeo termina.
              </p>
            </MotionReveal>
            <MotionReveal delay={0.12} className="rounded-xl border border-[#ed785e]/25 bg-[#ed785e]/[0.07] p-5 sm:p-6">
              <p className="text-[10px] font-semibold tracking-[0.15em] text-[#ed785e] uppercase">Agora</p>
              <h3 className="mt-5 text-xl font-medium tracking-[-0.04em] text-white">Execute com especialistas ao seu lado.</h3>
              <p className="mt-3 text-[13px] leading-6 text-zinc-400">
                Aprenda o raciocínio enquanto desenvolve uma campanha com apoio dos Sherpas Digitais.
              </p>
            </MotionReveal>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 md:py-24 lg:px-12">
        <MotionReveal className="max-w-[620px]">
          <p className="mb-4 text-[10px] font-semibold tracking-[0.17em] text-[#ed785e] uppercase">Aprender fazendo</p>
          <h2 className="text-3xl leading-[1.04] font-semibold tracking-[-0.06em] text-white sm:text-5xl">
            Cada sprint ensina enquanto entrega.
          </h2>
          <p className="mt-5 max-w-[520px] text-[14px] leading-7 text-zinc-400 sm:text-[15px]">
            Você participa das decisões. Os Sherpas ajudam a dar forma ao trabalho e explicam o porquê de cada etapa.
          </p>
        </MotionReveal>

        <div className="mt-12 grid grid-cols-1 gap-x-10 lg:grid-cols-3">
          <MotionReveal className="border-t border-white/15 py-6 lg:py-7">
            <p className="text-[10px] font-semibold tracking-[0.15em] text-[#ed785e] uppercase">Passo 1 · O Alinhamento</p>
            <div className="mt-6 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-zinc-900 text-zinc-300">
              <BrainCircuit className="h-[18px] w-[18px]" strokeWidth={1.7} />
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-[-0.035em] text-white">Agente Estrategista</h3>
            <p className="mt-2 text-[13px] leading-6 text-zinc-500">
              Defina funil e público-alvo junto com o agente, entendendo a lógica por trás das escolhas.
            </p>
          </MotionReveal>

          <MotionReveal delay={0.08} className="border-t border-white/15 py-6 lg:py-7">
            <p className="text-[10px] font-semibold tracking-[0.15em] text-[#ed785e] uppercase">Passo 2 · A Construção</p>
            <div className="mt-6 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-zinc-900 text-zinc-300">
              <WandSparkles className="h-[18px] w-[18px]" strokeWidth={1.7} />
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-[-0.035em] text-white">Engenheiro de Prompt</h3>
            <p className="mt-2 text-[13px] leading-6 text-zinc-500">
              Transforme suas decisões em comandos claros para a campanha, com intenção e contexto.
            </p>
          </MotionReveal>

          <MotionReveal delay={0.16} className="border-t border-white/15 py-6 lg:py-7">
            <p className="text-[10px] font-semibold tracking-[0.15em] text-[#ed785e] uppercase">Passo 3 · O Refinamento</p>
            <div className="mt-6 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-zinc-900 text-zinc-300">
              <Check className="h-[18px] w-[18px]" strokeWidth={1.7} />
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-[-0.035em] text-white">Revisor de Copy</h3>
            <p className="mt-2 text-[13px] leading-6 text-zinc-500">
              Analise, corrija e refine a copy até chegar a uma versão final pronta para sua revisão.
            </p>
          </MotionReveal>
        </div>
      </section>

      <section id="missoes" className="border-y border-white/[0.07] bg-zinc-900/45">
        <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 md:py-24 lg:px-12">
          <MotionReveal className="max-w-[650px]">
            <p className="mb-4 text-[10px] font-semibold tracking-[0.17em] text-[#ed785e] uppercase">Catálogo de ação</p>
            <h2 className="text-3xl leading-[1.04] font-semibold tracking-[-0.06em] text-white sm:text-5xl">
              Escolha o desafio. Aprenda no caminho.
            </h2>
            <p className="mt-5 max-w-[560px] text-[14px] leading-7 text-zinc-400 sm:text-[15px]">
              Entre numa missão prática ou aprofunde uma parte da sua estratégia num laboratório de ação.
            </p>
          </MotionReveal>

          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <h3 className="mb-3 text-[11px] font-semibold tracking-[0.14em] text-zinc-500 uppercase">Missões Práticas</h3>
              {missions.map(({ title, detail, specialist, href, icon: Icon }) => (
                <Link
                  key={title}
                  href={href}
                  className="group flex items-start gap-4 border-t border-white/10 py-5 transition-colors hover:border-[#ed785e]/60"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-zinc-950 text-[#ed785e]">
                    <Icon className="h-4 w-4" strokeWidth={1.7} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-4">
                      <span className="text-[15px] font-medium text-zinc-100">{title}</span>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#ed785e]" />
                    </span>
                    <span className="mt-1 block text-[12px] leading-5 text-zinc-500">{detail}</span>
                    <span className="mt-2 block text-[10px] text-zinc-600">Com {specialist}</span>
                  </span>
                </Link>
              ))}
            </div>

            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-5 sm:p-7">
              <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-[#ed785e]/[0.06] blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-[11px] font-semibold tracking-[0.14em] text-zinc-500 uppercase">Laboratórios de Ação</h3>
                  <Layers className="h-4 w-4 text-[#ed785e]" strokeWidth={1.7} />
                </div>
                <p className="mt-7 text-2xl leading-tight font-medium tracking-[-0.05em] text-white">
                  Monte a jornada antes de acelerar.
                </p>
                <p className="mt-3 max-w-[370px] text-[13px] leading-6 text-zinc-500">
                  No Laboratório de Funil, organize oferta, etapas e pontos de decisão com o Arquiteto de Funil.
                </p>
                <Link
                  href="/workspace/funnel-architect"
                  className="mt-7 inline-flex items-center gap-2 text-[12px] font-semibold text-zinc-200 transition-colors hover:text-[#ed785e]"
                >
                  Abrir Laboratório de Funil
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-[1400px] flex-col gap-5 px-5 py-8 text-[11px] text-zinc-600 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <Link href="/" className="font-semibold text-zinc-300">Workspace IA</Link>
        <p>Missões práticas. Aprendizado em movimento.</p>
        <Link href="/login" className="inline-flex items-center gap-2 font-medium text-zinc-300 transition-colors hover:text-[#ed785e]">
          Iniciar Missão
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </footer>
    </main>
  )
}
