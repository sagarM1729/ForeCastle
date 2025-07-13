'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { formatDateShort, formatNumber } from '@/utils/dateUtils'

// Featured Markets Component
export default function FeaturedMarkets() {
  const mockMarkets = [
    {
      id: '1',
      title: 'Will Bitcoin reach $100,000 by end of 2025?',
      category: 'Crypto',
      yesPrice: 0.67,
      totalVolume: 50000,
      endDate: '2025-12-31',
      trending: true,
      participants: 1247
    },
    {
      id: '2', 
      title: 'Will the next US President be under 60 years old?',
      category: 'Politics',
      yesPrice: 0.34,
      totalVolume: 125000,
      endDate: '2028-11-07',
      trending: true,
      participants: 892
    },
    {
      id: '3',
      title: 'Will Manchester City win the Premier League 2025?',
      category: 'Sports',
      yesPrice: 0.45,
      totalVolume: 75000,
      endDate: '2025-05-30',
      trending: false,
      participants: 567
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
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
    scale: 1.03,
    y: -8,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }

  const progressVariants = {
    hidden: { width: 0 },
    visible: (yesPrice) => ({
      width: `${yesPrice * 100}%`,
      transition: {
        duration: 1.5,
        delay: 0.5,
        ease: "easeOut"
      }
    })
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Crypto': 'from-orange-500 to-yellow-500',
      'Politics': 'from-red-500 to-pink-500',
      'Sports': 'from-green-500 to-emerald-500',
      'Technology': 'from-purple-500 to-indigo-500'
    }
    return colors[category] || 'from-gray-500 to-gray-600'
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
      >
        {mockMarkets.map((market, index) => (
          <motion.div
            key={market.id}
            variants={cardVariants}
            whileHover={hoverVariants}
            className="group"
          >
            <Link href={`/markets/${market.id}`}>
              <motion.div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 h-full relative overflow-hidden cursor-pointer">
                {/* Gradient Background */}
                <motion.div 
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getCategoryColor(market.category)}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.2 + 0.5, duration: 0.8 }}
                />
                
                {/* Trending Badge */}
                {market.trending && (
                  <motion.div
                    className="absolute top-4 right-4"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: index * 0.2 + 0.8,
                      type: "spring",
                      stiffness: 200 
                    }}
                  >
                    <motion.span
                      className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <span>🔥</span>
                      <span>Hot</span>
                    </motion.span>
                  </motion.div>
                )}

                {/* Category Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 + 0.3 }}
                  className="mb-4"
                >
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${getCategoryColor(market.category)}`}>
                    {market.category}
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h3
                  className="text-lg font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 + 0.4 }}
                >
                  {market.title}
                </motion.h3>

                {/* Price Section */}
                <motion.div
                  className="flex items-center justify-between mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 + 0.5 }}
                >
                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <motion.div 
                      className="text-green-600 font-bold text-xl"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    >
                      {(market.yesPrice * 100).toFixed(0)}¢
                    </motion.div>
                    <div className="text-xs text-gray-500 font-semibold">YES</div>
                  </motion.div>

                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full shadow-sm"
                        variants={progressVariants}
                        custom={market.yesPrice}
                        initial="hidden"
                        animate="visible"
                      />
                    </div>
                    <motion.div
                      className="text-center text-xs text-gray-500 mt-1 font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.2 + 1 }}
                    >
                      {(market.yesPrice * 100).toFixed(0)}% chance
                    </motion.div>
                  </div>

                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <motion.div 
                      className="text-red-600 font-bold text-xl"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 + 0.5 }}
                    >
                      {((1 - market.yesPrice) * 100).toFixed(0)}¢
                    </motion.div>
                    <div className="text-xs text-gray-500 font-semibold">NO</div>
                  </motion.div>
                </motion.div>

                {/* Stats */}
                <motion.div
                  className="flex items-center justify-between text-sm text-gray-500 border-t pt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 + 0.7 }}
                >
                  <motion.span
                    className="flex items-center space-x-1"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span>💰</span>
                    <span className="font-semibold">${formatNumber(market.totalVolume)}</span>
                  </motion.span>
                  
                  <motion.span
                    className="flex items-center space-x-1"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span>👥</span>
                    <span className="font-semibold">{market.participants}</span>
                  </motion.span>
                  
                  <motion.span
                    className="flex items-center space-x-1"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span>📅</span>
                    <span className="font-semibold">{formatDateShort(market.endDate)}</span>
                  </motion.span>
                </motion.div>

                {/* Hover Effect Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* View All Button */}
      <motion.div
        className="text-center mt-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/markets"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <span>🚀</span>
            <span>View All Markets</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
