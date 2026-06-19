'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Lock, Unlock, Star } from 'lucide-react'
import { GameState } from '@/types'
import { getTranslation } from '@/lib/i18n'
import { useState, useEffect } from 'react'

interface FinalScreenProps {
  gameState: GameState
  onComplete: () => void
  onBack: () => void
  onCorrect: () => void
  onWrong: () => void
}

export function FinalScreen({ gameState, onComplete, onBack, onCorrect, onWrong }: FinalScreenProps) {
  const t = (key: any) => getTranslation(gameState.language, key)
  const [code, setCode] = useState('')
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [shake, setShake] = useState(false)

  const correctCode = '4826'
  const maxDigits = 4

  const handleDigit = (digit: string) => {
    if (code.length < maxDigits && !feedback) {
      setCode(prev => prev + digit)
    }
  }

  const handleDelete = () => {
    if (!feedback) {
      setCode(prev => prev.slice(0, -1))
    }
  }

  const handleConfirm = () => {
    if (code.length !== maxDigits || feedback) return

    if (code === correctCode) {
      setFeedback('correct')
      onCorrect()
      setTimeout(() => {
        setShowCelebration(true)
      }, 800)
      setTimeout(() => {
        onComplete()
      }, 3000)
    } else {
      setFeedback('wrong')
      onWrong()
      setShake(true)
      setTimeout(() => {
        setShake(false)
        setFeedback(null)
        setCode('')
      }, 1500)
    }
  }

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'DEL', '0', '✓']

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 overflow-hidden">
      <AnimatedBackground />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
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
            <Star className="w-5 h-5 text-treasure-500" />
            <span className="font-bold text-wood-700">{t('finalTitle')}</span>
          </div>
        </div>

        {/* Main card */}
        <motion.div
          className="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-treasure-400"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          {/* Door/Treasure visual */}
          <motion.div className="text-center mb-6">
            <motion.div
              className="text-6xl md:text-7xl mb-3"
              animate={{ 
                scale: [1, 1.05, 1],
                filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {feedback === 'correct' ? '🚪✨' : '🔒'}
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-wood-800">
              {t('finalTitle')}
            </h2>
          </motion.div>

          {/* Intro text */}
          <motion.p
            className="text-center text-wood-700 mb-4 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t('finalIntro')}
          </motion.p>

          {/* Code hint */}
          <motion.div
            className="bg-wood-100 rounded-2xl p-4 mb-6 border-2 border-wood-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm text-wood-600 mb-2 font-bold">{t('finalCode')}</p>
            <div className="flex justify-center gap-3 mt-3">
              {[1, 2, 3, 4].map(i => (
                <motion.div
                  key={i}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold border-3 ${
                    gameState.keys.includes(i) 
                      ? 'bg-treasure-400 text-white border-treasure-500' 
                      : 'bg-gray-200 text-gray-400 border-gray-300'
                  }`}
                  animate={gameState.keys.includes(i) ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                >
                  {gameState.keys.includes(i) ? correctCode[i - 1] : '?'}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Code display */}
          <motion.div
            className={`flex justify-center gap-3 mb-6 ${shake ? 'animate-shake' : ''}`}
            animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            {[0, 1, 2, 3].map(i => (
              <motion.div
                key={i}
                className={`w-14 h-16 md:w-16 md:h-18 rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-bold border-4 transition-all ${
                  i < code.length
                    ? feedback === 'correct' 
                      ? 'bg-green-100 border-green-500 text-green-700'
                      : feedback === 'wrong'
                        ? 'bg-red-100 border-red-500 text-red-700'
                        : 'bg-ocean-100 border-ocean-400 text-ocean-700'
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 * i, type: "spring" }}
              >
                {code[i] || ''}
              </motion.div>
            ))}
          </motion.div>

          {/* Feedback */}
          <AnimatePresence>
            {feedback === 'correct' && (
              <motion.div
                className="text-center mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <p className="text-2xl font-bold text-green-600">{t('correct')}</p>
                <p className="text-wood-600">{t('treasureFound')}</p>
              </motion.div>
            )}
            {feedback === 'wrong' && (
              <motion.div
                className="text-center mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-lg font-bold text-red-600">{t('wrong')}</p>
                <p className="text-wood-600 text-sm">{t('tryAgain')}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Numeric keypad */}
          <div className="grid grid-cols-3 gap-3">
            {digits.map((digit, index) => {
              const isSpecial = digit === 'DEL' || digit === '✓'

              return (
                <motion.button
                  key={index}
                  onClick={() => {
                    if (digit === 'DEL') handleDelete()
                    else if (digit === '✓') handleConfirm()
                    else handleDigit(digit)
                  }}
                  disabled={!!feedback && digit !== '✓'}
                  className={`py-4 rounded-2xl text-xl md:text-2xl font-bold transition-all border-3 ${
                    isSpecial
                      ? digit === 'DEL'
                        ? 'bg-red-100 border-red-300 text-red-600 hover:bg-red-200'
                        : 'bg-green-100 border-green-300 text-green-600 hover:bg-green-200'
                      : 'bg-white border-wood-200 text-wood-800 hover:bg-ocean-50 hover:border-ocean-300'
                  } ${digit === '✓' && code.length !== maxDigits ? 'opacity-50 cursor-not-allowed' : ''}`}
                  whileHover={!feedback || digit === '✓' ? { scale: 1.05, y: -2 } : {}}
                  whileTap={!feedback || digit === '✓' ? { scale: 0.95 } : {}}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  {digit === 'DEL' ? '⌫' : digit}
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Celebration overlay */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              className="fixed inset-0 z-40 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Confetti */}
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="fixed w-3 h-3 rounded-sm"
                  style={{
                    backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FF8C42'][i % 6],
                    left: `${Math.random() * 100}%`,
                    top: '-10px',
                  }}
                  animate={{
                    y: ['0vh', '100vh'],
                    x: [0, (Math.random() - 0.5) * 200],
                    rotate: [0, 720],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}

              <motion.div
                className="bg-white rounded-3xl p-8 text-center shadow-2xl border-4 border-treasure-400 max-w-sm mx-4 relative z-50"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <motion.div
                  className="text-7xl mb-4"
                  animate={{ y: [0, -20, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  🎉
                </motion.div>
                <h3 className="text-3xl font-bold text-treasure-600 mb-2">{t('congratulations')}</h3>
                <p className="text-wood-700 text-lg">{t('treasureFound')}</p>
                <motion.div
                  className="mt-4 text-5xl"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  💎
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

import { AnimatedBackground } from './AnimatedBackground'
