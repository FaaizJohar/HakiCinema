"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

import Link from "next/link"

interface ContentRowProps {
  title: string
  href?: string
  children: React.ReactNode
  className?: string
  itemWidthClass?: string
}

export function ContentRow({ title, href, children, className, itemWidthClass = "w-[140px] md:w-[180px] lg:w-[220px]" }: ContentRowProps) {
  const rowRef = React.useRef<HTMLDivElement>(null)
  const [showLeft, setShowLeft] = React.useState(false)
  const [showRight, setShowRight] = React.useState(true)

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current
      const scrollAmount = direction === "left" ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75
      rowRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current
      setShowLeft(scrollLeft > 0)
      setShowRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth)
    }
  }

  // Initial check in case items don't overflow
  React.useEffect(() => {
    handleScroll()
    window.addEventListener("resize", handleScroll)
    return () => window.removeEventListener("resize", handleScroll)
  }, [children])

  return (
    <section className={cn("relative flex flex-col py-6 space-y-5", className)}>
      <div className="flex items-end justify-between px-4 lg:px-8">
        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-white flex items-center gap-3">
          {title}
        </h2>
        {href && (
          <Link href={href} className="text-[13px] font-bold uppercase tracking-wider text-text-muted hover:text-white transition-colors flex items-center gap-1 group">
            View All <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>
      <div className="group/row relative">
        {/* Left Arrow */}
        {showLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 z-40 hidden w-16 items-center justify-center bg-gradient-to-r from-background via-background/90 to-transparent opacity-0 transition-opacity duration-300 group-hover/row:opacity-100 md:flex hover:from-surface"
          >
            <div className="w-10 h-10 rounded-full bg-surface-elevated/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110 hover:bg-crimson hover:border-crimson">
               <ChevronLeft className="h-6 w-6" />
            </div>
          </button>
        )}

        {/* Scroll Container */}
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex gap-4 md:gap-5 overflow-x-auto px-4 lg:px-8 pb-6 pt-1 hide-scrollbar snap-x snap-mandatory scroll-smooth"
        >
          {React.Children.map(children, (child) => (
            <div className={cn("shrink-0 snap-start", itemWidthClass)}>
              {child}
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {showRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-0 z-40 hidden w-16 items-center justify-center bg-gradient-to-l from-background via-background/90 to-transparent opacity-0 transition-opacity duration-300 group-hover/row:opacity-100 md:flex hover:from-surface"
          >
            <div className="w-10 h-10 rounded-full bg-surface-elevated/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110 hover:bg-crimson hover:border-crimson">
               <ChevronRight className="h-6 w-6" />
            </div>
          </button>
        )}
      </div>
    </section>
  )
}
