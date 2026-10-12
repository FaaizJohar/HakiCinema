import React, { useState, useEffect } from "react"
import { Play, X } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface UpNextOverlayProps {
  onPlayNext: () => void
  onCancel: () => void
  countdownSeconds?: number
}

export function UpNextOverlay({ onPlayNext, onCancel, countdownSeconds = 8 }: UpNextOverlayProps) {
  const [timeLeft, setTimeLeft] = useState(countdownSeconds)

  useEffect(() => {
    if (timeLeft <= 0) {
      onPlayNext()
      return
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft, onPlayNext])

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
      <div className="flex flex-col items-center max-w-md text-center p-6">
        <h3 className="text-platinum text-sm font-semibold tracking-widest uppercase mb-2">Up Next</h3>
        
        {/* Placeholder for Next Episode Poster */}
        <div className="w-48 aspect-video bg-surface-strong rounded-lg overflow-hidden mb-6 relative shadow-2xl border border-white/10">
          <img 
            src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=400&auto=format&fit=crop" 
            alt="Next Episode"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-black text-white opacity-80">{timeLeft}</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-1">Episode 2: The Journey</h2>
        <p className="text-text-muted text-sm mb-8">Starting automatically in {timeLeft} seconds...</p>

        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={onCancel} className="px-6 border-white/20 hover:bg-white/10">
            <X className="w-4 h-4 mr-2" /> Cancel
          </Button>
          <Button onClick={onPlayNext} className="px-6 bg-crimson hover:bg-crimson-hover text-white shadow-[0_0_15px_rgba(217,22,43,0.5)]">
            <Play className="w-4 h-4 mr-2 fill-current" /> Play Now
          </Button>
        </div>
      </div>
    </div>
  )
}
