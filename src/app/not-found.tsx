import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Compass, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 premium-gradient z-0 opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-crimson/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg glass-panel p-12 rounded-2xl shadow-2xl">
        <h1 className="text-[120px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-crimson to-crimson-dark drop-shadow-sm mb-4">
          404
        </h1>
        <h2 className="text-3xl font-bold text-white tracking-tight mb-4">Lost in the Void</h2>
        <p className="text-text-secondary text-lg mb-8 leading-relaxed">
          The page you are looking for has been moved, deleted, or never existed in this timeline.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link href="/">
            <Button variant="secondary" className="px-8 h-12 rounded-full font-bold bg-surface hover:bg-surface-strong border border-border transition-all flex items-center gap-2">
              <Home className="w-5 h-5" /> Return Home
            </Button>
          </Link>
          <Link href="/explore">
            <Button className="px-8 h-12 rounded-full font-bold flex items-center gap-2">
              <Compass className="w-5 h-5" /> Explore Catalog
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
