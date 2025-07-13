'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

// Recent Activity Component
export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'trade',
      user: 'CryptoTrader123',
      action: 'bought YES shares',
      market: 'Bitcoin $100K by 2025',
      amount: 250,
      timestamp: '2 minutes ago',
      icon: '📈',
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'trade',
      user: 'PoliticalPundit',
      action: 'sold NO shares',
      market: 'US Election Prediction',
      amount: 150,
      timestamp: '5 minutes ago',
      icon: '📉',
      color: 'text-red-600'
    },
    {
      id: 3,
      type: 'creation',
      user: 'MarketMaker',
      action: 'created new market',
      market: 'AI AGI by 2030',
      amount: null,
      timestamp: '12 minutes ago',
      icon: '🆕',
      color: 'text-blue-600'
    },
    {
      id: 4,
      type: 'comment',
      user: 'SportsAnalyst',
      action: 'commented on',
      market: 'Man City Premier League',
      amount: null,
      timestamp: '18 minutes ago',
      icon: '💬',
      color: 'text-purple-600'
    },
    {
      id: 5,
      type: 'resolution',
      user: 'System',
      action: 'resolved market',
      market: 'Q4 GDP Growth',
      amount: null,
      timestamp: '1 hour ago',
      icon: '✅',
      color: 'text-emerald-600'
    }
  ]

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
      x: -30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const hoverVariants = {
    scale: 1.02,
    x: 5,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
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
        className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-xl mb-2 flex items-center space-x-2">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                📊
              </motion.span>
              <span>Recent Activity</span>
            </h3>
            <p className="text-purple-100">
              Live feed of market activities and trades
            </p>
          </div>
          <motion.div
            className="w-3 h-3 bg-green-400 rounded-full"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [1, 0.7, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Activity Feed */}
      <motion.div
        className="p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              variants={itemVariants}
              whileHover={hoverVariants}
              className="group"
            >
              <motion.div className="flex items-start space-x-4 p-4 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer">
                {/* Icon */}
                <motion.div
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {activity.icon}
                </motion.div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <motion.span
                      className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      {activity.user}
                    </motion.span>
                    <motion.span
                      className="text-xs text-gray-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                    >
                      {activity.timestamp}
                    </motion.span>
                  </div>
                  
                  <motion.p
                    className="text-sm text-gray-600 mb-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    <span>{activity.action} </span>
                    <Link 
                      href="/markets/1" 
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                    >
                      {activity.market}
                    </Link>
                  </motion.p>
                  
                  {activity.amount && (
                    <motion.div
                      className={`inline-flex items-center space-x-1 text-sm font-semibold ${activity.color}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.6 }}
                    >
                      <span>💰</span>
                      <span>${activity.amount}</span>
                    </motion.div>
                  )}
                </div>

                {/* Arrow indicator */}
                <motion.div
                  className="flex-shrink-0 text-gray-400 group-hover:text-blue-500 transition-colors"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                >
                  →
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-semibold hover:bg-blue-50 px-4 py-2 rounded-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>View All Activity</span>
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
