'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check, X, Star, Trophy, Lightbulb } from 'lucide-react'
import { GameState } from '@/types'
import { getTranslation } from '@/lib/i18n'
import { useState, useEffect } from 'react'

interface ChallengeConfig {
  id: number
  titleKey: any
  introKey: any
  questionKey: any
  options: string[]
  correctAnswer: string
  skillKey: any
  competenceKey: any
  emoji: string
  successEmoji: string
  successMessage: string
  color: string
}

interface ChallengeScreenProps {
  gameState: GameState
  config: ChallengeConfig
  onComplete: () => void
  onBack: () => void
  onCorrect: () => void
  onWrong: () => void
}

export function ChallengeScreen({ 
  gameState, 
  config, 
  onComplete, 
  onBack, 
  onCorrect, 
  onWrong 
}: ChallengeScreenProps) {
  const t = (key: any) => getTranslation(gameState.language, key)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, color: string}>>([])
  const [autoCloseTimer, setAutoCloseTimer] = useState(10)

  const isCompleted = gameState.completedChallenges.includes(config.id)

  const handleSelect = (option: string) => {
    if (isCompleted || feedback) return
    setSelectedOption(option)
  }

  const handleConfirm = () => {
    if (!selectedOption || isCompleted || feedback) return

    if (selectedOption === config.correctAnswer) {
      setFeedback('correct')
      onCorrect()

      const newParticles = [...Array(20)].map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][Math.floor(Math.random() * 5)]
      }))
      setParticles(newParticles)

      setTimeout(() => {
        setShowCelebration(true)
        setAutoCloseTimer(10)
      }, 800)
    } else {
      setFeedback('wrong')
      onWrong()
      setTimeout(() => {
        setFeedback(null)
        setSelectedOption(null)
      }, 1500)
    }
  }

  // Auto-close celebration after 10 seconds
  useEffect(() => {
    if (showCelebration && autoCloseTimer > 0) {
      const timer = setInterval(() => {
        setAutoCloseTimer(prev => {
          if (prev <= 1) {
            onComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [showCelebration, autoCloseTimer, onComplete])

  const handleCloseCelebration = () => {
    setShowCelebration(false)
    onComplete()
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 overflow-hidden">
      <AnimatedBackground />

      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="fixed w-3 h-3 rounded-full z-50 pointer-events-none"
            style={{ backgroundColor: p.color, left: `${p.x}%`, top: `${p.y}%` }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ 
              scale: [0, 1.5, 0],
              y: [0, -100, -200],
              x: [0, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 200],
              opacity: [1, 1, 0]
            }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      <motion.div
        className="relative z-10 w-full max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 text-wood-700 font-bold hover:text-wood-900 transition-colors bg-white/80 px-3 py-2 rounded-xl"
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            {t('back')}
          </motion.button>

          <div className="flex items-center gap-2 bg-white/80 px-3 py-2 rounded-xl">
            <Key className="w-5 h-5 text-treasure-500" />
            <span className="font-bold text-wood-700">{gameState.keys.length}/4</span>
          </div>
        </div>

        <motion.div
          className={`bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl border-4 ${config.color}`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <motion.div className="text-center mb-6">
            <motion.div
              className="text-5xl md:text-6xl mb-3"
              animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {config.emoji}
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-wood-800">
              {t(config.titleKey)}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Star className="w-4 h-4 text-treasure-400" />
              <span className="text-sm text-wood-600 font-medium">
                {t(config.competenceKey)}: {t(config.skillKey)}
              </span>
              <Star className="w-4 h-4 text-treasure-400" />
            </div>
          </motion.div>

          <motion.p
            className="text-center text-wood-700 mb-6 text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t(config.introKey)}
          </motion.p>

          <motion.div
            className="bg-ocean-50 rounded-2xl p-5 mb-6 border-2 border-ocean-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-treasure-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-bold text-wood-800 mb-2">{t(config.questionKey)}</p>
                {config.id === 1 && (
                  <p className="text-2xl md:text-3xl font-bold text-ocean-700 text-center py-4 bg-white rounded-xl border-2 border-ocean-300">
                    10 - 20 - 30 - <span className="text-treasure-500">___</span> - 50
                  </p>
                )}
                {config.id === 2 && (
                  <p className="text-lg text-ocean-700 text-center py-4 bg-white rounded-xl border-2 border-ocean-300">
                    {gameState.language === 'es' ? 'El tesoro está 5 pasos al norte y 3 al este.' : 'The treasure is 5 steps north and 3 east.'}
                  </p>
                )}
                {config.id === 3 && (
                  <div className="flex flex-col gap-2 py-2">
                    {config.options.map((opt, i) => (
                      <div key={i} className="text-center py-2 bg-white rounded-lg border border-ocean-200 font-bold text-wood-700">
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
                {config.id === 4 && (
                  <p className="text-lg text-ocean-700 text-center py-4 bg-white rounded-xl border-2 border-ocean-300">
                    {gameState.language === 'es' 
                      ? 'El pirata tenía 50 monedas. Gastó 18 comprando provisiones. ¿Cuántas le quedaron?' 
                      : 'The pirate had 50 coins. He spent 18 buying supplies. How many did he have left?'}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col gap-3 mb-6">
            {config.options.map((option, index) => {
              const isSelected = selectedOption === option
              const isCorrect = option === config.correctAnswer

              let buttonClass = 'bg-white border-3 border-wood-200 hover:border-ocean-400 hover:bg-ocean-50'
              if (feedback === 'correct' && isCorrect) {
                buttonClass = 'bg-green-100 border-3 border-green-500'
              } else if (feedback === 'wrong' && isSelected) {
                buttonClass = 'bg-red-100 border-3 border-red-500'
              } else if (isSelected) {
                buttonClass = 'bg-ocean-100 border-3 border-ocean-500'
              }

              return (
                <motion.button
                  key={index}
                  onClick={() => handleSelect(option)}
                  disabled={isCompleted || !!feedback}
                  className={`w-full py-4 px-6 rounded-2xl text-lg font-bold transition-all duration-200 ${buttonClass} ${
                    isCompleted && isCorrect ? 'bg-green-100 border-green-500' : ''
                  }`}
                  whileHover={!isCompleted && !feedback ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!isCompleted && !feedback ? { scale: 0.98 } : {}}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <span className="flex items-center justify-between">
                    <span>{String.fromCharCode(65 + index)}. {option}</span>
                    {feedback === 'correct' && isCorrect && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <Check className="w-6 h-6 text-green-600" />
                      </motion.div>
                    )}
                    {feedback === 'wrong' && isSelected && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <X className="w-6 h-6 text-red-600" />
                      </motion.div>
                    )}
                  </span>
                </motion.button>
              )
            })}
          </div>

          {isCompleted ? (
            <motion.div
              className="text-center py-4 bg-green-100 rounded-2xl border-3 border-green-400"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="font-bold text-green-700">{t('keyObtained')} ✓</p>
            </motion.div>
          ) : (
            <motion.button
              onClick={handleConfirm}
              disabled={!selectedOption || !!feedback}
              className={`w-full py-4 rounded-2xl text-xl font-bold transition-all ${
                selectedOption && !feedback
                  ? 'bg-gradient-to-r from-treasure-400 to-treasure-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              whileHover={selectedOption && !feedback ? { scale: 1.02 } : {}}
              whileTap={selectedOption && !feedback ? { scale: 0.98 } : {}}
            >
              {t('confirm')}
            </motion.button>
          )}

          <AnimatePresence>
            {feedback === 'wrong' && (
              <motion.div
                className="mt-4 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-red-600 font-bold">{t('wrong')}</p>
                <p className="text-wood-600 text-sm">{t('tryAgain')}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* SUCCESS CELEBRATION - Auto-close 10s + manual close */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseCelebration}
            >
              <motion.div
                className="bg-white rounded-3xl p-8 text-center shadow-2xl border-4 border-treasure-400 max-w-sm mx-4 relative"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button */}
                <button
                  onClick={handleCloseCelebration}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-wood-100 hover:bg-wood-200 flex items-center justify-center text-wood-600 text-sm font-bold transition-colors"
                >
                  ✕
                </button>

                <motion.div
                  className="text-6xl md:text-7xl mb-4"
                  animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {config.successEmoji}
                </motion.div>
                <h3 className="text-2xl font-bold text-treasure-600 mb-2">{t('correct')}</h3>
                <p className="text-wood-700 mb-4">{config.successMessage}</p>
                <motion.div
                  className="text-5xl mb-4"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  🔑
                </motion.div>

                {/* Timer indicator */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <motion.div
                      className="bg-treasure-400 h-2 rounded-full"
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: 10, ease: "linear" }}
                    />
                  </div>
                  <p className="text-xs text-wood-400">
                    {gameState.language === 'es' 
                      ? `Cerrando en ${autoCloseTimer}s (o toca ✕)` 
                      : `Closing in ${autoCloseTimer}s (or tap ✕)`}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

import { AnimatedBackground } from './AnimatedBackground'
import { Key } from 'lucide-react'
