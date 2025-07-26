'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'

// Modern Hero Component with Beautiful Design
export default function Hero() {
  const [mounted, setMounted] = useState(false)
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, -50])
  const y2 = useTransform(scrollY, [0, 300], [0, -100])
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-5, 5, -5],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  if (!mounted) return null

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Floating Elements */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 blur-xl"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div 
        style={{ y: y2 }}
        className="absolute top-40 right-10 w-32 h-32 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-20 blur-xl"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 1 }}
      />
      <motion.div 
        style={{ y: y1 }}
        className="absolute bottom-40 left-1/4 w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 blur-xl"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 2 }}
      />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />

      {/* Main Content */}
      <motion.div
        className="relative z-10 container mx-auto px-6 py-20 min-h-screen flex items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-white space-y-8">
              {/* Badge */}
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
              >
                <span className="text-sm font-medium">🚀 Next-Gen Prediction Markets</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                variants={itemVariants}
                className="text-5xl md:text-7xl font-bold leading-tight"
              >
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Trade the
                </span>
                <br />
                <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                  Future
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={itemVariants}
                className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl"
              >
                Make predictions on real-world events and earn rewards. From politics to sports, 
                crypto to entertainment - trade your insights with the world.
              </motion.p>

              {/* Feature Points */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-6 text-sm"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-gray-300">Real-time trading</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  <span className="text-gray-300">Crypto payments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  <span className="text-gray-300">Transparent outcomes</span>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="sp">
                    <Link
                      href="/markets"
                      className="sparkle-button primary"
                    >
                      <span className="spark"></span>
                      <span className="backdrop"></span>
                      <svg className="sparkle" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 0L13.09 8.91L22 10L13.09 11.09L12 20L10.91 11.09L2 10L10.91 8.91L12 0Z"/>
                        <path d="M19 4L19.5 6.5L22 7L19.5 7.5L19 10L18.5 7.5L16 7L18.5 6.5L19 4Z"/>
                        <path d="M5 14L5.5 16.5L8 17L5.5 17.5L5 20L4.5 17.5L2 17L4.5 16.5L5 14Z"/>
                      </svg>
                      <span className="text">🎯 Start Trading</span>
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="ml-2"
                      >
                        →
                      </motion.span>
                    </Link>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="sp">
                    <Link
                      href="/markets/create"
                      className="sparkle-button secondary"
                    >
                      <span className="spark"></span>
                      <span className="backdrop"></span>
                      <svg className="sparkle" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 0L13.09 8.91L22 10L13.09 11.09L12 20L10.91 11.09L2 10L10.91 8.91L12 0Z"/>
                        <path d="M19 4L19.5 6.5L22 7L19.5 7.5L19 10L18.5 7.5L16 7L18.5 6.5L19 4Z"/>
                        <path d="M5 14L5.5 16.5L8 17L5.5 17.5L5 20L4.5 17.5L2 17L4.5 16.5L5 14Z"/>
                      </svg>
                      <span className="text">✨ Create Market</span>
                    </Link>
                  </div>
                </motion.div>
              </motion.div>

              {/* Social Proof */}
              <motion.div
                variants={itemVariants}
                className="flex items-center space-x-8 pt-8"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">10K+</div>
                  <div className="text-sm text-gray-400">Active Traders</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">$2.5M</div>
                  <div className="text-sm text-gray-400">Total Volume</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-sm text-gray-400">Markets</div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Visual Elements */}
            <div className="relative">
              {/* Main Visual Container */}
              <motion.div
                variants={itemVariants}
                className="relative"
              >
                {/* Glowing Card Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl" />
                
                {/* Main Card */}
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                  {/* Mock Trading Interface */}
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold">🏛️ 2024 Elections</h3>
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                        Live
                      </span>
                    </div>

                    {/* Question */}
                    <h4 className="text-lg text-white font-medium">
                      Will the next US President be under 60?
                    </h4>

                    {/* Options */}
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 cursor-pointer"
                      >
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-300">34¢</div>
                          <div className="text-green-200 text-sm">YES</div>
                          <div className="text-xs text-green-400 mt-1">34% chance</div>
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 cursor-pointer"
                      >
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-300">66¢</div>
                          <div className="text-red-200 text-sm">NO</div>
                          <div className="text-xs text-red-400 mt-1">66% chance</div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between text-sm text-gray-300">
                      <span>💰 $125K Volume</span>
                      <span>👥 892 Traders</span>
                    </div>
                  </div>
                </div>

                {/* Floating Elements Around Card */}
                <motion.div
                  animate={{ 
                    y: [-5, 5, -5],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 shadow-2xl"
                >
                  <div className="text-2xl">🎯</div>
                </motion.div>

                <motion.div
                  animate={{ 
                    y: [5, -5, 5],
                    rotate: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-4 shadow-2xl"
                >
                  <div className="text-2xl">📈</div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-white/60 cursor-pointer"
        >
          <span className="text-sm mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
