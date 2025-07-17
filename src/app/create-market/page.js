'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function CreateMarket() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Crypto',
    creator_wallet: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/markets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Create New Market 🏛️
        </h1>
        
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 space-y-6"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Market Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g., Will Bitcoin reach $100,000 by end of 2024?"
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 h-32"
              placeholder="Provide detailed information about this prediction market..."
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Crypto">Crypto</option>
              <option value="Politics">Politics</option>
              <option value="Sports">Sports</option>
              <option value="Tech">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Creator Wallet Address
            </label>
            <input
              type="text"
              value={formData.creator_wallet}
              onChange={(e) => setFormData({ ...formData, creator_wallet: e.target.value })}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="0x..."
              required
            />
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Creating Market...' : 'Create Market 🚀'}
          </motion.button>
        </motion.form>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-lg ${
              result.success 
                ? 'bg-green-500/20 border border-green-400' 
                : 'bg-red-500/20 border border-red-400'
            }`}
          >
            <h3 className={`font-semibold ${result.success ? 'text-green-400' : 'text-red-400'}`}>
              {result.success ? '✅ Success!' : '❌ Error'}
            </h3>
            <pre className="mt-2 text-sm text-white/80 overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </motion.div>
        )}

        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            💡 This creates a market in your AWS PostgreSQL database
          </p>
        </div>
      </motion.div>
    </div>
  )
}
