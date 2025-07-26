'use client'


import Link from 'next/link'
import { useEffect, useState } from 'react'
import MarketChart from '@/components/MarketChart'
import TradingInterface from '@/components/TradingInterface'
import PageLayout from '@/components/PageLayout'
import LoadingState from '@/components/LoadingState'
import ErrorState from '@/components/ErrorState'
import { formatDate, formatDateLong } from '@/utils/dateUtils'
import LiveMarketStats from '@/components/LiveMarketStats'

export default function MarketDetailPage({ params }) {
  const [market, setMarket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchMarket() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/markets/${params.id}`)
        if (!res.ok) throw new Error('Market not found')
        const data = await res.json()
        setMarket(data.market || data)
      } catch (err) {
        setError(err.message)
        setMarket(null)
      } finally {
        setLoading(false)
      }
    }
    fetchMarket()
  }, [params.id])

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <LoadingState message="Loading Market Details" size="large" />
        </div>
      </PageLayout>
    )
  }

  if (error || !market) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <ErrorState 
            title="Market Not Found"
            message="The market you're looking for doesn't exist or has been removed."
            actionText="Browse All Markets"
            actionHref="/markets"
          />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      {/* Breadcrumb */}
      <div className="bg-gray-900/90 backdrop-blur-lg border-b border-white/10 relative z-10">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-orange-400 hover:text-orange-300 transition-colors">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/markets" className="text-orange-400 hover:text-orange-300 transition-colors">Markets</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-300">Market #{market.id}</span>
          </nav>
        </div>
      </div>

      {/* Market Header */}
      <div className="bg-gray-900/90 backdrop-blur-lg border-b border-white/10 shadow-2xl relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${
                  market.category === 'Crypto' ? 'from-orange-500 to-yellow-500' :
                  market.category === 'Technology' ? 'from-purple-500 to-indigo-500' :
                  market.category === 'Space' ? 'from-blue-500 to-cyan-500' :
                  'from-gray-500 to-gray-600'
                }`}>
                  {market.category}
                </span>
                {market.trending && <span className="text-red-400 font-semibold">🔥 Trending</span>}
                <span className="text-green-400 font-semibold">🟢 {market.status}</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {market.title}
              </h1>
              
              <p className="text-lg text-gray-300 max-w-4xl">
                {market.description}
              </p>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{(market.probability * 100).toFixed(0)}%</div>
              <div className="text-sm text-gray-300">Current Odds</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">${market.totalVolume?.toLocaleString() || '0'}</div>
              <div className="text-sm text-gray-300">Total Volume</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{market.participants?.toLocaleString() || '0'}</div>
              <div className="text-sm text-gray-300">Traders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">${market.liquidityPool?.toLocaleString() || '0'}</div>
              <div className="text-sm text-gray-300">Liquidity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{market.endDate ? formatDate(market.endDate) : 'TBD'}</div>
              <div className="text-sm text-gray-300">Ends</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Market Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Price Chart */}
            <MarketChart marketId={market.id} />
            
            {/* About This Market */}
            <div className="bg-gray-900/90 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl p-6">
              <h3 className="text-xl font-bold mb-4 text-white">📋 About This Market</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {market.longDescription || market.description}
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-3">🎯 Resolution Rules</h4>
                  <ul className="space-y-2">
                    {market.rules?.map((rule, index) => (
                      <li key={index} className="text-sm text-gray-300 flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        {rule}
                      </li>
                    )) || (
                      <li className="text-sm text-gray-300 flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        Market resolves based on outcome verification
                      </li>
                    )}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-3">📊 Data Sources</h4>
                  <ul className="space-y-2">
                    {market.sources?.map((source, index) => (
                      <li key={index} className="text-sm text-gray-300 flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        {source}
                      </li>
                    )) || (
                      <li className="text-sm text-gray-300 flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        Market Creator Verification
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Trading Activity */}
            <div className="bg-gray-900/90 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl p-6">
              <h3 className="text-xl font-bold mb-4 text-white">📈 Recent Trading Activity</h3>
              {market.trades && market.trades.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-2 text-sm font-semibold text-gray-300">User</th>
                        <th className="text-left py-2 text-sm font-semibold text-gray-300">Action</th>
                        <th className="text-left py-2 text-sm font-semibold text-gray-300">Amount</th>
                        <th className="text-left py-2 text-sm font-semibold text-gray-300">Option</th>
                        <th className="text-left py-2 text-sm font-semibold text-gray-300">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {market.trades.map((trade) => (
                        <tr key={trade.id} className="border-b border-white/10 hover:bg-gray-800/50">
                          <td className="py-3 font-mono text-sm text-white">{trade.user.wallet_address.slice(0, 10)}...</td>
                          <td className="py-3">
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-500/20 text-blue-400">
                              {trade.type || 'Trade'}
                            </span>
                          </td>
                          <td className="py-3 font-semibold text-white">${trade.amount}</td>
                          <td className="py-3 text-gray-300">{trade.option?.label || 'N/A'}</td>
                          <td className="py-3 text-gray-400">{new Date(trade.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No trading activity yet. Be the first to trade!</p>
              )}
            </div>
          </div>
          
          {/* Right Column - Trading Interface */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <TradingInterface market={market} />
              
              {/* Live Market Stats */}
              <LiveMarketStats marketId={market.id} />
              
              {/* Market Info Card */}
              <div className="bg-gray-900/90 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl p-6">
                <h3 className="font-bold text-lg mb-4 text-white">ℹ️ Market Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Created:</span>
                    <span className="font-semibold text-white">{formatDate(market.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Status:</span>
                    <span className="font-semibold text-white">{market.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Creator:</span>
                    <span className="font-mono text-sm text-gray-300">{market.creator?.wallet_address?.slice(0, 10)}...</span>
                  </div>
                  {market.options && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Options:</span>
                      <span className="font-semibold text-white">{market.options.map(opt => opt.label).join(', ')}</span>
                    </div>
                  )}
                </div>
                
                {/* Tags */}
                <div className="mt-6 pt-4 border-t border-white/20">
                  <div className="text-sm font-semibold text-gray-300 mb-2">Tags:</div>
                  <div className="flex flex-wrap gap-2">
                    {market.tags?.map((tag) => (
                      <span key={tag} className="bg-gray-800/50 text-gray-300 px-2 py-1 rounded text-xs border border-white/10">
                        {tag}
                      </span>
                    )) || (
                      <span className="bg-gray-800/50 text-gray-300 px-2 py-1 rounded text-xs border border-white/10">
                        {market.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
