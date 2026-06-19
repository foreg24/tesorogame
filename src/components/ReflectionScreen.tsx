'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Heart, Brain, Compass, Lightbulb, Sparkles } from 'lucide-react'
import { GameState } from '@/types'
import { getTranslation } from '@/lib/i18n'

interface ReflectionScreenProps {
  gameState: GameState
  onBack: () => void
}

export function ReflectionScreen({ gameState, onBack }: ReflectionScreenProps) {
  const t = (key: any) => getTranslation(gameState.language, key)

  const skills = [
    { icon: Brain, name: gameState.language === 'es' ? 'Razonamiento' : 'Reasoning', color: 'bg-purple-100 text-purple-700' },
    { icon: Compass, name: gameState.language === 'es' ? 'Comparación' : 'Comparison', color: 'bg-blue-100 text-blue-700' },
    { icon: Lightbulb, name: gameState.language === 'es' ? 'Estimación' : 'Estimation', color: 'bg-yellow-100 text-yellow-700' },
    { icon: Sparkles, name: gameState.language === 'es' ? 'Reflexión' : 'Reflection', color: 'bg-green-100 text-green-700' },
    { icon: Heart, name: gameState.language === 'es' ? 'Resolución de Problemas' : 'Problem Solving', color: 'bg-red-100 text-red-700' },
  ]

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 overflow-hidden">
      <AnimatedBackground />

      <motion.div
        className="relative z-10 w-full max-w-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-wood-700 font-bold hover:text-wood-900 transition-colors bg-white/80 px-3 py-2 rounded-xl"
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5" />
          {t('back')}
        </motion.button>

        <motion.div
          className="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-treasure-400"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="text-6xl md:text-7xl mb-4"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🎓
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-wood-800">
              {t('reflectionTitle')}
            </h2>
          </motion.div>

          {/* Main reflection text */}
          <motion.div
            className="bg-gradient-to-r from-ocean-50 to-treasure-50 rounded-2xl p-6 mb-8 border-2 border-ocean-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-lg md:text-xl text-wood-700 leading-relaxed text-center font-medium">
              {t('reflectionText')}
            </p>
          </motion.div>

          {/* Skills learned */}
          <motion.div className="mb-6">
            <h3 className="text-center text-lg font-bold text-wood-800 mb-4">
              {gameState.language === 'es' ? 'Habilidades que usaste:' : 'Skills you used:'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  className={`${skill.color} rounded-2xl p-4 text-center border-2 border-white/50`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <skill.icon className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-bold text-sm">{skill.name}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Encouragement */}
          <motion.div
            className="text-center bg-treasure-100 rounded-2xl p-6 border-2 border-treasure-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.div
              className="text-4xl mb-3"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⭐
            </motion.div>
            <p className="text-lg font-bold text-treasure-800">
              {t('reflectionSubtext')}
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

import { AnimatedBackground } from './AnimatedBackground'
