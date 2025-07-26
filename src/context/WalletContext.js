'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const WalletContext = createContext()

// Wallet types and their detection methods
const WALLET_TYPES = {
  BRAVE: 'brave',
  METAMASK: 'metamask',
  COINBASE: 'coinbase',
  UNKNOWN: 'unknown'
}

// Detect which wallet is available
const detectWallet = () => {
  if (typeof window === 'undefined') return WALLET_TYPES.UNKNOWN
  
  if (window.ethereum?.isBraveWallet) {
    return WALLET_TYPES.BRAVE
  } else if (window.ethereum?.isCoinbaseWallet) {
    return WALLET_TYPES.COINBASE
  } else if (window.ethereum?.isMetaMask) {
    return WALLET_TYPES.METAMASK
  } else if (window.ethereum) {
    // Generic wallet detected, but we'll treat it as unknown for now
    return WALLET_TYPES.UNKNOWN
  }
  
  return null // No wallet detected
}

// Wallet configuration for different types
const WALLET_CONFIG = {
  [WALLET_TYPES.BRAVE]: {
    name: 'Brave Wallet',
    icon: '🦁',
    color: 'orange',
    downloadUrl: 'https://brave.com/download/',
    description: 'Built into Brave browser'
  },
  [WALLET_TYPES.METAMASK]: {
    name: 'MetaMask',
    icon: '🦊',
    color: 'orange',
    downloadUrl: 'https://metamask.io/download/',
    description: 'Popular Ethereum wallet'
  },
  [WALLET_TYPES.COINBASE]: {
    name: 'Coinbase Wallet',
    icon: '🔵',
    color: 'blue',
    downloadUrl: 'https://www.coinbase.com/wallet',
    description: 'Coinbase\'s self-custody wallet'
  },
  [WALLET_TYPES.UNKNOWN]: {
    name: 'Ethereum Wallet',
    icon: '⚡',
    color: 'gray',
    downloadUrl: '#',
    description: 'Generic Ethereum wallet'
  }
}

export function WalletProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [walletType, setWalletType] = useState(null)
  const [walletConfig, setWalletConfig] = useState(null)

  // Detect wallet on mount
  useEffect(() => {
    const detected = detectWallet()
    setWalletType(detected)
    
    if (detected) {
      setWalletConfig(WALLET_CONFIG[detected])
      checkExistingConnection()
      setupEventListeners()
    }

    return () => {
      removeEventListeners()
    }
  }, [])

  const checkExistingConnection = async () => {
    if (!window.ethereum) return

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      if (accounts.length > 0) {
        setAddress(accounts[0])
        setIsConnected(true)
      }
    } catch (error) {
      console.error('Error checking existing connection:', error)
    }
  }

  const setupEventListeners = () => {
    if (!window.ethereum) return

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)
    window.ethereum.on('disconnect', handleDisconnect)
  }

  const removeEventListeners = () => {
    if (!window.ethereum || !window.ethereum.removeListener) return

    window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
    window.ethereum.removeListener('chainChanged', handleChainChanged)
    window.ethereum.removeListener('disconnect', handleDisconnect)
  }

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setAddress(accounts[0])
      setIsConnected(true)
      setError(null)
    } else {
      setAddress(null)
      setIsConnected(false)
    }
  }

  const handleChainChanged = (chainId) => {
    // Reload the page when chain changes for now
    window.location.reload()
  }

  const handleDisconnect = () => {
    setAddress(null)
    setIsConnected(false)
  }

  const connect = useCallback(async () => {
    if (!walletType) {
      setError('No compatible wallet detected. Please install a supported wallet.')
      return false
    }

    setIsLoading(true)
    setError(null)

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      if (accounts.length > 0) {
        setAddress(accounts[0])
        setIsConnected(true)
        setError(null)
        return true
      } else {
        throw new Error('No accounts found')
      }
    } catch (error) {
      console.error('Connection error:', error)
      let errorMessage = `Failed to connect to ${walletConfig?.name || 'wallet'}`
      
      if (error.code === 4001) {
        errorMessage = 'Connection rejected by user'
      } else if (error.code === -32002) {
        errorMessage = 'Connection request already pending'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setError(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [walletType, walletConfig])

  const disconnect = useCallback(() => {
    setAddress(null)
    setIsConnected(false)
    setError(null)
    
    // Note: Not all wallets support programmatic disconnect
    // Users may need to disconnect from the wallet interface directly
  }, [])

  const switchChain = async (chainId) => {
    if (!window.ethereum) return false

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainId }],
      })
      return true
    } catch (error) {
      console.error('Failed to switch chain:', error)
      setError('Failed to switch network')
      return false
    }
  }

  const addChain = async (chainConfig) => {
    if (!window.ethereum) return false

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [chainConfig],
      })
      return true
    } catch (error) {
      console.error('Failed to add chain:', error)
      setError('Failed to add network')
      return false
    }
  }

  const signMessage = async (message) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected')
    }

    try {
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      })
      return signature
    } catch (error) {
      console.error('Failed to sign message:', error)
      throw error
    }
  }

  const getBalance = async () => {
    if (!isConnected || !address) {
      return null
    }

    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      })
      
      // Convert from wei to ETH
      const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18)
      return balanceInEth
    } catch (error) {
      console.error('Failed to get balance:', error)
      return null
    }
  }

  const value = {
    // Connection state
    isConnected,
    address,
    isLoading,
    error,
    
    // Wallet info
    walletType,
    walletConfig,
    isWalletAvailable: !!walletType,
    
    // Actions
    connect,
    disconnect,
    switchChain,
    addChain,
    signMessage,
    getBalance,
    
    // Wallet types for comparison
    WALLET_TYPES
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

// Utility functions
export function formatAddress(address, chars = 4) {
  if (!address) return ''
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

export function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

// Helper hooks for specific wallet types
export function useBraveWallet() {
  const wallet = useWallet()
  return {
    ...wallet,
    isBraveWallet: wallet.walletType === WALLET_TYPES.BRAVE
  }
}

export function useMetaMask() {
  const wallet = useWallet()
  return {
    ...wallet,
    isMetaMask: wallet.walletType === WALLET_TYPES.METAMASK
  }
}

export function useCoinbaseWallet() {
  const wallet = useWallet()
  return {
    ...wallet,
    isCoinbaseWallet: wallet.walletType === WALLET_TYPES.COINBASE
  }
}
