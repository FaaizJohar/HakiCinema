import { adminDb } from "@/server/firebase/admin"
import { redirect } from "next/navigation"

export const revalidate = 0 // Never cache this page

export default async function RandomPage() {
  try {
    const snapshot = await adminDb.collection("content")
      .limit(100)
      .get();
      
    if (!snapshot.empty) {
      const docs = snapshot.docs.filter(doc => doc.data().publishState === "PUBLISHED");
      if (docs.length > 0) {
        const randomDoc = docs[Math.floor(Math.random() * docs.length)];
        redirect(`/content/${randomDoc.id}`);
      }
    }
  } catch (error) {
    console.error("Failed to fetch random content", error);
  }
  
  // Fallback if no content found
  redirect("/explore");
}
