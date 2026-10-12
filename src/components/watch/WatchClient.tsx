"use client"

import React, { useState } from "react"
import { PlayerEngine } from "@/components/player/PlayerEngine"
import { EpisodeSelector } from "@/components/watch/EpisodeSelector"
import { ServerSelector } from "@/components/watch/ServerSelector"
import { Badge } from "@/components/ui/Badge"
import { Share2, Plus, Flag } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { WatchlistButton } from "@/components/ui/WatchlistButton"

const MOCK_SERVERS = [
  { id: "s1", name: "Haki-Fast", type: "fast" as const },
  { id: "s2", name: "Haki-Stable", type: "stable" as const },
  { id: "s3", name: "VidStream HD", type: "hd" as const },
  { id: "s4", name: "Backup", type: "normal" as const },
]

export function WatchClient({ 
  content, 
  episodes, 
  initialEpisodeId,
  initialIsWatchlisted
}: { 
  content: any, 
  episodes: any[], 
  initialEpisodeId: string,
  initialIsWatchlisted: boolean
}) {
  const [isTheaterMode, setIsTheaterMode] = useState(false)
  const [activeServerId, setActiveServerId] = useState("s1")
  const [activeEpisodeId, setActiveEpisodeId] = useState(initialEpisodeId)

  const currentEp = episodes.find(e => e.id === activeEpisodeId) || episodes[0];

  if (!currentEp && content.type !== "MOVIE") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <div className="w-24 h-24 mb-6 rounded-full bg-surface-elevated flex items-center justify-center shadow-lg border border-border">
          <Flag className="w-10 h-10 text-text-muted" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">No Episodes Found</h1>
        <p className="text-text-secondary text-center max-w-md mb-8">
          We couldn't find any episodes for this series. They may have been removed or are still processing.
        </p>
        <Button onClick={() => window.history.back()} variant="secondary" className="px-8 rounded-full font-bold">
          Go Back
        </Button>
      </div>
    );
  }

  // Format thumbnail, falling back to content poster/backdrop if episode doesn't have one
  const formatEpisodeList = episodes.map(ep => ({
    ...ep,
    thumbnail: ep.thumbnailUrl || content.backdropUrl || content.posterUrl || "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=400&auto=format&fit=crop",
    isWatched: false,
  }));

  const nextEp = episodes.find(e => currentEp && e.number === currentEp.number + 1);

  const finalVideoSrc = currentEp?.videoUrl?.trim() ? currentEp.videoUrl.trim() : (content.videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4");

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isTheaterMode ? 'bg-[#000000]' : 'bg-background'}`}>
      
      {/* Player Section */}
      <div className={`w-full transition-all duration-500 ${isTheaterMode ? 'pt-0' : 'pt-16 md:pt-20 lg:px-8'}`}>
        <div className={`mx-auto ${isTheaterMode ? 'max-w-full' : 'max-w-[1600px] rounded-xl overflow-hidden shadow-2xl border border-border/50'}`}>
          <PlayerEngine
            animeId={content.id}
            episodeId={activeEpisodeId || "movie"}
            videoSrc={finalVideoSrc}
            title={currentEp ? `Episode ${currentEp.number}: ${currentEp.title}` : content.title}
            subtitle={content.title}
            isTheaterMode={isTheaterMode}
            toggleTheaterMode={() => setIsTheaterMode(!isTheaterMode)}
            onNextEpisode={() => {
              if (nextEp) setActiveEpisodeId(nextEp.id)
            }}
          />
        </div>
      </div>

      {/* Below Player Layout */}
      <div className={`container mx-auto px-4 md:px-8 py-8 transition-opacity duration-500 ${isTheaterMode ? 'opacity-30 hover:opacity-100' : 'opacity-100'}`}>
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Info Column */}
          <div className="flex-1 flex flex-col gap-8">
            
            {/* Servers */}
            <ServerSelector 
              servers={MOCK_SERVERS} 
              activeServerId={activeServerId} 
              onSelect={setActiveServerId} 
            />

            {/* Episode Meta */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="crimson">{content.type || 'TV'}</Badge>
                <Badge variant="outline">HD</Badge>
                <Badge variant="outline">Sub</Badge>
                <span className="text-sm font-medium text-text-muted">
                  {currentEp?.duration ? `${Math.floor(currentEp.duration / 60)}m` : (content.runtime ? `${content.runtime}m` : '24m')}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                {currentEp ? `Episode ${currentEp.number}: ${currentEp.title}` : content.title}
              </h1>
              <p className="text-text-secondary leading-relaxed max-w-3xl text-sm md:text-base">
                {content.description || content.synopsis || "No synopsis available."}
              </p>
              
              {/* Actions */}
              <div className="flex flex-wrap items-center gap-4 mt-6">
                <WatchlistButton 
                  contentId={content.id} 
                  initialIsWatchlisted={initialIsWatchlisted} 
                  className="bg-surface hover:bg-surface-elevated"
                />
                <Button variant="secondary" className="gap-2 bg-surface hover:bg-surface-elevated">
                  <Share2 className="w-4 h-4" /> Share
                </Button>
                <Button variant="ghost" className="gap-2 text-text-muted hover:text-white">
                  <Flag className="w-4 h-4" /> Report Issue
                </Button>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          {episodes.length > 0 && (
            <div className="w-full lg:w-[400px] shrink-0">
              <EpisodeSelector 
                episodes={formatEpisodeList} 
                currentEpisodeId={activeEpisodeId}
                onSelect={setActiveEpisodeId}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
