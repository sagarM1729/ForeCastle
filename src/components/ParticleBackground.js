'use client'

import { motion } from 'framer-motion'

export default function ParticleBackground() {
  // Generate random particles
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-indigo-400/20 to-purple-400/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [-20, -100],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
      
      {/* Larger floating orbs */}
      {Array.from({ length: 10 }, (_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full bg-gradient-to-r from-pink-400/10 to-yellow-400/10 blur-sm"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 200 + 50}px`,
            height: `${Math.random() * 200 + 50}px`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            scale: [1, Math.random() * 0.5 + 0.5, 1],
          }}
          transition={{
            duration: Math.random() * 30 + 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
