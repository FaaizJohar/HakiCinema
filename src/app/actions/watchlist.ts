"use server"

import { adminDb, adminAuth } from "@/server/firebase/admin"
import { cookies } from "next/headers"
import { FieldValue } from "firebase-admin/firestore"

async function getUserId() {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")?.value
  if (!session) return null
  
  try {
    const decodedClaims = await adminAuth.verifySessionCookie(session, true)
    return decodedClaims.uid
  } catch (error) {
    return null
  }
}

export async function toggleWatchlist(contentId: string) {
  const uid = await getUserId()
  if (!uid) return { success: false, error: "Not logged in" }
  
  try {
    const docRef = adminDb.collection("users").doc(uid).collection("watchlist").doc(contentId)
    const docSnap = await docRef.get()
    
    if (docSnap.exists) {
      await docRef.delete()
      return { success: true, isWatchlisted: false }
    } else {
      await docRef.set({
        addedAt: FieldValue.serverTimestamp()
      })
      return { success: true, isWatchlisted: true }
    }
  } catch (error: any) {
    console.error("Watchlist toggle failed", error)
    return { success: false, error: error.message }
  }
}

export async function getWatchlistStatus(contentId: string) {
  const uid = await getUserId()
  if (!uid) return false
  
  try {
    const docRef = adminDb.collection("users").doc(uid).collection("watchlist").doc(contentId)
    const docSnap = await docRef.get()
    return docSnap.exists
  } catch (error) {
    return false
  }
}
