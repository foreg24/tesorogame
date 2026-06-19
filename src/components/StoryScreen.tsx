'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, BookOpen } from 'lucide-react'
import { GameState } from '@/types'
import { getTranslation } from '@/lib/i18n'
import { useState, useEffect } from 'react'

interface StoryScreenProps {
  gameState: GameState
  onStart: () => void
}

export function StoryScreen({ gameState, onStart }: StoryScreenProps) {
  const t = (key: any) => getTranslation(gameState.language, key)
  const [currentScene, setCurrentScene] = useState(0)
  const [showText, setShowText] = useState(false)

  const scenes = [
    { emoji: '🏴‍☠️', text: t('storyText') },
    { emoji: '🗝️', text: gameState.language === 'es' ? 'Necesitarás 4 llaves mágicas para abrir el cofre.' : 'You will need 4 magic keys to open the chest.' },
    { emoji: '🏝️', text: gameState.language === 'es' ? 'La isla está llena de desafíos matemáticos esperándote.' : 'The island is full of math challenges waiting for you.' },
  ]

  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 500)
    return () => clearTimeout(timer)
  }, [currentScene])

  const nextScene = () => {
    if (currentScene < scenes.length - 1) {
      setShowText(false)
      setTimeout(() => {
        setCurrentScene(prev => prev + 1)
      }, 300)
    } else {
      onStart()
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
      <AnimatedBackground />

      <motion.div
        className="relative z-10 w-full max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="bg-gradient-to-b from-wood-700 to-wood-900 rounded-3xl p-8 md:p-12 shadow-2xl border-4 border-treasure-400 relative overflow-hidden"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          {/* Decorative corners */}
          <div className="absolute top-4 left-4 text-treasure-400 text-2xl">✦</div>
          <div className="absolute top-4 right-4 text-treasure-400 text-2xl">✦</div>
          <div className="absolute bottom-4 left-4 text-treasure-400 text-2xl">✦</div>
          <div className="absolute bottom-4 right-4 text-treasure-400 text-2xl">✦</div>

          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <BookOpen className="w-12 h-12 text-treasure-400 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-treasure-300">
              {t('storyTitle')}
            </h2>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentScene}
              className="text-center min-h-[200px] flex flex-col items-center justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="text-6xl md:text-8xl mb-6"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {scenes[currentScene].emoji}
              </motion.div>

              <AnimatePresence>
                {showText && (
                  <motion.p
                    className="text-lg md:text-xl text-amber-100 leading-relaxed max-w-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    {scenes[currentScene].text}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>

          {/* Scene indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {scenes.map((_, i) => (
              <motion.div
                key={i}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i === currentScene ? 'bg-treasure-400' : 'bg-wood-500'
                }`}
                animate={i === currentScene ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              />
            ))}
          </div>

          <motion.button
            onClick={nextScene}
            className="mt-8 w-full py-4 bg-gradient-to-r from-treasure-400 to-treasure-600 text-white text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all border-3 border-treasure-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center justify-center gap-2">
              {currentScene < scenes.length - 1 ? (
                <>
                  {t('next')} <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  {t('startAdventure')} <ArrowRight className="w-5 h-5" />
                </>
              )}
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}

import { AnimatedBackground } from './AnimatedBackground'
