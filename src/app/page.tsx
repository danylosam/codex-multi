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

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-indigo-500/30">
      {/* HEADER */}
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
          </nav>
          <div className="flex items-center gap-4">
            <Link 
              href="/workspace" 
              className="h-9 px-4 inline-flex items-center justify-center rounded-full bg-white text-zinc-950 text-sm font-medium hover:bg-zinc-200 transition-colors"
            >
              Acessar Workspace ↗
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-16 pb-24 border-b border-zinc-800/40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/15 blur-[130px] rounded-full pointer-events-none" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* LADO ESQUERDO: Ajuste Fino 1 */}
              <div className="flex flex-col items-start space-y-6">
                <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-1.5 text-sm text-zinc-300 backdrop-blur-sm">
                  <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-3 animate-pulse"></span>
                  A Nova Era do Aprendizado por Execução
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08]">
                  Aprender é <br />construir. <br />
                  <span className="text-zinc-500">Da ideia ao ativo publicado em um único fluxo.</span>
                </h1>
                
                <p className="text-lg text-zinc-200 max-w-lg leading-relaxed">
                  Alinhe o contexto do seu negócio com agentes autônomos de alta performance. Em minutos de interação guiada, suas ofertas, roteiros e criativos saem estruturados e prontos para distribuição.
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

              {/* LADO DIREITO: Imagem 3D */}
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

        {/* MISSÕES EM DESTAQUE */}
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

        {/* PILARES DE EXECUÇÃO */}
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
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
