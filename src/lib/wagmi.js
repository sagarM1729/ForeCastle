// Wagmi configuration for Web3 connectivity with robust error handling
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, sepolia } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'ForeCastle',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'your-project-id',
  chains: [mainnet, polygon, sepolia],
  ssr: true,
  multiInjectedProviderDiscovery: false,
  walletConnectOptions: {
    qrcode: true,
    showQrModal: true,
    metadata: {
      name: 'ForeCastle',
      description: 'Decentralized Prediction Markets',
      url: 'https://forecastle.market',
      icons: ['https://forecastle.market/logo.png']
    },
    // Add connection timeout and retry settings
    relayUrl: 'wss://relay.walletconnect.com',
    maxRetries: 0, // Disable automatic retries to prevent connection spam
    retryDelay: 5000,
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'your-project-id'
  },
  // Disable automatic connection on mount to prevent errors
  autoConnect: false,
  // Add custom transport configuration
  transports: {
    // Disable WebSocket for problematic providers
    [mainnet.id]: undefined,
    [polygon.id]: undefined,
    [sepolia.id]: undefined,
  }
})
