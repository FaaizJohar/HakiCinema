import { useEffect, RefObject } from "react"

interface UsePlayerShortcutsProps {
  videoRef: RefObject<HTMLVideoElement | null>
  containerRef: RefObject<HTMLElement | null>
  togglePlay: () => void
  toggleMute: () => void
  toggleFullscreen: (ref: RefObject<HTMLElement | null>) => void
  seek: (time: number) => void
  currentTime: number
  duration: number
  toggleTheater?: () => void
}

export function usePlayerShortcuts({
  videoRef,
  containerRef,
  togglePlay,
  toggleMute,
  toggleFullscreen,
  seek,
  currentTime,
  duration,
  toggleTheater
}: UsePlayerShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.tagName === "SELECT" ||
        document.activeElement?.getAttribute("contenteditable") === "true"
      ) {
        return
      }

      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault()
          togglePlay()
          break
        case "f":
          e.preventDefault()
          toggleFullscreen(containerRef)
          break
        case "m":
          e.preventDefault()
          toggleMute()
          break
        case "t":
          e.preventDefault()
          if (toggleTheater) toggleTheater()
          break
        case "arrowleft":
          e.preventDefault()
          seek(Math.max(0, currentTime - 10))
          break
        case "arrowright":
          e.preventDefault()
          seek(Math.min(duration, currentTime + 10))
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [togglePlay, toggleMute, toggleFullscreen, seek, currentTime, duration, toggleTheater, containerRef])
}
