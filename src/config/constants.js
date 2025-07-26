// Shared configuration constants to eliminate duplication
export const CONFIG = {
  // Admin settings
  ADMIN_WALLET_ADDRESS: '0x9ce7F13f5E99282dC6b683Ac9adE48e348001F3D',
  
  // Market categories
  MARKET_CATEGORIES: [
    'all', 'Crypto', 'Technology', 'Politics', 'Sports', 
    'Entertainment', 'Science', 'Finance', 'Space', 'Other'
  ],
  
  // Common styles (CSS classes that can be reused)
  STYLES: {
    // Background gradients
    primaryBg: 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900',
    buttonGradient: 'bg-gradient-to-r from-orange-500 to-pink-600',
    
    // Background elements
    backgroundElement1: 'absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl',
    backgroundElement2: 'absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl',
    backgroundElement3: 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-blue-400/10 to-indigo-500/10 rounded-full blur-3xl',
    
    // Common containers
    container: 'container mx-auto px-4 py-8',
    card: 'bg-gray-900/90 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl',
    
    // Text styles
    heading: 'text-4xl md:text-6xl font-bold',
    subheading: 'text-xl md:text-2xl text-gray-300',
  },
  
  // API endpoints
  API: {
    markets: '/api/markets',
    trades: '/api/trades',
    users: '/api/users'
  }
}
