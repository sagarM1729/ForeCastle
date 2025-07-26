'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

export default function LiveMarketStats({ marketId }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`/api/markets/${marketId}`)
      const data = await response.json()
      
      if (data.success || data.market) {
        const market = data.market || data
        
        // Calculate current odds from trades
        const yesVolume = market.trades?.filter(t => {
          const tradeOption = market.options?.find(opt => opt.id === t.option_id)
          return tradeOption?.label === 'YES'
        }).reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0
        
        const noVolume = market.trades?.filter(t => {
          const tradeOption = market.options?.find(opt => opt.id === t.option_id)
          return tradeOption?.label === 'NO'
        }).reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0
        
        const liquidityConstant = 100
        const yesPool = yesVolume + liquidityConstant
        const noPool = noVolume + liquidityConstant
        const totalPool = yesPool + noPool
        
        const currentYesOdds = yesPool / totalPool
        const currentNoOdds = 1 - currentYesOdds
        
        setStats({
          totalVolume: yesVolume + noVolume,
          yesVolume,
          noVolume,
          yesOdds: currentYesOdds,
          noOdds: currentNoOdds,
          totalTrades: market.trades?.length || 0,
          participants: new Set(market.trades?.map(t => t.user_id) || []).size
        })
      }
    } catch (error) {
      console.error('Error fetching market stats:', error)
    } finally {
      setLoading(false)
    }
  }, [marketId])

  useEffect(() => {
    fetchStats()
    
    // Update stats every 10 seconds
    const interval = setInterval(fetchStats, 10000)
    
    return () => clearInterval(interval)
  }, [fetchStats])

  if (loading || !stats) {
    return (
      <div className="bg-gray-900/90 backdrop-blur-lg rounded-xl border border-white/10 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-8 bg-gray-700 rounded"></div>
            <div className="h-8 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/90 backdrop-blur-lg rounded-xl border border-white/10 p-6"
    >
      <h3 className="font-bold text-lg mb-4 text-white">📊 Live Market Stats</h3>
      
      <div className="space-y-4">
        {/* Current Odds */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-green-500/20 rounded-lg p-3 border border-green-400/30"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {(stats.yesOdds * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-300">YES Odds</div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-red-500/20 rounded-lg p-3 border border-red-400/30"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {(stats.noOdds * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-300">NO Odds</div>
            </div>
          </motion.div>
        </div>
        
        {/* Volume Information */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-300">Total Volume:</span>
            <span className="font-semibold text-white">${stats.totalVolume.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">YES Volume:</span>
            <span className="font-semibold text-green-400">${stats.yesVolume.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">NO Volume:</span>
            <span className="font-semibold text-red-400">${stats.noVolume.toFixed(2)}</span>
          </div>
        </div>
        
        {/* Activity Stats */}
        <div className="pt-4 border-t border-white/20 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-300">Total Trades:</span>
            <span className="font-semibold text-white">{stats.totalTrades}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Participants:</span>
            <span className="font-semibold text-white">{stats.participants}</span>
          </div>
        </div>
        
        {/* Volume Distribution Bar */}
        <div className="pt-4">
          <div className="text-sm text-gray-300 mb-2">Volume Distribution</div>
          <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(stats.yesVolume / stats.totalVolume * 100).toFixed(1)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-green-400"
            />
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(stats.noVolume / stats.totalVolume * 100).toFixed(1)}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="absolute right-0 top-0 h-full bg-gradient-to-l from-red-500 to-red-400"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>YES: {stats.totalVolume > 0 ? (stats.yesVolume / stats.totalVolume * 100).toFixed(1) : 0}%</span>
            <span>NO: {stats.totalVolume > 0 ? (stats.noVolume / stats.totalVolume * 100).toFixed(1) : 0}%</span>
          </div>
        </div>
        
        {/* Last Updated */}
        <div className="text-xs text-gray-500 text-center pt-2">
          Updates every 10 seconds • Last: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  )
}
