'use client'

import { motion } from 'framer-motion'

// Loading Spinner Component
export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  return (
    <motion.div
      className="flex flex-col justify-center items-center py-12"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Spinner */}
      <motion.div
        className={`relative ${sizeClasses[size]}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        {/* Outer Ring */}
        <motion.div
          className={`absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 ${sizeClasses[size]}`}
          style={{ mask: 'linear-gradient(transparent 50%, black 50%)' }}
        />
        
        {/* Inner Ring */}
        <motion.div
          className={`absolute inset-2 rounded-full border-2 border-transparent bg-gradient-to-r from-purple-500 to-pink-500 ${sizeClasses[size].replace('h-', 'h-').replace('w-', 'w-')}`}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          style={{ mask: 'linear-gradient(transparent 30%, black 30%)' }}
        />
        
        {/* Center Dot */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </motion.div>

      {/* Loading Text */}
      <motion.div
        className={`mt-4 ${textSizes[size]} font-semibold text-gray-600 text-center`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.span
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.span>
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              left: Math.cos(i * 60 * Math.PI / 180) * 40,
              top: Math.sin(i * 60 * Math.PI / 180) * 40,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}
