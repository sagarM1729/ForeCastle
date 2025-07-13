// Market Form Component
export default function MarketForm() {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Market Question
          </label>
          <input 
            type="text" 
            className="w-full input-field"
            placeholder="Will Bitcoin reach $100,000 by end of 2025?"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea 
            rows="4"
            className="w-full input-field"
            placeholder="Provide details about the market resolution criteria..."
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select className="w-full input-field">
              <option value="">Select Category</option>
              <option value="politics">Politics</option>
              <option value="sports">Sports</option>
              <option value="crypto">Crypto</option>
              <option value="technology">Technology</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input 
              type="datetime-local" 
              className="w-full input-field"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Source URL (Optional)
          </label>
          <input 
            type="url" 
            className="w-full input-field"
            placeholder="https://example.com/source"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <input 
            type="text" 
            className="w-full input-field"
            placeholder="bitcoin, cryptocurrency, price"
          />
        </div>
        
        <div className="flex gap-4">
          <button type="submit" className="btn-primary">
            Create Market
          </button>
          <button type="button" className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
