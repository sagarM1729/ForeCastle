'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWallet } from '@/context/WalletContext'
import Loader from './Loader'

// Trading Interface Component
export default function TradingInterface({ market }) {
  const [activeTab, setActiveTab] = useState('YES')
  const [amount, setAmount] = useState('')
  const [shares, setShares] = useState('')
  const [loading, setLoading] = useState(false)
  const [ethBalance, setEthBalance] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [priceQuote, setPriceQuote] = useState(null)
  const [quoteLoading, setQuoteLoading] = useState(false)
  
  const { isConnected, address, getBalance, connect } = useWallet()
  
  // Use market data or fallback to marketId-based data
  const marketData = market || {
    id: 'unknown',
    yesPrice: 0.50,
    noPrice: 0.50,
    probability: 0.50,
    title: 'Unknown Market'
  }
  
  const currentPrice = priceQuote ? priceQuote.price : (activeTab === 'YES' ? marketData.yesPrice : marketData.noPrice)
  const estimatedShares = priceQuote ? priceQuote.shares : (amount ? Math.floor(parseFloat(amount) / currentPrice) : 0)
  const estimatedPayout = shares ? (parseFloat(shares) * 1.00).toFixed(2) : '0.00'

  // Fetch wallet balance when connected
  const loadBalance = useCallback(async () => {
    try {
      const balance = await getBalance()
      setEthBalance(balance)
    } catch (error) {
      console.error('Error fetching balance:', error)
    }
  }, [getBalance])

  useEffect(() => {
    if (isConnected) {
      loadBalance()
    }
  }, [isConnected, loadBalance])

  // Get price quote when amount or side changes
  const getPriceQuote = useCallback(async () => {
    if (!amount || parseFloat(amount) <= 0) return
    setQuoteLoading(true)
    try {
      const response = await fetch(`/api/markets/${marketData.id}/quote?side=${activeTab}&amount=${amount}`)
      const data = await response.json()
      if (data.success) {
        setPriceQuote(data.data)
      } else {
        console.error('Quote error:', data.error)
        setPriceQuote(null)
      }
    } catch (error) {
      console.error('Error getting quote:', error)
      setPriceQuote(null)
    } finally {
      setQuoteLoading(false)
    }
  }, [amount, activeTab, marketData.id])

  useEffect(() => {
    if (amount && parseFloat(amount) > 0 && marketData.id !== 'unknown') {
      getPriceQuote()
    } else {
      setPriceQuote(null)
    }
  }, [amount, activeTab, marketData.id, getPriceQuote])

  const handleTrade = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first')
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (marketData.id === 'unknown') {
      setError('Invalid market')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // For this demo, we'll simulate a simple payment process
      // In a real implementation, you'd handle actual crypto transactions
      
      const response = await fetch('/api/trades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          marketId: marketData.id,
          userId: address, // Using wallet address as user ID
          side: activeTab,
          amount: parseFloat(amount),
          maxPrice: currentPrice * 1.1 // 10% slippage tolerance
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(`Trade successful! You received ${data.data.sharesReceived.toFixed(2)} ${activeTab} shares`)
        setAmount('')
        
        // Refresh balance after trade
        await loadBalance()
        
        // Optionally refresh market data here
        if (typeof window !== 'undefined') {
          window.location.reload() // Simple refresh for now
        }
      } else {
        setError(data.error || 'Trade failed')
      }
    } catch (error) {
      console.error('Trade error:', error)
      setError('Failed to execute trade. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="bg-gray-900/90 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl p-6"
    >
      <motion.h3 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-bold text-xl mb-6 text-white"
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
              ? 'bg-green-500 text-white shadow-lg' 
              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-white/10'
          }`}
        >
          <div className="text-center">
            <div>YES</div>
            <div className="text-sm opacity-90">
              {priceQuote ? 
                `${(priceQuote.currentOdds.yes * 100).toFixed(0)}%` :
                `${(marketData.yesPrice * 100).toFixed(0)}¢`
              }
            </div>
          </div>
        </motion.button>
        <motion.button 
          onClick={() => setActiveTab('NO')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`py-3 px-4 rounded-lg font-semibold transition-colors ${
            activeTab === 'NO' 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-white/10'
          }`}
        >
          <div className="text-center">
            <div>NO</div>
            <div className="text-sm opacity-90">
              {priceQuote ? 
                `${(priceQuote.currentOdds.no * 100).toFixed(0)}%` :
                `${(marketData.noPrice * 100).toFixed(0)}¢`
              }
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
        className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-4 mb-6 border border-white/10"
      >
        <div className="text-center">
          <div className="text-lg font-semibold text-white">
            Buying {activeTab} shares
          </div>
          <div className="text-sm text-gray-300">
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
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Amount to spend ($)
          </label>
          <motion.input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            whileFocus={{ scale: 1.02 }}
            className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
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
              className="py-2 px-3 bg-gray-800/50 hover:bg-gray-700/50 border border-white/10 text-gray-300 hover:text-white rounded text-sm font-semibold transition-all"
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
            className="bg-blue-500/20 backdrop-blur-lg rounded-lg p-4 mb-6 space-y-2 overflow-hidden border border-blue-400/30"
          >
            {priceQuote ? (
              <>
                <motion.div 
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-300">Shares you'll get:</span>
                  <span className="font-semibold text-white">{priceQuote.shares}</span>
                </motion.div>
                <motion.div 
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-300">Price per share:</span>
                  <span className="font-semibold text-white">{(priceQuote.price * 100).toFixed(1)}¢</span>
                </motion.div>
                <motion.div 
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-300">Price Impact:</span>
                  <span className={`font-semibold ${parseFloat(priceQuote.priceImpact) > 5 ? 'text-red-400' : 'text-green-400'}`}>
                    {priceQuote.priceImpact}
                  </span>
                </motion.div>
                <motion.div 
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-300">Trading Fee:</span>
                  <span className="font-semibold text-yellow-400">${priceQuote.fee}</span>
                </motion.div>
                <motion.div 
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-between text-sm border-t border-white/20 pt-2"
                >
                  <span className="text-gray-300">Max payout:</span>
                  <span className="font-semibold text-green-400">${priceQuote.shares}</span>
                </motion.div>
              </>
            ) : quoteLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader size="sm" />
                <span className="ml-2 text-gray-300">Getting quote...</span>
              </div>
            ) : (
              <>
                <motion.div 
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-300">Shares you'll get:</span>
                  <span className="font-semibold text-white">{estimatedShares}</span>
                </motion.div>
                <motion.div 
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-300">Price per share:</span>
                  <span className="font-semibold text-white">{(currentPrice * 100).toFixed(0)}¢</span>
                </motion.div>
                <motion.div 
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-300">Max payout:</span>
                  <span className="font-semibold text-green-400">${(estimatedShares * 1.00).toFixed(2)}</span>
                </motion.div>
              </>
            )}
            <motion.div 
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-between text-sm"
            >
              <span className="text-gray-300">Potential profit:</span>
              <span className="font-semibold text-green-400">
                ${(estimatedShares * 1.00 - parseFloat(amount || 0)).toFixed(2)}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Trade Button */}
      <motion.button 
        onClick={handleTrade}
        disabled={loading || !amount || parseFloat(amount) <= 0 || !isConnected}
        whileHover={amount && parseFloat(amount) > 0 && isConnected ? { scale: 1.02 } : {}}
        whileTap={amount && parseFloat(amount) > 0 && isConnected ? { scale: 0.98 } : {}}
        className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
          loading ? 'bg-gray-600 cursor-not-allowed' :
          amount && parseFloat(amount) > 0 && isConnected
            ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg'
            : 'bg-gray-600 cursor-not-allowed'
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <Loader size="xs" />
            <span>Processing...</span>
          </div>
        ) : !isConnected ? (
          'Connect Wallet to Trade'
        ) : amount && parseFloat(amount) > 0 ? (
          `Buy ${activeTab} for $${amount}`
        ) : (
          'Enter amount to trade'
        )}
      </motion.button>

      {/* Error/Success Messages */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg text-red-400 text-sm backdrop-blur-lg"
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-3 bg-green-500/20 border border-green-400/30 rounded-lg text-green-400 text-sm backdrop-blur-lg"
          >
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wallet Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 pt-4 border-t border-white/20 text-center"
      >
        <div className="text-sm text-gray-300 mb-2">
          {isConnected ? 'Your Balance' : 'Wallet Status'}
        </div>
        <motion.div 
          className="font-bold text-lg text-white"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {isConnected ? (
            ethBalance !== null ? (
              `${ethBalance.toFixed(4)} ETH`
            ) : (
              'Loading...'
            )
          ) : (
            'Not Connected'
          )}
        </motion.div>
        {isConnected ? (
          <motion.div 
            className="text-xs text-gray-400 mt-1"
          >
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </motion.div>
        ) : (
          <motion.button 
            onClick={connect}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-orange-400 hover:text-orange-300 text-sm font-semibold mt-1 transition-colors"
          >
            Connect Wallet
          </motion.button>
        )}
      </motion.div>

      {/* Connect Wallet CTA */}
      {!isConnected && (
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
              onClick={connect}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-600 text-white px-4 py-2 rounded font-semibold text-sm hover:bg-yellow-700 transition-colors"
            >
              Connect Brave Wallet
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
