import { Metadata } from "next"
import Link from "next/link"
import { Plus, Settings } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cookies } from "next/headers"
import { adminAuth } from "@/server/firebase/admin"
import { ProfileService } from "@/lib/services/ProfileService"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Who's watching? | HAKIBOX",
  description: "Select your profile to continue",
}

export default async function ProfilesPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  
  if (!session) {
    redirect("/");
  }

  let uid = null;
  try {
    const decodedClaims = await adminAuth.verifySessionCookie(session, true);
    uid = decodedClaims.uid;
  } catch (e) {
    redirect("/");
  }

  const profiles = await ProfileService.getProfilesForAccount(uid);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Background cinematic blur */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background/90 backdrop-blur-3xl z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[40vh] bg-crimson/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-20 w-full max-w-4xl text-center">
        <div className="mb-12">
          <Link href="/">
            <img src="https://files.catbox.moe/cfqnon.png" alt="HAKIBOX" className="h-10 mx-auto object-contain mb-8 drop-shadow-[0_0_15px_rgba(217,22,43,0.3)]" />
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Who's watching?</h1>
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {profiles.map(profile => (
            <Link key={profile.id} href="/" className="group flex flex-col items-center gap-4">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-xl overflow-hidden border-2 border-transparent group-hover:border-white transition-all duration-300 group-hover:scale-105 shadow-xl bg-surface-strong">
                <img src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} alt={profile.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-lg font-semibold text-text-secondary group-hover:text-white transition-colors">
                {profile.name}
              </span>
            </Link>
          ))}
          
          <Link href="/profiles/create" className="group flex flex-col items-center gap-4">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-xl border-2 border-border/50 border-dashed group-hover:border-white flex items-center justify-center transition-all duration-300 group-hover:scale-105 bg-surface/30 group-hover:bg-surface">
              <Plus className="w-12 h-12 text-text-muted group-hover:text-white transition-colors" />
            </div>
            <span className="text-lg font-semibold text-text-secondary group-hover:text-white transition-colors">
              Add Profile
            </span>
          </Link>
        </div>

        <div className="mt-16">
          <Button variant="secondary" className="px-6 rounded-full border-border-strong hover:bg-surface-elevated font-semibold text-text-secondary hover:text-white">
            <Settings className="w-4 h-4 mr-2" /> Manage Profiles
          </Button>
        </div>
      </div>
    </div>
  )
}
