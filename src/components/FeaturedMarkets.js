'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { formatDateShort, formatNumber } from '@/utils/dateUtils'
import { useState, useEffect } from 'react'
import LoadingState from './LoadingState'

export default function FeaturedMarkets() {
  const [markets, setMarkets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchFeaturedMarkets()
  }, [])

  const fetchFeaturedMarkets = async () => {
    try {
      const response = await fetch('/api/markets?sort=volume&order=desc&limit=6')
      const data = await response.json()
      
      if (data.success) {
        setMarkets(data.data)
      } else {
        setError(data.error)
      }
    } catch (error) {
      console.error('Error fetching markets:', error)
      setError('Failed to load markets')
    } finally {
      setLoading(false)
    }
  }

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

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.95
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

  const getCategoryGradient = (category) => {
    const gradients = {
      'Crypto': 'from-orange-500 to-yellow-500',
      'Politics': 'from-red-500 to-pink-500', 
      'Sports': 'from-green-500 to-emerald-500',
      'Technology': 'from-purple-500 to-indigo-500',
      'Finance': 'from-blue-500 to-cyan-500',
      'Entertainment': 'from-pink-500 to-purple-500',
      'Test': 'from-gray-500 to-gray-600'
    }
    return gradients[category] || 'from-blue-500 to-indigo-500'
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <LoadingState message="Loading Featured Markets" size="medium" />
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.div 
          className="text-8xl mb-6"
          animate={{ 
            rotate: [0, -10, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          😔
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h3>
        <p className="text-gray-300 mb-8 text-lg max-w-md mx-auto">{error}</p>
        <motion.button
          onClick={fetchFeaturedMarkets}
          className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl font-semibold text-white shadow-2xl hover:shadow-orange-500/25 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="mr-2">🔄</span>
          Try Again
        </motion.button>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="markets-grid"
    >
      {markets.map((market, index) => (
        <motion.div
          key={market.id}
          variants={cardVariants}
          whileHover={{ 
            scale: 1.02,
            y: -8,
            transition: { duration: 0.3 }
          }}
          className="group"
        >
          <Link href={`/markets/${market.id}`} className="block">
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-2xl hover:shadow-xl border border-gray-700/50 hover:border-gray-600/70 transition-all duration-300 p-6 h-full">
              
              {/* Hot Badge for High Volume Markets */}
              {market.totalVolume > 1000 && (
                <motion.div
                  className="absolute top-4 right-4 z-10"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.5, type: "spring", stiffness: 200 }}
                >
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                    <span>🔥</span>
                    <span>HOT</span>
                  </div>
                </motion.div>
              )}

              {/* Category Badge */}
              <div className="mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${getCategoryGradient(market.category)}`}>
                  {market.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-white mb-4 leading-tight">
                {market.title.length > 80 ? `${market.title.substring(0, 80)}...` : market.title}
              </h3>

              {/* Price Section */}
              <div className="flex gap-3 mb-6">
                <div className="flex-1 text-center p-4 bg-green-500/20 backdrop-blur-sm rounded-lg border border-green-500/30 group-hover:bg-green-500/30 group-hover:border-green-400/50 transition-colors duration-300">
                  <div className="text-2xl font-bold text-white mb-1">
                    {(market.yesPrice * 100).toFixed(0)}¢
                  </div>
                  <div className="text-sm font-medium text-green-300 mb-1">YES</div>
                  <div className="text-xs text-gray-300">
                    {(market.yesPrice * 100).toFixed(0)}% chance
                  </div>
                </div>

                <div className="flex-1 text-center p-4 bg-red-500/20 backdrop-blur-sm rounded-lg border border-red-500/30 group-hover:bg-red-500/30 group-hover:border-red-400/50 transition-colors duration-300">
                  <div className="text-2xl font-bold text-white mb-1">
                    {((1 - market.yesPrice) * 100).toFixed(0)}¢
                  </div>
                  <div className="text-sm font-medium text-red-300 mb-1">NO</div>
                  <div className="text-xs text-gray-300">
                    {((1 - market.yesPrice) * 100).toFixed(0)}% chance
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-300 border-t border-white/20 pt-4">
                <div className="flex items-center space-x-1">
                  <span>💰</span>
                  <span className="font-medium">
                    ${isNaN(market.totalVolume) ? '0' : formatNumber(market.totalVolume || 0)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <span>👥</span>
                  <span className="font-medium">{market.participants || 0}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <span>📅</span>
                  <span className="font-medium">{formatDateShort(market.endDate || market.end_date)}</span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
