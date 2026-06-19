'use client'

import { useState, useCallback, useEffect } from 'react'
import { GameState, Screen, Language, PlayerPosition } from '@/types'
import { saveGameState, loadGameState, clearGameState } from '@/lib/utils'

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = typeof window !== 'undefined' ? loadGameState() : null
    if (saved) return saved
    return {
      currentScreen: 'title',
      language: 'es',
      keys: [],
      completedChallenges: [],
      totalTime: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      playerName: '',
      startTime: null,
      soundEnabled: true,
      playerPosition: { x: 10, y: 60, direction: 'right' as const },
    }
  })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = loadGameState()
    if (saved) {
      setGameState(prev => ({
        ...prev,
        ...saved,
        playerPosition: saved.playerPosition || { x: 10, y: 60, direction: 'right' },
      }))
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      saveGameState(gameState)
    }
  }, [gameState, isLoaded])

  const setScreen = useCallback((screen: Screen) => {
    setGameState(prev => ({
      ...prev,
      currentScreen: screen,
      startTime: prev.startTime || Date.now(),
    }))
  }, [])

  const setLanguage = useCallback((language: Language) => {
    setGameState(prev => ({ ...prev, language }))
  }, [])

  const addKey = useCallback((challengeId: number) => {
    setGameState(prev => {
      if (prev.keys.includes(challengeId)) return prev
      return {
        ...prev,
        keys: [...prev.keys, challengeId],
        completedChallenges: [...prev.completedChallenges, challengeId],
      }
    })
  }, [])

  const addCorrectAnswer = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      correctAnswers: prev.correctAnswers + 1,
    }))
  }, [])

  const addWrongAnswer = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      wrongAnswers: prev.wrongAnswers + 1,
    }))
  }, [])

  const toggleSound = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      soundEnabled: !prev.soundEnabled,
    }))
  }, [])

  const updatePlayerPosition = useCallback((position: PlayerPosition) => {
    setGameState(prev => ({
      ...prev,
      playerPosition: position,
    }))
  }, [])

  const resetProgress = useCallback(() => {
    clearGameState()
    setGameState({
      currentScreen: 'title',
      language: 'es',
      keys: [],
      completedChallenges: [],
      totalTime: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      playerName: '',
      startTime: null,
      soundEnabled: true,
      playerPosition: { x: 10, y: 60, direction: 'right' },
    })
  }, [])

  const getTotalTime = useCallback(() => {
    if (!gameState.startTime) return 0
    return Math.floor((Date.now() - gameState.startTime) / 1000)
  }, [gameState.startTime])

  return {
    gameState,
    setScreen,
    setLanguage,
    addKey,
    addCorrectAnswer,
    addWrongAnswer,
    toggleSound,
    updatePlayerPosition,
    resetProgress,
    getTotalTime,
    isLoaded,
  }
}
