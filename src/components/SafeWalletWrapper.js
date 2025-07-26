'use client'

import { useState, useEffect } from 'react'

// Safe wrapper component to handle wallet-related errors gracefully
export default function SafeWalletWrapper({ children, fallback = null }) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Reset error state on component mount
    setHasError(false)
  }, [])

  if (hasError) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">
          Wallet connection error. Please refresh the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Refresh Page
        </button>
      </div>
    )
  }

  try {
    return children
  } catch (error) {
    console.error('SafeWalletWrapper caught error:', error)
    setHasError(true)
    return fallback || (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">Something went wrong. Please try again.</p>
      </div>
    )
  }
}
