"use client"

import React, { useState } from "react"
import { Calendar } from "lucide-react"
import { AnimeCard } from "@/components/ui/AnimeCard"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function ScheduleClient({ contentList }: { contentList: any[] }) {
  // Use current day as default
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const [activeDay, setActiveDay] = useState(DAYS[todayIndex])

  // Mock grouping: Since we don't have broadcastDay in our DB yet, 
  // we'll distribute the content evenly across the days for demonstration.
  const activeDayContent = contentList.filter((content, index) => {
    return DAYS[index % 7] === activeDay;
  })

  return (
    <div className="min-h-screen pt-24 pb-20 container px-4 md:px-8">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Calendar className="h-8 w-8 text-crimson" />
            Release Schedule
          </h1>
          <p className="text-text-secondary mt-1 text-sm">Track when your favorite shows are airing new episodes.</p>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {DAYS.map((day) => (
            <button 
              key={day} 
              onClick={() => setActiveDay(day)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${activeDay === day ? 'bg-white text-black' : 'bg-surface-strong text-text-secondary hover:text-white'}`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {activeDayContent.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-surface/50 rounded-xl border border-border border-dashed">
          <Calendar className="h-12 w-12 text-text-muted mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-white mb-2">No Releases Today</h2>
          <p className="text-text-secondary max-w-md text-center">
            There are no new episodes scheduled for {activeDay}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 md:gap-4">
          {activeDayContent.map((content) => (
            <AnimeCard key={content.id} anime={content} />
          ))}
        </div>
      )}
    </div>
  )
}
