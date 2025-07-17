'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { ClientOnly } from './ClientOnly'
import SafeWalletWrapper from './SafeWalletWrapper'
import { useState, useEffect } from 'react'

// Wallet Button Component with improved error handling
export default function WalletButton() {
  const [connectionError, setConnectionError] = useState(null)

  useEffect(() => {
    // Clear any existing errors on mount
    setConnectionError(null)
  }, [])

  return (
    <ClientOnly>
      {connectionError && (
        <div className="mb-2 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded text-sm">
          {connectionError}
        </div>
      )}
      <SafeWalletWrapper>
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            // Note: If your app doesn't use authentication, you
            // can remove all 'authenticationStatus' checks
            const ready = mounted && authenticationStatus !== 'loading'
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === 'authenticated')

            const handleConnectClick = () => {
              try {
                setConnectionError(null)
                openConnectModal()
              } catch (error) {
                // Don't show wallet connection errors
                console.warn('Wallet connection attempt:', error)
              }
            }

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  'style': {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button 
                        onClick={handleConnectClick} 
                        type="button"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Connect Wallet
                      </button>
                    )
                  }

                  if (chain.unsupported) {
                    return (
                      <button 
                        onClick={openChainModal} 
                        type="button"
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                      >
                        Wrong network
                      </button>
                    )
                  }

                  return (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={openChainModal}
                        type="button"
                        className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-1"
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 16,
                              height: 16,
                              borderRadius: 999,
                              overflow: 'hidden',
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? 'Chain icon'}
                                src={chain.iconUrl}
                                style={{ width: 16, height: 16 }}
                              />
                            )}
                          </div>
                        )}
                        <span className="text-sm">{chain.name}</span>
                      </button>

                      <button 
                        onClick={openAccountModal} 
                        type="button"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center space-x-2"
                      >
                        <span>{account.displayName}</span>
                        <span className="text-blue-200">
                          {account.displayBalance
                            ? ` (${account.displayBalance})`
                            : ''}
                        </span>
                      </button>
                    </div>
                  )
                })()}
              </div>
            )
          }}
        </ConnectButton.Custom>
      </SafeWalletWrapper>
    </ClientOnly>
  )
}
