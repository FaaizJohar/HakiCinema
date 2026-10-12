"use client"

import * as React from "react"
import { Search, History, TrendingUp, SlidersHorizontal, PlayCircle, Star } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/Badge"

interface SearchOverlayProps {
  searchQuery: string
  onClose: () => void
  onOpenFilters: () => void
}

export function SearchOverlay({ searchQuery, onClose, onOpenFilters }: SearchOverlayProps) {
  // Mock data for search
  const recentSearches = ["One Piece", "Solo Leveling", "Jujutsu Kaisen"]
  const trendingSearches = ["Demon Slayer", "Frieren", "Attack on Titan", "Ninja Kamui", "Bleach"]
  
  const mockResults = [
    {
      id: "1",
      title: "One Piece",
      type: "TV",
      duration: "24m",
      episodes: 1100,
      rating: 4.9,
      poster: "https://images.unsplash.com/photo-1613376023733-7740951b63bb?w=200&h=300&fit=crop"
    },
    {
      id: "2",
      title: "Solo Leveling",
      type: "TV",
      duration: "24m",
      episodes: 12,
      rating: 4.8,
      poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&h=300&fit=crop"
    }
  ]

  return (
    <div className="absolute top-[120%] left-0 w-full bg-surface-elevated/95 backdrop-blur-2xl border border-border rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.7)] overflow-hidden z-50 flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
      
      {/* Search Header / Quick Actions */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-black/20">
        <div className="flex items-center gap-2 text-text-muted text-sm font-medium">
          <Search className="h-4 w-4" />
          <span>{searchQuery ? `Searching for "${searchQuery}"` : "Discover"}</span>
        </div>
        <button 
          type="button"
          onMouseDown={(e) => { e.preventDefault(); onOpenFilters(); }}
          className="flex items-center gap-2 text-xs font-semibold text-platinum bg-surface hover:bg-surface-strong px-3 py-1.5 rounded-full border border-border/50 transition-colors"
        >
          <SlidersHorizontal className="h-3 w-3" /> Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row max-h-[60vh] overflow-hidden">
        
        {/* Left Column: Recent & Trending (Hidden on small screens if typing, or shown at top) */}
        {(!searchQuery || window.innerWidth > 768) && (
          <div className="w-full md:w-1/3 p-4 border-b md:border-b-0 md:border-r border-border/50 bg-black/10 overflow-y-auto">
            {!searchQuery && (
              <div className="mb-6">
                <h4 className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
                  <History className="h-3 w-3" /> Recent
                </h4>
                <div className="flex flex-col gap-1">
                  {recentSearches.map(term => (
                    <button key={term} className="text-left text-sm text-platinum hover:text-crimson hover:bg-surface-strong px-2 py-1.5 rounded transition-colors truncate">
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h4 className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
                <TrendingUp className="h-3 w-3 text-warning" /> Trending
              </h4>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map(term => (
                  <Badge key={term} variant="outline" className="hover:bg-surface-strong cursor-pointer border-border/50 text-platinum">
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Right Column: Instant Results */}
        <div className="w-full md:flex-1 p-4 overflow-y-auto premium-scrollbar">
          {searchQuery ? (
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Top Results</h4>
              {mockResults.map(anime => (
                <Link 
                  key={anime.id} 
                  href={`/anime/${anime.id}`}
                  onClick={onClose}
                  className="flex gap-4 p-2 rounded-lg hover:bg-surface-strong transition-colors group"
                >
                  <div className="relative w-12 h-16 md:w-16 md:h-24 shrink-0 rounded bg-surface overflow-hidden shadow-md group-hover:shadow-lg">
                    <img src={anime.poster} alt={anime.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayCircle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <h3 className="font-bold text-sm md:text-base text-white truncate group-hover:text-crimson transition-colors">{anime.title}</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-text-muted font-medium truncate">
                      <span className="text-warning flex items-center"><Star className="h-3 w-3 mr-0.5 fill-current" /> {anime.rating}</span>
                      <span className="opacity-50">•</span>
                      <span>{anime.type}</span>
                      <span className="opacity-50">•</span>
                      <span>{anime.episodes} EPS</span>
                      <span className="opacity-50">•</span>
                      <span>{anime.duration}</span>
                    </div>
                  </div>
                </Link>
              ))}
              
              <Link 
                href={`/search?q=${searchQuery}`}
                onClick={onClose}
                className="mt-4 block w-full py-3 text-center text-sm font-semibold text-white bg-surface hover:bg-surface-strong border border-border/50 rounded-lg transition-colors"
              >
                View all results for "{searchQuery}"
              </Link>
            </div>
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
               <Search className="h-10 w-10 text-text-muted mb-4" />
               <p className="text-sm font-medium text-platinum">Type something to begin your search</p>
               <p className="text-xs text-text-muted mt-1">Press Esc to close</p>
             </div>
          )}
        </div>

      </div>
    </div>
  )
}
