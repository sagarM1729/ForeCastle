// Admin Dashboard Component
export default function AdminDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="font-semibold text-lg mb-4">Platform Statistics</h3>
        <p className="text-gray-600">Overall platform metrics</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="font-semibold text-lg mb-4">Market Management</h3>
        <p className="text-gray-600">Manage and moderate markets</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="font-semibold text-lg mb-4">User Management</h3>
        <p className="text-gray-600">User administration tools</p>
      </div>
    </div>
  )
}
