'use client'

import React from 'react'

class WalletErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, errorMessage: null }
  }

  static getDerivedStateFromError(error) {
    const message = error?.message?.toLowerCase() || ''
    
    // Only catch wallet-related errors, let other errors propagate
    if (
      message.includes('connection interrupted') ||
      message.includes('walletconnect') ||
      message.includes('websocket') ||
      message.includes('jsonrpc') ||
      message.includes('subscription')
    ) {
      return { hasError: true, errorMessage: error.message }
    }
    
    // Let other errors propagate normally
    throw error
  }

  componentDidCatch(error, errorInfo) {
    const message = error?.message?.toLowerCase() || ''
    
    if (
      message.includes('connection interrupted') ||
      message.includes('walletconnect') ||
      message.includes('websocket') ||
      message.includes('jsonrpc') ||
      message.includes('subscription')
    ) {
      console.warn('Wallet connection error caught by boundary:', error)
      // Don't report to error tracking services for wallet connection issues
      return
    }
    
    // Report other errors normally
    console.error('Unexpected error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
            <div className="text-yellow-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Wallet Connection Issue
            </h2>
            <p className="text-gray-600 mb-6">
              The wallet connection was interrupted. This is normal and doesn't affect the app functionality.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, errorMessage: null })
                window.location.reload()
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue to App
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default WalletErrorBoundary
