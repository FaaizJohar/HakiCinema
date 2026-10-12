import { Metadata } from "next"
import { SearchClient } from "@/components/search/SearchClient"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Search | HAKIBOX",
  description: "Search for your favorite anime.",
}

export default function SearchPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 container px-4 md:px-8">
      <Suspense fallback={<div className="flex justify-center mt-20"><Loader2 className="animate-spin text-crimson w-8 h-8" /></div>}>
        <SearchClient />
      </Suspense>
    </div>
  )
}
