'use client'

import MarketForm from '../../../components/MarketForm'
import { useRouter } from 'next/navigation'

export default function CreateMarketPage() {
  const router = useRouter()

  const handleSuccess = (marketData) => {
    // Show success and redirect to the created market
    setTimeout(() => {
      router.push(`/markets/${marketData.id}`)
    }, 2000)
  }

  const handleCancel = () => {
    router.push('/markets')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-orange-900 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto pt-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            ⚡ Create New Market
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Create a prediction market using your connected wallet
          </p>
        </div>
        
        <MarketForm 
          onSuccess={handleSuccess} 
          onCancel={handleCancel} 
        />
        
        {/* Bottom spacing */}
        <div className="h-16"></div>
      </div>
    </div>
  )
}
