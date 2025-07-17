'use client'

import { useState, useEffect } from 'react'

// Component to safely render wallet-related components only when needed
export function SafeWalletWrapper({ children }) {
  const [canRenderWallet, setCanRenderWallet] = useState(false)
  const [userInitiated, setUserInitiated] = useState(false)

  useEffect(() => {
    // Only enable wallet rendering after user interaction
    const handleUserInteraction = () => {
      if (!userInitiated) {
        setUserInitiated(true)
        setTimeout(() => setCanRenderWallet(true), 100)
      }
    }

    // Listen for any user interaction before enabling wallet
    document.addEventListener('click', handleUserInteraction, { once: true })
    document.addEventListener('keydown', handleUserInteraction, { once: true })
    document.addEventListener('touchstart', handleUserInteraction, { once: true })

    return () => {
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('keydown', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
    }
  }, [userInitiated])

  // Provide a fallback if wallet can't render
  if (!canRenderWallet) {
    return (
      <button 
        onClick={() => {
          setUserInitiated(true)
          setCanRenderWallet(true)
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
      >
        Connect Wallet
      </button>
    )
  }

  return children
}

export default SafeWalletWrapper
