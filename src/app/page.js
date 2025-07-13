import Hero from '@/components/Hero'
import FeaturedMarkets from '@/components/FeaturedMarkets'
import MarketCategories from '@/components/MarketCategories'
import TradingStats from '@/components/TradingStats'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero />
      
      {/* Trading Statistics */}
      <section className="py-12 bg-white">
        <TradingStats />
      </section>
      
      {/* Featured Markets */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🔥 Trending Markets
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trade on the most popular prediction markets right now
            </p>
          </div>
          <FeaturedMarkets />
        </div>
      </section>
      
      {/* Market Categories */}
      <section className="py-16 bg-white">
        <MarketCategories />
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Trading?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of traders making predictions on real-world events
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/markets" 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Markets
            </a>
            <a 
              href="/markets/create" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Create Market
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
