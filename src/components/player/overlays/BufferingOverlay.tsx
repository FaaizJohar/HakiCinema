import React from "react"
import { Loader2 } from "lucide-react"

export function BufferingOverlay() {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none transition-opacity duration-300">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 md:w-12 md:h-12 text-crimson animate-spin" />
        <span className="text-white/80 font-semibold tracking-widest text-sm md:text-base animate-pulse uppercase">
          HAKI BOX
        </span>
      </div>
    </div>
  )
}
