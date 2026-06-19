'use client'

import { useEffect, useRef, useCallback } from 'react'

interface MusicPlayerProps {
  enabled: boolean
}

export function MusicPlayer({ enabled }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const wasPlayingRef = useRef(false)

  useEffect(() => {
    // Create audio element if not exists
    if (!audioRef.current) {
      audioRef.current = new Audio('/music/pirate-adventure.mp3')
      audioRef.current.loop = true
      audioRef.current.volume = 0.4
    }

    const audio = audioRef.current

    if (enabled) {
      // If it was paused, restart from beginning
      if (!wasPlayingRef.current) {
        audio.currentTime = 0
      }

      // Try to play (needs user interaction first)
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay blocked, will play on next user interaction
        })
      }
      wasPlayingRef.current = true
    } else {
      audio.pause()
      wasPlayingRef.current = false
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [enabled])

  return null
}
