'use client'

import { motion } from 'framer-motion'
import { useWallet } from '@/context/WalletContext'
import Loader from './Loader'

export default function UniversalWalletButton({ className = '', size = 'default' }) {
  const { 
    isConnected, 
    address, 
    connect, 
    disconnect, 
    isLoading, 
    error, 
    isWalletAvailable, 
    walletConfig,
    walletType,
    WALLET_TYPES
  } = useWallet()

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  }

  const handleClick = async () => {
    if (isConnected) {
      disconnect()
    } else {
      await connect()
    }
  }

  // Get color classes based on wallet type
  const getColorClasses = () => {
    if (!isWalletAvailable) return 'bg-gray-500 hover:bg-gray-600'
    
    switch (walletConfig?.color) {
      case 'orange':
        return isConnected 
          ? 'bg-green-500 hover:bg-green-600' 
          : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
      case 'blue':
        return isConnected 
          ? 'bg-green-500 hover:bg-green-600'
          : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
      default:
        return isConnected 
          ? 'bg-green-500 hover:bg-green-600'
          : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700'
    }
  }

  // Show install message if no wallet is available
  if (!isWalletAvailable) {
    return (
      <div className="text-center p-4">
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 max-w-md mx-auto">
          <div className="text-4xl mb-2">🦊</div>
          <h3 className="font-bold text-yellow-800 mb-2">Ethereum Wallet Required</h3>
          <p className="text-yellow-700 text-sm mb-4">
            To use this app, you need an Ethereum wallet. Choose from popular options:
          </p>
          <div className="space-y-2">
            <a
              href="https://brave.com/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              🦁 Download Brave Browser
            </a>
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              🦊 Install MetaMask
            </a>
            <a
              href="https://www.coinbase.com/wallet"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔵 Get Coinbase Wallet
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <motion.button
        onClick={handleClick}
        disabled={isLoading}
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        className={`
          flex items-center space-x-2 font-semibold rounded-xl shadow-lg transition-all duration-200 text-white
          ${getColorClasses()}
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          ${sizeClasses[size]}
          ${className}
        `}
      >
        {isLoading ? (
          <>
            <Loader size="xs" />
            <span>Connecting...</span>
          </>
        ) : isConnected ? (
          <>
            <div className="w-2 h-2 rounded-full bg-green-200 animate-pulse"></div>
            <span>
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </>
        ) : (
          <>
            <span className="text-xl">{walletConfig?.icon || '⚡'}</span>
            <span>Connect {walletConfig?.name || 'Wallet'}</span>
          </>
        )}
      </motion.button>

      {/* Wallet Type Indicator */}
      {walletConfig && (
        <div className="text-xs text-gray-500 text-center">
          {walletConfig.name} Detected
        </div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm max-w-xs text-center"
        >
          {error}
        </motion.div>
      )}

      {isConnected && address && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-gray-500 font-mono max-w-xs break-all text-center"
        >
          {address}
        </motion.div>
      )}
    </div>
  )
}

// Compact version for headers/navigation
export function UniversalWalletButtonCompact() {
  const { 
    isConnected, 
    address, 
    connect, 
    disconnect, 
    isLoading, 
    isWalletAvailable, 
    walletConfig 
  } = useWallet()

  if (!isWalletAvailable) {
    return (
      <div className="text-xs text-orange-600 text-center">
        Wallet Required
      </div>
    )
  }

  const getCompactColorClasses = () => {
    switch (walletConfig?.color) {
      case 'orange':
        return isConnected 
          ? 'bg-green-100 text-green-800 border-green-200' 
          : 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200'
      case 'blue':
        return isConnected 
          ? 'bg-green-100 text-green-800 border-green-200'
          : 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200'
      default:
        return isConnected 
          ? 'bg-green-100 text-green-800 border-green-200'
          : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
    }
  }

  return (
    <motion.button
      onClick={isConnected ? disconnect : connect}
      disabled={isLoading}
      whileHover={{ scale: isLoading ? 1 : 1.05 }}
      whileTap={{ scale: isLoading ? 1 : 0.95 }}
      className={`
        relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-3 overflow-hidden group
        ${isConnected 
          ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:shadow-emerald-500/25' 
          : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl hover:shadow-purple-500/30'
        }
        ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
      `}
    >
      {/* Background gradient animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={false}
        animate={isLoading ? { x: [-100, 100] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      
      <div className="relative z-10 flex items-center space-x-3">
        {isLoading ? (
          <>
            <motion.div 
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span>Connecting...</span>
          </>
        ) : isConnected ? (
          <>
            <motion.div 
              className="w-3 h-3 rounded-full bg-emerald-200"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="font-medium">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
            <motion.svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </motion.svg>
          </>
        ) : (
          <>
            <motion.span 
              className="text-xl"
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              {walletConfig?.icon || '⚡'}
            </motion.span>
            <span className="font-medium">Connect Wallet</span>
            <motion.svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </motion.svg>
          </>
        )}
      </div>
      
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
        animate={{ x: [-200, 200] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
        style={{ transform: 'skewX(-20deg)' }}
      />
    </motion.button>
  )
}
