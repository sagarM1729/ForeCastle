'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

// Trading Stats Component
export default function TradingStats() {
  const [isVisible, setIsVisible] = useState(false)
  
  const stats = [
    { 
      label: 'Total Volume', 
      value: '2.4M', 
      change: '+12.5%',
      icon: '💰',
      gradient: 'from-green-500 to-emerald-500',
      prefix: '$'
    },
    { 
      label: 'Active Markets', 
      value: '1,247', 
      change: '+8.2%',
      icon: '📊',
      gradient: 'from-blue-500 to-cyan-500',
      prefix: ''
    },
    { 
      label: 'Total Traders', 
      value: '15,432', 
      change: '+15.7%',
      icon: '👥',
      gradient: 'from-purple-500 to-indigo-500',
      prefix: ''
    },
    { 
      label: 'Markets Resolved', 
      value: '3,891', 
      change: '+5.3%',
      icon: '✅',
      gradient: 'from-orange-500 to-yellow-500',
      prefix: ''
    }
  ]

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const hoverVariants = {
    scale: 1.05,
    y: -10,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }

  const CountUpNumber = ({ value, prefix = '', duration = 2 }) => {
    const [count, setCount] = useState(0)
    
    useEffect(() => {
      if (!isVisible) return
      
      const numericValue = parseInt(value.replace(/[^0-9]/g, ''))
      let startTime = null
      
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
        
        setCount(Math.floor(numericValue * progress))
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      requestAnimationFrame(animate)
    }, [isVisible, value, duration])
    
    return (
      <span>
        {prefix}{count.toLocaleString()}
        {value.includes('M') ? 'M' : ''}
        {value.includes('K') ? 'K' : ''}
      </span>
    )
  }

  return (
    <motion.div
      className="container mx-auto px-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={cardVariants}
            whileHover={hoverVariants}
            className="group"
          >
            <motion.div className="relative overflow-hidden bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center cursor-pointer">
              {/* Gradient Background */}
              <motion.div 
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.2 + 0.5, duration: 0.8 }}
              />
              
              {/* Icon */}
              <motion.div
                className="text-3xl mb-3"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.5
                }}
              >
                {stat.icon}
              </motion.div>
              
              {/* Value */}
              <motion.h3
                className={`text-4xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 + 0.3, duration: 0.6 }}
              >
                <CountUpNumber value={stat.value} prefix={stat.prefix} duration={2 + index * 0.5} />
              </motion.h3>
              
              {/* Label */}
              <motion.p
                className="text-gray-600 mb-3 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 + 0.4 }}
              >
                {stat.label}
              </motion.p>
              
              {/* Change */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 + 0.6 }}
                className="inline-flex items-center space-x-1"
              >
                <motion.span
                  className="text-green-600 text-sm font-semibold flex items-center space-x-1"
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.span
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ↗️
                  </motion.span>
                  <span>{stat.change}</span>
                </motion.span>
              </motion.div>

              {/* Hover Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${stat.gradient.replace('from-', '').replace(' to-', ', ')})`,
                  filter: 'blur(20px)',
                  transform: 'scale(1.1)',
                  zIndex: -1
                }}
              />
              
              {/* Sparkle Effects */}
              <motion.div
                className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100"
                animate={{ 
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3
                }}
              />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
