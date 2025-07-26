// Comment Section Component
export default function CommentSection({ marketId }) {
  return (
    <div className="bg-gray-900/90 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl p-6">
      <h3 className="font-semibold text-lg mb-4 text-white">Comments & Discussion</h3>
      <p className="text-gray-300 mb-4">Discussion for Market ID: {marketId}</p>
      
      <div className="space-y-4">
        <textarea 
          placeholder="Add a comment..."
          className="w-full bg-gray-800/50 border border-white/10 rounded-lg p-3 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
          rows="3"
        />
        <button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105">
          Post Comment
        </button>
      </div>
    </div>
  )
}
