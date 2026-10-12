import { Metadata } from "next"
import { Bookmark, Play } from "lucide-react"
import { cookies } from "next/headers"
import { adminDb, adminAuth } from "@/server/firebase/admin"
import { AnimeCard } from "@/components/ui/AnimeCard"
import Link from "next/link"
import { Button } from "@/components/ui/Button"

export const metadata: Metadata = {
  title: "My List | HAKIBOX",
  description: "Your saved content collection.",
}

export default async function MyListPage() {
  let uid = null;
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  
  if (session) {
    try {
      const decodedClaims = await adminAuth.verifySessionCookie(session, true);
      uid = decodedClaims.uid;
    } catch (e) {}
  }

  let watchlistedContent: any[] = [];

  if (uid) {
    try {
      const watchlistSnap = await adminDb.collection("users").doc(uid).collection("watchlist")
        .orderBy("addedAt", "desc")
        .get();
        
      if (!watchlistSnap.empty) {
        const contentIds = watchlistSnap.docs.map(doc => doc.id);
        
        // Fetch content data for these IDs
        // Note: Firestore 'in' query has a limit of 30, so for a real production app we'd chunk it.
        if (contentIds.length > 0) {
          const chunks = [];
          for (let i = 0; i < contentIds.length; i += 30) {
            chunks.push(contentIds.slice(i, i + 30));
          }
          
          for (const chunk of chunks) {
            const contentSnap = await adminDb.collection("content").where("__name__", "in", chunk).get();
            contentSnap.forEach(doc => {
              watchlistedContent.push({ id: doc.id, ...doc.data() });
            });
          }
          
          // Re-sort based on watchlist addedAt order
          watchlistedContent.sort((a, b) => contentIds.indexOf(a.id) - contentIds.indexOf(b.id));
        }
      }
    } catch (error) {
      console.error("Failed to fetch watchlist", error);
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-20 container px-4 md:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Bookmark className="h-8 w-8 text-crimson" />
          My List
        </h1>
        <p className="text-text-secondary mt-1 text-sm">Your personal collection of saved content.</p>
      </div>

      {!uid ? (
        <div className="flex flex-col items-center justify-center py-20 bg-surface/50 rounded-xl border border-border border-dashed">
          <Bookmark className="h-12 w-12 text-text-muted mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-white mb-2">Sign in to see your list</h2>
          <p className="text-text-secondary max-w-md text-center mb-6">
            Log in to save shows and movies to keep track of what you want to watch.
          </p>
        </div>
      ) : watchlistedContent.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-surface/50 rounded-xl border border-border border-dashed">
          <Bookmark className="h-12 w-12 text-text-muted mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-white mb-2">Your list is empty</h2>
          <p className="text-text-secondary max-w-md text-center mb-6">
            Save shows and movies to keep track of what you want to watch.
          </p>
          <Link href="/explore">
            <Button className="font-bold">Explore Content</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 md:gap-4">
          {watchlistedContent.map((content) => (
            <AnimeCard key={content.id} anime={content} />
          ))}
        </div>
      )}
    </div>
  )
}
