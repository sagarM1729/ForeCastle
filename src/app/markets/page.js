import Link from 'next/link'
import MarketGrid from '@/components/MarketGrid'

// Dummy market data
const dummyMarkets = [
  {
    id: '1',
    title: 'Will Bitcoin reach $100,000 by end of 2025?',
    description: 'Predict whether Bitcoin will hit the $100k milestone before January 1, 2026',
    category: 'Crypto',
    endDate: '2025-12-31',
    totalVolume: 2500000,
    probability: 0.68,
    participants: 1247,
    yesPrice: 0.68,
    noPrice: 0.32,
    trending: true,
    tags: ['Bitcoin', 'Cryptocurrency', 'Price Prediction']
  },
  {
    id: '2',
    title: 'Will AI achieve AGI by 2030?',
    description: 'Will artificial general intelligence be achieved by any organization before 2030?',
    category: 'Technology',
    endDate: '2030-01-01',
    totalVolume: 1800000,
    probability: 0.34,
    participants: 892,
    yesPrice: 0.34,
    noPrice: 0.66,
    trending: true,
    tags: ['AI', 'AGI', 'Technology']
  },
  {
    id: '3',
    title: 'Will SpaceX land humans on Mars by 2029?',
    description: 'Will SpaceX successfully land the first humans on Mars before 2030?',
    category: 'Space',
    endDate: '2029-12-31',
    totalVolume: 3200000,
    probability: 0.42,
    participants: 2156,
    yesPrice: 0.42,
    noPrice: 0.58,
    trending: false,
    tags: ['SpaceX', 'Mars', 'Space Exploration']
  },
  {
    id: '4',
    title: 'Will the next US Presidential Election be decided by < 100k votes?',
    description: 'Will the margin of victory in the Electoral College come down to a swing state decided by less than 100,000 votes?',
    category: 'Politics',
    endDate: '2028-11-15',
    totalVolume: 4100000,
    probability: 0.71,
    participants: 3421,
    yesPrice: 0.71,
    noPrice: 0.29,
    trending: true,
    tags: ['Election', 'Politics', 'US']
  },
  {
    id: '5',
    title: 'Will Formula 1 introduce electric cars by 2030?',
    description: 'Will Formula 1 officially transition to fully electric vehicles by 2030?',
    category: 'Sports',
    endDate: '2030-06-01',
    totalVolume: 890000,
    probability: 0.23,
    participants: 567,
    yesPrice: 0.23,
    noPrice: 0.77,
    trending: false,
    tags: ['Formula 1', 'Electric', 'Sports']
  },
  {
    id: '6',
    title: 'Will global temperature rise exceed 2°C by 2035?',
    description: 'Will the global average temperature increase exceed 2°C above pre-industrial levels by 2035?',
    category: 'Climate',
    endDate: '2035-12-31',
    totalVolume: 1560000,
    probability: 0.58,
    participants: 1834,
    yesPrice: 0.58,
    noPrice: 0.42,
    trending: true,
    tags: ['Climate', 'Temperature', 'Environment']
  }
]

const categories = [
  { name: 'All', count: dummyMarkets.length, active: true },
  { name: 'Crypto', count: 1 },
  { name: 'Technology', count: 1 },
  { name: 'Space', count: 1 },
  { name: 'Politics', count: 1 },
  { name: 'Sports', count: 1 },
  { name: 'Climate', count: 1 }
]

export default function MarketsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                🏰 All Markets
              </h1>
              <p className="text-lg text-gray-600">
                Trade on prediction markets across all categories
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link 
                href="/markets/create"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                ➕ Create Market
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-blue-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 font-semibold">📊 Total Markets:</span>
              <span className="font-bold text-gray-900">{dummyMarkets.length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 font-semibold">💰 Total Volume:</span>
              <span className="font-bold text-gray-900">
                ${dummyMarkets.reduce((sum, market) => sum + market.totalVolume, 0).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 font-semibold">👥 Active Traders:</span>
              <span className="font-bold text-gray-900">
                {dummyMarkets.reduce((sum, market) => sum + market.participants, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h3 className="font-bold text-lg mb-4">🗂️ Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button 
                    key={category.name}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                      category.active 
                        ? 'bg-blue-100 text-blue-700 font-semibold' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold mb-3">🔍 Filters</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                      <option>All Markets</option>
                      <option>Active</option>
                      <option>Ending Soon</option>
                      <option>High Volume</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                      <option>Most Popular</option>
                      <option>Highest Volume</option>
                      <option>Ending Soon</option>
                      <option>Recently Created</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Markets Grid */}
          <div className="lg:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  Showing {dummyMarkets.length} markets
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">View:</span>
                  <button className="p-2 bg-blue-100 text-blue-600 rounded">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Market Cards Grid */}
            <MarketGrid markets={dummyMarkets} />

            {/* Load More */}
            <div className="text-center mt-8">
              <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                Load More Markets
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
