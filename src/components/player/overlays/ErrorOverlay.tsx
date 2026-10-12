import React from "react"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"

export function ErrorOverlay() {
  return (
    <div className="absolute inset-0 z-40 bg-black/90 flex flex-col items-center justify-center pointer-events-none p-4">
      <div className="flex flex-col items-center text-center max-w-md pointer-events-auto">
        <div className="w-16 h-16 rounded-full bg-error/20 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-error" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Playback Error</h3>
        <p className="text-text-secondary text-sm mb-6">
          The video source might be broken, blocked by an adblocker, or formatted incorrectly. Please try another server or check the URL.
        </p>
        <Button onClick={() => window.location.reload()} variant="secondary" className="px-8">
          Reload Player
        </Button>
      </div>
    </div>
  )
}
