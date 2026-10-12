import { db } from "@/lib/firebase/client"
import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp, query, orderBy, limit } from "firebase/firestore"

export interface WatchHistoryEntry {
  id: string; // contentId
  episodeId: string;
  progressSeconds: number;
  durationSeconds: number;
  isCompleted: boolean;
  updatedAt: any;
}

export const WatchHistoryService = {
  /**
   * Get the watch history for a specific profile
   */
  async getHistory(uid: string, profileId: string): Promise<WatchHistoryEntry[]> {
    if (!uid || !profileId) return []
    try {
      const historyRef = collection(db, "users", uid, "profiles", profileId, "watchHistory")
      const q = query(historyRef, orderBy("updatedAt", "desc"), limit(20))
      const snapshot = await getDocs(q)
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WatchHistoryEntry[]
    } catch (error) {
      console.error("Failed to fetch watch history:", error)
      return []
    }
  },

  /**
   * Update watch progress for a specific piece of content
   */
  async updateProgress(
    uid: string, 
    profileId: string, 
    contentId: string, 
    episodeId: string, 
    progressSeconds: number, 
    durationSeconds: number
  ): Promise<boolean> {
    if (!uid || !profileId || !contentId) return false
    
    try {
      const historyRef = doc(db, "users", uid, "profiles", profileId, "watchHistory", contentId)
      
      const isCompleted = durationSeconds > 0 && (progressSeconds / durationSeconds) >= 0.9
      
      await setDoc(historyRef, {
        episodeId,
        progressSeconds,
        durationSeconds,
        isCompleted,
        updatedAt: serverTimestamp()
      }, { merge: true })
      
      return true
    } catch (error) {
      console.error("Failed to update watch progress:", error)
      return false
    }
  },
  
  /**
   * Remove an item from watch history
   */
  async removeFromHistory(uid: string, profileId: string, contentId: string): Promise<boolean> {
    if (!uid || !profileId || !contentId) return false
    
    try {
      const historyRef = doc(db, "users", uid, "profiles", profileId, "watchHistory", contentId)
      await deleteDoc(historyRef)
      return true
    } catch (error) {
      console.error("Failed to remove from history:", error)
      return false
    }
  }
}
