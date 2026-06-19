'use client'

import { motion } from 'framer-motion'
import { Volume2, VolumeX, RotateCcw, Globe, Play } from 'lucide-react'
import { GameState, Screen } from '@/types'
import { getTranslation } from '@/lib/i18n'

interface TitleScreenProps {
  gameState: GameState
  onPlay: () => void
  onLanguage: () => void
  onReset: () => void
  onToggleSound: () => void
}

export function TitleScreen({ gameState, onPlay, onLanguage, onReset, onToggleSound }: TitleScreenProps) {
  const t = (key: any) => getTranslation(gameState.language, key)

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      <AnimatedBackground />

      {/* Floating treasure chest decoration */}
      <motion.div
        className="absolute top-20 right-8 md:right-20 text-6xl md:text-8xl"
        animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        🏴‍☠️
      </motion.div>

      <motion.div
        className="absolute top-32 left-8 md:left-20 text-5xl md:text-7xl"
        animate={{ y: [0, -10, 0], rotate: [0, -3, 3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        🦜
      </motion.div>

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center max-w-2xl w-full"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Logo */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        >
          <div className="relative inline-block">
            <motion.div
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-treasure-400 via-treasure-600 to-treasure-800 drop-shadow-lg"
              style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.3)' }}
              animate={{ 
                textShadow: [
                  '3px 3px 6px rgba(0,0,0,0.3)',
                  '3px 3px 20px rgba(255,200,0,0.5)',
                  '3px 3px 6px rgba(0,0,0,0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🏝️
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          className="text-3xl md:text-5xl lg:text-6xl font-bold text-wood-800 mb-2 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}
        >
          {t('title')}
        </motion.h1>

        <motion.div
          className="h-1 w-48 md:w-64 mx-auto bg-gradient-to-r from-transparent via-treasure-400 to-transparent rounded-full mb-8"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        />

        {/* Buttons */}
        <motion.div
          className="flex flex-col gap-4 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            onClick={onPlay}
            className="group relative w-64 md:w-72 py-4 px-8 bg-gradient-to-r from-treasure-400 to-treasure-600 text-white text-xl md:text-2xl font-bold rounded-2xl shadow-lg shadow-treasure-400/30 hover:shadow-xl hover:shadow-treasure-400/50 transition-all duration-300 border-4 border-treasure-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center justify-center gap-3">
              <Play className="w-6 h-6" />
              {t('play')}
            </span>
            <motion.div
              className="absolute inset-0 rounded-2xl bg-white/20"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.5 }}
            />
          </motion.button>

          <motion.button
            onClick={onLanguage}
            className="w-56 md:w-64 py-3 px-6 bg-gradient-to-r from-ocean-400 to-ocean-600 text-white text-lg font-bold rounded-xl shadow-lg shadow-ocean-400/30 hover:shadow-xl hover:shadow-ocean-400/50 transition-all duration-300 border-3 border-ocean-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center justify-center gap-2">
              <Globe className="w-5 h-5" />
              {t('selectLanguage')}
            </span>
          </motion.button>

          <div className="flex gap-3 mt-2">
            <motion.button
              onClick={onToggleSound}
              className="p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all border-2 border-ocean-200 text-ocean-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {gameState.soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </motion.button>

            <motion.button
              onClick={onReset}
              className="p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all border-2 border-wood-200 text-wood-600"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
            >
              <RotateCcw className="w-6 h-6" />
            </motion.button>
          </div>
        </motion.div>

        {/* Progress indicator if has progress */}
        {gameState.completedChallenges.length > 0 && (
          <motion.div
            className="mt-6 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-xl border-2 border-treasure-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-wood-700 font-bold text-sm">
              {t('progress')}: {gameState.completedChallenges.length}/4 {t('challengesCompleted')}
            </p>
            <div className="flex gap-1 mt-1 justify-center">
              {[1, 2, 3, 4].map(key => (
                <motion.div
                  key={key}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    gameState.keys.includes(key)
                      ? 'bg-treasure-400 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                  animate={gameState.keys.includes(key) ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  🔑
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Bottom decorative elements */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 text-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>🌴</motion.span>
        <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}>⭐</motion.span>
        <motion.span animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}>🌴</motion.span>
      </motion.div>
    </div>
  )
}

// Import needed
import { AnimatedBackground } from './AnimatedBackground'
