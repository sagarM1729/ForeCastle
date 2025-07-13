'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

// Market Details Component
export default function MarketDetails({ marketId, market }) {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'activity', label: '📈 Activity', icon: '📈' },
    { id: 'rules', label: '📋 Rules', icon: '📋' },
    { id: 'comments', label: '💬 Discussion', icon: '💬' }
  ]

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    }
  }

  const tabContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 }
    }
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white"
        variants={itemVariants}
      >
        <h3 className="font-bold text-xl mb-2">🔍 Market Details</h3>
        <p className="text-blue-100">
          Comprehensive information and analytics for this prediction market
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="flex border-b border-gray-200 bg-gray-50"
        variants={itemVariants}
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center justify-center space-x-2">
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label.split(' ')[1]}</span>
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Content */}
      <motion.div
        className="p-6"
        key={activeTab}
        variants={tabContentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {activeTab === 'overview' && (
          <motion.div className="space-y-6">
            <motion.div variants={itemVariants}>
              <h4 className="font-semibold text-lg mb-3 flex items-center space-x-2">
                <span>🎯</span>
                <span>Market Overview</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Market ID</div>
                  <div className="font-semibold">{marketId}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Status</div>
                  <div className="font-semibold text-green-600">🟢 Active</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Created</div>
                  <div className="font-semibold">2024-01-15</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Resolution Date</div>
                  <div className="font-semibold">{market?.endDate || '2025-12-31'}</div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h4 className="font-semibold text-lg mb-3 flex items-center space-x-2">
                <span>📊</span>
                <span>Key Metrics</span>
              </h4>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                  className="text-center p-4 bg-blue-50 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl font-bold text-blue-600">{market?.probability * 100 || 68}%</div>
                  <div className="text-sm text-blue-700">Current Probability</div>
                </motion.div>
                <motion.div
                  className="text-center p-4 bg-green-50 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl font-bold text-green-600">${market?.totalVolume?.toLocaleString() || '2.5M'}</div>
                  <div className="text-sm text-green-700">Total Volume</div>
                </motion.div>
                <motion.div
                  className="text-center p-4 bg-purple-50 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl font-bold text-purple-600">{market?.participants?.toLocaleString() || '1,247'}</div>
                  <div className="text-sm text-purple-700">Participants</div>
                </motion.div>
                <motion.div
                  className="text-center p-4 bg-orange-50 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl font-bold text-orange-600">A+</div>
                  <div className="text-sm text-orange-700">Liquidity Score</div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'activity' && (
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-lg mb-4 flex items-center space-x-2">
              <span>📈</span>
              <span>Recent Activity</span>
            </h4>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm">👤</span>
                    </div>
                    <div>
                      <div className="font-medium">User bought YES shares</div>
                      <div className="text-sm text-gray-500">2 hours ago</div>
                    </div>
                  </div>
                  <div className="text-green-600 font-semibold">+$250</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'rules' && (
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-lg mb-4 flex items-center space-x-2">
              <span>📋</span>
              <span>Resolution Rules</span>
            </h4>
            <div className="prose max-w-none">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Resolution Criteria:</strong> This market will resolve based on official data and reliable sources.
                    </p>
                  </div>
                </div>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">✅</span>
                  <span>Market resolves YES if conditions are met by the specified date</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">❌</span>
                  <span>Market resolves NO if conditions are not met</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-gray-500 mt-1">⏱️</span>
                  <span>Resolution will occur within 48 hours of the end date</span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}

        {activeTab === 'comments' && (
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-lg mb-4 flex items-center space-x-2">
              <span>💬</span>
              <span>Discussion</span>
            </h4>
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">💬</div>
              <p>Discussion feature coming soon!</p>
              <p className="text-sm">Connect with other traders and share insights.</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
