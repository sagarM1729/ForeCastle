// Basic JavaScript objects/types definitions
// This replaces the TypeScript types file

export const UserDefaults = {
  id: '',
  walletAddress: '',
  username: null,
  email: null,
  avatar: null,
  reputation: 0,
  totalVolume: 0,
  createdAt: new Date(),
  updatedAt: new Date()
}

export const MarketDefaults = {
  id: '',
  title: '',
  description: '',
  imageUrl: null,
  category: '',
  contractAddress: null,
  endDate: new Date(),
  resolutionDate: null,
  resolved: false,
  outcome: null, // 'YES', 'NO', 'INVALID'
  totalVolume: 0,
  liquidityPool: 0,
  yesPrice: 0.5,
  noPrice: 0.5,
  tags: [],
  sourceUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  creator: null,
  creatorId: ''
}

export const TradeDefaults = {
  id: '',
  side: '', // 'YES' or 'NO'
  amount: 0,
  price: 0,
  shares: 0,
  txHash: null,
  gasUsed: null,
  createdAt: new Date(),
  user: null,
  userId: '',
  market: null,
  marketId: ''
}

export const PositionDefaults = {
  id: '',
  side: '', // 'YES' or 'NO'
  shares: 0,
  avgPrice: 0,
  realized: 0,
  unrealized: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  user: null,
  userId: '',
  market: null,
  marketId: ''
}

// Helper functions for object validation
export function validateUser(user) {
  return user && typeof user.walletAddress === 'string'
}

export function validateMarket(market) {
  return market && typeof market.title === 'string' && typeof market.description === 'string'
}

export function validateTrade(trade) {
  return trade && ['YES', 'NO'].includes(trade.side) && typeof trade.amount === 'number'
}
