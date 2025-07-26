'use client'

import { useEffect, useState } from 'react'

// Simple SVG Chart Component (no external dependencies)
function SimpleLineChart({ data, width = 400, height = 200 }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-48 bg-gray-800/50 backdrop-blur-lg rounded-xl border border-white/10 flex items-center justify-center">
        <p className="text-gray-400">No data available</p>
      </div>
    )
  }

  const maxPrice = Math.max(...data.map(d => d.price))
  const minPrice = Math.min(...data.map(d => d.price))
  const priceRange = maxPrice - minPrice || 0.1
  
  const padding = 40
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2
  
  // Create path for the line
  const pathData = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth
    const y = padding + ((maxPrice - point.price) / priceRange) * chartHeight
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')
  
  // Create gradient area under the line
  const areaData = `${pathData} L ${padding + chartWidth} ${padding + chartHeight} L ${padding} ${padding + chartHeight} Z`
  
  const currentPrice = data[data.length - 1]?.price || 0.5
  const firstPrice = data[0]?.price || 0.5
  const priceChange = currentPrice - firstPrice
  const isPositive = priceChange >= 0

  return (
    <div className="relative">
      <svg width={width} height={height} className="w-full">
        {/* Grid lines */}
        <defs>
          <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity="0.3" />
            <stop offset="100%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        
        {/* Horizontal grid lines */}
        {[0.25, 0.5, 0.75].map((ratio) => (
          <line
            key={ratio}
            x1={padding}
            y1={padding + ratio * chartHeight}
            x2={padding + chartWidth}
            y2={padding + ratio * chartHeight}
            stroke="#374151"
            strokeWidth="1"
            strokeDasharray="3,3"
          />
        ))}
        
        {/* Area under curve */}
        <path
          d={areaData}
          fill="url(#priceGradient)"
        />
        
        {/* Price line */}
        <path
          d={pathData}
          stroke={isPositive ? "#10B981" : "#EF4444"}
          strokeWidth="2"
          fill="none"
        />
        
        {/* Data points */}
        {data.map((point, index) => {
          const x = padding + (index / (data.length - 1)) * chartWidth
          const y = padding + ((maxPrice - point.price) / priceRange) * chartHeight
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill={isPositive ? "#10B981" : "#EF4444"}
              stroke="white"
              strokeWidth="2"
              opacity={index === data.length - 1 ? 1 : 0.7}
            />
          )
        })}
        
        {/* Y-axis labels */}
        <text x={padding - 10} y={padding + 5} textAnchor="end" fontSize="12" fill="#9CA3AF">
          {(maxPrice * 100).toFixed(0)}%
        </text>
        <text x={padding - 10} y={padding + chartHeight + 5} textAnchor="end" fontSize="12" fill="#9CA3AF">
          {(minPrice * 100).toFixed(0)}%
        </text>
      </svg>
    </div>
  )
}

// Market Chart Component
export default function MarketChart({ marketId }) {
  const [priceData, setPriceData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeframe, setTimeframe] = useState('7d')

  useEffect(() => {
    if (!marketId) return
    
    async function fetchPriceData() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/markets/${marketId}/prices?timeframe=${timeframe}&interval=hour`)
        if (!res.ok) throw new Error('Failed to fetch price data')
        const data = await res.json()
        setPriceData(data.data)
      } catch (err) {
        setError(err.message)
        setPriceData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPriceData()
  }, [marketId, timeframe])

  const timeframeOptions = [
    { value: '24h', label: '24H' },
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' },
    { value: 'all', label: 'All' }
  ]

  const getPriceChangeInfo = () => {
    if (!priceData || !priceData.price_history || priceData.price_history.length < 2) {
      return { change: 0, percentage: 0, isPositive: true }
    }

    const prices = priceData.price_history.map(point => point.price)
    const firstPrice = prices[0]
    const lastPrice = prices[prices.length - 1]
    const change = lastPrice - firstPrice
    const percentage = firstPrice > 0 ? (change / firstPrice) * 100 : 0

    return {
      change,
      percentage,
      isPositive: change >= 0
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-900/90 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-800/50 rounded-xl flex items-center justify-center">
            <p className="text-gray-400">Loading price chart...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-900/90 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl p-6">
        <h3 className="font-semibold text-lg mb-4 text-white">📈 Price Chart</h3>
        <div className="h-64 bg-gray-800/50 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400 mb-2">Failed to load price data</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-orange-400 hover:text-orange-300 text-sm transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  const priceChangeInfo = getPriceChangeInfo()
  const currentPrice = priceData?.current_price || 0.5

  return (
    <div className="bg-gray-900/90 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-semibold text-lg text-white mb-2">📈 Price Chart</h3>
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-white">
              {(currentPrice * 100).toFixed(1)}¢
            </div>
            <div className={`flex items-center space-x-1 text-sm font-medium ${
              priceChangeInfo.isPositive ? 'text-green-400' : 'text-red-400'
            }`}>
              <span>{priceChangeInfo.isPositive ? '↗' : '↘'}</span>
              <span>
                {priceChangeInfo.isPositive ? '+' : ''}{priceChangeInfo.percentage.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        
        {/* Timeframe Selector */}
        <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1 border border-white/10">
          {timeframeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeframe(option.value)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                timeframe === option.value
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 relative">
        {priceData && priceData.price_history ? (
          <SimpleLineChart data={priceData.price_history} width={600} height={250} />
        ) : (
          <div className="h-full bg-gray-800/50 rounded-xl flex items-center justify-center">
            <p className="text-gray-400">No price data available</p>
          </div>
        )}
      </div>

      {/* Stats */}
      {priceData && priceData.price_history && (
        <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-400">Volume</div>
            <div className="font-semibold text-white">
              ${priceData.price_history.reduce((sum, point) => sum + (point.volume || 0), 0).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Trades</div>
            <div className="font-semibold text-white">
              {priceData.price_history.reduce((sum, point) => sum + (point.trades_count || 0), 0)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Data Points</div>
            <div className="font-semibold text-white">{priceData.total_points}</div>
          </div>
        </div>
      )}
    </div>
  )
}
