import Link from "next/link";
import { LayoutDashboard, Film, ListVideo, Users, Settings, LogOut } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth, adminDb } from "@/server/firebase/admin";
import { removeSession } from "@/app/actions/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    redirect("/login");
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(session, true);
    const userDoc = await adminDb.collection("users").doc(decodedClaims.uid).get();
    
    if (!userDoc.exists || userDoc.data()?.role !== "ADMIN") {
      redirect("/");
    }
  } catch (error) {
    console.error("Session verification failed", error);
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-elevated border-r border-border flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/admin" className="text-xl font-bold tracking-tight text-foreground">
            HAKI<span className="text-crimson">ADMIN</span>
          </Link>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-md bg-surface-strong text-white font-medium">
            <LayoutDashboard className="h-5 w-5 text-platinum" />
            Dashboard
          </Link>
          <Link href="/admin/content" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-text-secondary hover:bg-surface-strong hover:text-white transition-colors font-medium">
            <Film className="h-5 w-5" />
            Content
          </Link>
          <Link href="/admin/episodes" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-text-secondary hover:bg-surface-strong hover:text-white transition-colors font-medium">
            <ListVideo className="h-5 w-5" />
            Episodes
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-text-secondary hover:bg-surface-strong hover:text-white transition-colors font-medium">
            <Users className="h-5 w-5" />
            Users
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-text-secondary hover:bg-surface-strong hover:text-white transition-colors font-medium">
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t border-border">
          <form action={async () => {
            "use server";
            await removeSession();
            redirect("/login");
          }}>
            <button type="submit" className="flex w-full items-center gap-3 px-3 py-2.5 rounded-md text-error hover:bg-error/10 transition-colors font-medium">
              <LogOut className="h-5 w-5" />
              Exit Admin
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="h-16 flex items-center px-8 border-b border-border bg-surface/50 backdrop-blur">
          <h2 className="text-lg font-medium text-platinum">Administration</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
