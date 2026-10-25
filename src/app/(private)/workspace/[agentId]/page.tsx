'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Send, FileText, Target, PlayCircle, Bot } from 'lucide-react'
import { toast } from 'sonner'
import { sendAgentMessage } from './actions'

export default function AgentWorkspacePage() {
  const params = useParams()
  const agentSlug = params?.agentId as string

  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: 'Olá! Sou seu especialista dedicado. Defina o objetivo da campanha no painel esquerdo ou me envie o briefing inicial para começarmos a estruturação.',
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    const briefing = window.sessionStorage.getItem('sherpa-mission-briefing')
    if (!briefing) return
    window.sessionStorage.removeItem('sherpa-mission-briefing')
    setInputValue(briefing)
  }, [])

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const content = inputValue.trim()
    if (!content || isPending) return

    const conversation = [...messages, { role: 'user' as const, content }]
    setMessages(conversation)
    setInputValue('')
    setIsPending(true)

    try {
      const result = await sendAgentMessage(agentSlug, conversation)
      if ('error' in result) {
        toast.error('Não foi possível responder', { description: result.error })
      } else {
        setMessages([...conversation, { role: 'assistant', content: result.reply }])
      }
    } catch {
      toast.error('Falha de conexão', {
        description: 'Tente enviar sua mensagem novamente em instantes.',
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background font-sans text-foreground lg:flex-row">
      {/* Painel Esquerdo: Canvas do Projeto / Briefing */}
      <section className="flex min-w-0 flex-1 flex-col border-b border-border bg-background lg:border-r lg:border-b-0">
        <header className="flex h-14 items-center justify-between border-b border-border px-6">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-muted-foreground" />
            <span className="text-sm font-semibold">Projeto: Estrutura de VSL & Funil</span>
          </div>
          <Badge variant="outline" className="text-xs">
            Em Execução
          </Badge>
        </header>

        <div className="flex-1 p-6 overflow-hidden">
          <Tabs defaultValue="briefing" className="h-full flex flex-col">
            <TabsList className="mb-4 self-start border border-border bg-muted">
              <TabsTrigger value="briefing" className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground">
                Briefing & Persona
              </TabsTrigger>
              <TabsTrigger value="canvas" className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground">
                Rascunho de Execução
              </TabsTrigger>
              <TabsTrigger value="deliverables" className="text-xs data-[state=active]:bg-card data-[state=active]:text-foreground">
                Entregáveis Finais
              </TabsTrigger>
            </TabsList>

            <TabsContent value="briefing" className="flex-1 overflow-y-auto rounded-xl border border-border bg-card p-5 text-sm text-foreground">
              <div className="space-y-4">
                <div>
                  <h4 className="mb-1 flex items-center gap-2 font-semibold">
                    <Target className="size-4 text-muted-foreground" /> Público-Alvo & Dores
                  </h4>
                  <p className="leading-relaxed text-muted-foreground">
                    Defina o nicho, o valor do ticket e a principal barreira de conversão da campanha antes de disparar o prompt para o agente.
                  </p>
                </div>
                <div className="border-t border-border pt-4">
                  <h4 className="mb-1 flex items-center gap-2 font-semibold">
                    <PlayCircle className="size-4 text-muted-foreground" /> Promessa Central
                  </h4>
                  <p className="leading-relaxed text-muted-foreground">
                    A Big Idea orientará a retenção nos primeiros 5 segundos de criativo ou vídeo de vendas.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="canvas" className="flex-1 rounded-xl border border-border bg-card p-5">
              <textarea
                placeholder="Edite aqui o resultado gerado pela IA ou escreva sua estrutura..."
                className="h-full w-full resize-none border-none bg-transparent text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
              />
            </TabsContent>

            <TabsContent value="deliverables" className="flex-1 rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
              Nenhum ativo final consolidado. Complete a interação com o agente para exportar copys ou estruturas.
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Painel Direito: Especialista de IA (Co-learning) */}
      <section className="flex min-w-0 flex-1 flex-col bg-background">
        <header className="flex h-14 items-center justify-between border-b border-border px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-muted">
              <Bot className="size-4" />
            </div>
            <div>
              <span className="text-sm font-semibold capitalize">
                {agentSlug ? agentSlug.replace('-', ' ') : 'Especialista'}
              </span>
              <span className="block text-xs text-muted-foreground">Co-Learning Ativo</span>
            </div>
          </div>
          <Badge variant="outline" className="text-xs text-muted-foreground">
            Turbo Engine
          </Badge>
        </header>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4 max-w-2xl mx-auto">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 text-sm ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg px-4 py-3 max-w-[85%] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border bg-card text-card-foreground'
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {isPending && (
              <div className="flex justify-start text-sm" role="status" aria-live="polite">
                <div className="rounded-lg border border-border bg-card px-4 py-3 text-muted-foreground">
                  Sherpa está preparando uma resposta...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t border-border bg-background p-4">
          <form onSubmit={handleSendMessage} className="max-w-2xl mx-auto flex gap-2">
            <textarea
              rows={2}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Envie uma dúvida ou instrução para seu especialista..."
              disabled={isPending}
              className="min-h-10 flex-1 resize-y rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            />
            <Button type="submit" size="icon" disabled={isPending || !inputValue.trim()} className="shrink-0 rounded-full">
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </section>
    </div>
  )
}
