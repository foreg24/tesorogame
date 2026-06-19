'use client'

import { motion } from 'framer-motion'
import { Trophy, Clock, Target, Zap, Key, RotateCcw, Star, TrendingUp } from 'lucide-react'
import { GameState } from '@/types'
import { getTranslation } from '@/lib/i18n'
import { formatTime, getSuccessRate } from '@/lib/utils'

interface CelebrationScreenProps {
  gameState: GameState
  totalTime: number
  onPlayAgain: () => void
  onReflection: () => void
}

export function CelebrationScreen({ gameState, totalTime, onPlayAgain, onReflection }: CelebrationScreenProps) {
  const t = (key: any) => getTranslation(gameState.language, key)
  const successRate = getSuccessRate(gameState.correctAnswers, gameState.wrongAnswers)

  const stats = [
    { icon: Clock, label: t('totalTime'), value: formatTime(totalTime), color: 'bg-ocean-100 text-ocean-700' },
    { icon: Target, label: t('correctAnswers'), value: gameState.correctAnswers.toString(), color: 'bg-green-100 text-green-700' },
    { icon: Zap, label: t('wrongAnswers'), value: gameState.wrongAnswers.toString(), color: 'bg-red-100 text-red-700' },
    { icon: TrendingUp, label: t('successRate'), value: `${successRate}%`, color: 'bg-treasure-100 text-treasure-700' },
    { icon: Key, label: t('keysCollected'), value: `${gameState.keys.length}/4`, color: 'bg-yellow-100 text-yellow-700' },
    { icon: Star, label: t('challengesCompleted'), value: `${gameState.completedChallenges.length}/4`, color: 'bg-purple-100 text-purple-700' },
  ]

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 overflow-hidden">
      <AnimatedBackground />

      {/* Floating decorations */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed text-3xl pointer-events-none z-0"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 360],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          {['⭐', '💎', '🏆', '🎉', '✨'][i % 5]}
        </motion.div>
      ))}

      <motion.div
        className="relative z-10 w-full max-w-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <motion.div
            className="text-7xl md:text-8xl mb-4"
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🏆
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-bold text-wood-800 mb-2">
            {t('congratulations')}
          </h1>
          <p className="text-xl md:text-2xl text-treasure-600 font-bold">
            {t('treasureFound')}
          </p>
        </motion.div>

        {/* Stats card */}
        <motion.div
          className="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-treasure-400 mb-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Trophy className="w-6 h-6 text-treasure-500" />
            <h2 className="text-xl md:text-2xl font-bold text-wood-800">{t('statsTitle')}</h2>
            <Trophy className="w-6 h-6 text-treasure-500" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className={`${stat.color} rounded-2xl p-4 text-center border-2 border-white/50`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <stat.icon className="w-6 h-6 mx-auto mb-2" />
                <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                <p className="text-xs md:text-sm font-medium opacity-80">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Success rate bar */}
          <motion.div
            className="mt-6 bg-gray-100 rounded-full h-6 overflow-hidden border-2 border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-treasure-400 to-treasure-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${successRate}%` }}
              transition={{ duration: 1.5, delay: 1.5, ease: "easeOut" }}
            />
          </motion.div>
          <p className="text-center text-sm text-wood-600 mt-2 font-medium">
            {t('successRate')}: {successRate}%
          </p>
        </motion.div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            onClick={onReflection}
            className="py-4 px-8 bg-gradient-to-r from-ocean-400 to-ocean-600 text-white text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all border-3 border-ocean-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <span className="flex items-center justify-center gap-2">
              <Star className="w-5 h-5" />
              {t('reflectionTitle')}
            </span>
          </motion.button>

          <motion.button
            onClick={onPlayAgain}
            className="py-4 px-8 bg-gradient-to-r from-treasure-400 to-treasure-600 text-white text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all border-3 border-treasure-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7 }}
          >
            <span className="flex items-center justify-center gap-2">
              <RotateCcw className="w-5 h-5" />
              {t('playAgain')}
            </span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

import { AnimatedBackground } from './AnimatedBackground'
