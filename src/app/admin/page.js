'use client'

import { useWallet } from '@/context/WalletContext'
import AdminDashboard from '@/components/AdminDashboard'
import { motion } from 'framer-motion'
import { CONFIG } from '@/config/constants'
import PageLayout from '@/components/PageLayout'

export default function AdminPage() {
  const { address, isConnected } = useWallet()
  
  // Check if current user is admin
  const isAdmin = isConnected && address && address.toLowerCase() === CONFIG.ADMIN_WALLET_ADDRESS.toLowerCase()

  // If wallet is not connected
  if (!isConnected) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/90 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-8 text-center max-w-md mx-4 relative z-10"
          >
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-2xl font-bold text-white mb-4">Admin Access Required</h2>
            <p className="text-gray-300 mb-6">Please connect your wallet to access the admin dashboard.</p>
            <button className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all">
              Connect Wallet
            </button>
          </motion.div>
        </div>
      </PageLayout>
    )
  }

  // If connected but not admin
  if (!isAdmin) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/90 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-8 text-center max-w-md mx-4 relative z-10"
          >
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
            <p className="text-gray-300 mb-2">This area is restricted to administrators only.</p>
            <p className="text-sm text-gray-400 mb-6">
              Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
            <button 
              onClick={() => window.history.back()}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-all"
            >
              Go Back
            </button>
          </motion.div>
        </div>
      </PageLayout>
    )
  }

  // Admin access granted
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-3xl">👑</div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <p className="text-gray-300">
            Welcome, Administrator! Manage markets, monitor trades, and oversee platform operations.
          </p>
          <div className="text-sm text-gray-400 mt-2">
            Logged in as: {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
        </motion.div>

        <AdminDashboard />
      </div>
    </PageLayout>
  )
}
