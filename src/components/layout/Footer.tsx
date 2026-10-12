"use client"

import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full h-full relative overflow-hidden bg-[#020202] pt-10 pb-12 flex flex-col items-center justify-center border-t border-border">
      
      {/* Huge Background Typography Animation */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full flex pointer-events-none opacity-[0.03] select-none overflow-hidden">
        <div className="flex w-[200%] animate-marquee">
          <h1 className="text-[12vw] font-black tracking-tighter text-white whitespace-nowrap shrink-0 w-1/2 text-center uppercase">
            HAKI BOX — PREMIUM ANIME — 
          </h1>
          <h1 className="text-[12vw] font-black tracking-tighter text-white whitespace-nowrap shrink-0 w-1/2 text-center uppercase">
            HAKI BOX — PREMIUM ANIME — 
          </h1>
        </div>
      </div>

      <div className="container relative z-10 px-4 md:px-8 flex flex-col items-center justify-center gap-10 text-center">
        
        {/* Animated Logo */}
        <Link href="/" className="group relative">
          <div className="absolute -inset-4 bg-crimson/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <img 
            src="https://files.catbox.moe/cfqnon.png" 
            alt="HAKIBOX" 
            className="h-10 md:h-14 object-contain relative z-10 drop-shadow-2xl transition-transform duration-500 group-hover:scale-110" 
          />
        </Link>
        
        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-sm font-semibold tracking-wide text-text-muted">
          <Link href="/explore" className="hover:text-white hover:-translate-y-0.5 transition-all">Explore</Link>
          <Link href="/genres" className="hover:text-white hover:-translate-y-0.5 transition-all">Genres</Link>
          <Link href="/schedule" className="hover:text-white hover:-translate-y-0.5 transition-all">Schedule</Link>
          <Link href="/search" className="hover:text-white hover:-translate-y-0.5 transition-all">Search</Link>
          <Link href="/my-list" className="hover:text-white hover:-translate-y-0.5 transition-all">My List</Link>
        </div>

        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Signature & Copyright */}
        <div className="flex flex-col gap-4 text-xs md:text-sm text-text-muted font-medium">
          <p className="flex items-center justify-center flex-wrap gap-1.5">
            Made With <span className="animate-pulse text-crimson text-base">❤️</span> by{" "}
            <a href="https://www.cavrixcore.com/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-crimson transition-colors font-bold">
              Cavrix Core
            </a>
          </p>
          <p className="opacity-70">
            & A Cavrix Core Product
          </p>
          <p className="opacity-50 mt-2 text-[10px] md:text-xs">
            © {new Date().getFullYear()} HAKIBOX. All rights reserved.
          </p>
        </div>
      </div>
      
      {/* Subtle Bottom Glow */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-crimson/20 to-transparent"></div>
    </footer>
  )
}
