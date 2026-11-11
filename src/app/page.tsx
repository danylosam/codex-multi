import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-indigo-500/30">
      {/* HEADER: Glassmorphism */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/70 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 rounded bg-white text-zinc-950 flex items-center justify-center">
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
        {/* HERO SECTION: Split-Screen */}
        <section className="relative overflow-hidden pt-20 pb-32">
          {/* Brilho de fundo (Glow) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* LADO ESQUERDO: Copy e CTA */}
              <div className="flex flex-col items-start space-y-8">
                <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-sm text-zinc-300 backdrop-blur-sm">
                  <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-3 animate-pulse"></span>
                  A Nova Era do Aprendizado por Execução
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                  Não assista <br />a cursos. <br />
                  <span className="text-zinc-400">Construa seus ativos.</span>
                </h1>
                
                <p className="text-lg text-zinc-400 max-w-lg leading-relaxed">
                  Delege o trabalho pesado. Seus Sherpas criam as copys, imagens e vídeos. Você apenas aprova e o sistema posta no seu Instagram automaticamente.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Link 
                    href="/workspace" 
                    className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-medium text-zinc-950 transition-all hover:scale-105 hover:bg-zinc-200"
                  >
                    Iniciar Primeira Missão &rarr;
                  </Link>
                  <Link 
                    href="#esteira" 
                    className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm px-8 text-sm font-medium text-zinc-300 transition-all hover:bg-zinc-800"
                  >
                    Conhecer a Esteira
                  </Link>
                </div>
              </div>

              {/* LADO DIREITO: Imagem 3D */}
              <div className="relative w-full aspect-[4/3] lg:aspect-[16/10] rounded-2xl overflow-hidden shadow-[0_0_50px_-12px_rgba(99,102,241,0.2)] border border-zinc-800/50 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950/80 via-transparent to-transparent z-10 pointer-events-none" />
                <Image
                  src="/assets/hero-glow-3d.png"
                  alt="Workspace IA Mesa de Comando Omnichannel"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </div>

            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
