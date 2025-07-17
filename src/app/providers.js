'use client'

import { useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { config } from '@/lib/wagmi'
import { setupGlobalErrorHandler } from '@/utils/errorHandler'
import WalletErrorBoundary from '@/components/WalletErrorBoundary'
import '@rainbow-me/rainbowkit/styles.css'

// Create QueryClient with robust error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry wallet connection errors
        const message = error?.message?.toLowerCase() || ''
        if (message.includes('walletconnect') || message.includes('connection interrupted')) {
          return false
        }
        return failureCount < 2
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      onError: (error) => {
        const message = error?.message?.toLowerCase() || ''
        if (!message.includes('walletconnect') && !message.includes('connection interrupted')) {
          console.error('Query error:', error)
        }
      }
    },
  },
})

export function Providers({ children }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Setup global error handler for wallet issues
    setupGlobalErrorHandler()
    setMounted(true)
  }, [])

  return (
    <WalletErrorBoundary>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {mounted ? (
            <RainbowKitProvider
              modalSize="compact"
              initialChain={config.chains[0]}
              showRecentTransactions={true}
            >
              {children}
            </RainbowKitProvider>
          ) : (
            <div suppressHydrationWarning>
              {children}
            </div>
          )}
        </QueryClientProvider>
      </WagmiProvider>
    </WalletErrorBoundary>
  )
}
