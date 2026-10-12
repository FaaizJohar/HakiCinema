import { adminDb } from "@/server/firebase/admin";
import { notFound } from "next/navigation";
import { WatchClient } from "@/components/watch/WatchClient";
import { getWatchlistStatus } from "@/app/actions/watchlist";

export default async function WatchPage({ params }: { params: Promise<{ contentId: string, episodeId: string }> }) {
  const { contentId, episodeId } = await params;

  try {
    const isWatchlisted = await getWatchlistStatus(contentId);
    
    // Fetch content metadata
    const contentDoc = await adminDb.collection("content").doc(contentId).get();
    if (!contentDoc.exists) {
      return notFound();
    }
    const data = contentDoc.data() || {};
    const content = { 
      id: contentDoc.id, 
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
    };

    // Fetch episodes list
    const epsSnap = await adminDb.collection("content").doc(contentId).collection("episodes").orderBy("number", "asc").get();
    const episodes: any[] = [];
    epsSnap.forEach(doc => {
      const epData = doc.data();
      episodes.push({ 
        id: doc.id, 
        ...epData,
        createdAt: epData.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: epData.updatedAt?.toDate?.()?.toISOString() || null,
      });
    });

    return <WatchClient content={content} episodes={episodes} initialEpisodeId={episodeId} initialIsWatchlisted={isWatchlisted} />;
  } catch (error) {
    console.error("Failed to fetch watch data", error);
    return notFound();
  }
}
