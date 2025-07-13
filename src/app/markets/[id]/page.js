import Link from 'next/link'
import MarketChart from '@/components/MarketChart'
import TradingInterface from '@/components/TradingInterface'
import { formatDate, formatDateLong } from '@/utils/dateUtils'

// Dummy market data for individual markets
const getMarketData = (id) => {
  const markets = {
    '1': {
      id: '1',
      title: 'Will Bitcoin reach $100,000 by end of 2025?',
      description: 'This market resolves to "Yes" if Bitcoin (BTC/USD) reaches or exceeds $100,000 at any point before January 1, 2026, 00:00 UTC. The resolution will be based on the highest price recorded on major exchanges including Coinbase, Binance, and Kraken.',
      longDescription: 'Bitcoin has been on a remarkable journey since its inception, reaching all-time highs and establishing itself as digital gold. With increasing institutional adoption, the approval of Bitcoin ETFs, and growing mainstream acceptance, many analysts believe the $100,000 milestone is not a matter of if, but when. However, market volatility, regulatory challenges, and macroeconomic factors could impact this trajectory. This market allows traders to express their view on whether Bitcoin will achieve this significant psychological and technical level by the end of 2025.',
      category: 'Crypto',
      createdAt: '2024-01-15',
      endDate: '2025-12-31',
      resolutionDate: '2026-01-02',
      totalVolume: 2500000,
      probability: 0.68,
      participants: 1247,
      yesPrice: 0.68,
      noPrice: 0.32,
      trending: true,
      tags: ['Bitcoin', 'Cryptocurrency', 'Price Prediction', '$100k'],
      creator: '0x1234...5678',
      totalShares: 3676470,
      yesShares: 2500000,
      noShares: 1176470,
      liquidityPool: 850000,
      status: 'active',
      rules: [
        'Market resolves to "Yes" if Bitcoin reaches $100,000 USD',
        'Price must be sustained for at least 1 hour on major exchanges',
        'Resolution based on CoinGecko and CoinMarketCap data',
        'Market closes at 23:59 UTC on December 31, 2025'
      ],
      sources: [
        'CoinGecko API',
        'CoinMarketCap',
        'Coinbase Pro',
        'Binance',
        'Kraken'
      ]
    },
    '2': {
      id: '2',
      title: 'Will AI achieve AGI by 2030?',
      description: 'This market resolves to "Yes" if artificial general intelligence (AGI) is achieved by any organization before January 1, 2030. AGI is defined as AI that matches or exceeds human cognitive abilities across all domains.',
      longDescription: 'Artificial General Intelligence represents the next major milestone in AI development. Unlike narrow AI systems that excel at specific tasks, AGI would possess human-level intelligence across all cognitive domains. Leading AI research organizations like OpenAI, DeepMind, and Anthropic are racing toward this goal, with some predicting achievement within this decade. However, significant technical, safety, and philosophical challenges remain. This market allows participants to bet on whether this transformative technology will emerge by 2030.',
      category: 'Technology',
      createdAt: '2024-02-01',
      endDate: '2030-01-01',
      resolutionDate: '2030-01-15',
      totalVolume: 1800000,
      probability: 0.34,
      participants: 892,
      yesPrice: 0.34,
      noPrice: 0.66,
      trending: true,
      tags: ['AI', 'AGI', 'Technology', 'Machine Learning'],
      creator: '0xabcd...efgh',
      totalShares: 5294117,
      yesShares: 1800000,
      noShares: 3494117,
      liquidityPool: 650000,
      status: 'active',
      rules: [
        'AGI must demonstrate human-level performance across multiple cognitive domains',
        'Achievement must be verified by independent AI research organizations',
        'System must show general reasoning, not just task-specific performance',
        'Market resolves based on expert consensus and peer-reviewed evidence'
      ],
      sources: [
        'Major AI Research Papers',
        'OpenAI Announcements',
        'DeepMind Publications',
        'Academic AI Conferences',
        'Expert Panel Consensus'
      ]
    },
    '3': {
      id: '3',
      title: 'Will SpaceX land humans on Mars by 2029?',
      description: 'This market resolves to "Yes" if SpaceX successfully lands humans on the surface of Mars before December 31, 2029. The mission must include live human crew members.',
      longDescription: 'SpaceX has ambitious plans to establish a human presence on Mars, with Elon Musk repeatedly stating goals for human Mars missions in the late 2020s. The Starship vehicle is being developed specifically for this purpose, and successful unmanned missions would likely precede human landing attempts. However, the technical challenges of long-duration spaceflight, Mars entry/descent/landing, and life support systems are immense. This market captures the likelihood of SpaceX achieving this historic milestone within the decade.',
      category: 'Space',
      createdAt: '2024-01-20',
      endDate: '2029-12-31',
      resolutionDate: '2030-01-15',
      totalVolume: 3200000,
      probability: 0.42,
      participants: 2156,
      yesPrice: 0.42,
      noPrice: 0.58,
      trending: false,
      tags: ['SpaceX', 'Mars', 'Space Exploration', 'Human Spaceflight'],
      creator: '0x5678...9abc',
      totalShares: 7619047,
      yesShares: 3200000,
      noShares: 4419047,
      liquidityPool: 1200000,
      status: 'active',
      rules: [
        'Mission must successfully land humans on Mars surface',
        'Crew must be alive at time of landing',
        'Landing must be confirmed by independent space agencies',
        'Mission must be completed before December 31, 2029'
      ],
      sources: [
        'SpaceX Official Announcements',
        'NASA Mission Updates',
        'Space Industry News',
        'Government Space Agencies',
        'Technical Mission Documentation'
      ]
    }
  }
  
  return markets[id] || null
}

// Generate dummy trading history
const getTradingHistory = (marketId) => {
  return [
    { id: 1, user: '0x1234...5678', action: 'Buy YES', amount: 1000, price: 0.67, timestamp: '2024-07-13 10:30' },
    { id: 2, user: '0xabcd...efgh', action: 'Sell NO', amount: 500, price: 0.33, timestamp: '2024-07-13 09:15' },
    { id: 3, user: '0x9876...5432', action: 'Buy YES', amount: 2500, price: 0.68, timestamp: '2024-07-13 08:45' },
    { id: 4, user: '0xfedc...ba98', action: 'Buy NO', amount: 750, price: 0.32, timestamp: '2024-07-12 16:20' },
    { id: 5, user: '0x1111...2222', action: 'Sell YES', amount: 1200, price: 0.66, timestamp: '2024-07-12 14:10' }
  ]
}

export default function MarketDetailPage({ params }) {
  const market = getMarketData(params.id)
  const tradingHistory = getTradingHistory(params.id)
  
  if (!market) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Market Not Found</h1>
          <p className="text-gray-600 mb-8">The market you're looking for doesn't exist or has been removed.</p>
          <Link href="/markets" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Browse All Markets
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/markets" className="text-blue-600 hover:text-blue-800">Markets</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">Market #{market.id}</span>
          </nav>
        </div>
      </div>

      {/* Market Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  market.category === 'Crypto' ? 'bg-orange-100 text-orange-600' :
                  market.category === 'Technology' ? 'bg-purple-100 text-purple-600' :
                  market.category === 'Space' ? 'bg-blue-100 text-blue-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {market.category}
                </span>
                {market.trending && <span className="text-red-500">🔥 Trending</span>}
                <span className="text-green-600 font-semibold">🟢 Active</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {market.title}
              </h1>
              
              <p className="text-lg text-gray-600 max-w-4xl">
                {market.description}
              </p>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 bg-gray-50 rounded-lg p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{(market.probability * 100).toFixed(0)}%</div>
              <div className="text-sm text-gray-500">Current Odds</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">${market.totalVolume.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total Volume</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{market.participants.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Traders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">${market.liquidityPool.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Liquidity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{formatDate(market.endDate)}</div>
              <div className="text-sm text-gray-500">Ends</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Market Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Price Chart */}
            <MarketChart marketId={market.id} />
            
            {/* About This Market */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-xl font-bold mb-4">📋 About This Market</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {market.longDescription}
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">🎯 Resolution Rules</h4>
                  <ul className="space-y-2">
                    {market.rules.map((rule, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">📊 Data Sources</h4>
                  <ul className="space-y-2">
                    {market.sources.map((source, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        {source}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Trading Activity */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-xl font-bold mb-4">📈 Recent Trading Activity</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-sm font-semibold text-gray-600">User</th>
                      <th className="text-left py-2 text-sm font-semibold text-gray-600">Action</th>
                      <th className="text-left py-2 text-sm font-semibold text-gray-600">Amount</th>
                      <th className="text-left py-2 text-sm font-semibold text-gray-600">Price</th>
                      <th className="text-left py-2 text-sm font-semibold text-gray-600">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tradingHistory.map((trade) => (
                      <tr key={trade.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 font-mono text-sm">{trade.user}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            trade.action.includes('YES') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {trade.action}
                          </span>
                        </td>
                        <td className="py-3 font-semibold">${trade.amount}</td>
                        <td className="py-3">{trade.price.toFixed(2)}</td>
                        <td className="py-3 text-gray-500">{trade.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-center">
                <button className="text-blue-600 hover:text-blue-800 font-semibold">
                  View All Trading History
                </button>
              </div>
            </div>
          </div>
          
          {/* Right Column - Trading Interface */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <TradingInterface market={market} />
              
              {/* Market Info Card */}
              <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
                <h3 className="font-bold text-lg mb-4">ℹ️ Market Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-semibold">{formatDate(market.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ends:</span>
                    <span className="font-semibold">{formatDate(market.endDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Resolution:</span>
                    <span className="font-semibold">{formatDate(market.resolutionDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Creator:</span>
                    <span className="font-mono text-sm">{market.creator}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Shares:</span>
                    <span className="font-semibold">{market.totalShares.toLocaleString()}</span>
                  </div>
                </div>
                
                {/* Tags */}
                <div className="mt-6 pt-4 border-t">
                  <div className="text-sm font-semibold text-gray-600 mb-2">Tags:</div>
                  <div className="flex flex-wrap gap-2">
                    {market.tags.map((tag) => (
                      <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
