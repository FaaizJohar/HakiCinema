import { adminDb } from "@/server/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export class ProfileService {
  static async getProfilesForAccount(accountId: string) {
    const snapshot = await adminDb.collection("users").doc(accountId).collection("profiles")
      .orderBy("createdAt", "asc")
      .get();
      
    const profiles: any[] = [];
    snapshot.forEach(doc => {
      profiles.push({ id: doc.id, ...doc.data() });
    });
    
    return profiles;
  }

  static async getProfileById(profileId: string, accountId: string) {
    const docRef = adminDb.collection("users").doc(accountId).collection("profiles").doc(profileId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      throw new Error("Profile not found");
    }

    return { id: docSnap.id, ...docSnap.data() };
  }

  static async createProfile(accountId: string, data: { name: string; avatar?: string; isKidsProfile?: boolean }) {
    const profilesRef = adminDb.collection("users").doc(accountId).collection("profiles");
    const snapshot = await profilesRef.get();
    
    if (snapshot.size >= 5) {
      throw new Error("Maximum number of profiles reached");
    }

    const docRef = profilesRef.doc();
    const profileData = {
      accountId,
      name: data.name,
      avatar: data.avatar || null,
      isKidsProfile: data.isKidsProfile ?? false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    
    await docRef.set(profileData);
    
    return { id: docRef.id, ...profileData };
  }

  static async updateProfile(profileId: string, accountId: string, data: { name?: string; avatar?: string }) {
    await this.getProfileById(profileId, accountId); // Verify it exists and belongs to user
    
    const docRef = adminDb.collection("users").doc(accountId).collection("profiles").doc(profileId);
    await docRef.update({
      ...data,
      updatedAt: FieldValue.serverTimestamp()
    });
    
    return this.getProfileById(profileId, accountId);
  }

  static async deleteProfile(profileId: string, accountId: string) {
    await this.getProfileById(profileId, accountId); // Verify it exists and belongs to user
    
    const docRef = adminDb.collection("users").doc(accountId).collection("profiles").doc(profileId);
    await docRef.delete();
    
    return true;
  }
}
