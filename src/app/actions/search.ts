"use server"

import { adminDb } from "@/server/firebase/admin"

export async function searchContent(query: string) {
  if (!query || query.trim().length === 0) return [];
  
  try {
    const q = query.trim().toLowerCase();
    
    // For simple search without a full-text engine, we can fetch recently published 
    // content and filter by title/alternativeTitle.
    // For production with thousands of items, use Algolia/Typesense.
    const snapshot = await adminDb.collection("content")
      .where("published", "==", true)
      .limit(200)
      .get();
      
    const results: any[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      const titleMatch = data.title?.toLowerCase().includes(q);
      const altMatch = data.alternativeTitle?.toLowerCase().includes(q);
      const tagsMatch = data.tags?.some((t: string) => t.toLowerCase().includes(q));
      
      if (titleMatch || altMatch || tagsMatch) {
        results.push({ 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
        });
      }
    });
    
    return results;
  } catch (error) {
    console.error("Search failed", error);
    return [];
  }
}
