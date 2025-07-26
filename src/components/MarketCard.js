'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { formatDateShort, formatNumber } from '@/utils/dateUtils'

// Market Card Component
export default function MarketCard({ market, index = 0 }) {
  const cardVariants = {
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
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const hoverVariants = {
    scale: 1.02,
    y: -5,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }

  const probabilityVariants = {
    hidden: { width: 0 },
    visible: { 
      width: `${market.probability * 100}%`,
      transition: {
        duration: 1.2,
        delay: (index * 0.1) + 0.3,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={hoverVariants}
      className="block"
    >
      <Link href={`/markets/${market.id}`} className="block group">
        <motion.div className={`market-card ${market.trending ? 'featured' : ''} h-full`}>
          <div className="flex items-start justify-between mb-3">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (index * 0.1) + 0.2 }}
              className={`market-card-category ${
                market.category === 'Crypto' ? 'bg-gradient-to-r from-orange-500 to-yellow-500' :
                market.category === 'Technology' ? 'bg-gradient-to-r from-purple-500 to-indigo-500' :
                market.category === 'Tech' ? 'bg-gradient-to-r from-purple-500 to-indigo-500' :
                market.category === 'Space' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                market.category === 'Politics' ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                market.category === 'Sports' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                market.category === 'Test' ? 'bg-gradient-to-r from-gray-500 to-slate-500' :
                'bg-gradient-to-r from-gray-500 to-gray-600'
              } text-white`}
            >
              {market.category}
            </motion.span>
            {market.trending && (
              <motion.span 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: (index * 0.1) + 0.4,
                  type: "spring",
                  stiffness: 200
                }}
                className="trending-fire text-xl"
              >
                🔥
              </motion.span>
            )}
          </div>

          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: (index * 0.1) + 0.3 }}
            className="market-card-title line-clamp-2"
          >
            {market.title}
          </motion.h3>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: (index * 0.1) + 0.4 }}
            className="text-gray-300 text-sm mb-4 line-clamp-2"
          >
            {market.description}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: (index * 0.1) + 0.5 }}
            className="market-card-price-section"
          >
            <div className="flex items-center justify-between mb-3">
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="market-card-price yes">
                  {(market.yesPrice * 100).toFixed(0)}¢
                </div>
                <div className="text-xs text-gray-400 mt-1">YES</div>
                <div className="text-xs text-emerald-400 font-medium">
                  {(market.probability * 100).toFixed(0)}% chance
                </div>
              </motion.div>
              
              <div className="flex-1 mx-6">
                <div className="market-card-progress">
                  <motion.div 
                    variants={probabilityVariants}
                    initial="hidden"
                    animate="visible"
                    className="market-card-progress-bar"
                    style={{ width: `${market.probability * 100}%` }}
                  ></motion.div>
                </div>
              </div>

              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="market-card-price no">
                  {(market.noPrice * 100).toFixed(0)}¢
                </div>
                <div className="text-xs text-gray-400 mt-1">NO</div>
                <div className="text-xs text-red-400 font-medium">
                  {((1 - market.probability) * 100).toFixed(0)}% chance
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index * 0.1) + 0.6 }}
            className="market-card-stats"
          >
            <div className="market-card-stat">
              <span>💰</span>
              <span>${formatNumber(market.totalVolume)}</span>
            </div>
            <div className="market-card-stat">
              <span>👥</span>
              <span>{market.participants}</span>
            </div>
            <div className="market-card-stat">
              <span>📅</span>
              <span>{formatDateShort(market.endDate)}</span>
            </div>
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

// Trade Modal Component
export function TradeModal() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="font-semibold text-lg mb-4">Trade Modal</h3>
        <p className="text-gray-600">Trading interface modal</p>
      </div>
    </div>
  )
}

// Wallet Button Component
export function WalletButton() {
  return (
    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
      Connect Wallet
    </button>
  )
}

// Admin Panel Component
export function AdminPanel() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="font-semibold text-lg mb-4">Admin Panel</h3>
      <p className="text-gray-600">Administrative controls</p>
    </div>
  )
}
