// Trade Modal Component
export default function TradeModal() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="font-semibold text-lg mb-4">Place Trade</h3>
        <p className="text-gray-600 mb-4">Select your position and amount</p>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <button className="flex-1 bg-green-600 text-white py-2 rounded">
              YES 67¢
            </button>
            <button className="flex-1 bg-red-600 text-white py-2 rounded">
              NO 33¢
            </button>
          </div>
          
          <input 
            type="number" 
            placeholder="Amount ($)"
            className="w-full input-field"
          />
          
          <div className="flex gap-2">
            <button className="flex-1 btn-primary">
              Place Trade
            </button>
            <button className="flex-1 btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
