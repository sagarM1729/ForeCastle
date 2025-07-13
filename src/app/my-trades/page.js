import TradeHistory from '@/components/TradeHistory'
import PositionsList from '@/components/PositionsList'
import TradingStats from '@/components/TradingStats'

export default function MyTradesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          My Trading Activity
        </h1>
        <p className="text-xl text-gray-600">
          View your trades, positions, and performance
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <TradeHistory />
          <PositionsList />
        </div>
        
        <div className="lg:col-span-1">
          <TradingStats />
        </div>
      </div>
    </div>
  )
}
