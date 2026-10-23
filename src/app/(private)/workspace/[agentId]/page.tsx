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
    <div className="flex h-full flex-col lg:flex-row overflow-hidden bg-zinc-950 font-sans">
      {/* Painel Esquerdo: Canvas do Projeto / Briefing */}
      <section className="flex-1 border-b lg:border-b-0 lg:border-r border-zinc-800/80 flex flex-col min-w-0 bg-zinc-900/20">
        <header className="h-14 border-b border-zinc-800/80 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-zinc-400" />
            <span className="text-sm font-semibold text-zinc-200">Projeto: Estrutura de VSL & Funil</span>
          </div>
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-xs">
            Em Execução
          </Badge>
        </header>

        <div className="flex-1 p-6 overflow-hidden">
          <Tabs defaultValue="briefing" className="h-full flex flex-col">
            <TabsList className="bg-zinc-900 border border-zinc-800 self-start mb-4">
              <TabsTrigger value="briefing" className="text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
                Briefing & Persona
              </TabsTrigger>
              <TabsTrigger value="canvas" className="text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
                Rascunho de Execução
              </TabsTrigger>
              <TabsTrigger value="deliverables" className="text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
                Entregáveis Finais
              </TabsTrigger>
            </TabsList>

            <TabsContent value="briefing" className="flex-1 bg-zinc-900/40 border border-zinc-800/80 rounded-lg p-5 overflow-y-auto">
              <div className="space-y-4 text-sm text-zinc-300">
                <div>
                  <h4 className="font-semibold text-zinc-100 flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-zinc-400" /> Público-Alvo & Dores
                  </h4>
                  <p className="text-zinc-400 leading-relaxed">
                    Defina o nicho, o valor do ticket e a principal barreira de conversão da campanha antes de disparar o prompt para o agente.
                  </p>
                </div>
                <div className="border-t border-zinc-800/60 pt-4">
                  <h4 className="font-semibold text-zinc-100 flex items-center gap-2 mb-1">
                    <PlayCircle className="h-4 w-4 text-zinc-400" /> Promessa Central
                  </h4>
                  <p className="text-zinc-400 leading-relaxed">
                    A Big Idea orientará a retenção nos primeiros 5 segundos de criativo ou vídeo de vendas.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="canvas" className="flex-1 bg-zinc-900/40 border border-zinc-800/80 rounded-lg p-5">
              <textarea
                placeholder="Edite aqui o resultado gerado pela IA ou escreva sua estrutura..."
                className="w-full h-full bg-transparent resize-none border-none outline-none text-zinc-200 placeholder:text-zinc-600 text-sm leading-relaxed"
              />
            </TabsContent>

            <TabsContent value="deliverables" className="flex-1 bg-zinc-900/40 border border-zinc-800/80 rounded-lg p-5 text-zinc-400 text-sm">
              Nenhum ativo final consolidado. Complete a interação com o agente para exportar copys ou estruturas.
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Painel Direito: Especialista de IA (Co-learning) */}
      <section className="flex-1 flex flex-col min-w-0 bg-zinc-950">
        <header className="h-14 border-b border-zinc-800/80 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center">
              <Bot className="h-4 w-4 text-zinc-200" />
            </div>
            <div>
              <span className="text-sm font-semibold text-zinc-100 capitalize">
                {agentSlug ? agentSlug.replace('-', ' ') : 'Especialista'}
              </span>
              <span className="text-xs text-zinc-500 block">Co-Learning Ativo</span>
            </div>
          </div>
          <Badge variant="outline" className="border-zinc-800 text-zinc-400 text-xs">
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
                      ? 'bg-zinc-100 text-zinc-950'
                      : 'bg-zinc-900 border border-zinc-800/80 text-zinc-200'
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {isPending && (
              <div className="flex justify-start text-sm" role="status" aria-live="polite">
                <div className="rounded-lg border border-zinc-800/80 bg-zinc-900 px-4 py-3 text-zinc-400">
                  Sherpa está preparando uma resposta...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950">
          <form onSubmit={handleSendMessage} className="max-w-2xl mx-auto flex gap-2">
            <textarea
              rows={2}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Envie uma dúvida ou instrução para seu especialista..."
              disabled={isPending}
              className="min-h-10 flex-1 resize-y rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-700 disabled:opacity-50"
            />
            <Button type="submit" size="icon" disabled={isPending || !inputValue.trim()} className="bg-zinc-100 text-zinc-900 hover:bg-zinc-300 shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </section>
    </div>
  )
}
