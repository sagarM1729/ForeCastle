const { PrismaClient } = require('@prisma/client')

const db = new PrismaClient()

async function quickCheck() {
  try {
    console.log('⚡ Quick database check...')
    
    // Simple counts
    const userCount = await db.user.count()
    const marketCount = await db.market.count()
    const optionCount = await db.option.count()
    const tradeCount = await db.trade.count()
    
    console.log(`Users: ${userCount}`)
    console.log(`Markets: ${marketCount}`)
    console.log(`Options: ${optionCount}`)
    console.log(`Trades: ${tradeCount}`)
    
    if (marketCount > 0) {
      console.log('\n📋 Markets:')
      const markets = await db.market.findMany({
        select: {
          id: true,
          title: true,
          status: true,
          category: true
        }
      })
      markets.forEach(m => {
        console.log(`  ${m.id}: ${m.title} [${m.status}] (${m.category})`)
      })
    }
    
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await db.$disconnect()
  }
}

quickCheck()
