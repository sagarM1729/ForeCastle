'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWallet } from '@/context/WalletContext'
import { formatDistanceToNow } from 'date-fns'
import PageLayout from '../../components/PageLayout'
import LoadingState from '../../components/LoadingState'

export default function TradesPage() {
  const [activeTab, setActiveTab] = useState('history')
  const [trades, setTrades] = useState([])
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPnL: 257.75,
    totalPnLChange: 17.75,
    totalVolume: 24000000,
    volumeChange: 12.5,
    activeMarkets: 1247,
    marketsChange: 8.2,
    totalTraders: 15432,
    tradersChange: 15.7,
    resolvedMarkets: 3891,
    resolvedChange: 5.3
  })

  const { isConnected, address } = useWallet()

  const fetchUserData = async () => {
    try {
      // Fetch trades
      const tradesResponse = await fetch(`/api/trades?userId=${address}`)
      const tradesData = await tradesResponse.json()
      
      if (tradesData.success) {
        setTrades(tradesData.data)
      }

      // For now, we'll use mock positions data
      setPositions([
        {
          id: '1',
          market: 'Bitcoin $100K by 2025',
          category: 'Crypto',
          side: 'YES',
          shares: 150,
          avgPrice: 0.68,
          currentPrice: 0.72,
          value: 108.00,
          pnl: 6.00,
          pnlPercent: 5.9
        },
        {
          id: '2',
          market: 'AI AGI by 2030',
          category: 'Technology',
          side: 'NO',
          shares: 200,
          avgPrice: 0.65,
          currentPrice: 0.58,
          value: 116.00,
          pnl: 14.00,
          pnlPercent: 10.8
        },
        {
          id: '3',
          market: 'Man City Premier League 2025',
          category: 'Sports',
          side: 'YES',
          shares: 75,
          avgPrice: 0.48,
          currentPrice: 0.45,
          value: 33.75,
          pnl: -2.25,
          pnlPercent: -6.3
        }
      ])
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isConnected && address) {
      fetchUserData()
    }
  }, [isConnected, address, fetchUserData])

  const getCategoryColor = (category) => {
    const colors = {
      'Crypto': 'from-orange-500 to-yellow-500',
      'Politics': 'from-red-500 to-pink-500',
      'Sports': 'from-green-500 to-emerald-500',
      'Technology': 'from-purple-500 to-indigo-500'
    }
    return colors[category] || 'from-gray-500 to-gray-600'
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  if (!isConnected) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-8 bg-gray-900/90 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl max-w-md mx-auto"
          >
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Connect Your Wallet
            </h2>
            <p className="text-gray-300 mb-6">
              Please connect your wallet to view your trading activity and positions.
            </p>
            <button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105">
              Connect Wallet
            </button>
          </motion.div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            💼 My Trading Activity
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            View your trades, positions, and performance in one comprehensive dashboard
          </p>
        </motion.div>

        {/* Statistics Grid - More Spacious Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-gray-900/90 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-full -translate-y-4 translate-x-4"></div>
            <div className="flex items-start justify-between mb-6">
              <div className="text-4xl mb-2">💰</div>
              <div className="text-sm text-green-400 font-bold flex items-center bg-green-500/20 px-3 py-1 rounded-full">
                <span className="mr-1">↗️</span>
                +{stats.volumeChange}%
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">
                ${formatNumber(stats.totalVolume)}
              </div>
              <div className="text-sm text-gray-300 font-medium">Total Volume</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-gray-900/90 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full -translate-y-4 translate-x-4"></div>
            <div className="flex items-start justify-between mb-6">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-sm text-green-400 font-bold flex items-center bg-green-500/20 px-3 py-1 rounded-full">
                <span className="mr-1">↗️</span>
                +{stats.marketsChange}%
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">
                {formatNumber(stats.activeMarkets)}
              </div>
              <div className="text-sm text-gray-300 font-medium">Active Markets</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-gray-900/90 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-full -translate-y-4 translate-x-4"></div>
            <div className="flex items-start justify-between mb-6">
              <div className="text-4xl mb-2">👥</div>
              <div className="text-sm text-green-400 font-bold flex items-center bg-green-500/20 px-3 py-1 rounded-full">
                <span className="mr-1">↗️</span>
                +{stats.tradersChange}%
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">
                {formatNumber(stats.totalTraders)}
              </div>
              <div className="text-sm text-gray-300 font-medium">Total Traders</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-gray-900/90 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-full -translate-y-4 translate-x-4"></div>
            <div className="flex items-start justify-between mb-6">
              <div className="text-4xl mb-2">✅</div>
              <div className="text-sm text-green-400 font-bold flex items-center bg-green-500/20 px-3 py-1 rounded-full">
                <span className="mr-1">↗️</span>
                +{stats.resolvedChange}%
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">
                {formatNumber(stats.resolvedMarkets)}
              </div>
              <div className="text-sm text-gray-300 font-medium">Markets Resolved</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Portfolio Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl shadow-2xl p-8 mb-10 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-6 -translate-x-6"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center">
                <span className="mr-3">💼</span>
                Portfolio Value
              </h3>
              <div className="space-y-2">
                <div className="text-4xl font-bold">
                  {formatCurrency(stats.totalPnL)}
                </div>
                <div className="flex items-center text-green-200 text-lg">
                  <span className="mr-2 text-xl">↗️</span>
                  <span className="font-semibold">
                    +{formatCurrency(stats.totalPnLChange)} Total P&L
                  </span>
                </div>
              </div>
            </div>
            <div className="text-8xl opacity-30">📈</div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex space-x-2 bg-gray-900/90 backdrop-blur-lg p-2 rounded-xl mb-8 w-fit border border-white/10"
        >
          <button
            onClick={() => setActiveTab('history')}
            className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg transform scale-105'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <span className="mr-2">📜</span>
            Trade History
          </button>
          <button
            onClick={() => setActiveTab('positions')}
            className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'positions'
                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg transform scale-105'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <span className="mr-2">📊</span>
            My Positions
          </button>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-gray-900/90 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Trade History</h3>
              {loading ? (
                <div className="py-4">
                  <LoadingState message="Loading Trades" size="small" />
                </div>
              ) : trades.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📈</div>
                  <h4 className="text-lg font-semibold text-white mb-2">No Trades Yet</h4>
                  <p className="text-gray-300 mb-4">Start trading to see your history here</p>
                  <a
                    href="/markets"
                    className="inline-block bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105"
                  >
                    Browse Markets
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {trades.map((trade, index) => (
                    <motion.div
                      key={trade.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-lg rounded-lg border border-white/10 hover:bg-gray-700/50 transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          trade.option?.label === 'YES' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <div className="font-semibold text-white">{trade.market?.title}</div>
                          <div className="text-sm text-gray-300">
                            {trade.option?.label} • {formatDistanceToNow(new Date(trade.created_at))} ago
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">
                          {formatCurrency(parseFloat(trade.amount))}
                        </div>
                        <div className="text-sm text-gray-300">
                          @ {(parseFloat(trade.price) * 100).toFixed(0)}¢
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'positions' && (
            <motion.div
              key="positions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-gray-900/90 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6">💼 My Positions</h3>
              <p className="text-gray-300 mb-6">Track your active positions and performance</p>
              
              {positions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <h4 className="text-lg font-semibold text-white mb-2">No Active Positions</h4>
                  <p className="text-gray-300 mb-4">Make some trades to see your positions here</p>
                  <a
                    href="/markets"
                    className="inline-block bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105"
                  >
                    Start Trading
                  </a>
                </div>
              ) : (
                <div className="grid gap-6">
                  {positions.map((position, index) => (
                    <motion.div
                      key={position.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-white/10 bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 hover:bg-gray-700/50 hover:shadow-2xl transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${getCategoryColor(position.category)}`}>
                              {position.category}
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                              position.side === 'YES' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {position.side}
                            </div>
                          </div>
                          <div className={`text-right ${
                            position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            <div className="font-bold text-lg">
                              {position.pnl >= 0 ? '+' : ''}{formatCurrency(position.pnl)}
                            </div>
                            <div className="text-sm font-semibold">
                              ({position.pnl >= 0 ? '+' : ''}{position.pnlPercent.toFixed(1)}%)
                            </div>
                          </div>
                        </div>

                        <h4 className="font-bold text-lg text-white mb-4">
                          {position.market}
                        </h4>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-gray-300 font-medium">Shares</div>
                            <div className="font-bold text-white">{position.shares}</div>
                          </div>
                          <div>
                            <div className="text-gray-300 font-medium">Avg Price</div>
                            <div className="font-bold text-white">{(position.avgPrice * 100).toFixed(0)}¢</div>
                          </div>
                          <div>
                            <div className="text-gray-300 font-medium">Current Price</div>
                            <div className="font-bold text-white">{(position.currentPrice * 100).toFixed(0)}¢</div>
                          </div>
                          <div>
                            <div className="text-gray-300 font-medium">Value</div>
                            <div className="font-bold text-white">{formatCurrency(position.value)}</div>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-sm text-gray-300">
                            Performance
                          </div>
                          <div className="text-2xl">
                            {position.pnl >= 0 ? '📈' : '📉'}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  )
}
