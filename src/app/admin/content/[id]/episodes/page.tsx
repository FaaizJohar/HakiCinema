import { adminDb } from "@/server/firebase/admin";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ListVideo, Play } from "lucide-react";
import { CreateEpisodeForm, DeleteEpisodeButton } from "./CreateEpisodeForm";

export default async function ContentEpisodesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let content: any = null;
  let episodes: any[] = [];
  
  try {
    const docRef = adminDb.collection("content").doc(id);
    const docSnap = await docRef.get();
    
    if (docSnap.exists) {
      content = { id: docSnap.id, ...docSnap.data() };
      
      const epsSnap = await docRef.collection("episodes").orderBy("number", "desc").get();
      epsSnap.forEach(epDoc => {
        episodes.push({ id: epDoc.id, ...epDoc.data() });
      });
    }
  } catch (error) {
    console.error("Failed to fetch content episodes", error);
  }

  if (!content) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/episodes" className="p-2 bg-surface-elevated hover:bg-surface-strong border border-border rounded-lg text-platinum transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ListVideo className="w-6 h-6 text-crimson" /> {content.title}
          </h1>
          <p className="text-text-muted mt-1 text-sm">Manage episodes for this content.</p>
        </div>
      </div>

      <CreateEpisodeForm contentId={id} />

      <div className="mt-8">
        <h3 className="text-lg font-bold text-white mb-4">Existing Episodes ({episodes.length})</h3>
        
        <div className="bg-surface-elevated border border-border rounded-xl overflow-hidden">
          {episodes.length === 0 ? (
            <div className="p-12 text-center text-text-muted border-dashed">
              No episodes have been added yet. Use the form above to add one!
            </div>
          ) : (
            <div className="divide-y divide-border">
              {episodes.map(ep => (
                <div key={ep.id} className="p-4 flex items-center gap-4 hover:bg-surface-strong/50 transition-colors">
                  <div className="w-24 h-16 shrink-0 bg-surface-strong rounded overflow-hidden shadow-inner relative">
                    {ep.thumbnailUrl ? (
                      <img src={ep.thumbnailUrl} alt={ep.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted/50">
                        <Play className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-crimson/20 text-crimson text-[10px] font-black uppercase rounded">EP {ep.number}</span>
                      <h4 className="font-bold text-white text-sm truncate">{ep.title}</h4>
                    </div>
                    {ep.videoUrl && (
                      <p className="text-xs text-text-muted truncate mt-1" title={ep.videoUrl}>
                        {ep.videoUrl}
                      </p>
                    )}
                  </div>
                  
                  <div className="shrink-0 flex items-center gap-2">
                    <DeleteEpisodeButton contentId={id} episodeId={ep.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
