export type ContentType = "ANIME" | "MOVIE" | "SERIES" | "OVA" | "SPECIAL";
export type ContentStatus = "ONGOING" | "COMPLETED" | "UPCOMING" | "HIATUS";

export interface Content {
  id: string;
  title: string;
  alternativeTitles?: string[];
  slug?: string;
  description: string;
  shortDescription?: string;
  posterUrl: string;
  backdropUrl?: string;
  bannerUrl?: string;
  trailerUrl?: string;
  logoUrl?: string;
  
  type: ContentType;
  status: ContentStatus;
  
  year?: number;
  releaseDate?: string;
  endDate?: string;
  
  genres: string[];
  tags?: string[];
  studios?: string[];
  
  rating?: number; // E.g., 8.5
  popularity?: number;
  
  runtime?: number; // In minutes, useful for movies
  episodesCount?: number;
  seasonsCount?: number;
  
  ageRating?: string;
  
  isFeatured?: boolean;
  visibility: "PUBLIC" | "UNLISTED" | "PRIVATE";
  publishState: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  
  createdAt: string;
  updatedAt: string;
}

export interface Episode {
  id: string;
  contentId: string;
  seasonNumber?: number;
  number: number;
  title: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  isFiller?: boolean;
  isRecap?: boolean;
  airDate?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  name: string;
  avatarUrl?: string;
  isKidsProfile?: boolean;
  languagePreference?: string;
  subtitlePreference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WatchHistoryEntry {
  id: string;
  contentId: string;
  episodeId?: string;
  profileId: string;
  progressSeconds: number;
  durationSeconds: number;
  progressPercentage: number; // 0 to 1
  isCompleted: boolean;
  lastWatchedAt: string; // ISO String
}

export interface WatchlistEntry {
  id: string;
  contentId: string;
  profileId: string;
  addedAt: string; // ISO String
}

export interface Provider {
  id: string;
  name: string;
  type: "HLS" | "MP4" | "IFRAME";
  priority: number; // Higher is preferred
  health: "HEALTHY" | "DEGRADED" | "OFFLINE";
  status: "ACTIVE" | "INACTIVE";
}
