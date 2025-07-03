import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Juridiq - Gerenciador de Livros',
  description: 'Sistema de gerenciamento de livros - Desafio Full Stack Juridiq',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gradient-to-br from-[#eaf1fb] via-[#e3eefd] to-[#f8fafc] text-gray-800 font-sans">
        {/* Header */}
        <header className="w-full bg-white/80 shadow-md fixed top-0 left-0 z-50 backdrop-blur-md">
          <div className="container mx-auto flex items-center justify-between py-4">
            <div className="flex items-center">
              <img src="/imgs/juridiqLOGO.webp" alt="Juridiq Logo" className="h-10 w-10 mr-3" />
              <span className="text-2xl font-bold tracking-tight text-[#2563eb] drop-shadow-sm">Juridiq Library</span>
            </div>
            <nav className="flex gap-6 text-base font-semibold">
              <a href="/dashboard" className="text-[#2563eb] hover:underline">Dashboard</a>
              <a href="/adicionar" className="text-[#2563eb] hover:underline">Adicionar Livro</a>
              <a href="/" className="text-[#2563eb] hover:underline">Buscar Livros</a>
            </nav>
          </div>
        </header>
        <main className="pt-24 pb-16 container mx-auto px-4 flex flex-col min-h-[80vh]">
          {children}
        </main>
        <footer className="w-full bg-white/80 shadow-inner py-6 text-center text-gray-500 text-sm mt-auto">
          <p>
            Desenvolvido para o Desafio Full Stack Juridiq | <a href="https://www.juridiq.com.br/" className="underline text-[#2563eb] hover:text-[#1d4ed8]">juridiq.com.br</a>
          </p>
        </footer>
      </body>
    </html>
  )
} 