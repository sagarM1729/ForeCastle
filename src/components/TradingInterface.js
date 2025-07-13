'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Trading Interface Component
export default function TradingInterface({ market }) {
  const [activeTab, setActiveTab] = useState('YES')
  const [amount, setAmount] = useState('')
  const [shares, setShares] = useState('')
  
  // Use market data or fallback to marketId-based data
  const marketData = market || {
    id: 'unknown',
    yesPrice: 0.50,
    noPrice: 0.50,
    probability: 0.50,
    title: 'Unknown Market'
  }
  
  const currentPrice = activeTab === 'YES' ? marketData.yesPrice : marketData.noPrice
  const estimatedShares = amount ? Math.floor(parseFloat(amount) / currentPrice) : 0
  const estimatedPayout = shares ? (parseFloat(shares) * 1.00).toFixed(2) : '0.00'
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="bg-white rounded-lg shadow-sm border p-6"
    >
      <motion.h3 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-bold text-xl mb-6"
      >
        💰 Trade
      </motion.h3>
      
      {/* Tab Selection */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-2 mb-6"
      >
        <motion.button 
          onClick={() => setActiveTab('YES')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`py-3 px-4 rounded-lg font-semibold transition-colors ${
            activeTab === 'YES' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <div className="text-center">
            <div>YES</div>
            <div className="text-sm opacity-90">
              {(marketData.yesPrice * 100).toFixed(0)}¢
            </div>
          </div>
        </motion.button>
        <motion.button 
          onClick={() => setActiveTab('NO')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`py-3 px-4 rounded-lg font-semibold transition-colors ${
            activeTab === 'NO' 
              ? 'bg-red-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <div className="text-center">
            <div>NO</div>
            <div className="text-sm opacity-90">
              {(marketData.noPrice * 100).toFixed(0)}¢
            </div>
          </div>
        </motion.button>
      </motion.div>
      
      {/* Current Selection Info */}
      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, x: activeTab === 'YES' ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-50 rounded-lg p-4 mb-6"
      >
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            Buying {activeTab} shares
          </div>
          <div className="text-sm text-gray-600">
            {activeTab === 'YES' ? 
              `${(marketData.probability * 100).toFixed(0)}% chance of winning` :
              `${((1 - marketData.probability) * 100).toFixed(0)}% chance of winning`
            }
          </div>
        </div>
      </motion.div>
      
      {/* Amount Input */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-4 mb-6"
      >
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Amount to spend ($)
          </label>
          <motion.input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            whileFocus={{ scale: 1.02 }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
        
        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {[10, 25, 50, 100].map((value, index) => (
            <motion.button
              key={value}
              onClick={() => setAmount(value.toString())}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + (index * 0.1) }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded text-sm font-semibold transition-colors"
            >
              ${value}
            </motion.button>
          ))}
        </div>
      </motion.div>
      
      {/* Trade Summary */}
      <AnimatePresence>
        {amount && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-blue-50 rounded-lg p-4 mb-6 space-y-2 overflow-hidden"
          >
            <motion.div 
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="flex justify-between text-sm"
            >
              <span className="text-gray-600">Shares you'll get:</span>
              <span className="font-semibold">{estimatedShares}</span>
            </motion.div>
            <motion.div 
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex justify-between text-sm"
            >
              <span className="text-gray-600">Price per share:</span>
              <span className="font-semibold">{(currentPrice * 100).toFixed(0)}¢</span>
            </motion.div>
            <motion.div 
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-between text-sm"
            >
              <span className="text-gray-600">Max payout:</span>
              <span className="font-semibold text-green-600">${(estimatedShares * 1.00).toFixed(2)}</span>
            </motion.div>
            <motion.div 
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-between text-sm"
            >
              <span className="text-gray-600">Potential profit:</span>
              <span className="font-semibold text-green-600">
                ${(estimatedShares * 1.00 - parseFloat(amount || 0)).toFixed(2)}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Trade Button */}
      <motion.button 
        whileHover={amount && parseFloat(amount) > 0 ? { scale: 1.02 } : {}}
        whileTap={amount && parseFloat(amount) > 0 ? { scale: 0.98 } : {}}
        className={`w-full py-4 rounded-lg font-semibold text-white transition-colors ${
          amount && parseFloat(amount) > 0
            ? activeTab === 'YES'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-red-600 hover:bg-red-700'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
        disabled={!amount || parseFloat(amount) <= 0}
      >
        {amount && parseFloat(amount) > 0 
          ? `Buy ${activeTab} for $${amount}`
          : 'Enter amount to trade'
        }
      </motion.button>
      
      {/* Wallet Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 pt-4 border-t text-center"
      >
        <div className="text-sm text-gray-600 mb-2">Your Balance</div>
        <motion.div 
          className="font-bold text-lg"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          $1,250.00
        </motion.div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-blue-600 hover:text-blue-800 text-sm font-semibold mt-1"
        >
          Add Funds
        </motion.button>
      </motion.div>
      
      {/* Connect Wallet CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
      >
        <div className="text-center">
          <div className="text-sm text-yellow-800 mb-2">
            Connect your wallet to start trading
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-yellow-600 text-white px-4 py-2 rounded font-semibold text-sm hover:bg-yellow-700 transition-colors"
          >
            Connect Wallet
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
