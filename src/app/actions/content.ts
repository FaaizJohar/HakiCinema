"use server"

import { adminDb } from "@/server/firebase/admin"
import { FieldValue } from "firebase-admin/firestore"
import { cookies } from "next/headers"
import { adminAuth } from "@/server/firebase/admin"
import { Content, Episode } from "@/types"

async function requireAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) throw new Error("Unauthorized");
  
  const decodedClaims = await adminAuth.verifySessionCookie(session, true);
  const userDoc = await adminDb.collection("users").doc(decodedClaims.uid).get();
  
  if (!userDoc.exists || userDoc.data()?.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
}

export async function createContent(data: Omit<Content, "id" | "createdAt" | "updatedAt">) {
  await requireAdmin();
  
  try {
    const docRef = adminDb.collection("content").doc();
    await docRef.set({
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Failed to create content", error);
    return { success: false, error: error.message };
  }
}

export async function updateContent(id: string, data: Partial<Content>) {
  await requireAdmin();
  
  try {
    await adminDb.collection("content").doc(id).update({
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    });
    
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update content", error);
    return { success: false, error: error.message };
  }
}

export async function deleteContent(id: string) {
  await requireAdmin();
  
  try {
    await adminDb.collection("content").doc(id).delete();
    // A robust background function should ideally clean up subcollections
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete content", error);
    return { success: false, error: error.message };
  }
}

export async function createEpisode(contentId: string, data: Omit<Episode, "id" | "contentId" | "createdAt" | "updatedAt">) {
  await requireAdmin();
  
  try {
    const docRef = adminDb.collection("content").doc(contentId).collection("episodes").doc();
    await docRef.set({
      ...data,
      number: Number(data.number),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Failed to create episode", error);
    return { success: false, error: error.message };
  }
}

export async function deleteEpisode(contentId: string, episodeId: string) {
  await requireAdmin();
  
  try {
    await adminDb.collection("content").doc(contentId).collection("episodes").doc(episodeId).delete();
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete episode", error);
    return { success: false, error: error.message };
  }
}
