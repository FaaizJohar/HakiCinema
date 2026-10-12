"use client"

import * as React from "react"
import { X, SlidersHorizontal, Check } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const genres = ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Sports", "Isekai"]
  const types = ["TV", "Movie", "OVA", "ONA", "Special"]
  const statuses = ["Airing", "Completed", "Upcoming"]
  const years = ["2024", "2023", "2022", "2021", "2020", "Older"]
  const seasons = ["Spring", "Summer", "Fall", "Winter"]

  const [activeFilters, setActiveFilters] = React.useState<Record<string, string[]>>({
    genre: [],
    type: [],
    status: [],
    year: [],
    season: []
  })

  const toggleFilter = (category: string, value: string) => {
    setActiveFilters(prev => {
      const current = prev[category] || []
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(v => v !== value) }
      }
      return { ...prev, [category]: [...current, value] }
    })
  }

  const renderSection = (title: string, category: string, options: string[]) => (
    <div className="mb-8">
      <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const isActive = activeFilters[category]?.includes(opt)
          return (
            <button
              key={opt}
              onClick={() => toggleFilter(category, opt)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                isActive 
                  ? "bg-crimson border-crimson text-white shadow-[0_0_10px_rgba(217,22,43,0.3)]" 
                  : "bg-surface border-border/50 text-text-muted hover:bg-surface-strong hover:text-platinum"
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-surface-elevated border-l border-border shadow-2xl z-[120] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50 bg-black/20">
          <div className="flex items-center gap-3 text-white">
            <SlidersHorizontal className="h-5 w-5 text-crimson" />
            <h2 className="text-lg font-black tracking-tight">Advanced Filter</h2>
          </div>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-white bg-surface hover:bg-surface-strong rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto premium-scrollbar p-6">
          {renderSection("Genres", "genre", genres)}
          {renderSection("Type", "type", types)}
          {renderSection("Status", "status", statuses)}
          
          <div className="grid grid-cols-2 gap-4">
             {renderSection("Season", "season", seasons)}
             {renderSection("Year", "year", years)}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border/50 bg-black/20 flex gap-4">
          <Button 
            variant="ghost" 
            className="flex-1 text-text-muted hover:text-white"
            onClick={() => setActiveFilters({ genre: [], type: [], status: [], year: [], season: [] })}
          >
            Clear All
          </Button>
          <Button className="flex-[2] bg-crimson hover:bg-crimson-hover text-white shadow-[0_0_15px_rgba(217,22,43,0.3)]">
            Apply Filters
          </Button>
        </div>
      </div>
    </>
  )
}
