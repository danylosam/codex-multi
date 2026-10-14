'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  sendSignInCode,
  signInWithPassword,
  verifySignInCode,
} from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
  ArrowRight,
  BrainCircuit,
  Check,
  Layers,
  Loader2,
  Target,
  Workflow,
} from 'lucide-react'

const benefits = [
  {
    icon: BrainCircuit,
    title: 'Sherpas Digitais',
    description: 'Orientação de estratégia, copy e aquisição enquanto você constrói.',
  },
  {
    icon: Workflow,
    title: 'Sprints de Marketing',
    description: 'Missões práticas divididas em etapas claras e aplicáveis.',
  },
  {
    icon: Target,
    title: 'Aprendizado em contexto',
    description: 'A teoria aparece no momento em que ajuda a tomar uma decisão.',
  },
]

export default function LoginPage() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [mode, setMode] = useState<'password' | 'code'>('password')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    const result = await signInWithPassword(formData)

    if (result?.error) {
      toast.error('Erro na autenticação', { description: result.error })
      setIsPending(false)
    } else {
      toast.success('Autenticado com sucesso!')
      router.push('/workspace/vsl-writer')
      router.refresh()
    }
  }

  async function handleSendCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email.trim()) return

    setIsPending(true)
    const result = await sendSignInCode(email.trim())

    if (result?.error) {
      toast.error('Não foi possível enviar o código', { description: result.error })
    } else {
      toast.success('Código enviado', {
        description: `Confira a caixa de entrada de ${email.trim()}.`,
      })
      setCodeSent(true)
    }
    setIsPending(false)
  }

  async function handleVerifyCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!code.trim()) return

    setIsPending(true)
    const result = await verifySignInCode(email.trim(), code.trim())

    if (result?.error) {
      toast.error('Código inválido', { description: result.error })
      setIsPending(false)
    } else {
      toast.success('Autenticado com sucesso!')
      router.push('/workspace/vsl-writer')
      router.refresh()
    }
  }

  function changeMode(nextMode: 'password' | 'code') {
    setMode(nextMode)
    setCodeSent(false)
    setCode('')
  }

  return (
    <main className="grid min-h-[100dvh] grid-cols-1 bg-zinc-950 font-sans text-zinc-100 selection:bg-[#ed785e] selection:text-zinc-950 lg:grid-cols-2">
      <section className="order-2 flex min-h-[100dvh] flex-col justify-between px-5 py-7 sm:px-10 lg:order-1 lg:px-14 xl:px-20">
        <Link href="/" aria-label="Voltar ao início" className="flex w-fit items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-zinc-900 text-[#ed785e]">
            <Layers className="h-4 w-4" strokeWidth={1.8} />
          </span>
          <span className="text-[14px] font-semibold tracking-[-0.04em]">Workspace IA</span>
        </Link>

        <div className="mx-auto w-full max-w-[400px] py-14 lg:py-12">
          <div className="mb-8">
            <p className="mb-3 text-[10px] font-semibold tracking-[0.17em] text-[#ed785e] uppercase">Sua próxima missão começa aqui</p>
            <h1 className="text-3xl font-semibold tracking-[-0.055em] text-white sm:text-4xl">
              Entre no Workspace
            </h1>
            <p className="mt-3 text-[14px] leading-6 text-zinc-500">
              Acesse seus projetos e continue aprendendo enquanto executa.
            </p>
          </div>

          <div className="mb-5 grid grid-cols-2 rounded-lg border border-white/[0.07] bg-zinc-900/65 p-1" role="tablist" aria-label="Método de acesso">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'password'}
              onClick={() => changeMode('password')}
              className={`h-9 rounded-md px-2 text-[12px] font-medium transition-colors ${mode === 'password' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Palavra-passe
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'code'}
              onClick={() => changeMode('code')}
              className={`h-9 rounded-md px-2 text-[12px] font-medium transition-colors ${mode === 'code' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Código por e-mail
            </button>
          </div>

          {mode === 'password' ? (
            <form action={handleSubmit} className="space-y-4" role="tabpanel">
              <div className="space-y-2">
                <label htmlFor="email-password" className="text-[12px] font-medium text-zinc-300">E-mail</label>
                <Input
                  id="email-password"
                  type="email"
                  name="email"
                  placeholder="voce@empresa.com"
                  autoComplete="email"
                  required
                  className="h-12 rounded-lg border-white/10 bg-zinc-900/70 px-4 text-[14px] text-white placeholder:text-zinc-600 focus-visible:border-[#ed785e]/60 focus-visible:ring-[#ed785e]/30"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-[12px] font-medium text-zinc-300">Palavra-passe</label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Insira a sua palavra-passe"
                  autoComplete="current-password"
                  required
                  className="h-12 rounded-lg border-white/10 bg-zinc-900/70 px-4 text-[14px] text-white placeholder:text-zinc-600 focus-visible:border-[#ed785e]/60 focus-visible:ring-[#ed785e]/30"
                />
              </div>
              <Button
                type="submit"
                disabled={isPending}
                className="mt-2 h-12 w-full rounded-lg bg-[#ed785e] text-[14px] font-semibold text-zinc-950 transition-all hover:-translate-y-0.5 hover:bg-[#f38a72] active:translate-y-0 active:scale-[0.99] disabled:translate-y-0 disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Acedendo...
                  </>
                ) : (
                  <>
                    Entrar no Workspace
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          ) : codeSent ? (
            <form onSubmit={handleVerifyCode} className="space-y-4" role="tabpanel">
              <div className="space-y-2">
                <label htmlFor="verification-code" className="text-[12px] font-medium text-zinc-300">Código de acesso</label>
                <p className="text-[12px] leading-5 text-zinc-500">Enviámos um código para {email.trim()}.</p>
                <Input
                  id="verification-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="Introduza o código"
                  maxLength={8}
                  required
                  autoFocus
                  className="h-12 rounded-lg border-white/10 bg-zinc-900/70 px-4 text-center font-mono text-[17px] tracking-[0.2em] text-white placeholder:font-sans placeholder:text-[13px] placeholder:tracking-normal placeholder:text-zinc-600 focus-visible:border-[#ed785e]/60 focus-visible:ring-[#ed785e]/30"
                />
              </div>
              <Button
                type="submit"
                disabled={isPending}
                className="h-12 w-full rounded-lg bg-[#ed785e] text-[14px] font-semibold text-zinc-950 transition-all hover:-translate-y-0.5 hover:bg-[#f38a72] active:translate-y-0 active:scale-[0.99] disabled:translate-y-0 disabled:opacity-60"
              >
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isPending ? 'Validando...' : 'Validar código e entrar'}
              </Button>
              <button
                type="button"
                onClick={() => setCodeSent(false)}
                className="w-full py-1 text-center text-[12px] text-zinc-500 transition-colors hover:text-zinc-300"
              >
                Usar outro e-mail
              </button>
            </form>
          ) : (
            <form onSubmit={handleSendCode} className="space-y-4" role="tabpanel">
              <div className="space-y-2">
                <label htmlFor="email-code" className="text-[12px] font-medium text-zinc-300">E-mail</label>
                <Input
                  id="email-code"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="voce@empresa.com"
                  autoComplete="email"
                  required
                  className="h-12 rounded-lg border-white/10 bg-zinc-900/70 px-4 text-[14px] text-white placeholder:text-zinc-600 focus-visible:border-[#ed785e]/60 focus-visible:ring-[#ed785e]/30"
                />
              </div>
              <Button
                type="submit"
                disabled={isPending}
                className="h-12 w-full rounded-lg bg-[#ed785e] text-[14px] font-semibold text-zinc-950 transition-all hover:-translate-y-0.5 hover:bg-[#f38a72] active:translate-y-0 active:scale-[0.99] disabled:translate-y-0 disabled:opacity-60"
              >
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isPending ? 'Enviando...' : 'Enviar código de acesso'}
                {!isPending ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
              </Button>
              <p className="text-center text-[11px] leading-5 text-zinc-600">
                O código chega à sua caixa de entrada. Não precisa abrir um link.
              </p>
            </form>
          )}

          <div className="mt-6 flex items-start gap-2.5 border-t border-white/[0.07] pt-5 text-[11px] leading-5 text-zinc-600">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#ed785e]" />
            <p>Acesse com as credenciais associadas à sua conta para retomar os seus projetos.</p>
          </div>
        </div>

        <p className="text-[11px] text-zinc-700">© Workspace IA · Aprender fazendo.</p>
      </section>

      <aside className="relative order-1 hidden min-h-[100dvh] overflow-hidden border-l border-white/[0.06] bg-[radial-gradient(ellipse_at_78%_12%,rgba(237,120,94,0.14),transparent_34%),linear-gradient(145deg,#18181b_0%,#111113_55%,#09090b_100%)] px-10 py-10 lg:order-2 lg:flex lg:flex-col lg:justify-between lg:px-14 lg:py-12 xl:px-20">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold tracking-[0.18em] text-zinc-500 uppercase">Co-learning por execução</span>
          <span className="flex items-center gap-2 rounded-full border border-white/10 bg-black/15 px-3 py-1.5 text-[10px] text-zinc-400">
            Missões práticas
          </span>
        </div>

        <div className="relative z-10 my-14 max-w-[560px]">
          <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-xl border border-[#ed785e]/25 bg-[#ed785e]/[0.08] text-[#ed785e]">
            <Layers className="h-5 w-5" strokeWidth={1.7} />
          </div>
          <h2 className="max-w-[540px] text-4xl leading-[1.03] font-semibold tracking-[-0.065em] text-white xl:text-[3.5rem]">
            O Futuro da Educação é a Execução.
          </h2>
          <p className="mt-5 max-w-[440px] text-[14px] leading-7 text-zinc-400">
            Menos conteúdo para acumular. Mais projetos para construir com apoio inteligente em cada etapa.
          </p>

          <ul className="mt-10 space-y-5">
            {benefits.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-4">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-zinc-950/70 text-zinc-300">
                  <Icon className="h-4 w-4" strokeWidth={1.7} />
                </span>
                <span>
                  <span className="block text-[13px] font-medium text-zinc-200">{title}</span>
                  <span className="mt-1 block max-w-[360px] text-[12px] leading-5 text-zinc-500">{description}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.08] pt-5 text-[10px] text-zinc-600">
          <span>Estratégia · Construção · Refinamento</span>
          <Link href="/" className="transition-colors hover:text-zinc-300">Conhecer a plataforma</Link>
        </div>
      </aside>
    </main>
  )
}
