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
    <div className="container mx-auto px-6">
      {/* Section Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 text-green-300 rounded-full text-sm font-semibold mb-4">
          📊 Live Statistics
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Platform Overview
          </span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Real-time insights into our growing prediction market ecosystem.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={cardVariants}
            whileHover={{ 
              scale: 1.02,
              y: -8,
              transition: { duration: 0.3 }
            }}
            className="group"
          >
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-2xl hover:shadow-xl transition-all duration-300 p-8 border border-gray-700/50 hover:border-gray-600/70 h-full text-center">
              
              {/* Icon */}
              <motion.div
                className="text-4xl mb-4"
                whileHover={{ 
                  scale: 1.1,
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.4 }
                }}
              >
                {stat.icon}
              </motion.div>

              {/* Value */}
              <motion.div
                className="text-3xl font-bold text-white mb-2"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
              >
                <CountUpNumber value={stat.value} prefix={stat.prefix} />
              </motion.div>

              {/* Label */}
              <div className="text-lg font-semibold text-gray-300 mb-3">
                {stat.label}
              </div>

              {/* Change Indicator */}
              <div className="flex items-center justify-center space-x-1">
                <motion.span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${stat.gradient}`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  📈 {stat.change}
                </motion.span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Additional Info */}
      <motion.div
        className="text-center mt-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <p className="text-gray-300 text-lg">
          📈 Data updates in real-time • 🔒 All transactions are secure • ⚡ Lightning-fast execution
        </p>
      </motion.div>
    </div>
  )
}
