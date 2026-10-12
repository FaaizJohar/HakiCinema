"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { signInWithPopup, getIdToken } from "firebase/auth"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { auth, googleProvider, db } from "@/lib/firebase/client"
import { Button } from "@/components/ui/Button"
import { Loader2, UserCircle2, X } from "lucide-react"
import { createSession } from "@/app/actions/auth"

export function AuthModal() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    window.addEventListener("open-auth-modal", handleOpen)
    return () => window.removeEventListener("open-auth-modal", handleOpen)
  }, [])

  React.useEffect(() => {
    // Don't show modal on login or admin pages
    if (pathname === "/login" || pathname?.startsWith("/admin")) return;

    // Check if user has already made a choice
    const authChoice = localStorage.getItem("hakibox_auth_choice")
    if (!authChoice) {
      // Delay slightly for effect
      const timer = setTimeout(() => setIsOpen(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [pathname])

  const handleGuest = () => {
    localStorage.setItem("hakibox_auth_choice", "guest")
    setIsOpen(false)
  }

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true)
    setError(null)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      const idToken = await getIdToken(user);
      const sessionResult = await createSession(idToken);
      if (!sessionResult.success) {
        throw new Error("Failed to create session");
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const isAdmin = user.email === "zoom10x00@gmail.com";
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0],
          photoURL: user.photoURL || null,
          provider: user.providerData[0]?.providerId || "google",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          role: isAdmin ? "ADMIN" : "USER"
        });
      } else {
        const data = userSnap.data();
        if (user.email === "zoom10x00@gmail.com" && data.role !== "ADMIN") {
          await setDoc(userRef, { lastLoginAt: serverTimestamp(), role: "ADMIN" }, { merge: true });
        } else {
          await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true });
        }
      }

      localStorage.setItem("hakibox_auth_choice", "authenticated")
      setIsOpen(false)
      router.refresh()
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Sign in was cancelled.")
      } else {
        setError("Could not authenticate with Google. Please try again.")
      }
      setIsGoogleLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-surface-elevated border border-border rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        
        <button 
          onClick={handleGuest}
          className="absolute top-4 right-4 p-2 text-text-muted hover:text-white transition-colors rounded-full hover:bg-surface-strong"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-strong mb-4">
            <UserCircle2 className="w-8 h-8 text-crimson" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mb-2">Welcome to HAKIBOX</h2>
          <p className="text-sm text-text-secondary">
            Sign in to save your watchlist and keep track of your episodes across devices.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm text-white bg-error/80 rounded-md border border-error text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <Button 
            onClick={handleGoogleAuth}
            disabled={isGoogleLoading}
            className="w-full font-bold text-base h-12 bg-white text-black hover:bg-platinum rounded-xl shadow-md transition-all flex items-center justify-center gap-3"
          >
            {isGoogleLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Continue with Google
          </Button>

          <Button 
            onClick={handleGuest}
            variant="secondary"
            className="w-full font-bold text-base h-12 bg-surface-strong hover:bg-surface text-platinum hover:text-white rounded-xl border border-border"
          >
            Continue as Guest
          </Button>
        </div>

        <p className="text-center text-xs text-text-muted mt-6">
          Guest accounts cannot save data or access synchronized watch history.
        </p>
      </div>
    </div>
  )
}
