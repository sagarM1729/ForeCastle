'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const BraveWalletContext = createContext({
  isConnected: false,
  address: null,
  connect: async () => {},
  disconnect: () => {},
  isLoading: false,
  error: null
})

export function BraveWalletProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Check if Brave Wallet is available
  const isBraveWallet = () => {
    return typeof window !== 'undefined' && 
           window.ethereum && 
           window.ethereum.isBraveWallet
  }

  // Check for existing connection on mount
  useEffect(() => {
    checkExistingConnection()
  }, [])

  const checkExistingConnection = async () => {
    if (!isBraveWallet()) return

    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_accounts' 
      })
      
      if (accounts.length > 0) {
        setAddress(accounts[0])
        setIsConnected(true)
      }
    } catch (err) {
      console.error('Error checking existing connection:', err)
    }
  }

  const connect = async () => {
    if (!isBraveWallet()) {
      setError('Brave Wallet is not available. Please install Brave browser or enable Brave Wallet.')
      return false
    }

    setIsLoading(true)
    setError(null)

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      if (accounts.length > 0) {
        setAddress(accounts[0])
        setIsConnected(true)
        setError(null)
        
        // Set up account change listener
        window.ethereum.on('accountsChanged', handleAccountsChanged)
        window.ethereum.on('chainChanged', handleChainChanged)
        
        return true
      }
    } catch (err) {
      console.error('Error connecting to Brave Wallet:', err)
      setError(err.message || 'Failed to connect to Brave Wallet')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setAddress(null)
    setError(null)
    
    // Remove listeners
    if (window.ethereum && window.ethereum.removeListener) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnect()
    } else if (accounts[0] !== address) {
      setAddress(accounts[0])
    }
  }

  const handleChainChanged = () => {
    // Reload page on chain change for simplicity
    window.location.reload()
  }

  const value = {
    isConnected,
    address,
    connect,
    disconnect,
    isLoading,
    error,
    isBraveWallet: isBraveWallet()
  }

  return (
    <BraveWalletContext.Provider value={value}>
      {children}
    </BraveWalletContext.Provider>
  )
}

export const useBraveWallet = () => {
  const context = useContext(BraveWalletContext)
  if (!context) {
    throw new Error('useBraveWallet must be used within BraveWalletProvider')
  }
  return context
}
