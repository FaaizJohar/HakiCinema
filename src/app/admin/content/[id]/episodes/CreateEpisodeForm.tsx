"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createEpisode, deleteEpisode } from "@/app/actions/content";
import { Trash2 } from "lucide-react";

const episodeSchema = z.object({
  number: z.coerce.number().min(1, "Episode number is required"),
  title: z.string().min(1, "Title is required"),
  videoUrl: z.string().url("Must be a valid video URL").or(z.literal("")),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  duration: z.coerce.number().optional(),
});

type EpisodeValues = z.infer<typeof episodeSchema>;

export function CreateEpisodeForm({ contentId }: { contentId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EpisodeValues>({
    resolver: zodResolver(episodeSchema),
    defaultValues: {
      number: 1,
    }
  });

  const onSubmit = async (data: EpisodeValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await createEpisode(contentId, data);
      if (!res.success) throw new Error(res.error);
      reset();
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-surface-elevated border border-border p-6 rounded-xl space-y-4">
      <h3 className="text-lg font-bold text-white mb-4">Add New Episode</h3>
      
      {error && <div className="text-sm text-error bg-error/10 p-3 rounded">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-platinum">Episode Number *</label>
          <Input type="number" {...register("number")} className="bg-surface-strong border-border-strong text-white" />
          {errors.number && <p className="text-xs text-error">{errors.number.message}</p>}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-platinum">Episode Title *</label>
          <Input {...register("title")} className="bg-surface-strong border-border-strong text-white" />
          {errors.title && <p className="text-xs text-error">{errors.title.message}</p>}
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-platinum">Video URL (m3u8, mp4, etc.)</label>
          <Input {...register("videoUrl")} placeholder="https://..." className="bg-surface-strong border-border-strong text-white" />
          {errors.videoUrl && <p className="text-xs text-error">{errors.videoUrl.message}</p>}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-platinum">Thumbnail URL</label>
          <Input {...register("thumbnailUrl")} className="bg-surface-strong border-border-strong text-white" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-platinum">Duration (seconds)</label>
          <Input type="number" {...register("duration")} className="bg-surface-strong border-border-strong text-white" />
        </div>
      </div>
      
      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={isLoading} className="font-bold">
          {isLoading ? "Adding..." : "Add Episode"}
        </Button>
      </div>
    </form>
  );
}

export function DeleteEpisodeButton({ contentId, episodeId }: { contentId: string, episodeId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this episode?")) return;
    setIsDeleting(true);
    await deleteEpisode(contentId, episodeId);
    router.refresh();
  };
  
  return (
    <button 
      onClick={handleDelete} 
      disabled={isDeleting}
      className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded transition-colors disabled:opacity-50"
      title="Delete Episode"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
