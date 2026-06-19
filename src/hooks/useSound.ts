'use client'

import { useCallback, useRef } from 'react'

export function useSound(enabled: boolean) {
  const audioContextRef = useRef<AudioContext | null>(null)

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioContextRef.current
  }, [])

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!enabled) return
    try {
      const ctx = getAudioContext()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + duration)
    } catch (e) {
      console.log('Audio not available')
    }
  }, [enabled, getAudioContext])

  const playCorrect = useCallback(() => {
    playTone(523, 0.15, 'sine') // C5
    setTimeout(() => playTone(659, 0.15, 'sine'), 150) // E5
    setTimeout(() => playTone(784, 0.3, 'sine'), 300) // G5
  }, [playTone])

  const playWrong = useCallback(() => {
    playTone(300, 0.3, 'sawtooth')
    setTimeout(() => playTone(250, 0.3, 'sawtooth'), 200)
  }, [playTone])

  const playKey = useCallback(() => {
    playTone(880, 0.1, 'sine')
    setTimeout(() => playTone(1100, 0.1, 'sine'), 100)
    setTimeout(() => playTone(1320, 0.2, 'sine'), 200)
  }, [playTone])

  const playClick = useCallback(() => {
    playTone(800, 0.05, 'sine')
  }, [playTone])

  const playCelebration = useCallback(() => {
    const notes = [523, 587, 659, 784, 880, 1047]
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.2, 'sine'), i * 150)
    })
  }, [playTone])

  const playJump = useCallback(() => {
    playTone(400, 0.1, 'sine')
    setTimeout(() => playTone(600, 0.1, 'sine'), 50)
  }, [playTone])

  return {
    playCorrect,
    playWrong,
    playKey,
    playClick,
    playCelebration,
    playJump
  }
}
