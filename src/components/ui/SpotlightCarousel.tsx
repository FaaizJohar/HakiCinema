"use client"

import * as React from "react"
import Link from "next/link"
import { Play, Info, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./Button"
import { cn } from "@/lib/utils"

export interface SpotlightItem {
  id: string
  title: string
  alternativeTitle?: string | null
  synopsis: string | null
  posterUrl: string | null
  backdropUrl: string | null
  type?: string
  duration?: number
  episodeCount?: number
  status?: string
  rating?: number | null
  genres?: string[]
}

interface SpotlightCarouselProps {
  items: SpotlightItem[]
}

export function SpotlightCarousel({ items }: SpotlightCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isHovered, setIsHovered] = React.useState(false)

  React.useEffect(() => {
    if (items.length <= 1 || isHovered) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, 7000)

    return () => clearInterval(interval)
  }, [items.length, isHovered])

  if (!items || items.length === 0) return null

  const item = items[currentIndex]

  // Formatter for metadata
  const metaParts = []
  if (item.type) metaParts.push(item.type)
  if (item.duration) metaParts.push(`${item.duration}m`)
  const metaString = metaParts.join(" • ")

  return (
    <div 
      className="relative w-full h-[65vh] md:h-[80vh] min-h-[450px] overflow-hidden group bg-background"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image with Crossfade */}
      {items.map((imgItem, idx) => (
        <div 
          key={imgItem.id} 
          className={cn(
            "absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.25,0.8,0.25,1)]",
            idx === currentIndex ? "opacity-100 z-0 scale-100" : "opacity-0 z-[-1] scale-105"
          )}
        >
          <img
            src={imgItem.backdropUrl || imgItem.posterUrl || ""}
            alt={imgItem.title}
            className="w-full h-full object-cover object-top"
          />
          {/* Editorial Gradients: Vignette + Directional Shadows */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent h-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent w-full md:w-[75%]" />
        </div>
      ))}

      {/* Content Container */}
      <div className="relative z-10 container h-full flex flex-col justify-end pb-12 md:pb-24 px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-end gap-6 md:gap-12 w-full">
          
          {/* Metadata & Typography (Editorial Layout) */}
          <div className="flex-1 max-w-2xl space-y-5">
            
            {/* Rank/Badges */}
            <div className="flex items-center gap-3 mb-2">
               <span className="px-2 py-1 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white bg-crimson rounded shadow-[0_0_15px_rgba(217,22,43,0.5)]">
                 Spotlight
               </span>
               <span className="text-crimson font-black text-xl md:text-2xl italic drop-shadow-md">#{currentIndex + 1}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[64px] font-black tracking-tighter text-white drop-shadow-2xl leading-[1.1] line-clamp-2 md:line-clamp-3">
              {item.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm font-semibold text-platinum uppercase tracking-wider">
               <span className="flex items-center gap-2">
                 {metaString && <span>{metaString}</span>}
                 {metaString && item.episodeCount && <span className="opacity-40">•</span>}
                 {item.episodeCount && <span>{item.episodeCount} EPS</span>}
               </span>
               {item.rating && (
                 <>
                   <span className="opacity-40 text-text-muted">•</span>
                   <span className="text-warning flex items-center gap-1.5"><span className="text-sm">★</span>{item.rating.toFixed(1)}</span>
                 </>
               )}
            </div>

            <p className="text-sm md:text-base text-text-secondary line-clamp-3 drop-shadow-md max-w-xl leading-relaxed font-medium">
              {item.synopsis || "No synopsis available for this title."}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link href={`/watch/${item.id}/1`}>
                <Button className="h-12 px-8 font-bold bg-white text-black hover:bg-platinum rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105">
                  <Play className="mr-2 h-5 w-5 fill-current" /> Watch Now
                </Button>
              </Link>
              <Link href={`/anime/${item.id}`}>
                <Button variant="secondary" className="h-12 px-8 font-bold rounded-full bg-surface-elevated/50 backdrop-blur-md border border-white/10 hover:bg-surface-elevated hover:border-white/30 text-white transition-all hover:scale-105">
                  <Info className="mr-2 h-5 w-5" /> Details
                </Button>
              </Link>
              <Button variant="secondary" className="h-12 w-12 p-0 rounded-full bg-surface-elevated/50 backdrop-blur-md border border-white/10 hover:bg-surface-elevated hover:border-white/30 transition-all flex items-center justify-center group hover:scale-105">
                 <Plus className="h-6 w-6 text-platinum group-hover:text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      {items.length > 1 && (
        <>
          <div className="absolute right-4 md:right-8 bottom-12 flex gap-3 z-20">
             <button 
               onClick={() => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)}
               className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-surface-elevated/30 backdrop-blur-md border border-white/10 hover:border-white/30 hover:bg-crimson flex items-center justify-center text-white transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(217,22,43,0.5)]"
             >
               <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
             </button>
             <button 
               onClick={() => setCurrentIndex((prev) => (prev + 1) % items.length)}
               className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-surface-elevated/30 backdrop-blur-md border border-white/10 hover:border-white/30 hover:bg-crimson flex items-center justify-center text-white transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(217,22,43,0.5)]"
             >
               <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
             </button>
          </div>
          
          {/* Progress Indicators */}
          <div className="absolute bottom-6 left-0 w-full flex justify-center md:justify-start md:pl-8 gap-2 z-20">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]",
                  idx === currentIndex ? "w-10 md:w-12 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" : "w-2 bg-white/20 hover:bg-white/50"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
