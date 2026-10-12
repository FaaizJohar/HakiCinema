import { Metadata } from "next"
import { LayoutGrid } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Genres | HAKIBOX",
  description: "Browse content by genre.",
}

const GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Romance", 
  "Sci-Fi", "Mystery", "Horror", "Thriller", "Sports", "Isekai", 
  "Slice of Life", "Shounen", "Shoujo", "Seinen", "Josei", 
  "Supernatural", "Psychological", "Historical", "Music", "Mecha",
  "Demons", "Magic", "Martial Arts", "Vampire", "Space", "School"
]

export default function GenresPage() {
  return (
    <div className="min-h-screen pt-20 pb-20 container px-4 lg:px-8 bg-background">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
          <LayoutGrid className="h-6 w-6 md:h-8 md:w-8 text-crimson" />
          Browse by Genre
        </h1>
        <p className="text-text-muted mt-2 text-sm md:text-base">Find exactly what you're looking for from our vast collection.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4">
        {GENRES.map((genre) => (
          <Link 
            href={`/search?genre=${genre}`} 
            key={genre}
            className="group relative overflow-hidden rounded-lg aspect-[4/3] bg-surface flex items-center justify-center p-4 border border-border transition-all duration-300 hover:border-crimson hover:shadow-[0_0_15px_rgba(217,22,43,0.2)] hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-surface-elevated to-surface group-hover:from-surface-strong group-hover:to-surface-elevated transition-colors duration-500" />
            <span className="relative z-10 font-bold text-sm md:text-base text-text-primary group-hover:text-white transition-colors">{genre}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
