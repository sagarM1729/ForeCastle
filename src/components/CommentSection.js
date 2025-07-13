// Comment Section Component
export default function CommentSection({ marketId }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="font-semibold text-lg mb-4">Comments & Discussion</h3>
      <p className="text-gray-600 mb-4">Discussion for Market ID: {marketId}</p>
      
      <div className="space-y-4">
        <textarea 
          placeholder="Add a comment..."
          className="w-full input-field"
          rows="3"
        />
        <button className="btn-primary">Post Comment</button>
      </div>
    </div>
  )
}
