// Market Filters Component
export default function MarketFilters() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="font-semibold text-lg mb-4">Filters</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select className="w-full input-field">
            <option value="">All Categories</option>
            <option value="politics">Politics</option>
            <option value="sports">Sports</option>
            <option value="crypto">Crypto</option>
            <option value="technology">Technology</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select className="w-full input-field">
            <option value="">All Markets</option>
            <option value="active">Active</option>
            <option value="ended">Ended</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select className="w-full input-field">
            <option value="volume">Volume</option>
            <option value="newest">Newest</option>
            <option value="ending">Ending Soon</option>
            <option value="activity">Most Active</option>
          </select>
        </div>
        
        <button className="w-full btn-primary">
          Apply Filters
        </button>
      </div>
    </div>
  )
}
