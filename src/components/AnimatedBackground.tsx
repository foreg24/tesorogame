'use client'

import { motion } from 'framer-motion'

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-ocean-100" />

      {/* Sun */}
      <motion.div
        className="absolute top-8 right-12 w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 shadow-[0_0_60px_rgba(255,200,0,0.5)]"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Clouds */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white/80 rounded-full blur-sm"
          style={{
            width: `${80 + i * 30}px`,
            height: `${30 + i * 10}px`,
            top: `${10 + i * 15}%`,
            left: `${-10 + i * 25}%`,
          }}
          animate={{ x: ['0%', '120%'] }}
          transition={{ 
            duration: 20 + i * 5, 
            repeat: Infinity, 
            ease: "linear",
            delay: i * 3
          }}
        />
      ))}

      {/* Palm trees silhouettes */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`palm-${i}`}
          className="absolute bottom-0"
          style={{
            left: `${10 + i * 35}%`,
            transformOrigin: 'bottom center',
          }}
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="80" height="120" viewBox="0 0 80 120" fill="none" className="opacity-60">
            <path d="M40 120 L40 40" stroke="#2e7d32" strokeWidth="8" strokeLinecap="round"/>
            <path d="M40 40 Q20 20 10 30" stroke="#388e3c" strokeWidth="4" fill="none" strokeLinecap="round"/>
            <path d="M40 40 Q60 20 70 30" stroke="#388e3c" strokeWidth="4" fill="none" strokeLinecap="round"/>
            <path d="M40 35 Q25 15 15 20" stroke="#4caf50" strokeWidth="4" fill="none" strokeLinecap="round"/>
            <path d="M40 35 Q55 15 65 20" stroke="#4caf50" strokeWidth="4" fill="none" strokeLinecap="round"/>
            <path d="M40 30 Q30 10 20 15" stroke="#66bb6a" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <path d="M40 30 Q50 10 60 15" stroke="#66bb6a" strokeWidth="3" fill="none" strokeLinecap="round"/>
          </svg>
        </motion.div>
      ))}

      {/* Ocean waves at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
        <svg className="absolute bottom-0 w-[200%] h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <motion.path
            fill="#4dd0e1"
            fillOpacity="0.6"
            d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,149.3C672,149,768,203,864,224C960,245,1056,235,1152,208C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            fill="#00bcd4"
            fillOpacity="0.4"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            animate={{ x: ['-50%', '0%'] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>

      {/* Sparkles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-2 h-2 bg-yellow-300 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 80}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-treasure-300 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  )
}
