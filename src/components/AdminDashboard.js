// Admin Dashboard Component
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import LoadingState from './LoadingState'

export default function AdminDashboard() {
  const [markets, setMarkets] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState({})
  const [message, setMessage] = useState(null)
  const [stats, setStats] = useState({
    totalMarkets: 0,
    testMarkets: 0,
    validMarkets: 0
  })

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 5000)
  }

  useEffect(() => {
    fetchMarkets()
  }, [])

  const fetchMarkets = async () => {
    try {
      const response = await fetch('/api/markets?limit=100')
      const data = await response.json()
      
      if (data.success) {
        const allMarkets = data.data
        setMarkets(allMarkets)
        
        // Calculate stats
        const testMarkets = allMarkets.filter(market => 
          market.title.includes('xxx') || 
          market.title.includes('kkk') || 
          market.title.includes('qqq') ||
          market.title.length > 50 && /^[a-z]+$/.test(market.title.toLowerCase())
        )
        
        setStats({
          totalMarkets: allMarkets.length,
          testMarkets: testMarkets.length,
          validMarkets: allMarkets.length - testMarkets.length
        })
      }
    } catch (error) {
      console.error('Error fetching markets:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteMarket = async (marketId) => {
    setDeleting(prev => ({ ...prev, [marketId]: true }))
    
    try {
      const response = await fetch(`/api/markets/${marketId}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Remove market from state
        setMarkets(prev => prev.filter(market => market.id !== marketId))
        // Update stats
        const deletedMarket = markets.find(m => m.id === marketId)
        const wasTestMarket = deletedMarket && (
          deletedMarket.title.includes('xxx') || 
          deletedMarket.title.includes('kkk') || 
          deletedMarket.title.includes('qqq') ||
          (deletedMarket.title.length > 50 && /^[a-z]+$/.test(deletedMarket.title.toLowerCase()))
        )
        
        setStats(prev => ({
          ...prev,
          totalMarkets: prev.totalMarkets - 1,
          testMarkets: wasTestMarket ? prev.testMarkets - 1 : prev.testMarkets,
          validMarkets: wasTestMarket ? prev.validMarkets : prev.validMarkets - 1
        }))
        
        console.log('Market deleted successfully')
        showMessage('Market deleted successfully', 'success')
      } else {
        console.error('Failed to delete market:', data.error)
        showMessage(`Failed to delete market: ${data.error}`, 'error')
      }
    } catch (error) {
      console.error('Error deleting market:', error)
      showMessage('Error deleting market. Please try again.', 'error')
    } finally {
      setDeleting(prev => ({ ...prev, [marketId]: false }))
    }
  }

  const deleteAllTestMarkets = async () => {
    const testMarkets = markets.filter(market => 
      market.title.includes('xxx') || 
      market.title.includes('kkk') || 
      market.title.includes('qqq') ||
      (market.title.length > 50 && /^[a-z]+$/.test(market.title.toLowerCase()))
    )

    for (const market of testMarkets) {
      await deleteMarket(market.id)
      // Add small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }

  const getTestMarkets = () => {
    return markets.filter(market => 
      market.title.includes('xxx') || 
      market.title.includes('kkk') || 
      market.title.includes('qqq') ||
      (market.title.length > 50 && /^[a-z]+$/.test(market.title.toLowerCase()))
    )
  }

  return (
    <div className="space-y-8">
      {/* Success/Error Messages */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-500/20 border-green-500/30 text-green-400'
              : 'bg-red-500/20 border-red-500/30 text-red-400'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{message.type === 'success' ? '✅' : '❌'}</span>
            <span>{message.text}</span>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/90 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl p-6">
          <h3 className="font-semibold text-lg mb-4 text-white">Platform Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">Total Markets:</span>
              <span className="text-white font-bold">{stats.totalMarkets}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Valid Markets:</span>
              <span className="text-green-400 font-bold">{stats.validMarkets}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Test Markets:</span>
              <span className="text-red-400 font-bold">{stats.testMarkets}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/90 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl p-6">
          <h3 className="font-semibold text-lg mb-4 text-white">Market Management</h3>
          <div className="space-y-3">
            <button
              onClick={fetchMarkets}
              className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-semibold py-2 px-4 rounded-lg transition-all border border-blue-400/30"
            >
              🔄 Refresh Data
            </button>
            {stats.testMarkets > 0 && (
              <button
                onClick={deleteAllTestMarkets}
                className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-2 px-4 rounded-lg transition-all border border-red-400/30"
              >
                🗑️ Delete All Test Markets
              </button>
            )}
          </div>
        </div>
        
        <div className="bg-gray-900/90 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl p-6">
          <h3 className="font-semibold text-lg mb-4 text-white">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 font-semibold py-2 px-4 rounded-lg transition-all border border-purple-400/30">
              📊 View Analytics
            </button>
            <button className="w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 font-semibold py-2 px-4 rounded-lg transition-all border border-orange-400/30">
              ⚙️ Platform Settings
            </button>
          </div>
        </div>
      </div>

      {/* All Markets Management Section */}
      <div className="bg-gray-900/90 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl p-6">
        <h3 className="font-semibold text-lg mb-4 text-white flex items-center justify-between">
          📊 All Markets Management
          <span className="text-sm bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
            {markets.length} total
          </span>
        </h3>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {markets.map((market) => {
            const isTestMarket = market.title.includes('xxx') || 
              market.title.includes('kkk') || 
              market.title.includes('qqq') ||
              (market.title.length > 50 && /^[a-z]+$/.test(market.title.toLowerCase()))
              
            return (
              <motion.div
                key={market.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                  isTestMarket 
                    ? 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20' 
                    : 'bg-gray-800/50 border-white/10 hover:bg-gray-800/70'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      isTestMarket ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {market.category}
                    </span>
                    {isTestMarket && (
                      <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-bold">
                        TEST
                      </span>
                    )}
                  </div>
                  <div className="text-white font-medium mb-1">
                    {market.title.length > 70 ? `${market.title.substring(0, 70)}...` : market.title}
                  </div>
                  <div className="text-gray-400 text-sm flex items-center gap-4">
                    <span>📅 {new Date(market.created_at).toLocaleDateString()}</span>
                    <span>💰 ${market.totalVolume || 0}</span>
                    <span>👥 {market.participants || 0}</span>
                    <span className="font-mono text-xs text-gray-500">ID: {market.id.slice(0, 8)}...</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <button
                    onClick={() => window.open(`/markets/${market.id}`, '_blank')}
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-2 rounded text-sm font-semibold transition-all border border-blue-400/30"
                  >
                    👁️ View
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${market.title}"?\n\nThis will permanently delete:\n- The market\n- All trades\n- All options\n- Resolution data\n\nThis action cannot be undone.`)) {
                        deleteMarket(market.id)
                      }
                    }}
                    disabled={deleting[market.id]}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-2 rounded text-sm font-semibold transition-all border border-red-400/30 disabled:opacity-50"
                  >
                    {deleting[market.id] ? '⏳ Deleting...' : '🗑️ Delete'}
                  </button>
                </div>
              </motion.div>
            )
          })}
          
          {markets.length === 0 && !loading && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📭</div>
              <p className="text-gray-400">No markets found</p>
            </div>
          )}
        </div>
      </div>

      {/* Test Markets Section */}
      {stats.testMarkets > 0 && (
        <div className="bg-gray-900/90 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl p-6">
          <h3 className="font-semibold text-lg mb-4 text-white flex items-center">
            🧹 Test Markets Cleanup
            <span className="ml-2 text-sm bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
              {stats.testMarkets} found
            </span>
          </h3>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {getTestMarkets().map((market) => (
              <motion.div
                key={market.id}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-white/10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">
                    {market.title.length > 60 ? `${market.title.substring(0, 60)}...` : market.title}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {market.category} • Created {new Date(market.created_at).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => deleteMarket(market.id)}
                  disabled={deleting[market.id]}
                  className="ml-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1 rounded text-sm font-semibold transition-all border border-red-400/30 disabled:opacity-50"
                >
                  {deleting[market.id] ? '⏳' : '🗑️'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {loading && (
        <LoadingState message="Loading admin data..." />
      )}
    </div>
  )
}
