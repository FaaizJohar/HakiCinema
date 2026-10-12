import React, { RefObject } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, SkipForward, PictureInPicture, MonitorPlay } from "lucide-react"
import { Button } from "@/components/ui/Button"

// Simple time formatter (e.g. 13:42)
function formatTime(time: number) {
  if (isNaN(time)) return "00:00"
  const m = Math.floor(time / 60)
  const s = Math.floor(time % 60)
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

interface PlayerControlsProps {
  player: any
  containerRef: RefObject<HTMLElement | null>
  isTheaterMode: boolean
  toggleTheaterMode: () => void
  onNextEpisode?: () => void
}

export function PlayerControls({ player, containerRef, isTheaterMode, toggleTheaterMode, onNextEpisode }: PlayerControlsProps) {
  const { 
    playerState, currentTime, duration, volume, isMuted, isFullscreen, 
    togglePlay, seek, toggleMute, handleVolume, toggleFullscreen, togglePiP 
  } = player

  const isPlaying = playerState === "playing"

  // Handle timeline seek interaction
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    seek(pos * duration)
  }

  // Handle volume bar interaction
  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    handleVolume(pos)
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0
  const volumePercent = isMuted ? 0 : volume * 100

  return (
    <div className="w-full px-4 md:px-6 pb-4 md:pb-6 flex flex-col gap-2">
      
      {/* Progress Bar Area */}
      <div 
        className="w-full h-2 md:h-1.5 bg-white/20 hover:bg-white/30 rounded-full cursor-pointer relative group/progress transition-all py-1 md:py-2 flex items-center"
        onClick={handleTimelineClick}
      >
        <div className="absolute left-0 h-1.5 bg-white/40 rounded-full w-full pointer-events-none" />
        <div 
          className="absolute left-0 h-1.5 bg-crimson rounded-full pointer-events-none transition-all duration-100" 
          style={{ width: `${progressPercent}%` }} 
        />
        <div 
          className="absolute h-3 w-3 md:h-4 md:w-4 bg-white rounded-full shadow border border-border opacity-0 group-hover/progress:opacity-100 transition-opacity transform -translate-x-1/2" 
          style={{ left: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 md:gap-3">
          <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:bg-white/10 rounded-full h-9 w-9 md:h-10 md:w-10">
            {isPlaying ? <Pause className="w-5 h-5 md:w-5 md:h-5 fill-current" /> : <Play className="w-5 h-5 md:w-5 md:h-5 fill-current" />}
          </Button>
          
          {onNextEpisode && (
            <Button variant="ghost" size="icon" onClick={onNextEpisode} className="text-white hover:bg-white/10 rounded-full h-9 w-9 md:h-10 md:w-10 hidden sm:flex">
              <SkipForward className="w-4 h-4 md:w-5 md:h-5 fill-current" />
            </Button>
          )}

          <div className="flex items-center gap-2 ml-1 md:ml-3 group/vol">
            <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/10 rounded-full h-9 w-9 md:h-10 md:w-10">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 md:w-5 md:h-5" /> : <Volume2 className="w-4 h-4 md:w-5 md:h-5" />}
            </Button>
            <div 
              className="w-0 overflow-hidden group-hover/vol:w-16 md:group-hover/vol:w-20 transition-all duration-300 flex items-center h-full cursor-pointer"
              onClick={handleVolumeClick}
            >
              <div className="w-full h-1 bg-white/20 rounded-full relative">
                <div 
                  className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-100" 
                  style={{ width: `${volumePercent}%` }} 
                />
              </div>
            </div>
          </div>
          
          <span className="text-white text-xs md:text-sm font-medium ml-2 md:ml-4 tabular-nums tracking-wide">
            {formatTime(currentTime)} <span className="text-white/40">/</span> {formatTime(duration)}
          </span>
        </div>
        
        <div className="flex items-center gap-1 md:gap-3">
          {/* PiP Button */}
          <Button variant="ghost" size="icon" onClick={togglePiP} className="text-white hover:bg-white/10 rounded-full h-9 w-9 md:h-10 md:w-10 hidden sm:flex">
            <PictureInPicture className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
          
          {/* Settings Button */}
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full h-9 w-9 md:h-10 md:w-10">
            <Settings className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
          
          {/* Theater Mode Toggle (Hidden in fullscreen) */}
          {!isFullscreen && (
            <Button variant="ghost" size="icon" onClick={toggleTheaterMode} className="text-white hover:bg-white/10 rounded-full h-9 w-9 md:h-10 md:w-10 hidden md:flex" title="Theater Mode">
               <MonitorPlay className={`w-4 h-4 md:w-5 md:h-5 ${isTheaterMode ? 'text-crimson' : ''}`} />
            </Button>
          )}

          {/* Fullscreen Button */}
          <Button variant="ghost" size="icon" onClick={() => toggleFullscreen(containerRef)} className="text-white hover:bg-white/10 rounded-full h-9 w-9 md:h-10 md:w-10">
            {isFullscreen ? <Minimize className="w-4 h-4 md:w-5 md:h-5" /> : <Maximize className="w-4 h-4 md:w-5 md:h-5" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
