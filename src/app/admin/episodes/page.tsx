import { adminDb } from "@/server/firebase/admin";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Film, ListVideo } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminEpisodesPage() {
  let animes: any[] = [];

  try {
    const snapshot = await adminDb.collection("anime")
      .orderBy("createdAt", "desc")
      .get();
      
    snapshot.forEach(doc => {
      const data = doc.data();
      animes.push({ 
        id: doc.id, 
        ...data,
      });
    });
  } catch (error) {
    console.error("Failed to fetch anime for episodes page", error);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <ListVideo className="w-8 h-8 text-crimson" /> Manage Episodes
        </h1>
        <p className="text-text-muted mt-2">Select an anime to add, edit, or remove episodes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {animes.map(anime => (
          <div key={anime.id} className="bg-surface-elevated border border-border rounded-xl p-4 flex gap-4 hover:border-border-strong transition-colors">
            {anime.posterUrl ? (
              <img src={anime.posterUrl} alt={anime.title} className="w-16 h-24 object-cover rounded-md bg-surface-strong" />
            ) : (
              <div className="w-16 h-24 rounded-md bg-surface-strong flex items-center justify-center">
                <Film className="w-6 h-6 text-text-muted" />
              </div>
            )}
            
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-white truncate text-sm">{anime.title}</h3>
                <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded ${anime.status === 'Ongoing' ? 'bg-success/20 text-success' : 'bg-surface-strong text-text-secondary'}`}>
                  {anime.status}
                </span>
              </div>
              
              <Link href={`/admin/anime/${anime.id}/episodes`}>
                <Button variant="secondary" className="w-full text-xs h-8">
                  Manage Episodes
                </Button>
              </Link>
            </div>
          </div>
        ))}

        {animes.length === 0 && (
          <div className="col-span-full py-12 text-center text-text-muted bg-surface-strong rounded-xl border border-border border-dashed">
            No anime found. Create an anime first before adding episodes.
          </div>
        )}
      </div>
    </div>
  );
}
