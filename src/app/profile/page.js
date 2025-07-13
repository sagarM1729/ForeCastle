import WalletProfile from '@/components/WalletProfile'
import UserStats from '@/components/UserStats'
import RecentActivity from '@/components/RecentActivity'

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Profile & Wallet
        </h1>
        <p className="text-xl text-gray-600">
          Manage your account and view your trading statistics
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <WalletProfile />
          <RecentActivity />
        </div>
        
        <div className="lg:col-span-1">
          <UserStats />
        </div>
      </div>
    </div>
  )
}
