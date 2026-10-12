import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/server/firebase/admin";
import { ProfileService } from "@/lib/services/ProfileService";

async function verifySession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  try {
    const decoded = await adminAuth.verifySessionCookie(session, true);
    return decoded.uid;
  } catch (error) {
    return null;
  }
}

export async function GET() {
  try {
    const userId = await verifySession();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profiles = await ProfileService.getProfilesForAccount(userId);
    return NextResponse.json({ profiles });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await verifySession();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    if (!body.name || typeof body.name !== "string" || body.name.trim() === "") {
      return NextResponse.json({ error: "Profile name is required" }, { status: 400 });
    }

    const profile = await ProfileService.createProfile(userId, {
      name: body.name.trim(),
      avatar: body.avatar,
      isKidsProfile: body.isKidsProfile,
    });

    return NextResponse.json({ success: true, profile }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Maximum number of profiles reached") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
