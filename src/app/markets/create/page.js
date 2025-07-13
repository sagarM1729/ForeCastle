import MarketForm from '@/components/MarketForm'

export default function CreateMarketPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create New Market
          </h1>
          <p className="text-xl text-gray-600">
            Create a prediction market on any future event
          </p>
        </div>
        
        <MarketForm />
      </div>
    </div>
  )
}
