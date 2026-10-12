"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { signInWithPopup, signInWithEmailAndPassword, getIdToken } from "firebase/auth"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { auth, googleProvider, db } from "@/lib/firebase/client"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Loader2 } from "lucide-react"
import { createSession } from "@/app/actions/auth"

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleAuthSuccess = async (user: any) => {
    try {
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
          provider: user.providerData[0]?.providerId || "password",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          role: isAdmin ? "ADMIN" : "USER"
        });
      } else {
        // Upgrade to admin if matching the special email
        const data = userSnap.data();
        if (user.email === "zoom10x00@gmail.com" && data.role !== "ADMIN") {
          await setDoc(userRef, { lastLoginAt: serverTimestamp(), role: "ADMIN" }, { merge: true });
        } else {
          await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true });
        }
      }

      router.push("/admin")
      router.refresh()
    } catch (err) {
      console.error("Error setting up user profile:", err)
      setError("Failed to set up account profile. Please try again.")
      setIsLoading(false)
      setIsGoogleLoading(false)
    }
  }

  async function onGoogleSignIn() {
    setIsGoogleLoading(true)
    setError(null)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      await handleAuthSuccess(result.user)
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Sign in was cancelled.")
      } else {
        setError("Could not authenticate with Google. Please try again.")
      }
      setIsGoogleLoading(false)
    }
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const target = event.target as typeof event.target & {
      email: { value: string }
      password: { value: string }
    }

    try {
      const result = await signInWithEmailAndPassword(auth, target.email.value, target.password.value)
      await handleAuthSuccess(result.user)
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError("Invalid email or password")
      } else {
        setError("An unexpected error occurred during sign in")
      }
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-white bg-error/80 rounded-md border border-error text-center">
          {error}
        </div>
      )}
      
      <Button 
        type="button" 
        onClick={onGoogleSignIn}
        disabled={isGoogleLoading || isLoading}
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

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border-strong" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-surface-elevated px-2 text-text-muted font-semibold tracking-wider">Or continue with</span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary" htmlFor="email">Email</label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            required 
            placeholder="name@example.com"
            className="bg-surface-strong border-border-strong text-white placeholder:text-text-muted h-11"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary" htmlFor="password">Password</label>
          <Input 
            id="password" 
            name="password" 
            type="password" 
            required 
            className="bg-surface-strong border-border-strong text-white h-11"
          />
        </div>
        <Button className="w-full font-bold text-base mt-2 h-11" type="submit" disabled={isLoading || isGoogleLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Sign In
        </Button>
      </form>
    </div>
  )
}
