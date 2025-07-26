import Hero from '@/components/Hero'
import FeaturedMarkets from '@/components/FeaturedMarkets'
import MarketCategories from '@/components/MarketCategories'
import TradingStats from '@/components/TradingStats'
import PageLayout from '@/components/PageLayout'

export default function HomePage() {
  return (
    <div className="min-h-screen -mt-20">
      {/* Hero Section */}
      <Hero />
      
      {/* Trading Statistics */}
      <PageLayout showBackgroundElements={true} className="py-20" minHeight="">
        <TradingStats />
      </PageLayout>
      
      {/* Featured Markets */}
      <PageLayout showBackgroundElements={true} className="py-24" minHeight="">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="section-badge mb-6">
              🔥 Trending Now
            </div>
            <h2 className="section-title">
              Hottest Markets
            </h2>
            <p className="section-description">
              Join thousands of traders making predictions on the world's most exciting events. 
              Real-time pricing, instant execution, transparent outcomes.
            </p>
          </div>
          <FeaturedMarkets />
        </div>
      </PageLayout>
      
      {/* Market Categories */}
      <PageLayout showBackgroundElements={true} className="py-24" minHeight="">
        <MarketCategories />
      </PageLayout>
      
      {/* Call to Action */}
      <PageLayout showBackgroundElements={true} className="py-32" minHeight="">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Ready to Shape
              </span>
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                Tomorrow?
              </span>
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Join the future of prediction markets. Create markets, trade insights, 
              and earn rewards while helping the world make better decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <div className="sp">
                <a 
                  href="/markets" 
                  className="sparkle-button primary"
                >
                  <span className="spark"></span>
                  <span className="backdrop"></span>
                  <svg className="sparkle" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0L13.09 8.91L22 10L13.09 11.09L12 20L10.91 11.09L2 10L10.91 8.91L12 0Z"/>
                    <path d="M19 4L19.5 6.5L22 7L19.5 7.5L19 10L18.5 7.5L16 7L18.5 6.5L19 4Z"/>
                    <path d="M5 14L5.5 16.5L8 17L5.5 17.5L5 20L4.5 17.5L2 17L4.5 16.5L5 14Z"/>
                  </svg>
                  <span className="text">🚀 Start Trading Now</span>
                </a>
              </div>
              <div className="sp">
                <a 
                  href="/markets/create" 
                  className="sparkle-button secondary"
                >
                  <span className="spark"></span>
                  <span className="backdrop"></span>
                  <svg className="sparkle" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0L13.09 8.91L22 10L13.09 11.09L12 20L10.91 11.09L2 10L10.91 8.91L12 0Z"/>
                    <path d="M19 4L19.5 6.5L22 7L19.5 7.5L19 10L18.5 7.5L16 7L18.5 6.5L19 4Z"/>
                    <path d="M5 14L5.5 16.5L8 17L5.5 17.5L5 20L4.5 17.5L2 17L4.5 16.5L5 14Z"/>
                  </svg>
                  <span className="text">✨ Create Your Market</span>
                </a>
              </div>
            </div>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p className="text-gray-400">Execute trades in milliseconds with our optimized infrastructure</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold mb-2">Fully Secure</h3>
                <p className="text-gray-400">Your funds are protected by cutting-edge blockchain technology</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">Real-time Data</h3>
                <p className="text-gray-400">Get instant market updates and transparent price discovery</p>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  )
}
