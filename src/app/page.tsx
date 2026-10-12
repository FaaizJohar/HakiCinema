import { adminDb } from "@/server/firebase/admin"
import { AnimeCard } from "@/components/ui/AnimeCard"
import { ContentRow } from "@/components/ui/ContentRow"
import { SpotlightCarousel } from "@/components/ui/SpotlightCarousel"
import { Button } from "@/components/ui/Button"
import { Compass, Play } from "lucide-react"
import Link from "next/link"

export default async function HomePage() {
  let contentList: any[] = []
  
  try {
    const snapshot = await adminDb.collection("content")
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();
      
    snapshot.forEach(doc => {
      const data = doc.data();
      contentList.push({ 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
      })
    });
  } catch (error) {
    console.error("Firebase connection failed.", error)
  }

  if (contentList.length === 0) {
    return (
      <div className="flex flex-col min-h-[80vh] items-center justify-center bg-background px-4">
        <div className="w-24 h-24 mb-6 rounded-full bg-surface-elevated/50 flex items-center justify-center">
          <Play className="w-10 h-10 text-text-muted" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">HAKIBOX is currently empty</h1>
        <p className="text-text-secondary text-center max-w-md mb-8">
          The catalog is currently being prepared. Please check back later when real content has been published.
        </p>
        <Link href="/admin">
          <Button className="font-bold rounded-full">Go to Admin Dashboard</Button>
        </Link>
      </div>
    )
  }
  
  const carouselItems = contentList.slice(0, 5)
  const trendingItems = [...contentList].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10)
  const topAiringItems = contentList.filter(a => a.status === 'Ongoing' || a.status === 'ONGOING').slice(0, 10)
  const popularItems = [...contentList].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 20)
  const latestEpisodes = contentList.slice(0, 15) // Simplified for now since we sort by createdAt desc
  const upcomingItems = contentList.filter(a => a.status === 'Upcoming' || a.status === 'UPCOMING').slice(0, 10)
  const top10Items = trendingItems.slice(0, 10)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "HAKIBOX",
    "url": "http://localhost:3000",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "http://localhost:3000/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-8 pt-14 md:pt-[72px] bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* 1. SPOTLIGHT CAROUSEL */}
      {carouselItems.length > 0 && <SpotlightCarousel items={carouselItems} />}

      <div className="flex flex-col gap-6 md:gap-8 -mt-6 md:-mt-10 relative z-20">
        
        {/* 2. TRENDING */}
        {trendingItems.length > 0 && (
          <ContentRow title="Trending" href="/explore?sort=trending" itemWidthClass="w-[180px] md:w-[220px]">
            {trendingItems.map((anime, idx) => (
              <AnimeCard key={anime.id} anime={anime} variant="ranked" rank={idx + 1} />
            ))}
          </ContentRow>
        )}

        {/* 3. TOP AIRING */}
        {topAiringItems.length > 0 && (
          <ContentRow title="Top Airing" href="/explore?status=airing">
            {topAiringItems.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </ContentRow>
        )}

        {/* 4. LATEST EPISODES */}
        {latestEpisodes.length > 0 && (
          <ContentRow title="Latest Episodes" href="/explore?sort=latest">
            {latestEpisodes.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </ContentRow>
        )}

        {/* 5. NEW ON HAKIBOX */}
        {contentList.length > 0 && (
          <ContentRow title="New on HAKIBOX" href="/explore?sort=new">
            {contentList.slice(0, 10).map((anime: any) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </ContentRow>
        )}

        {/* 6. MOST POPULAR (Desktop specific dense layout) */}
        {popularItems.length > 0 && (
          <div className="container px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 py-4">
            <div>
              <div className="flex items-end justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">Most Popular</h2>
                <Link href="/explore?sort=popular" className="text-sm font-semibold text-text-muted hover:text-crimson transition-colors">View More</Link>
              </div>
              <div className="flex flex-col gap-3">
                {popularItems.slice(0, 5).map(anime => (
                  <AnimeCard key={anime.id} anime={anime} variant="horizontal" />
                ))}
              </div>
            </div>
            
            {popularItems.length > 5 && (
              <div>
                <div className="flex items-end justify-between mb-4">
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">Most Favorite</h2>
                  <Link href="/explore?sort=favorite" className="text-sm font-semibold text-text-muted hover:text-crimson transition-colors">View More</Link>
                </div>
                <div className="flex flex-col gap-3">
                  {popularItems.slice(5, 10).map(anime => (
                    <AnimeCard key={anime.id} anime={anime} variant="horizontal" />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 7. UPCOMING */}
        {upcomingItems.length > 0 && (
          <ContentRow title="Upcoming" href="/explore?status=upcoming">
            {upcomingItems.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </ContentRow>
        )}

        {/* 9. GENRES PREVIEW */}
        <section className="py-6 container px-4 lg:px-8">
           <div className="flex items-end justify-between mb-4">
             <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">Genres</h2>
           </div>
           <div className="flex flex-wrap gap-3">
             {["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller", "Isekai"].map(genre => (
               <Link 
                 key={genre} 
                 href={`/search?genre=${genre.toLowerCase()}`}
                 className="px-4 py-2 bg-surface hover:bg-surface-strong border border-border rounded-lg text-sm font-semibold text-platinum hover:text-white transition-all hover:-translate-y-0.5 shadow-sm"
               >
                 {genre}
               </Link>
             ))}
           </div>
        </section>

        {/* BOTTOM CATALOG CTA */}
        <div className="container px-4 lg:px-8 py-12 flex justify-center">
          <Link href="/search">
             <Button variant="secondary" size="lg" className="px-12 h-14 rounded-full font-bold bg-surface-elevated border-border-strong hover:bg-surface-strong hover:text-white transition-all">
                <Compass className="mr-2 h-5 w-5" /> Browse Full Catalog
             </Button>
          </Link>
        </div>

      </div>
    </div>
  )
}
