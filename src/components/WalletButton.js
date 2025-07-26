'use client'

import { UniversalWalletButtonCompact } from './UniversalWalletButton'
import { ClientOnly } from './ClientOnly'

// Universal Wallet Button Component supporting Brave, MetaMask, Coinbase, and other wallets
export default function WalletButton() {
  return (
    <ClientOnly>
      <UniversalWalletButtonCompact />
    </ClientOnly>
  )
}
