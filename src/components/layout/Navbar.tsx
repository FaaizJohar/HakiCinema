"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Search, User, LogOut, Settings, History, Bookmark, Menu, X, Shuffle, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { SearchOverlay } from "./SearchOverlay"
import { FilterDrawer } from "../ui/FilterDrawer"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isSearchFocused, setIsSearchFocused] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)
  
  const searchContainerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close search overlay if clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close search on escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSearchFocused(false)
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsSearchFocused(false)
    }
  }

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 z-[100] w-full transition-all duration-300 h-14 md:h-[72px] border-b",
          isScrolled ? "bg-surface-elevated/95 backdrop-blur-md shadow-md border-border/50" : "bg-gradient-to-b from-background/95 to-transparent border-transparent"
        )}
      >
        <div className="container h-full flex items-center justify-between px-4 lg:px-8 gap-4">
          
          {/* LEFT: Logo = Home */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="relative">
                 <div className="absolute -inset-2 bg-crimson/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <img src="https://files.catbox.moe/cfqnon.png" alt="HAKIBOX" className="h-6 md:h-8 object-contain relative z-10 drop-shadow-lg transition-transform duration-300 group-hover:scale-105" />
              </div>
              <span className="text-xl font-black tracking-tight text-white hidden sm:block drop-shadow-md">HAKI BOX</span>
            </Link>
          </div>

          {/* MIDDLE: Dominant Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 items-center justify-center max-w-2xl mx-auto px-4 relative" ref={searchContainerRef}>
            <form onSubmit={handleSearch} className="w-full relative group">
              <div className={cn(
                "absolute -inset-1 bg-gradient-to-r from-crimson/0 via-crimson/20 to-crimson/0 rounded-full blur opacity-0 transition-opacity duration-500",
                isSearchFocused && "opacity-100"
              )} />
              <input
                type="text"
                placeholder="Search anime, movies, characters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className={cn(
                  "relative w-full bg-surface-strong border border-border/50 rounded-full h-11 pl-12 pr-4 text-sm text-white focus:outline-none focus:bg-surface-elevated focus:border-border transition-all shadow-inner",
                  isSearchFocused ? "bg-surface-elevated border-text-muted/50 ring-1 ring-text-muted/20" : "hover:border-border-strong hover:bg-surface-elevated"
                )}
              />
              <Search className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors", isSearchFocused ? "text-crimson" : "text-text-muted group-hover:text-platinum")} />
            </form>

            {/* Rich Search Overlay */}
            {isSearchFocused && (
              <SearchOverlay 
                searchQuery={searchQuery} 
                onClose={() => setIsSearchFocused(false)} 
                onOpenFilters={() => {
                  setIsSearchFocused(false)
                  setIsFilterOpen(true)
                }}
              />
            )}
          </div>

          {/* RIGHT: Minimal Utilities */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            
            {/* Mobile Search Icon */}
            <button 
              className="md:hidden flex items-center justify-center h-10 w-10 text-text-muted hover:text-white bg-surface hover:bg-surface-strong rounded-full transition-colors"
              onClick={() => {
                 // In a real app, this would expand a mobile search overlay
                 setIsFilterOpen(true)
              }}
            >
               <Search className="h-5 w-5" />
            </button>

            {/* Random Utility */}
            <Link 
              href="/random" 
              className="hidden md:flex items-center justify-center h-10 w-10 rounded-full bg-surface hover:bg-surface-strong border border-border text-text-muted hover:text-white transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
              title="Random Anime"
            >
               <Shuffle className="h-4 w-4" />
            </Link>

            {/* Watchlist Utility */}
            <Link 
              href="/my-list" 
              className="hidden md:flex items-center justify-center h-10 w-10 rounded-full bg-surface hover:bg-surface-strong border border-border text-text-muted hover:text-crimson transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(217,22,43,0.2)]" 
              title="Watchlist"
            >
               <Bookmark className="h-4 w-4" />
            </Link>

            {/* Profile Menu */}
            <div className="group relative">
              <Link href="/profiles" className="block h-9 w-9 md:h-10 md:w-10 rounded-full bg-surface-strong overflow-hidden border border-border transition-all hover:border-text-secondary hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                <User className="h-full w-full p-2 text-text-muted group-hover:text-white transition-colors" />
              </Link>
              
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border/50 bg-surface-elevated shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 backdrop-blur-xl">
                <div className="p-3 border-b border-border/50">
                  <p className="text-sm font-bold text-white px-1">My Account</p>
                </div>
                <div className="p-2 flex flex-col gap-1">
                  <Link href="/my-list" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-platinum hover:text-white hover:bg-surface-strong rounded-lg transition-colors md:hidden">
                    <Bookmark className="h-4 w-4 text-text-muted" /> Watchlist
                  </Link>
                  <Link href="/history" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-platinum hover:text-white hover:bg-surface-strong rounded-lg transition-colors">
                    <History className="h-4 w-4 text-text-muted" /> Continue Watching
                  </Link>
                  <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-platinum hover:text-white hover:bg-surface-strong rounded-lg transition-colors">
                    <Settings className="h-4 w-4 text-text-muted" /> Settings
                  </Link>
                  <div className="h-px bg-border/50 my-1 mx-2" />
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new Event('open-auth-modal'))
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-platinum hover:text-white hover:bg-surface-strong rounded-lg transition-colors"
                  >
                    <User className="h-4 w-4 text-text-muted" /> Sign In / Register
                  </button>
                  <button className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-error hover:bg-error/10 rounded-lg transition-colors">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <FilterDrawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </>
  )
}
