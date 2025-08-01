import { Header } from "@/components/layout/Header"

export function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-6 py-8 max-w-[1440px]">
        {children}
      </main>
    </div>
  )
} 