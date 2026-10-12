"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createContent } from "@/app/actions/content";

const createContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  alternativeTitles: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().optional(),
  type: z.enum(["TV", "MOVIE", "OVA", "ONA", "SPECIAL", "SERIES"]),
  status: z.enum(["ONGOING", "COMPLETED", "UPCOMING", "HIATUS", "CANCELLED"]),
  publishState: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  year: z.coerce.number().optional(),
  posterUrl: z.string().url().optional().or(z.literal("")),
  bannerUrl: z.string().url().optional().or(z.literal("")),
  studio: z.string().optional(),
  isFeatured: z.boolean().optional(),
  tags: z.string().optional(), // Comma separated tags
});

type CreateContentValues = z.infer<typeof createContentSchema>;

export default function CreateContentPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CreateContentValues>({
    resolver: zodResolver(createContentSchema),
    defaultValues: {
      type: "TV",
      status: "ONGOING",
      publishState: "DRAFT",
      isFeatured: false,
    }
  });

  const onSubmit = async (data: CreateContentValues) => {
    setIsLoading(true);
    setError(null);
    
    const payload = {
      ...data,
      alternativeTitles: data.alternativeTitles ? data.alternativeTitles.split(",").map(t => t.trim()).filter(Boolean) : [],
      tags: data.tags ? data.tags.split(",").map(g => g.trim()).filter(Boolean) : [],
      genres: [], // TODO: Add genre selector
      visibility: "PUBLIC" as const,
    };
    
    // @ts-ignore
    delete payload.alternativeTitlesString;
    // @ts-ignore
    delete payload.tagsString;

    try {
      const result = await createContent(payload as any);

      if (!result.success) {
        throw new Error(result.error || "Failed to create content");
      }
      
      router.push("/admin/content");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Add New Content</h1>
        <p className="text-text-muted mt-1">Create a new entry in the database (Anime, Movie, Series).</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-surface-elevated border border-border rounded-xl p-8">
        {error && (
          <div className="p-4 rounded bg-error/20 border border-error text-error text-sm">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-platinum">Title *</label>
            <Input {...register("title")} className="bg-surface-strong border-border-strong text-white" />
            {errors.title && <p className="text-xs text-error">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-platinum">Alternative Titles (comma separated)</label>
            <Input {...register("alternativeTitles")} className="bg-surface-strong border-border-strong text-white" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-platinum">Full Description *</label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-surface-strong border border-border-strong focus:border-crimson focus:ring-1 focus:ring-crimson outline-none text-white text-sm"
            />
            {errors.description && <p className="text-xs text-error">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-platinum">Type</label>
            <select
              {...register("type")}
              className="w-full px-4 py-3 rounded-lg bg-surface-strong border border-border-strong focus:border-crimson outline-none text-white text-sm"
            >
              <option value="TV">TV / Anime</option>
              <option value="SERIES">Series</option>
              <option value="MOVIE">Movie</option>
              <option value="OVA">OVA</option>
              <option value="ONA">ONA</option>
              <option value="SPECIAL">Special</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-platinum">Status</label>
            <select
              {...register("status")}
              className="w-full px-4 py-3 rounded-lg bg-surface-strong border border-border-strong focus:border-crimson outline-none text-white text-sm"
            >
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="HIATUS">Hiatus</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-platinum">Poster Image URL</label>
            <Input {...register("posterUrl")} className="bg-surface-strong border-border-strong text-white" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-platinum">Banner/Backdrop Image URL</label>
            <Input {...register("bannerUrl")} className="bg-surface-strong border-border-strong text-white" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-platinum">Release Year</label>
            <Input {...register("year")} type="number" className="bg-surface-strong border-border-strong text-white" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-platinum">Studio</label>
            <Input {...register("studio")} className="bg-surface-strong border-border-strong text-white" />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-platinum">Tags (comma separated)</label>
            <Input {...register("tags")} placeholder="Action, Adventure, Fantasy" className="bg-surface-strong border-border-strong text-white" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-platinum">Publish State</label>
            <select
              {...register("publishState")}
              className="w-full px-4 py-3 rounded-lg bg-surface-strong border border-border-strong focus:border-crimson outline-none text-white text-sm"
            >
              <option value="DRAFT">Draft (Hidden)</option>
              <option value="PUBLISHED">Published (Public)</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div className="flex items-center space-x-3 mt-8">
            <input
              {...register("isFeatured")}
              type="checkbox"
              id="isFeatured"
              className="w-5 h-5 rounded border-border bg-surface-strong text-crimson focus:ring-crimson"
            />
            <label htmlFor="isFeatured" className="text-sm font-medium text-platinum cursor-pointer">
              Feature on Homepage Carousel
            </label>
          </div>
        </div>

        <div className="flex gap-4 pt-6 border-t border-border">
          <Link href="/admin/content">
            <Button variant="secondary" className="px-8 font-bold border-border-strong bg-surface-strong hover:bg-surface">Cancel</Button>
          </Link>
          <Button type="submit" disabled={isLoading} className="px-10 font-bold text-base">
            {isLoading ? "Saving..." : "Create Content"}
          </Button>
        </div>
      </form>
    </div>
  );
}
