"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error?.message || "Failed to register");
      }
      
      // Redirect to login after successful registration
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      <div className="absolute inset-0 premium-gradient z-0 opacity-50" />
      
      <div className="w-full max-w-md p-8 space-y-8 glass-panel rounded-xl z-10 mt-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Join HAKI<span className="text-crimson">BOX</span>
          </h1>
          <p className="text-text-muted mt-2">Create an account to start streaming</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="p-3 rounded bg-error/20 border border-error/50 text-error text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-platinum">Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded bg-surface-strong border border-border focus:border-crimson focus:ring-1 focus:ring-crimson outline-none transition-all text-white placeholder:text-text-muted"
            />
            {errors.email && <p className="text-xs text-error">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-platinum">Password</label>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded bg-surface-strong border border-border focus:border-crimson focus:ring-1 focus:ring-crimson outline-none transition-all text-white placeholder:text-text-muted"
            />
            {errors.password && <p className="text-xs text-error">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-platinum">Confirm Password</label>
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded bg-surface-strong border border-border focus:border-crimson focus:ring-1 focus:ring-crimson outline-none transition-all text-white placeholder:text-text-muted"
            />
            {errors.confirmPassword && <p className="text-xs text-error">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded bg-crimson hover:bg-crimson-hover text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link href="/login" className="text-crimson hover:text-crimson-hover font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
