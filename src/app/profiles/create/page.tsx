"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const createProfileSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(50),
  isKidsProfile: z.boolean().optional(),
});

type CreateProfileValues = z.infer<typeof createProfileSchema>;

export default function CreateProfilePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CreateProfileValues>({
    resolver: zodResolver(createProfileSchema),
    defaultValues: {
      isKidsProfile: false,
    }
  });

  const onSubmit = async (data: CreateProfileValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to create profile");
      }
      
      router.push("/profiles");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      <div className="absolute inset-0 premium-gradient z-0 opacity-50" />
      
      <div className="w-full max-w-md p-8 space-y-8 glass-panel rounded-xl z-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Add Profile
          </h1>
          <p className="text-text-muted mt-2">Create a profile for someone else</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="p-3 rounded bg-error/20 border border-error/50 text-error text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-platinum">Name</label>
            <input
              {...register("name")}
              type="text"
              placeholder="Name"
              className="w-full px-4 py-3 rounded bg-surface-strong border border-border focus:border-crimson focus:ring-1 focus:ring-crimson outline-none transition-all text-white placeholder:text-text-muted"
            />
            {errors.name && <p className="text-xs text-error">{errors.name.message}</p>}
          </div>

          <div className="flex items-center space-x-3">
            <input
              {...register("isKidsProfile")}
              type="checkbox"
              id="isKidsProfile"
              className="w-5 h-5 rounded border-border bg-surface-strong text-crimson focus:ring-crimson focus:ring-offset-background"
            />
            <label htmlFor="isKidsProfile" className="text-sm font-medium text-platinum cursor-pointer">
              Kids Profile (Restricts mature content)
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <Link 
              href="/profiles" 
              className="flex-1 py-3 text-center rounded bg-surface-elevated hover:bg-surface-strong text-white font-semibold transition-colors border border-border"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 rounded bg-white hover:bg-platinum text-black font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
