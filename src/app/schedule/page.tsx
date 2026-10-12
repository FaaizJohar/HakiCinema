import { Metadata } from "next"
import { ScheduleClient } from "@/components/schedule/ScheduleClient"
import { adminDb } from "@/server/firebase/admin"

export const metadata: Metadata = {
  title: "Schedule | HAKIBOX",
  description: "Check the release schedule for upcoming content.",
}

export default async function SchedulePage() {
  let contentList: any[] = [];
  
  try {
    const snapshot = await adminDb.collection("content")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();
      
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.publishState === "PUBLISHED") {
        contentList.push({ 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
        });
      }
    });
    
    contentList = contentList.slice(0, 50);
  } catch (error) {
    console.error("Failed to fetch schedule", error);
  }

  return <ScheduleClient contentList={contentList} />;
}
