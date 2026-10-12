import * as React from "react"
import Link from "next/link"
import { Play, Plus, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "./Badge"

export interface AnimeCardProps {
  anime: {
    id: string
    title: string
    posterUrl: string | null
    status?: string
    type?: string
    rating?: number | null
    episodeCount?: number
    duration?: number
  }
  variant?: "vertical" | "horizontal" | "ranked"
  rank?: number
  className?: string
}

export function AnimeCard({ anime, variant = "vertical", rank, className }: AnimeCardProps) {
  
  const metaParts = []
  if (anime.type) metaParts.push(anime.type)
  if (anime.duration) metaParts.push(`${anime.duration}m`)
  if (anime.episodeCount) metaParts.push(`${anime.episodeCount} EPS`)
  const fullMeta = metaParts.join(" • ")

  if (variant === "horizontal") {
    return (
      <Link href={`/content/${anime.id}`} className={cn("group flex gap-4 premium-card-hover rounded-xl overflow-hidden bg-surface-elevated/50 hover:bg-surface-elevated p-2 transition-all duration-300", className)}>
        <div className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-lg bg-surface-strong shadow-md group-hover:shadow-lg transition-shadow">
          {anime.posterUrl ? (
            <img src={anime.posterUrl} alt={anime.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-text-muted text-xs">No Image</div>
          )}
        </div>
        <div className="flex flex-col py-1.5 justify-center min-w-0 pr-2">
          <h3 className="line-clamp-2 text-sm md:text-base font-bold text-platinum group-hover:text-white transition-colors">{anime.title}</h3>
          
          <div className="mt-1.5 text-[11px] md:text-xs text-text-muted font-medium truncate tracking-wide">
             {fullMeta}
          </div>

          <div className="mt-auto flex flex-wrap gap-2 pt-3">
            {anime.rating && <Badge variant="warning" className="bg-warning/10 text-warning border-warning/20">{anime.rating.toFixed(1)}</Badge>}
            {anime.status && <Badge variant="secondary" className="bg-surface-strong border-border/50">{anime.status}</Badge>}
          </div>
        </div>
      </Link>
    )
  }

  if (variant === "ranked" && rank !== undefined) {
    return (
      <Link href={`/content/${anime.id}`} className={cn("group flex items-center relative overflow-hidden py-3 px-1 hover:bg-surface-elevated/30 rounded-xl transition-colors duration-300", className)}>
        {/* Massive Editorial Rank Number */}
        <div className={cn(
          "text-6xl md:text-7xl lg:text-[80px] font-black italic tracking-tighter leading-none shrink-0 w-16 md:w-20 lg:w-24 text-right pr-2 z-0 transition-colors duration-300",
          rank <= 3 ? "text-transparent bg-clip-text bg-gradient-to-br from-crimson to-crimson-dark drop-shadow-sm" : "text-border-strong group-hover:text-border"
        )}>
          {rank}
        </div>
        
        {/* Poster overlapping the number slightly */}
        <div className="relative aspect-[3/4] w-14 md:w-16 lg:w-20 shrink-0 overflow-hidden rounded-lg bg-surface-elevated shadow-[0_4px_20px_rgba(0,0,0,0.5)] group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.8)] group-hover:-translate-y-1 transition-all duration-300 z-10 -ml-2 md:-ml-4">
          {anime.posterUrl ? (
            <img src={anime.posterUrl} alt={anime.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] text-text-muted">No Img</div>
          )}
        </div>
        
        {/* Metadata */}
        <div className="flex flex-col pl-4 min-w-0 z-10">
          <h3 className="line-clamp-2 text-sm md:text-base font-bold text-platinum group-hover:text-white transition-colors leading-tight mb-1.5">{anime.title}</h3>
          
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] md:text-[11px] text-text-muted font-semibold uppercase tracking-wider">
             {anime.type && <span className="bg-surface-strong border border-border/50 px-1.5 py-0.5 rounded text-platinum">{anime.type}</span>}
             {anime.episodeCount && <span>{anime.episodeCount} EP</span>}
             {anime.status && anime.status.toLowerCase() === 'ongoing' && (
                <>
                  <span className="opacity-50">•</span>
                  <span className="text-crimson flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse" /> Airing
                  </span>
                </>
             )}
          </div>
        </div>
      </Link>
    )
  }

  // Default Vertical Card
  return (
    <Link href={`/content/${anime.id}`} className={cn("group relative flex flex-col", className)}>
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-surface-elevated shadow-lg transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] group-hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.7)] group-hover:-translate-y-1.5 group-hover:border-border">
        {anime.posterUrl ? (
          <img src={anime.posterUrl} alt={anime.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-muted">No Image</div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {anime.rating && <Badge variant="warning" className="bg-black/60 backdrop-blur-md border-transparent text-warning text-[10px] px-1.5 py-0">{anime.rating.toFixed(1)}</Badge>}
        </div>

        {/* Refined Cinematic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-3 md:p-4">
          <div className="transform translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 flex gap-2">
             <button className="flex-1 flex items-center justify-center gap-1.5 bg-crimson hover:bg-crimson-hover text-white text-[11px] font-bold py-2 rounded-lg transition-colors">
                <Play className="h-3 w-3 fill-current" /> Play
             </button>
             <button className="flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2 rounded-lg transition-colors" title="Add to Watchlist">
                <Plus className="h-3 w-3" />
             </button>
          </div>
        </div>
      </div>
      
      <div className="mt-3 flex flex-col px-1">
        <h3 className="line-clamp-2 text-sm font-bold text-platinum group-hover:text-white transition-colors leading-snug">{anime.title}</h3>
        
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-text-muted font-medium tracking-wide">
           {anime.type && <span className="text-platinum">{anime.type}</span>}
           {anime.type && anime.episodeCount && <span className="opacity-50">•</span>}
           {anime.episodeCount && <span>{anime.episodeCount} EPS</span>}
           {anime.duration && <span className="opacity-50">•</span>}
           {anime.duration && <span>{anime.duration}m</span>}
        </div>
      </div>
    </Link>
  )
}
