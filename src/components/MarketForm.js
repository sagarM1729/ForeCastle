'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useWallet } from '@/context/WalletContext'
import UniversalWalletButton from './UniversalWalletButton'
import Loader from './Loader'

// Enhanced Market Form Component with Universal Wallet Connection & AWS Database Integration
export default function MarketForm({ onSuccess, onCancel }) {
  const { isConnected, address, connect, walletType } = useWallet()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    creator_wallet: '',
    tags: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [result, setResult] = useState(null)

  // Auto-populate wallet address when connected
  useEffect(() => {
    if (isConnected && address) {
      setFormData(prev => ({ ...prev, creator_wallet: address }))
    } else {
      setFormData(prev => ({ ...prev, creator_wallet: '' }))
    }
  }, [isConnected, address])

  const categories = [
    { value: 'Crypto', label: '₿ Crypto', color: 'from-orange-400 to-yellow-500' },
    { value: 'Politics', label: '🗳️ Politics', color: 'from-blue-400 to-indigo-500' },
    { value: 'Sports', label: '⚽ Sports', color: 'from-green-400 to-emerald-500' },
    { value: 'Tech', label: '💻 Technology', color: 'from-purple-400 to-pink-500' },
    { value: 'Finance', label: '📈 Finance', color: 'from-emerald-400 to-teal-500' },
    { value: 'Entertainment', label: '🎬 Entertainment', color: 'from-pink-400 to-rose-500' },
    { value: 'Other', label: '🌟 Other', color: 'from-gray-400 to-slate-500' }
  ]

  const validateForm = () => {
    const newErrors = {}
    
    // Check wallet connection first
    if (!isConnected || !address) {
      newErrors.wallet = 'Please connect your wallet to create a market'
      setErrors(newErrors)
      return false
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Market question is required'
    } else if (formData.title.length < 10) {
      newErrors.title = 'Market question must be at least 10 characters'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters'
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setResult(null)
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/markets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          creator_wallet: address // Use connected wallet address
        })
      })

      const data = await response.json()
      
      // Log response for debugging
      console.log('API Response:', { 
        status: response.status, 
        statusText: response.statusText, 
        data 
      })
      
      if (data.success) {
        setResult({ success: true, data: data.data })
        // Reset form on success
        setFormData({
          title: '',
          description: '',
          category: '',
          creator_wallet: '',
          tags: ''
        })
        // Call success callback if provided
        onSuccess?.(data.data)
      } else {
        console.error('Market creation failed:', data)
        setResult({ success: false, error: data.error || data.details || 'Unknown error' })
      }
    } catch (error) {
      console.error('Network error:', error)
      setResult({ success: false, error: `Network error: ${error.message}` })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const selectedCategory = categories.find(cat => cat.value === formData.category)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900/90 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl p-8 max-w-4xl mx-auto"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Create New Market
        </h2>
        <p className="text-gray-600">
          Create a prediction market that will be stored in AWS PostgreSQL
        </p>
        
        {/* Wallet Connection Status */}
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <div className="flex items-center justify-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
            <span className="font-medium text-gray-700">
              {isConnected ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Wallet Not Connected'}
            </span>
            {!isConnected && (
              <div className="ml-2">
                <UniversalWalletButton size="small" />
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Wallet Connection Required Notice */}
      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl"
        >
          <div className="flex items-start space-x-4">
            <div className="text-3xl">🔐</div>
            <div>
              <h3 className="font-bold text-yellow-800 mb-2">Wallet Connection Required</h3>
              <p className="text-yellow-700 text-sm mb-4">
                You need to connect your wallet to create a prediction market. Your wallet address will be used to:
              </p>
              <ul className="text-yellow-700 text-sm space-y-1 ml-4">
                <li>• Identify you as the market creator</li>
                <li>• Automatically populate your wallet address</li>
                <li>• Ensure secure market ownership</li>
                <li>• Enable future market management features</li>
              </ul>
              <div className="mt-4 flex justify-center">
                <UniversalWalletButton />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className={`space-y-6 ${!isConnected ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Market Question */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Market Question *
          </label>
          <input 
            type="text" 
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
              errors.title 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-gray-200 focus:border-blue-500'
            }`}
            placeholder="Will Bitcoin reach $100,000 by end of 2025?"
          />
          {errors.title && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-1 text-sm text-red-600"
            >
              {errors.title}
            </motion.p>
          )}
        </motion.div>
        
        {/* Description */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description *
          </label>
          <textarea 
            rows="4"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 resize-none ${
              errors.description 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-gray-200 focus:border-blue-500'
            }`}
            placeholder="Provide detailed information about this prediction market. What are the resolution criteria? When will it be resolved?"
          />
          {errors.description && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-1 text-sm text-red-600"
            >
              {errors.description}
            </motion.p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.description.length}/500 characters
          </p>
        </motion.div>
        
        {/* Category and Wallet Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category *
            </label>
            <div className="relative">
              <select 
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 appearance-none bg-white ${
                  errors.category 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-blue-500'
                }`}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {formData.category && selectedCategory && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`mt-2 inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${selectedCategory.color}`}
              >
                <span>{selectedCategory.label}</span>
              </motion.div>
            )}
            {errors.category && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.category}
              </motion.p>
            )}
          </motion.div>
          
          {/* Connected Wallet Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Creator Wallet Address *
            </label>
            <div className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 font-mono text-sm ${
              isConnected 
                ? 'border-green-300 bg-green-50 text-green-800' 
                : 'border-gray-200 bg-gray-50 text-gray-500'
            }`}>
              {isConnected ? address : 'Please connect your wallet first'}
            </div>
            <div className="mt-2 flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-gray-400'} animate-pulse`}></div>
              <span className={`text-xs font-medium ${isConnected ? 'text-green-600' : 'text-gray-500'}`}>
                {isConnected ? `${walletType} Connected` : 'Not Connected'}
              </span>
              {isConnected && (
                <UniversalWalletButton size="small" />
              )}
            </div>
            {errors.wallet && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.wallet}
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tags (Optional)
          </label>
          <input 
            type="text" 
            value={formData.tags}
            onChange={(e) => handleInputChange('tags', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
            placeholder="bitcoin, cryptocurrency, price prediction"
          />
          <p className="mt-1 text-xs text-gray-500">
            Add relevant tags separated by commas
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 pt-4"
        >
          <motion.button
            type="submit"
            disabled={isLoading || !isConnected}
            whileHover={{ scale: !isConnected ? 1 : 1.02 }}
            whileTap={{ scale: !isConnected ? 1 : 0.98 }}
            className={`flex-1 font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
              !isConnected 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : isLoading
                ? 'bg-gradient-to-r from-purple-400 to-blue-400 text-white cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-xl hover:from-purple-700 hover:to-blue-700'
            }`}
          >
            {!isConnected ? (
              <>
                <span>🔒</span>
                <span>Connect Wallet First</span>
              </>
            ) : isLoading ? (
              <>
                <Loader size="sm" />
                <span>Creating Market...</span>
              </>
            ) : (
              <>
                <span>🚀</span>
                <span>Create Market</span>
              </>
            )}
          </motion.button>
          
          {onCancel && (
            <motion.button
              type="button"
              onClick={onCancel}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 sm:flex-none px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </motion.button>
          )}
        </motion.div>
      </form>

      {/* Result Display */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 p-4 rounded-xl border-2 ${
            result.success 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-2xl">
              {result.success ? '✅' : '❌'}
            </span>
            <div className="flex-1">
              <h3 className="font-semibold">
                {result.success ? 'Market Created Successfully!' : 'Error Creating Market'}
              </h3>
              {result.success && result.data && (
                <div className="mt-2 text-sm">
                  <p><strong>ID:</strong> {result.data.id}</p>
                  <p><strong>Title:</strong> {result.data.title}</p>
                  <p><strong>Status:</strong> {result.data.status}</p>
                  <p><strong>Options:</strong> {result.data.options?.length || 0} created</p>
                </div>
              )}
              {!result.success && (
                <p className="mt-1 text-sm">{result.error}</p>
              )}
            </div>
          </div>
        </motion.div>
      )}

    </motion.div>
  )
}
