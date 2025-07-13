// Market Chart Component
export default function MarketChart({ marketId }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="font-semibold text-lg mb-4">Price Chart</h3>
      <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
        <p className="text-gray-500">Price chart for Market ID: {marketId}</p>
      </div>
    </div>
  )
}
