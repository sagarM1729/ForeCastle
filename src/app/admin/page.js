import AdminDashboard from '@/components/AdminDashboard'

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Admin Panel
        </h1>
        <p className="text-xl text-gray-600">
          Manage markets, users, and platform settings
        </p>
      </div>
      
      <AdminDashboard />
    </div>
  )
}
