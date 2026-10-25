'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { sendSignInCode, signInWithPassword, verifySignInCode } from './actions'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
  ArrowRight,
  AudioLines,
  Bot,
  Check,
  Layers,
  Loader2,
  Target,
  Workflow,
} from 'lucide-react'

const benefits = [
  {
    icon: Bot,
    title: 'Sherpas ao seu lado',
    description: 'Estratégia, copy e aquisição acompanhadas por especialistas de IA.',
  },
  {
    icon: AudioLines,
    title: 'Missões com começo e entrega',
    description: 'Avance por decisões práticas e construa uma parte do seu projeto em cada sprint.',
  },
  {
    icon: Target,
    title: 'Aprendizado no contexto',
    description: 'Entenda o raciocínio enquanto aplica ao desafio real da sua campanha.',
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
    <main className="relative grid min-h-dvh bg-background text-foreground lg:grid-cols-2">
      <div className="absolute top-4 right-4 z-20 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      <section className="flex min-h-dvh flex-col px-5 py-7 sm:px-10 lg:px-14 xl:px-20">
        <Link href="/" aria-label="Voltar ao início do Workspace IA" className="flex w-fit items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-ring">
          <span className="flex size-9 items-center justify-center rounded-lg bg-foreground text-background">
            <Layers className="size-[18px]" strokeWidth={1.8} />
          </span>
          <span className="text-sm font-semibold tracking-tight">Workspace IA</span>
        </Link>

        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-16 sm:py-20">
          <div className="mb-8">
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Continue de onde parou.</h1>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Entre para retomar suas missões e construir com seus Sherpas.
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 rounded-xl bg-muted p-1" role="tablist" aria-label="Método de acesso">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'password'}
              onClick={() => changeMode('password')}
              className={`h-10 rounded-lg px-3 text-sm font-medium transition-colors ${mode === 'password' ? 'bg-background text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Palavra-passe
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'code'}
              onClick={() => changeMode('code')}
              className={`h-10 rounded-lg px-3 text-sm font-medium transition-colors ${mode === 'code' ? 'bg-background text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Código por e-mail
            </button>
          </div>

          {mode === 'password' ? (
            <form action={handleSubmit} className="space-y-5" role="tabpanel">
              <div className="space-y-2">
                <label htmlFor="email-password" className="text-sm font-medium">E-mail</label>
                <Input
                  id="email-password"
                  type="email"
                  name="email"
                  placeholder="voce@empresa.com"
                  autoComplete="email"
                  required
                  className="h-12 rounded-lg border-input bg-card px-4 text-base focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Palavra-passe</label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Insira a sua palavra-passe"
                  autoComplete="current-password"
                  required
                  className="h-12 rounded-lg border-input bg-card px-4 text-base focus-visible:ring-ring"
                />
              </div>
              <Button type="submit" disabled={isPending} className="h-12 w-full rounded-full text-sm font-semibold">
                {isPending ? <Loader2 data-icon="inline-start" className="animate-spin" /> : null}
                {isPending ? 'Acedendo...' : 'Entrar no Workspace'}
                {!isPending ? <ArrowRight data-icon="inline-end" /> : null}
              </Button>
            </form>
          ) : codeSent ? (
            <form onSubmit={handleVerifyCode} className="space-y-5" role="tabpanel">
              <div className="space-y-2">
                <label htmlFor="verification-code" className="text-sm font-medium">Código de acesso</label>
                <p className="text-sm leading-6 text-muted-foreground">Enviámos um código para {email.trim()}.</p>
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
                  className="h-12 rounded-lg border-input bg-card px-4 text-center text-lg tracking-[0.2em] focus-visible:ring-ring"
                />
              </div>
              <Button type="submit" disabled={isPending} className="h-12 w-full rounded-full text-sm font-semibold">
                {isPending ? <Loader2 data-icon="inline-start" className="animate-spin" /> : null}
                {isPending ? 'Validando...' : 'Validar código e entrar'}
                {!isPending ? <ArrowRight data-icon="inline-end" /> : null}
              </Button>
              <button type="button" onClick={() => setCodeSent(false)} className="w-full py-1 text-center text-sm text-muted-foreground transition-colors hover:text-foreground">
                Usar outro e-mail
              </button>
            </form>
          ) : (
            <form onSubmit={handleSendCode} className="space-y-5" role="tabpanel">
              <div className="space-y-2">
                <label htmlFor="email-code" className="text-sm font-medium">E-mail</label>
                <Input
                  id="email-code"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="voce@empresa.com"
                  autoComplete="email"
                  required
                  className="h-12 rounded-lg border-input bg-card px-4 text-base focus-visible:ring-ring"
                />
              </div>
              <Button type="submit" disabled={isPending} className="h-12 w-full rounded-full text-sm font-semibold">
                {isPending ? <Loader2 data-icon="inline-start" className="animate-spin" /> : null}
                {isPending ? 'Enviando...' : 'Enviar código de acesso'}
                {!isPending ? <ArrowRight data-icon="inline-end" /> : null}
              </Button>
              <p className="text-center text-sm leading-6 text-muted-foreground">
                O código chega à sua caixa de entrada. Não precisa abrir um link.
              </p>
            </form>
          )}

          <div className="mt-7 flex items-start gap-3 pt-3 text-sm leading-6 text-muted-foreground">
            <Check className="mt-1 size-4 shrink-0" />
            <p>Acesse com as credenciais associadas à sua conta para retomar os seus projetos.</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">Workspace IA · Aprender fazendo.</p>
      </section>

      <aside className="hidden min-h-dvh flex-col justify-between bg-card px-10 py-10 lg:flex lg:px-14 xl:px-20">
        <div className="flex items-center justify-end">
          <span className="rounded-full bg-muted px-3.5 py-2 text-sm text-muted-foreground">Missões práticas</span>
        </div>

        <div className="my-14 max-w-[560px]">
          <div className="flex size-12 items-center justify-center rounded-xl bg-background text-foreground">
            <Layers className="size-5" strokeWidth={1.7} />
          </div>
          <h2 className="mt-7 max-w-[560px] text-4xl leading-[1.04] font-semibold tracking-tight xl:text-[3.125rem]">
            O futuro da educação é a execução.
          </h2>
          <p className="mt-5 max-w-[440px] text-lg leading-8 text-muted-foreground">
            Menos conteúdo para acumular. Mais projetos construídos com apoio inteligente em cada etapa.
          </p>

          <ul className="mt-10 space-y-6">
            {benefits.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-4">
                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-background text-foreground">
                  <Icon className="size-[18px]" strokeWidth={1.7} />
                </span>
                <span>
                  <span className="block text-base font-medium">{title}</span>
                  <span className="mt-1 block max-w-[360px] text-base leading-6 text-muted-foreground">{description}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between gap-4 pt-5 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2"><Workflow className="size-4" /> Estratégia · Construção · Refinamento</span>
          <Link href="/" className="transition-colors hover:text-foreground">Conhecer a plataforma</Link>
        </div>
      </aside>
    </main>
  )
}
