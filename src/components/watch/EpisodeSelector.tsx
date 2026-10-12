import React from "react"
import { Play, CheckCircle2 } from "lucide-react"

interface Episode {
  id: string
  number: number
  title: string
  thumbnail?: string
  isWatched?: boolean
  progress?: number // 0 to 1
}

interface EpisodeSelectorProps {
  episodes: Episode[]
  currentEpisodeId: string
  onSelect: (id: string) => void
}

export function EpisodeSelector({ episodes, currentEpisodeId, onSelect }: EpisodeSelectorProps) {
  return (
    <div className="w-full bg-surface-strong rounded-xl border border-border/50 overflow-hidden flex flex-col h-[400px]">
      <div className="p-4 border-b border-border/50 bg-surface flex items-center justify-between">
        <h3 className="font-bold text-white text-lg">Episodes</h3>
        <span className="text-sm text-text-muted">{episodes.length} Episodes</span>
      </div>
      
      <div className="flex-1 overflow-y-auto premium-scrollbar p-2">
        <div className="flex flex-col gap-1">
          {episodes.map((ep) => {
            const isActive = ep.id === currentEpisodeId
            return (
              <button
                key={ep.id}
                onClick={() => onSelect(ep.id)}
                className={`flex items-center gap-4 p-2 rounded-lg text-left transition-colors group ${
                  isActive ? "bg-crimson/10 border border-crimson/20" : "hover:bg-surface border border-transparent"
                }`}
              >
                {/* Thumbnail */}
                <div className="relative w-24 aspect-video rounded bg-background overflow-hidden flex-shrink-0">
                  {ep.thumbnail ? (
                    <img src={ep.thumbnail} alt={ep.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted text-xs bg-surface">
                      No Image
                    </div>
                  )}
                  
                  {/* Play Overlay */}
                  <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <Play className={`w-6 h-6 ${isActive ? 'text-crimson fill-current' : 'text-white fill-white'}`} />
                  </div>
                  
                  {/* Progress Bar */}
                  {ep.progress !== undefined && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-black/50">
                      <div className="h-full bg-crimson" style={{ width: `${ep.progress * 100}%` }} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold ${isActive ? 'text-crimson' : 'text-text-muted'}`}>
                      EP {ep.number.toString().padStart(2, '0')}
                    </span>
                    {ep.isWatched && <CheckCircle2 className="w-3 h-3 text-success" />}
                  </div>
                  <h4 className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-platinum group-hover:text-white'}`}>
                    {ep.title}
                  </h4>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
