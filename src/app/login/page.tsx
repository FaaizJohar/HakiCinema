import { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "./form"

export const metadata: Metadata = {
  title: "Login | HAKIBOX",
  description: "Login to your account",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10" />
        <img 
          src="https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2000&auto=format&fit=crop" 
          alt="Background" 
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      <div className="relative z-20 w-full max-w-[400px]">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <img src="https://files.catbox.moe/cfqnon.png" alt="HAKIBOX" className="h-10 object-contain drop-shadow-[0_0_15px_rgba(217,22,43,0.3)]" />
          </Link>
        </div>
        
        <div className="glass-panel p-8 sm:p-10 rounded-2xl shadow-2xl">
          <div className="flex flex-col space-y-2 text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-white">Welcome back</h1>
            <p className="text-sm text-text-secondary">Enter your email to sign in to your account</p>
          </div>
          
          <LoginForm />
          
          <p className="px-8 text-center text-sm text-text-secondary mt-8">
            New to HAKIBOX?{" "}
            <Link href="/register" className="font-semibold text-white hover:text-crimson transition-colors">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
