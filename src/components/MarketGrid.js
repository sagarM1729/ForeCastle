'use client'

import { motion } from 'framer-motion'
import MarketCard from './MarketCard'

// Market Grid Component
export default function MarketGrid({ markets = [] }) {
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

  const gridVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  if (!markets || markets.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
          className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center"
        >
          <span className="text-white text-xl">🏰</span>
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Markets Found</h3>
        <p className="text-gray-500">Try adjusting your filters or check back later for new markets</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        variants={gridVariants}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {markets.map((market, index) => (
          <MarketCard 
            key={market.id} 
            market={market} 
            index={index}
          />
        ))}
      </motion.div>
    </motion.div>
  )
}

// Loading Spinner Component
export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )
}

// Market Form Component - placeholder
export function MarketForm() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="font-semibold text-lg mb-4">Create Market Form</h3>
      <p className="text-gray-600">To be implemented with form fields</p>
    </div>
  )
}

// Market Details Component - placeholder
export function MarketDetails({ marketId }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="font-semibold text-lg mb-4">Market Details</h3>
      <p className="text-gray-600">Market ID: {marketId}</p>
    </div>
  )
}

// Trading Interface Component - placeholder
export function TradingInterface({ marketId }) {
  return (
    <div className="trading-interface">
      <h3 className="font-semibold text-lg mb-4">Trading Interface</h3>
      <p className="text-gray-600">Market ID: {marketId}</p>
    </div>
  )
}

// Market Chart Component - placeholder
export function MarketChart({ marketId }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="font-semibold text-lg mb-4">Price Chart</h3>
      <p className="text-gray-600">Chart for Market ID: {marketId}</p>
    </div>
  )
}

// Comment Section Component - placeholder
export function CommentSection({ marketId }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="font-semibold text-lg mb-4">Comments & Discussion</h3>
      <p className="text-gray-600">Comments for Market ID: {marketId}</p>
    </div>
  )
}
