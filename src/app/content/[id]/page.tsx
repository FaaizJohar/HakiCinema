import { adminDb } from "@/server/firebase/admin"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Play, Share2, Star, ChevronDown, Compass } from "lucide-react"
import Link from "next/link"
import { WatchlistButton } from "@/components/ui/WatchlistButton"
import { getWatchlistStatus } from "@/app/actions/watchlist"

export default async function ContentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let content: any = null;
  let episodes: any[] = [];
  let isWatchlisted = false;
  
  try {
    isWatchlisted = await getWatchlistStatus(id);
    const docRef = adminDb.collection("content").doc(id);
    const docSnap = await docRef.get();
    
    if (docSnap.exists) {
      content = { id: docSnap.id, ...docSnap.data() };
      
      const epsSnap = await docRef.collection("episodes").orderBy("number", "asc").get();
      epsSnap.forEach(epDoc => {
        episodes.push({ id: epDoc.id, ...epDoc.data() });
      });
      
      content.episodes = episodes;
    }
  } catch (error) {
    console.error("Firebase connection failed", error)
  }

  if (!content) {
    return (
      <div className="flex flex-col min-h-[80vh] items-center justify-center bg-background px-4">
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">Content Not Found</h1>
        <p className="text-text-secondary text-center max-w-md mb-8">
          The content you are looking for does not exist or has been removed.
        </p>
        <Link href="/">
          <Button className="font-bold rounded-full">
            <Compass className="mr-2 h-5 w-5" /> Return to Home
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Cinematic Hero Section */}
      <div className="relative w-full h-[65vh] md:h-[80vh] min-h-[500px]">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src={content.backdropUrl || content.posterUrl || ""} 
            alt={content.title} 
            className="w-full h-full object-cover object-top opacity-80"
          />
          {/* Advanced Editorial Gradients */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent h-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent w-full md:w-[75%]" />
        </div>

        <div className="relative z-10 container h-full flex flex-col justify-end px-4 md:px-8 pb-16">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-end w-full">
            
            {/* Poster (Desktop) */}
            <div className="hidden md:block w-56 shrink-0 overflow-hidden rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-white/10 bg-surface-elevated transform -translate-y-4">
              {content.posterUrl ? (
                <img src={content.posterUrl} alt={content.title} className="w-full h-auto object-cover" />
              ) : (
                <div className="w-full aspect-[2/3] flex items-center justify-center text-text-muted text-sm font-medium">No Poster</div>
              )}
            </div>

            {/* Metadata & Typography */}
            <div className="flex-1 space-y-5 max-w-3xl pb-2">
              
              <div className="flex items-center gap-3">
                 <span className="px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white bg-crimson rounded shadow-[0_0_15px_rgba(217,22,43,0.5)]">
                   {content.type || 'TV'}
                 </span>
                 <Badge variant="outline" className="border-white/20 text-platinum uppercase tracking-wider text-[10px]">
                   {content.status || 'Ongoing'}
                 </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter drop-shadow-2xl leading-[1.1]">
                {content.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm font-semibold text-platinum uppercase tracking-wider">
                {content.rating && (
                  <span className="flex items-center gap-1.5 text-warning drop-shadow-md">
                    <Star className="w-4 h-4 fill-current" /> {content.rating?.toFixed(1)}
                  </span>
                )}
                {content.rating && <span className="opacity-40 text-text-muted">•</span>}
                {content.releaseYear && <span>{content.releaseYear}</span>}
                {content.releaseYear && <span className="opacity-40 text-text-muted">•</span>}
                {content.type === "MOVIE" ? (
                  <span>{content.runtime ? `${content.runtime}m` : 'Movie'}</span>
                ) : (
                  <span>{content.episodes?.length || 0} Episodes</span>
                )}
              </div>

              <p className="text-sm md:text-base text-text-secondary max-w-2xl leading-relaxed font-medium drop-shadow-md">
                {content.synopsis || content.description || "No synopsis available for this title."}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-4">
                {content.type === "MOVIE" ? (
                  <Link href={`/watch/${content.id}/movie`}>
                    <Button className="h-12 px-8 font-bold bg-white text-black hover:bg-platinum rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105">
                      <Play className="mr-2 h-5 w-5 fill-current" /> Watch Movie
                    </Button>
                  </Link>
                ) : content.episodes?.length > 0 ? (
                  <Link href={`/watch/${content.id}/${content.episodes[0]?.id || '1'}`}>
                    <Button className="h-12 px-8 font-bold bg-white text-black hover:bg-platinum rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105">
                      <Play className="mr-2 h-5 w-5 fill-current" /> Play Episode 1
                    </Button>
                  </Link>
                ) : (
                  <Button disabled className="h-12 px-8 font-bold bg-surface-strong text-text-muted rounded-full cursor-not-allowed">
                    <Play className="mr-2 h-5 w-5 opacity-50" /> No Episodes Yet
                  </Button>
                )}
                <WatchlistButton 
                  contentId={content.id} 
                  initialIsWatchlisted={isWatchlisted}
                  className="h-12 w-12 p-0 rounded-full bg-surface-elevated/50 backdrop-blur-md border border-white/10 hover:bg-surface-elevated hover:border-white/30 transition-all flex items-center justify-center group hover:scale-105"
                  variant="secondary"
                />
                <Button variant="secondary" className="h-12 w-12 p-0 rounded-full bg-surface-elevated/50 backdrop-blur-md border border-white/10 hover:bg-surface-elevated hover:border-white/30 transition-all flex items-center justify-center group hover:scale-105" title="Share">
                  <Share2 className="h-5 w-5 text-platinum group-hover:text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container px-4 md:px-8 py-12 relative z-20">
        
        {/* Episodes Section (Hide if MOVIE) */}
        {content.type !== "MOVIE" && (
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Episodes</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text-secondary">{content.episodes?.length || 0} Available</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {content.episodes?.map((ep: any) => (
              <Link 
                key={ep.id} 
                href={`/watch/${content.id}/${ep.id}`}
                className="group flex gap-4 p-2.5 rounded-xl bg-surface-elevated/50 hover:bg-surface-elevated border border-transparent hover:border-border/80 transition-all duration-300 hover:shadow-lg"
              >
                <div className="relative w-36 shrink-0 aspect-video rounded-lg overflow-hidden bg-surface-strong shadow-md">
                  {ep.thumbnailUrl ? (
                    <img src={ep.thumbnailUrl} alt={ep.title || `Episode ${ep.number}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted bg-surface-strong">
                      <Play className="h-6 w-6 opacity-20" />
                    </div>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Play className="h-8 w-8 text-white fill-current transform scale-75 group-hover:scale-100 transition-transform duration-300" />
                  </div>
                  {/* Duration Badge */}
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 backdrop-blur px-1.5 py-0.5 rounded text-[10px] font-bold text-white">
                    {ep.duration ? `${Math.floor(ep.duration / 60)}m` : '24m'}
                  </div>
                </div>
                
                <div className="flex flex-col justify-center overflow-hidden py-1 pr-2">
                  <span className="text-xs font-black text-text-secondary group-hover:text-crimson transition-colors uppercase tracking-wider mb-1">Episode {ep.number}</span>
                  <span className="text-sm font-bold text-platinum group-hover:text-white truncate leading-tight">{ep.title || `Episode ${ep.number}`}</span>
                </div>
              </Link>
            ))}
            
            {(!content.episodes || content.episodes.length === 0) && (
              <div className="col-span-full py-16 text-center bg-surface-elevated/30 rounded-2xl border border-border/50 border-dashed">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-strong mb-4">
                  <Play className="w-8 h-8 text-text-muted" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Episodes Found</h3>
                <p className="text-sm text-text-muted max-w-md mx-auto">
                  Episodes for this content have not been processed yet. Please check back later.
                </p>
              </div>
            )}
          </div>
        </div>
        )}
        
      </div>
    </div>
  )
}
