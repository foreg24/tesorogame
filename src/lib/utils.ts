import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitialGameState(): GameState {
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
  }
}

export function saveGameState(state: GameState): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('islaTesoroState', JSON.stringify(state))
  }
}

export function loadGameState(): GameState | null {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('islaTesoroState')
    if (saved) {
      return JSON.parse(saved)
    }
  }
  return null
}

export function clearGameState(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('islaTesoroState')
  }
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function getSuccessRate(correct: number, wrong: number): number {
  const total = correct + wrong
  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}
