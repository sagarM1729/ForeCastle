'use client'

import { useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WalletProvider } from '@/context/WalletContext'
import { setupGlobalErrorHandler } from '@/utils/errorHandler'
import WalletErrorBoundary from '@/components/WalletErrorBoundary'

// Create QueryClient with robust error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry wallet connection errors
        const message = error?.message?.toLowerCase() || ''
        if (message.includes('wallet') || message.includes('connection interrupted')) {
          return false
        }
        return failureCount < 2
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      onError: (error) => {
        const message = error?.message?.toLowerCase() || ''
        if (!message.includes('wallet') && !message.includes('connection interrupted')) {
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
      <WalletProvider>
        <QueryClientProvider client={queryClient}>
          {mounted ? (
            children
          ) : (
            <div suppressHydrationWarning>
              {children}
            </div>
          )}
        </QueryClientProvider>
              </WalletProvider>
    </WalletErrorBoundary>
  )
}
