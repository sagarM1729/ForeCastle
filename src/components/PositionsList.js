'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

// Positions List Component
export default function PositionsList() {
  const positions = [
    {
      id: 1,
      marketTitle: 'Bitcoin $100K by 2025',
      position: 'YES',
      shares: 150,
      avgPrice: 0.68,
      currentPrice: 0.72,
      value: 108,
      pnl: 6,
      pnlPercent: 5.9,
      category: 'Crypto'
    },
    {
      id: 2,
      marketTitle: 'AI AGI by 2030',
      position: 'NO',
      shares: 200,
      avgPrice: 0.65,
      currentPrice: 0.58,
      value: 116,
      pnl: 14,
      pnlPercent: 10.8,
      category: 'Technology'
    },
    {
      id: 3,
      marketTitle: 'Man City Premier League 2025',
      position: 'YES',
      shares: 75,
      avgPrice: 0.48,
      currentPrice: 0.45,
      value: 33.75,
      pnl: -2.25,
      pnlPercent: -6.3,
      category: 'Sports'
    }
  ]

  const totalValue = positions.reduce((sum, pos) => sum + pos.value, 0)
  const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const hoverVariants = {
    scale: 1.02,
    y: -2,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Crypto': 'from-orange-500 to-yellow-500',
      'Technology': 'from-purple-500 to-indigo-500',
      'Sports': 'from-green-500 to-emerald-500',
      'Politics': 'from-red-500 to-pink-500'
    }
    return colors[category] || 'from-gray-500 to-gray-600'
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-xl mb-2 flex items-center space-x-2">
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                💼
              </motion.span>
              <span>My Positions</span>
            </h3>
            <p className="text-blue-100">
              Track your active positions and performance
            </p>
          </div>
          <motion.div
            className="text-right"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <div className={`text-sm ${totalPnL >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)} Total P&L
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Positions List */}
      <motion.div
        className="p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {positions.length > 0 ? (
          <div className="space-y-4">
            {positions.map((position, index) => (
              <motion.div
                key={position.id}
                variants={itemVariants}
                whileHover={hoverVariants}
                className="group"
              >
                <Link href={`/markets/${position.id}`}>
                  <motion.div className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <motion.span
                          className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getCategoryColor(position.category)}`}
                          whileHover={{ scale: 1.1 }}
                        >
                          {position.category}
                        </motion.span>
                        <motion.span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            position.position === 'YES' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}
                          whileHover={{ scale: 1.1 }}
                        >
                          {position.position}
                        </motion.span>
                      </div>
                      <motion.div
                        className={`text-right ${position.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="font-bold">
                          {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                        </div>
                        <div className="text-xs">
                          ({position.pnl >= 0 ? '+' : ''}{position.pnlPercent.toFixed(1)}%)
                        </div>
                      </motion.div>
                    </div>

                    {/* Market Title */}
                    <motion.h4
                      className="font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      {position.marketTitle}
                    </motion.h4>

                    {/* Position Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.4 }}
                      >
                        <div className="text-gray-500">Shares</div>
                        <div className="font-semibold">{position.shares}</div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                      >
                        <div className="text-gray-500">Avg Price</div>
                        <div className="font-semibold">{(position.avgPrice * 100).toFixed(0)}¢</div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.6 }}
                      >
                        <div className="text-gray-500">Current Price</div>
                        <div className="font-semibold">{(position.currentPrice * 100).toFixed(0)}¢</div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.7 }}
                      >
                        <div className="text-gray-500">Value</div>
                        <div className="font-semibold">${position.value.toFixed(2)}</div>
                      </motion.div>
                    </div>

                    {/* Progress Bar */}
                    <motion.div
                      className="mt-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.8 }}
                    >
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Performance</span>
                        <span>{position.pnlPercent >= 0 ? '📈' : '📉'}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full ${
                            position.pnl >= 0 ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(Math.abs(position.pnlPercent) * 2, 100)}%` }}
                          transition={{ delay: index * 0.1 + 1, duration: 1 }}
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              💼
            </motion.div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">No Positions Yet</h4>
            <p className="text-gray-600 mb-6">Start trading to see your positions here</p>
            <motion.button
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Markets
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
