'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Key, MessageCircle } from 'lucide-react'
import { GameState, Screen, PlayerPosition } from '@/types'
import { getTranslation } from '@/lib/i18n'
import { useState, useEffect, useCallback, useRef } from 'react'

interface WorldScreenProps {
  gameState: GameState
  onNavigate: (screen: Screen) => void
  onBack: () => void
  onUpdatePosition: (pos: PlayerPosition) => void
}

interface NPCData {
  id: string
  emoji: string
  x: number
  y: number
  name: string
  dialogue: string
}

interface ChallengeLoc {
  id: number
  x: number
  y: number
  emoji: string
  name: string
  screen: Screen
  requiresAllKeys?: boolean
}

export function WorldScreen({ gameState, onNavigate, onBack, onUpdatePosition }: WorldScreenProps) {
  const t = (key: any) => getTranslation(gameState.language, key)

  const [playerX, setPlayerX] = useState(gameState.playerPosition?.x ?? 15)
  const [playerY, setPlayerY] = useState(gameState.playerPosition?.y ?? 65)
  const [direction, setDirection] = useState<'left' | 'right'>(gameState.playerPosition?.direction ?? 'right')
  const [isMoving, setIsMoving] = useState(false)
  const [activeNPC, setActiveNPC] = useState<string | null>(null)
  const [showDialogue, setShowDialogue] = useState(false)
  const [dialogueText, setDialogueText] = useState('')
  const [dialogueName, setDialogueName] = useState('')
  const [nearChallenge, setNearChallenge] = useState<ChallengeLoc | null>(null)
  const [showEnterPrompt, setShowEnterPrompt] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const keysPressed = useRef<Set<string>>(new Set())
  const velocityRef = useRef({ x: 0, y: 0 })
  const animFrameRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  // Posiciones de los NPCs (ajusta según tu foto)
  const npcs: NPCData[] = [
    { id: 'pirate', emoji: '👴', x: 12, y: 58, name: t('npcOldPirate'), dialogue: t('npcOldPirateDialogue') },
    { id: 'parrot', emoji: '🧙‍♂️', x: 72, y: 32, name: t('npcWiseParrot'), dialogue: t('npcWiseParrotDialogue') },
    { id: 'guard', emoji: '🛡️', x: 32, y: 48, name: t('npcBridgeGuard'), dialogue: t('npcBridgeGuardDialogue') },
    { id: 'explorer', emoji: '👩‍🔬', x: 82, y: 68, name: t('npcExplorer'), dialogue: t('npcExplorerDialogue') },
  ]

  // Posiciones de los desafíos (ajusta según tu foto)
  const challengeLocations: ChallengeLoc[] = [
    { id: 1, x: 22, y: 42, emoji: '🌉', name: t('challenge1Title'), screen: 'challenge1' },
    { id: 2, x: 48, y: 36, emoji: '🗺️', name: t('challenge2Title'), screen: 'challenge2' },
    { id: 3, x: 58, y: 62, emoji: '💰', name: t('challenge3Title'), screen: 'challenge3' },
    { id: 4, x: 84, y: 52, emoji: '📜', name: t('challenge4Title'), screen: 'challenge4' },
    { id: 5, x: 88, y: 26, emoji: '🚪', name: t('finalTitle'), screen: 'final', requiresAllKeys: true },
  ]

  const savePosition = useCallback(() => {
    onUpdatePosition({ x: playerX, y: playerY, direction })
  }, [playerX, playerY, direction, onUpdatePosition])

  // MOVIMIENTO FLUIDO - LENTO
  useEffect(() => {
    const ACCEL = 0.15
    const MAX_SPEED = 0.45
    const FRICTION = 0.92

    const gameLoop = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimeRef.current) / 16, 3)
      lastTimeRef.current = timestamp

      let ax = 0
      let ay = 0
      let moved = false

      if (keysPressed.current.has('arrowleft') || keysPressed.current.has('a')) {
        ax = -ACCEL
        setDirection('left')
        moved = true
      }
      if (keysPressed.current.has('arrowright') || keysPressed.current.has('d')) {
        ax = ACCEL
        setDirection('right')
        moved = true
      }
      if (keysPressed.current.has('arrowup') || keysPressed.current.has('w')) {
        ay = -ACCEL
        moved = true
      }
      if (keysPressed.current.has('arrowdown') || keysPressed.current.has('s')) {
        ay = ACCEL
        moved = true
      }

      velocityRef.current.x += ax * dt
      velocityRef.current.y += ay * dt

      const speed = Math.sqrt(velocityRef.current.x ** 2 + velocityRef.current.y ** 2)
      if (speed > MAX_SPEED) {
        velocityRef.current.x = (velocityRef.current.x / speed) * MAX_SPEED
        velocityRef.current.y = (velocityRef.current.y / speed) * MAX_SPEED
      }

      if (!moved) {
        velocityRef.current.x *= FRICTION
        velocityRef.current.y *= FRICTION
        if (Math.abs(velocityRef.current.x) < 0.005) velocityRef.current.x = 0
        if (Math.abs(velocityRef.current.y) < 0.005) velocityRef.current.y = 0
      }

      if (Math.abs(velocityRef.current.x) > 0.005 || Math.abs(velocityRef.current.y) > 0.005) {
        setPlayerX(prev => Math.max(3, Math.min(94, prev + velocityRef.current.x * dt)))
        setPlayerY(prev => Math.max(8, Math.min(82, prev + velocityRef.current.y * dt)))
        setIsMoving(true)
      } else {
        setIsMoving(false)
      }

      animFrameRef.current = requestAnimationFrame(gameLoop)
    }

    lastTimeRef.current = performance.now()
    animFrameRef.current = requestAnimationFrame(gameLoop)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      keysPressed.current.add(key)

      if (key === 'enter' && nearChallenge) {
        e.preventDefault()
        const lang = gameState.language
        if (nearChallenge.requiresAllKeys && gameState.keys.length < 4) {
          setDialogueName('🔒')
          setDialogueText(lang === 'es' ? 'Necesitas las 4 llaves para entrar.' : 'You need all 4 keys to enter.')
          setShowDialogue(true)
        } else if (nearChallenge.id <= 4 && gameState.completedChallenges.includes(nearChallenge.id)) {
          setDialogueName('✅')
          setDialogueText(lang === 'es' ? 'Ya completaste este desafío. ¡Sigue adelante!' : 'You already completed this challenge. Keep going!')
          setShowDialogue(true)
        } else {
          savePosition()
          onNavigate(nearChallenge.screen)
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase())
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [nearChallenge, gameState.keys.length, gameState.completedChallenges, onNavigate, savePosition])

  useEffect(() => {
    // Find nearest NPC
    let nearestNPC: NPCData | null = null
    let minNPCDist = Infinity

    for (const npc of npcs) {
      const dist = Math.sqrt(Math.pow(playerX - npc.x, 2) + Math.pow(playerY - npc.y, 2))
      if (dist < 7 && dist < minNPCDist) {
        minNPCDist = dist
        nearestNPC = npc
      }
    }

    if (nearestNPC) {
      if (activeNPC !== nearestNPC.id) {
        setActiveNPC(nearestNPC.id)
        setDialogueName(nearestNPC.name)
        setDialogueText(nearestNPC.dialogue)
        setShowDialogue(true)
      }
    } else {
      setActiveNPC(null)
      setShowDialogue(false)
    }

    // Find nearest challenge
    let nearestChallenge: ChallengeLoc | null = null
    let minChallengeDist = Infinity

    for (const loc of challengeLocations) {
      const dist = Math.sqrt(Math.pow(playerX - loc.x, 2) + Math.pow(playerY - loc.y, 2))
      if (dist < 8 && dist < minChallengeDist) {
        minChallengeDist = dist
        nearestChallenge = loc
      }
    }

    setNearChallenge(nearestChallenge)
    setShowEnterPrompt(!!nearestChallenge)
  }, [playerX, playerY, activeNPC, npcs, challengeLocations])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const targetX = ((touch.clientX - rect.left) / rect.width) * 100
      const targetY = ((touch.clientY - rect.top) / rect.height) * 100

      const dx = targetX - playerX
      const dy = targetY - playerY
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist > 2) {
        velocityRef.current.x = (dx / dist) * 0.3
        velocityRef.current.y = (dy / dist) * 0.3
        setDirection(dx > 0 ? 'right' : 'left')
      }
    }
  }, [playerX, playerY])

  const handleTouchEnd = useCallback(() => {
    velocityRef.current.x = 0
    velocityRef.current.y = 0
    setIsMoving(false)
  }, [])

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="relative z-20 flex items-center justify-between px-4 py-2 bg-wood-800/90 backdrop-blur-sm border-b-2 border-wood-600">
        <motion.button
          onClick={() => { savePosition(); onBack(); }}
          className="flex items-center gap-2 text-amber-100 font-bold hover:text-amber-300 transition-colors text-sm"
          whileHover={{ x: -3 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{t('back')}</span>
        </motion.button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-treasure-400">
            <Key className="w-4 h-4" />
            <span className="font-bold text-sm">{gameState.keys.length}/4</span>
          </div>
          <div className="text-amber-100 text-xs font-bold">
            {gameState.completedChallenges.length}/4
          </div>
        </div>
      </div>

      {/* MAPA CON FOTO DE FONDO */}
      <div 
        ref={containerRef}
        className="relative flex-1 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* === FOTO DE FONDO === */}
        <img 
          src="/assets/island-map.png" 
          alt="Mapa de la Isla"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* === DESAFÍOS - Iconos encima de la foto === */}
        {challengeLocations.map(loc => {
          const isLocked = loc.id === 5 && gameState.keys.length < 4
          const isCompleted = loc.id <= 4 && gameState.completedChallenges.includes(loc.id)
          const isNear = nearChallenge?.id === loc.id

          return (
            <motion.div
              key={loc.id}
              className="absolute z-10"
              style={{ left: `${loc.x}%`, top: `${loc.y}%`, transform: 'translate(-50%, -50%)' }}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: loc.id * 0.3 }}
            >
              <div className={`relative flex flex-col items-center ${isLocked ? 'opacity-50' : ''}`}>
                {/* Sombra en el suelo */}
                <div className="absolute bottom-[-4px] w-10 h-3 bg-black/30 rounded-[50%] blur-[2px]" />

                {/* Icono del desafío */}
                <motion.div
                  className={`text-3xl md:text-4xl relative z-10 ${isCompleted ? 'grayscale opacity-60' : ''}`}
                  animate={isNear && !isCompleted ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  {isLocked ? '🔒' : loc.emoji}
                </motion.div>

                {/* Nombre del desafío */}
                <div className={`mt-1 px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap shadow-md border-2 ${
                  isCompleted 
                    ? 'bg-green-500 text-white border-green-600' 
                    : isLocked 
                      ? 'bg-gray-500 text-white border-gray-600' 
                      : isNear
                        ? 'bg-treasure-400 text-white border-treasure-500 animate-pulse'
                        : 'bg-white/90 text-wood-800 border-wood-300'
                }`}>
                  {isCompleted ? '✓ ' : isLocked ? '🔒 ' : ''}{loc.name}
                </div>

                {/* Llave obtenida */}
                {isCompleted && (
                  <motion.div
                    className="absolute -top-2 -right-2 text-lg z-20"
                    animate={{ scale: [1, 1.3, 1], y: [0, -3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    🔑
                  </motion.div>
                )}

                {/* Indicador "Presiona ENTER" */}
                {isNear && !isCompleted && !isLocked && (
                  <motion.div
                    className="absolute -top-9 left-1/2 -translate-x-1/2 bg-treasure-500 text-white text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap shadow-lg border-2 border-treasure-600"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {gameState.language === 'es' ? 'Presiona ENTER' : 'Press ENTER'}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )
        })}

        {/* === NPCs - Humanos con sombras === */}
        {npcs.map(npc => (
          <motion.div
            key={npc.id}
            className="absolute z-10"
            style={{ left: `${npc.x}%`, top: `${npc.y}%`, transform: 'translate(-50%, -50%)' }}
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: npc.id === 'pirate' ? 0 : npc.id === 'parrot' ? 1 : npc.id === 'guard' ? 2 : 3 }}
          >
            <div className="relative flex flex-col items-center">
              {/* Sombra */}
              <div className="absolute bottom-[-3px] w-8 h-2.5 bg-black/30 rounded-[50%] blur-[2px]" />

              {/* Emoji NPC */}
              <motion.div
                className="text-3xl md:text-4xl relative z-10"
                animate={activeNPC === npc.id ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                {npc.emoji}
              </motion.div>

              {/* Nombre */}
              <div className="mt-0.5 px-1.5 py-0.5 bg-white/90 rounded-md text-[10px] font-bold text-wood-800 whitespace-nowrap shadow-sm border border-wood-200">
                {npc.name}
              </div>

              {/* Indicador de diálogo */}
              {activeNPC === npc.id && (
                <motion.div
                  className="absolute -top-5 z-20"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <MessageCircle className="w-4 h-4 text-treasure-500 fill-treasure-500" />
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}

        {/* === PERSONAJE JUGADOR === */}
        <motion.div
          className="absolute z-20"
          style={{ 
            left: `${playerX}%`, 
            top: `${playerY}%`,
            transform: `translate(-50%, -50%) scaleX(${direction === 'left' ? -1 : 1})`,
          }}
        >
          <div className="relative">
            {/* Sombra del personaje */}
            <div className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-7 h-2.5 bg-black/35 rounded-[50%] blur-[2px]" />

            {/* Emoji personaje */}
            <motion.div
              className="text-3xl md:text-4xl relative z-10"
              animate={isMoving ? { 
                y: [0, -4, 0],
                rotate: direction === 'left' ? [0, -3, 3, 0] : [0, 3, -3, 0]
              } : { 
                y: [0, -1, 0],
              }}
              transition={{ 
                duration: isMoving ? 0.4 : 2.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🧒
            </motion.div>

            {/* Nombre del jugador */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-treasure-400 rounded-full text-[9px] font-bold text-white whitespace-nowrap shadow-sm">
              Explorer
            </div>
          </div>
        </motion.div>

        {/* === CAJA DE DIÁLOGO === */}
        <AnimatePresence>
          {showDialogue && (
            <motion.div
              className="absolute bottom-20 left-3 right-3 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-80 z-30"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
            >
              <div 
                className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border-2 border-treasure-300 relative cursor-pointer"
                onClick={() => setShowDialogue(false)}
              >
                <button 
                  className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-wood-100 hover:bg-wood-200 flex items-center justify-center text-wood-500 text-xs font-bold transition-colors"
                  onClick={(e) => { e.stopPropagation(); setShowDialogue(false); }}
                >
                  ✕
                </button>
                <div className="flex items-start gap-2.5 pr-5">
                  <div className="text-xl flex-shrink-0">💬</div>
                  <div className="min-w-0">
                    <p className="font-bold text-wood-800 text-xs mb-0.5">{dialogueName}</p>
                    <p className="text-wood-600 text-xs leading-relaxed">{dialogueText}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* === CONTROLES === */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1">
          <div className="bg-wood-800/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-amber-100 text-[10px] font-bold shadow-lg">
            {t('moveInstructions')}
          </div>
          {showEnterPrompt && nearChallenge && !gameState.completedChallenges.includes(nearChallenge.id) && !(nearChallenge.requiresAllKeys && gameState.keys.length < 4) && (
            <motion.div
              className="bg-treasure-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg border-2 border-treasure-600"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              {gameState.language === 'es' ? 'Presiona ENTER para entrar' : 'Press ENTER to enter'}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
