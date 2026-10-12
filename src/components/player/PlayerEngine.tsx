"use client"

import React, { useRef, useState, useEffect } from "react"
import { useVideoPlayer } from "@/hooks/useVideoPlayer"
import { usePlayerShortcuts } from "@/hooks/usePlayerShortcuts"
import { PlayerControls } from "./controls/PlayerControls"
import { BufferingOverlay } from "./overlays/BufferingOverlay"
import { ErrorOverlay } from "./overlays/ErrorOverlay"
import { UpNextOverlay } from "./overlays/UpNextOverlay"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/Button"
import { useRouter } from "next/navigation"

interface PlayerEngineProps {
  animeId: string
  episodeId: string
  videoSrc: string
  title: string
  subtitle: string
  isTheaterMode: boolean
  toggleTheaterMode: () => void
  onNextEpisode?: () => void
}

export function PlayerEngine({
  animeId,
  episodeId,
  videoSrc,
  title,
  subtitle,
  isTheaterMode,
  toggleTheaterMode,
  onNextEpisode
}: PlayerEngineProps) {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [showControls, setShowControls] = useState(true)
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null)
  const [showUpNext, setShowUpNext] = useState(false)

  const player = useVideoPlayer(videoRef, videoSrc)

  // Shortcuts
  usePlayerShortcuts({
    videoRef,
    containerRef,
    togglePlay: player.togglePlay,
    toggleMute: player.toggleMute,
    toggleFullscreen: player.toggleFullscreen,
    seek: player.seek,
    currentTime: player.currentTime,
    duration: player.duration,
    toggleTheater: toggleTheaterMode,
  })

  // Auto-hide controls logic
  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeout) clearTimeout(controlsTimeout)
    if (player.playerState === "playing") {
      const timeout = setTimeout(() => setShowControls(false), 3000)
      setControlsTimeout(timeout)
    }
  }

  const handleMouseLeave = () => {
    if (player.playerState === "playing") {
      setShowControls(false)
    }
  }

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeout) clearTimeout(controlsTimeout)
    }
  }, [controlsTimeout])

  // Show controls when paused
  useEffect(() => {
    if (player.playerState !== "playing") {
      setShowControls(true)
      if (controlsTimeout) clearTimeout(controlsTimeout)
    }
  }, [player.playerState])

  // End of episode Up Next overlay
  useEffect(() => {
    // Show UpNext overlay if we are 10 seconds from the end, and we have a next episode function
    if (player.duration > 0 && player.currentTime >= player.duration - 10 && onNextEpisode) {
      setShowUpNext(true)
    } else {
      setShowUpNext(false)
    }
  }, [player.currentTime, player.duration, onNextEpisode])

  const isEmbed = videoSrc.includes("vidmoly.me") || videoSrc.includes("youtube.com") || videoSrc.includes("embed") || videoSrc.includes("vimeo.com");

  return (
    <div 
      ref={containerRef}
      className={`relative w-full bg-black flex items-center justify-center overflow-hidden group ${isTheaterMode ? 'h-[75vh]' : 'aspect-video max-h-[85vh]'}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        // Mobile tap to toggle controls
        if (window.innerWidth < 768 && !isEmbed) {
          setShowControls(!showControls)
        }
      }}
    >
      {/* Video Element or Iframe */}
      {isEmbed ? (
        <iframe
          src={videoSrc}
          className="w-full h-full border-0"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
        />
      ) : (
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          playsInline
          crossOrigin="anonymous"
          onClick={(e) => {
            e.stopPropagation()
            player.togglePlay()
          }}
        />
      )}

      {/* Loading Overlay */}
      {!isEmbed && (player.playerState === "buffering" || player.playerState === "loading") ? (
        <BufferingOverlay />
      ) : null}

      {/* Error Overlay */}
      {!isEmbed && player.playerState === "error" && <ErrorOverlay />}

      {/* Up Next Overlay */}
      {!isEmbed && showUpNext && onNextEpisode && (
        <UpNextOverlay 
          onPlayNext={() => {
            setShowUpNext(false)
            onNextEpisode()
          }} 
          onCancel={() => setShowUpNext(false)}
        />
      )}

      {/* Top Bar (Back button, episode title) */}
      <div 
        className={`absolute top-0 left-0 w-full p-4 md:p-6 z-40 flex items-start justify-between bg-gradient-to-b from-black/90 to-transparent transition-opacity duration-300 ${(!isEmbed && showControls && !showUpNext) || (isEmbed && showControls) ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="flex items-center gap-4">
          <Link href={`/content/${animeId}`}>
            <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full h-10 w-10 md:h-12 md:w-12 p-0">
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
            </Button>
          </Link>
          <div>
            <h1 className="text-white font-bold text-base md:text-xl drop-shadow-md">{title}</h1>
            <p className="text-platinum text-xs md:text-sm drop-shadow">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      {!isEmbed && (
        <div 
          className={`absolute bottom-0 left-0 w-full z-40 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-all duration-300 ${showControls && !showUpNext ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
          onClick={e => e.stopPropagation()} // Prevent toggling play on control click
        >
          <PlayerControls 
            player={player} 
            containerRef={containerRef}
            isTheaterMode={isTheaterMode}
            toggleTheaterMode={toggleTheaterMode}
            onNextEpisode={onNextEpisode}
          />
        </div>
      )}
    </div>
  )
}
