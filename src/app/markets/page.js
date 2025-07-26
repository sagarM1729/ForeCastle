'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import MarketGrid from '@/components/MarketGrid'
import PageLayout from '@/components/PageLayout'
import LoadingState from '@/components/LoadingState'
import ErrorState from '@/components/ErrorState'
import EmptyState from '@/components/EmptyState'
import PrimaryButton from '@/components/PrimaryButton'
import { CONFIG } from '@/config/constants'

export default function MarketsPage() {
  const [markets, setMarkets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function fetchMarkets() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory)
        }
        if (searchTerm) {
          params.append('search', searchTerm)
        }
        
        const res = await fetch(`/api/markets?${params}`)
        if (!res.ok) throw new Error('Failed to fetch markets')
        const data = await res.json()
        setMarkets(data.data || data.markets || data || [])
      } catch (err) {
        setError(err.message)
        setMarkets([])
      } finally {
        setLoading(false)
      }
    }
    fetchMarkets()
  }, [selectedCategory, searchTerm])

  const categories = CONFIG.MARKET_CATEGORIES

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <LoadingState message="Loading Markets" size="large" />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      {/* Header */}
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Prediction Markets
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Trade on the future. Bet on outcomes that matter to you.
            </p>
            <PrimaryButton href="/markets/create" size="lg" sparkle={true}>
              <span className="mr-2">✨</span>
              Create New Market
            </PrimaryButton>
          </div>
        </div>
        {/* Gradient transition */}
        <div className="h-16 bg-gradient-to-b from-transparent to-gray-900/30"></div>
      </div>

      {/* Filters */}
      <div className="relative z-10 bg-gray-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search markets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <PrimaryButton
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "gradient" : "secondary"}
                  size="sm"
                >
                  {category === 'all' ? 'All Categories' : category}
                </PrimaryButton>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Markets Grid */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        {error ? (
          <ErrorState 
            title="Error Loading Markets"
            message={error}
            onRetry={() => window.location.reload()}
          />
        ) : markets.length === 0 ? (
          <EmptyState
            title="No Markets Found"
            message={
              searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filters.' 
                : 'Be the first to create a market!'
            }
            actionText="✨ Create First Market"
            actionHref="/markets/create"
            icon="🔍"
          />
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {markets.length} Market{markets.length !== 1 ? 's' : ''} Found
              </h2>
              <div className="text-sm text-gray-300">
                Showing {selectedCategory === 'all' ? 'all categories' : selectedCategory}
                {searchTerm && ` • "${searchTerm}"`}
              </div>
            </div>
            <MarketGrid markets={markets} />
          </>
        )}
        
        {/* Gradient transition to stats */}
        <div className="h-16 bg-gradient-to-b from-transparent to-gray-900/30 mt-8"></div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-900/30 backdrop-blur-lg relative z-10">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">{markets.length}</div>
              <div className="text-gray-300">Active Markets</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">
                ${markets.reduce((sum, market) => sum + (market.totalVolume || 0), 0).toLocaleString()}
              </div>
              <div className="text-gray-300">Total Volume</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {markets.reduce((sum, market) => sum + (market.participants || 0), 0).toLocaleString()}
              </div>
              <div className="text-gray-300">Total Traders</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400 mb-2">24/7</div>
              <div className="text-gray-300">Market Access</div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
