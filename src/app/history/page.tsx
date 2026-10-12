import { Metadata } from "next"
import { History, Play } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "History | HAKIBOX",
  description: "Your watch history.",
}

export default function HistoryPage() {
  return (
    <div className="min-h-screen pt-20 pb-20 container px-4 lg:px-8 bg-background">
      <div className="flex items-center gap-3 mb-8 border-b border-border pb-4">
        <History className="w-8 h-8 text-crimson" />
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Continue Watching</h1>
          <p className="text-text-muted mt-1 text-sm md:text-base">Your recently watched episodes and movies.</p>
        </div>
      </div>

      <div className="flex flex-col min-h-[60vh] items-center justify-center bg-surface-elevated/30 rounded-2xl border border-border/50">
        <div className="w-20 h-20 mb-6 rounded-full bg-surface flex items-center justify-center">
          <Play className="w-8 h-8 text-text-muted" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight mb-2">No Watch History</h2>
        <p className="text-text-secondary text-center max-w-sm mb-8">
          You haven't watched anything yet. Start exploring our catalog to build your history!
        </p>
        <Link href="/explore">
          <Button className="font-bold rounded-full px-8">Browse Anime</Button>
        </Link>
      </div>
    </div>
  )
}
