'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Check, X } from 'lucide-react'
import { GameState } from '@/types'
import { getTranslation } from '@/lib/i18n'

interface ResetModalProps {
  gameState: GameState
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ResetModal({ gameState, isOpen, onConfirm, onCancel }: ResetModalProps) {
  const t = (key: any) => getTranslation(gameState.language, key)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border-4 border-red-300"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="text-center mb-6">
              <motion.div
                className="text-5xl mb-3"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
              </motion.div>
              <h3 className="text-xl md:text-2xl font-bold text-wood-800 mb-2">
                {t('resetProgress')}
              </h3>
              <p className="text-wood-600">
                {t('confirmReset')}
              </p>
            </div>

            <div className="flex gap-3">
              <motion.button
                onClick={onCancel}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors border-2 border-gray-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center justify-center gap-2">
                  <X className="w-5 h-5" />
                  {t('no')}
                </span>
              </motion.button>

              <motion.button
                onClick={onConfirm}
                className="flex-1 py-3 px-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors border-2 border-red-400"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" />
                  {t('yes')}
                </span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
