const { PrismaClient } = require('@prisma/client')

const db = new PrismaClient()

async function checkData() {
  try {
    console.log('🔍 Checking existing data in AWS PostgreSQL...')
    
    // Check users
    const users = await db.user.findMany()
    console.log(`👥 Users: ${users.length}`)
    users.forEach(user => console.log(`  - ${user.wallet_address} (ID: ${user.id})`))
    
    // Check markets
    const markets = await db.market.findMany({
      include: {
        creator: true,
        options: true,
        trades: true,
        resolution: true
      }
    })
    console.log(`\n🏛️ Markets: ${markets.length}`)
    markets.forEach(market => {
      console.log(`  - "${market.title}" by ${market.creator?.wallet_address}`)
      console.log(`    Status: ${market.status}, Category: ${market.category}`)
      console.log(`    Options: ${market.options?.length || 0}`)
      console.log(`    Trades: ${market.trades?.length || 0}`)
    })
    
    // Check options
    const options = await db.option.findMany()
    console.log(`\n📝 Options: ${options.length}`)
    
    // Check trades
    const trades = await db.trade.findMany()
    console.log(`\n💰 Trades: ${trades.length}`)
    
    // Check resolutions
    const resolutions = await db.resolution.findMany()
    console.log(`\n✅ Resolutions: ${resolutions.length}`)
    
    console.log('\n🎯 Summary:')
    console.log(`  - Database contains ${markets.length} markets`)
    console.log(`  - Market creation functionality is ${markets.length > 0 ? 'WORKING' : 'NEEDS TESTING'}`)
    console.log(`  - Data is ${users.length > 0 || markets.length > 0 ? 'STORED' : 'EMPTY'} in AWS PostgreSQL`)
    
  } catch (error) {
    console.error('❌ Error checking data:', error)
  } finally {
    await db.$disconnect()
  }
}

checkData()
