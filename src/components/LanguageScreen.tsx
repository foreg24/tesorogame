'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Flag } from 'lucide-react'
import { GameState, Language } from '@/types'
import { getTranslation } from '@/lib/i18n'

interface LanguageScreenProps {
  gameState: GameState
  onSelectLanguage: (lang: Language) => void
  onBack: () => void
}

export function LanguageScreen({ gameState, onSelectLanguage, onBack }: LanguageScreenProps) {
  const t = (key: any) => getTranslation(gameState.language, key)

  const languages = [
    { code: 'es' as Language, name: 'Español', flag: '🇪🇸', color: 'from-red-400 to-yellow-400' },
    { code: 'en' as Language, name: 'English', flag: '🇬🇧', color: 'from-blue-400 to-red-400' },
  ]

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
      <AnimatedBackground />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-wood-700 font-bold hover:text-wood-900 transition-colors"
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5" />
          {t('back')}
        </motion.button>

        <motion.div
          className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border-4 border-ocean-200"
          initial={{ y: 30 }}
          animate={{ y: 0 }}
        >
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="text-5xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🌍
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-wood-800">
              {t('chooseLanguage')}
            </h2>
          </motion.div>

          <div className="flex flex-col gap-4">
            {languages.map((lang, index) => (
              <motion.button
                key={lang.code}
                onClick={() => onSelectLanguage(lang.code)}
                className={`relative w-full py-5 px-6 rounded-2xl bg-gradient-to-r ${lang.color} text-white font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-300 border-3 border-white/50`}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.15 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="flex items-center justify-center gap-4">
                  <span className="text-3xl">{lang.flag}</span>
                  <span>{lang.name}</span>
                  {gameState.language === lang.code && (
                    <motion.span
                      className="absolute right-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      ✓
                    </motion.span>
                  )}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

import { AnimatedBackground } from './AnimatedBackground'
