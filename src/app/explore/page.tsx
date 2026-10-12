import { Metadata } from "next"
import { Compass, Filter, Play } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { AnimeCard } from "@/components/ui/AnimeCard"
import { adminDb } from "@/server/firebase/admin"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Explore Premium Anime Catalogue | HAKIBOX",
  description: "Discover new anime content to watch on HAKIBOX. Filter by genre, rating, and status to find your next favorite series in 4K/1080p.",
  keywords: ['explore anime', 'anime catalogue', 'highest rated anime', 'new anime', 'hakibox catalogue'],
  openGraph: {
    title: "Explore Premium Anime Catalogue | HAKIBOX",
    description: "Discover new anime content to watch on HAKIBOX. Filter by genre, rating, and status to find your next favorite series in 4K/1080p.",
    url: '/explore',
    type: 'website',
  }
}

export default async function ExplorePage() {
  let contentList: any[] = []
  
  try {
    const snapshot = await adminDb.collection("content")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();
      
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.publishState === "PUBLISHED") {
        contentList.push({ id: doc.id, ...data });
      }
    });
    
    contentList = contentList.slice(0, 36);
  } catch (error) {
    console.error("Firebase connection failed", error)
  }

  // Real Empty State
  if (contentList.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-background px-4">
        <div className="w-24 h-24 mb-6 rounded-full bg-surface-elevated/50 flex items-center justify-center">
          <Play className="w-10 h-10 text-text-muted" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">No Content Found</h1>
        <p className="text-text-secondary text-center max-w-md mb-8">
          There is currently no published content in the catalog. Please check back later.
        </p>
        <Link href="/">
          <Button variant="secondary" className="font-bold rounded-full">Return Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-20 container px-4 lg:px-8 bg-background">
      {/* Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
            <Compass className="h-6 w-6 md:h-8 md:w-8 text-crimson" />
            Explore Catalogue
          </h1>
          <p className="text-text-muted mt-2 text-sm md:text-base">Find your next favorite series from our vast collection.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="secondary" className="h-9 px-4 shrink-0 bg-surface hover:bg-surface-strong border-border text-sm">
            <Filter className="h-4 w-4 mr-2" /> Filters
          </Button>
          <div className="relative flex-1 md:w-64">
             <select className="h-9 w-full bg-surface border border-border rounded-md px-3 text-sm text-platinum focus:outline-none focus:border-crimson appearance-none cursor-pointer">
                <option>Recently Added</option>
                <option>Highest Rated</option>
                <option>Most Popular</option>
                <option>A-Z</option>
             </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 md:gap-4">
        {contentList.map((content) => (
          <AnimeCard key={content.id} anime={content} />
        ))}
      </div>
      
      {/* Pagination */}
      {contentList.length === 36 && (
        <div className="mt-12 flex justify-center">
           <Button variant="secondary" className="px-8 border-border">Load More</Button>
        </div>
      )}
    </div>
  )
}
