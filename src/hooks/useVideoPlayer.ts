import { useState, useEffect, useCallback, RefObject } from "react"
import Hls from "hls.js"

export type PlayerState = "idle" | "loading" | "ready" | "playing" | "paused" | "buffering" | "ended" | "error"

export function useVideoPlayer(videoRef: RefObject<HTMLVideoElement | null>, videoSrc?: string) {
  const [playerState, setPlayerState] = useState<PlayerState>("idle")
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Initialization and event listeners
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onPlay = () => setPlayerState("playing")
    const onPause = () => setPlayerState("paused")
    const onWaiting = () => setPlayerState("buffering")
    const onPlaying = () => setPlayerState("playing")
    const onEnded = () => setPlayerState("ended")
    const onError = () => setPlayerState("error")
    
    const onTimeUpdate = () => setCurrentTime(video.currentTime)
    const onLoadedMetadata = () => {
      setDuration(video.duration)
      setPlayerState("ready")
    }
    const onVolumeChange = () => {
      setVolume(video.volume)
      setIsMuted(video.muted)
    }

    video.addEventListener("play", onPlay)
    video.addEventListener("pause", onPause)
    video.addEventListener("waiting", onWaiting)
    video.addEventListener("playing", onPlaying)
    video.addEventListener("ended", onEnded)
    video.addEventListener("error", onError)
    video.addEventListener("timeupdate", onTimeUpdate)
    video.addEventListener("loadedmetadata", onLoadedMetadata)
    video.addEventListener("volumechange", onVolumeChange)

    return () => {
      video.removeEventListener("play", onPlay)
      video.removeEventListener("pause", onPause)
      video.removeEventListener("waiting", onWaiting)
      video.removeEventListener("playing", onPlaying)
      video.removeEventListener("ended", onEnded)
      video.removeEventListener("error", onError)
      video.removeEventListener("timeupdate", onTimeUpdate)
      video.removeEventListener("loadedmetadata", onLoadedMetadata)
      video.removeEventListener("volumechange", onVolumeChange)
    }
  }, [videoRef])

  // Media Source Setup (HLS / Native)
  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoSrc) return

    let hls: Hls | null = null

    if (videoSrc.includes(".m3u8") && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      })
      hls.loadSource(videoSrc)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setPlayerState("ready")
      })
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          setPlayerState("error")
          console.error("HLS Error:", data)
        }
      })
    } else if (video.canPlayType("application/vnd.apple.mpegurl") && videoSrc.includes(".m3u8")) {
      // Native HLS (Safari)
      video.src = videoSrc
    } else {
      // Standard MP4/WebM
      video.src = videoSrc
    }

    return () => {
      if (hls) {
        hls.destroy()
      }
    }
  }, [videoRef, videoSrc])

  // Fullscreen listeners
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  // Actions
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play().catch((err) => {
        console.error("Playback failed. The video source might be invalid or blocked.", err)
        setPlayerState("error")
      })
    } else {
      videoRef.current.pause()
    }
  }, [videoRef])

  const seek = useCallback((time: number) => {
    if (!videoRef.current) return
    videoRef.current.currentTime = time
  }, [videoRef])

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
  }, [videoRef])

  const handleVolume = useCallback((val: number) => {
    if (!videoRef.current) return
    videoRef.current.volume = Math.max(0, Math.min(1, val))
  }, [videoRef])

  const handlePlaybackRate = useCallback((rate: number) => {
    if (!videoRef.current) return
    videoRef.current.playbackRate = rate
    setPlaybackRate(rate)
  }, [videoRef])

  const toggleFullscreen = useCallback((containerRef: RefObject<HTMLElement | null>) => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(console.error)
    } else {
      document.exitFullscreen().catch(console.error)
    }
  }, [])

  const togglePiP = useCallback(async () => {
    if (!videoRef.current) return
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture()
      }
    } catch (err) {
      console.error("PiP error", err)
    }
  }, [videoRef])

  return {
    playerState,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    isFullscreen,
    togglePlay,
    seek,
    toggleMute,
    handleVolume,
    handlePlaybackRate,
    toggleFullscreen,
    togglePiP,
  }
}
