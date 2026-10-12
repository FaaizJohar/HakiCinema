"use client"

import { useState } from "react"
import { Plus, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { toggleWatchlist } from "@/app/actions/watchlist"

interface WatchlistButtonProps {
  contentId: string;
  initialIsWatchlisted: boolean;
  className?: string;
  variant?: "default" | "secondary" | "ghost" | "danger" | "outline";
}

export function WatchlistButton({ contentId, initialIsWatchlisted, className, variant = "secondary" }: WatchlistButtonProps) {
  const [isWatchlisted, setIsWatchlisted] = useState(initialIsWatchlisted)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    setIsLoading(true)
    const res = await toggleWatchlist(contentId)
    if (res.success && res.isWatchlisted !== undefined) {
      setIsWatchlisted(res.isWatchlisted)
    } else if (res.error === "Not logged in") {
      alert("Please log in to add to your watchlist.")
    }
    setIsLoading(false)
  }

  return (
    <Button 
      variant={variant}
      className={`gap-2 ${className || ""}`}
      onClick={handleToggle}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isWatchlisted ? (
        <Check className="w-4 h-4" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
      {isWatchlisted ? "Added to List" : "Add to List"}
    </Button>
  )
}
