"use client"

import React, { useState, useEffect } from "react"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { searchContent } from "@/app/actions/search"
import { AnimeCard } from "@/components/ui/AnimeCard"
import { useSearchParams } from "next/navigation"

export function SearchClient() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || searchParams.get('genre') || ""
  
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  // Custom simple debounce since we don't know if useDebounce exists
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!query.trim()) {
        setResults([])
        setIsLoading(false)
        return
      }
      
      setIsLoading(true)
      const data = await searchContent(query)
      setResults(data)
      setIsLoading(false)
    }, 500)
    
    return () => clearTimeout(handler)
  }, [query])

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="relative mb-12 max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-text-muted" />
        <Input 
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for content, genres, or titles..." 
          className="pl-14 bg-surface-strong border-border-strong text-lg h-16 w-full rounded-2xl shadow-2xl focus:border-crimson focus:ring-1 focus:ring-crimson transition-all"
        />
        {isLoading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-crimson animate-spin" />
        )}
      </div>

      {!query.trim() ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Search className="h-12 w-12 text-text-muted mb-4 opacity-30" />
          <h2 className="text-xl font-bold text-text-secondary mb-2">Search HAKIBOX</h2>
          <p className="text-text-muted text-center max-w-sm">
            Type above to search across our entire database of movies and TV series.
          </p>
        </div>
      ) : results.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-xl font-bold text-white mb-2">No Results Found</h2>
          <p className="text-text-muted max-w-sm">
            We couldn't find any content matching "{query}". Try checking your spelling or using different keywords.
          </p>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-bold text-white mb-6">Search Results ({results.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {results.map((content) => (
              <AnimeCard key={content.id} anime={content} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
