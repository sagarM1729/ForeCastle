// Wagmi configuration for Web3 connectivity
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, sepolia } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'ForeCastle',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'your-project-id',
  chains: [mainnet, polygon, sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
})
