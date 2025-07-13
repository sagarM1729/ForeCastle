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
        <motion.div className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-shadow p-6 h-full overflow-hidden">
          <div className="flex items-start justify-between mb-3">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (index * 0.1) + 0.2 }}
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                market.category === 'Crypto' ? 'bg-orange-100 text-orange-600' :
                market.category === 'Technology' ? 'bg-purple-100 text-purple-600' :
                market.category === 'Space' ? 'bg-blue-100 text-blue-600' :
                market.category === 'Politics' ? 'bg-red-100 text-red-600' :
                market.category === 'Sports' ? 'bg-green-100 text-green-600' :
                'bg-gray-100 text-gray-600'
              }`}
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
                className="text-red-500 text-sm"
              >
                🔥
              </motion.span>
            )}
          </div>

          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: (index * 0.1) + 0.3 }}
            className="font-semibold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2"
          >
            {market.title}
          </motion.h3>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: (index * 0.1) + 0.4 }}
            className="text-gray-600 text-sm mb-4 line-clamp-2"
          >
            {market.description}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: (index * 0.1) + 0.5 }}
            className="flex items-center justify-between mb-4"
          >
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-green-600 font-bold text-lg">
                {(market.yesPrice * 100).toFixed(0)}¢
              </div>
              <div className="text-xs text-gray-500">YES</div>
            </motion.div>
            
            <div className="flex-1 mx-4">
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div 
                  variants={probabilityVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-green-500 h-2 rounded-full"
                ></motion.div>
              </div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: (index * 0.1) + 0.8 }}
                className="text-center text-xs text-gray-500 mt-1"
              >
                {(market.probability * 100).toFixed(0)}% chance
              </motion.div>
            </div>

            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-red-600 font-bold text-lg">
                {(market.noPrice * 100).toFixed(0)}¢
              </div>
              <div className="text-xs text-gray-500">NO</div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index * 0.1) + 0.6 }}
            className="flex items-center justify-between text-sm text-gray-500 border-t pt-3"
          >
            <span>💰 ${formatNumber(market.totalVolume)}</span>
            <span>👥 {market.participants}</span>
            <span>📅 {formatDateShort(market.endDate)}</span>
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
