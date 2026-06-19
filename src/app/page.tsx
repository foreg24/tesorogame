'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameState } from '@/hooks/useGameState'
import { useSound } from '@/hooks/useSound'
import { Screen } from '@/types'
import { AnimatedBackground } from '@/components/AnimatedBackground'
import { TitleScreen } from '@/components/TitleScreen'
import { LanguageScreen } from '@/components/LanguageScreen'
import { StoryScreen } from '@/components/StoryScreen'
import { WorldScreen } from '@/components/WorldScreen'
import { ChallengeScreen } from '@/components/ChallengeScreen'
import { FinalScreen } from '@/components/FinalScreen'
import { CelebrationScreen } from '@/components/CelebrationScreen'
import { ReflectionScreen } from '@/components/ReflectionScreen'
import { ResetModal } from '@/components/ResetModal'
import { MusicPlayer } from '@/components/MusicPlayer'
import { getTranslation } from '@/lib/i18n'

const challengeConfigs = [
  {
    id: 1,
    titleKey: 'challenge1Title',
    introKey: 'challenge1Intro',
    questionKey: 'challenge1Question',
    options: ['#FF0000', '#00FF00', '#0000FF'],  // Red, Green, Blue
    correctAnswer: '#00FF00',  // Green follows the pattern
    skillKey: 'challenge1Skill',
    competenceKey: 'challenge1Competence',
    emoji: '🎨',
    successEmoji: '🎨✨',
    successMessage: '¡Has descubierto el patrón de colores!',
    color: 'border-ocean-400',
    type: 'colors' as const,
    colorSequence: ['#FF0000', '#00FF00', '#0000FF', '#FF0000', '#00FF00', '#0000FF', '#FF0000', '#00FF00', '#0000FF', '#FF0000'],
    hiddenIndex: 9,  // The 10th color (index 9) is hidden
  },
  {
    id: 2,
    titleKey: 'challenge2Title',
    introKey: 'challenge2Intro',
    questionKey: 'challenge2Question',
    options: ['Norte 5, Este 3', 'Norte 3, Este 5', 'Sur 5, Oeste 3'],
    correctAnswer: 'Norte 5, Este 3',
    skillKey: 'challenge2Skill',
    competenceKey: 'challenge2Competence',
    emoji: '🗺️',
    successEmoji: '🗺️✨',
    successMessage: '¡Has encontrado el mapa secreto!',
    color: 'border-tropical-400',
  },
  {
    id: 3,
    titleKey: 'challenge3Title',
    introKey: 'challenge3Intro',
    questionKey: 'challenge3Question',
    options: ['25 + 15', '18 + 30', '20 + 20'],  // No results shown
    correctAnswer: '18 + 30',
    skillKey: 'challenge3Skill',
    competenceKey: 'challenge3Competence',
    emoji: '💰',
    successEmoji: '💰✨',
    successMessage: '¡El cofre se ha abierto!',
    color: 'border-treasure-400',
    type: 'math' as const,
  },
  {
    id: 4,
    titleKey: 'challenge4Title',
    introKey: 'challenge4Intro',
    questionKey: 'challenge4Question',
    options: ['32', '28', '38'],
    correctAnswer: '32',
    skillKey: 'challenge4Skill',
    competenceKey: 'challenge4Competence',
    emoji: '📜',
    successEmoji: '📜✨',
    successMessage: '¡Has descifrado el mensaje!',
    color: 'border-wood-400',
  },
]

export default function Home() {
  const {
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
    isLoaded
  } = useGameState()

  const { playCorrect, playWrong, playKey, playClick, playCelebration } = useSound(gameState.soundEnabled)
  const [showResetModal, setShowResetModal] = useState(false)
  const [totalTime, setTotalTime] = useState(0)

  useEffect(() => {
    if (gameState.startTime) {
      const interval = setInterval(() => {
        setTotalTime(getTotalTime())
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [gameState.startTime, getTotalTime])

  const handlePlay = useCallback(() => {
    playClick()
    if (gameState.completedChallenges.length > 0) {
      setScreen('world')
    } else {
      setScreen('story')
    }
  }, [playClick, gameState.completedChallenges.length, setScreen])

  const handleLanguage = useCallback(() => {
    playClick()
    setScreen('language')
  }, [playClick, setScreen])

  const handleSelectLanguage = useCallback((lang: 'es' | 'en') => {
    playClick()
    setLanguage(lang)
    setScreen('title')
  }, [playClick, setLanguage, setScreen])

  const handleStartAdventure = useCallback(() => {
    playClick()
    setScreen('world')
  }, [playClick, setScreen])

  const handleChallengeComplete = useCallback((challengeId: number) => {
    playKey()
    addKey(challengeId)
  }, [playKey, addKey])

  const handleCorrect = useCallback(() => {
    playCorrect()
    addCorrectAnswer()
  }, [playCorrect, addCorrectAnswer])

  const handleWrong = useCallback(() => {
    playWrong()
    addWrongAnswer()
  }, [playWrong, addWrongAnswer])

  const handleFinalComplete = useCallback(() => {
    playCelebration()
    setScreen('celebration')
  }, [playCelebration, setScreen])

  const handlePlayAgain = useCallback(() => {
    playClick()
    resetProgress()
    setScreen('title')
  }, [playClick, resetProgress, setScreen])

  const handleReset = useCallback(() => {
    playClick()
    setShowResetModal(true)
  }, [playClick])

  const handleConfirmReset = useCallback(() => {
    resetProgress()
    setShowResetModal(false)
  }, [resetProgress])

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ocean-50">
        <motion.div
          className="text-6xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          ⚙️
        </motion.div>
      </div>
    )
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      <MusicPlayer enabled={gameState.soundEnabled} />

      <AnimatePresence mode="wait">
        <motion.div
          key={gameState.currentScreen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {gameState.currentScreen === 'title' && (
            <TitleScreen
              gameState={gameState}
              onPlay={handlePlay}
              onLanguage={handleLanguage}
              onReset={handleReset}
              onToggleSound={toggleSound}
            />
          )}

          {gameState.currentScreen === 'language' && (
            <LanguageScreen
              gameState={gameState}
              onSelectLanguage={handleSelectLanguage}
              onBack={() => setScreen('title')}
            />
          )}

          {gameState.currentScreen === 'story' && (
            <StoryScreen
              gameState={gameState}
              onStart={handleStartAdventure}
            />
          )}

          {gameState.currentScreen === 'world' && (
            <WorldScreen
              gameState={gameState}
              onNavigate={setScreen}
              onBack={() => setScreen('title')}
              onUpdatePosition={updatePlayerPosition}
            />
          )}

          {gameState.currentScreen === 'challenge1' && (
            <ChallengeScreen
              gameState={gameState}
              config={challengeConfigs[0]}
              onComplete={() => handleChallengeComplete(1)}
              onBack={() => setScreen('world')}
              onCorrect={handleCorrect}
              onWrong={handleWrong}
            />
          )}

          {gameState.currentScreen === 'challenge2' && (
            <ChallengeScreen
              gameState={gameState}
              config={challengeConfigs[1]}
              onComplete={() => handleChallengeComplete(2)}
              onBack={() => setScreen('world')}
              onCorrect={handleCorrect}
              onWrong={handleWrong}
            />
          )}

          {gameState.currentScreen === 'challenge3' && (
            <ChallengeScreen
              gameState={gameState}
              config={challengeConfigs[2]}
              onComplete={() => handleChallengeComplete(3)}
              onBack={() => setScreen('world')}
              onCorrect={handleCorrect}
              onWrong={handleWrong}
            />
          )}

          {gameState.currentScreen === 'challenge4' && (
            <ChallengeScreen
              gameState={gameState}
              config={challengeConfigs[3]}
              onComplete={() => handleChallengeComplete(4)}
              onBack={() => setScreen('world')}
              onCorrect={handleCorrect}
              onWrong={handleWrong}
            />
          )}

          {gameState.currentScreen === 'final' && (
            <FinalScreen
              gameState={gameState}
              onComplete={handleFinalComplete}
              onBack={() => setScreen('world')}
              onCorrect={handleCorrect}
              onWrong={handleWrong}
            />
          )}

          {gameState.currentScreen === 'celebration' && (
            <CelebrationScreen
              gameState={gameState}
              totalTime={totalTime}
              onPlayAgain={handlePlayAgain}
              onReflection={() => setScreen('reflection')}
            />
          )}

          {gameState.currentScreen === 'reflection' && (
            <ReflectionScreen
              gameState={gameState}
              onBack={() => setScreen('celebration')}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <ResetModal
        gameState={gameState}
        isOpen={showResetModal}
        onConfirm={handleConfirmReset}
        onCancel={() => setShowResetModal(false)}
      />
    </main>
  )
}
