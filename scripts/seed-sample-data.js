const { PrismaClient } = require('@prisma/client')

const db = new PrismaClient()

async function seedSampleData() {
  try {
    console.log('🌱 Seeding sample data to AWS PostgreSQL...')

    // Create sample users
    const user1 = await db.user.upsert({
      where: { wallet_address: '0x1234567890abcdef1234567890abcdef12345678' },
      update: {},
      create: { wallet_address: '0x1234567890abcdef1234567890abcdef12345678' }
    })

    const user2 = await db.user.upsert({
      where: { wallet_address: '0xabcdef1234567890abcdef1234567890abcdef12' },
      update: {},
      create: { wallet_address: '0xabcdef1234567890abcdef1234567890abcdef12' }
    })

    console.log('👥 Created sample users')

    // Create sample markets
    const market1 = await db.market.create({
      data: {
        title: 'Will Bitcoin reach $100,000 by end of 2025?',
        description: 'Prediction market for Bitcoin reaching $100K USD by December 31, 2025',
        category: 'Crypto',
        created_by: user1.id,
        status: 'ACTIVE'
      }
    })

    const market2 = await db.market.create({
      data: {
        title: 'Will AI achieve AGI by 2030?',
        description: 'Will Artificial General Intelligence be achieved by any company by 2030?',
        category: 'Tech',
        created_by: user2.id,
        status: 'ACTIVE'
      }
    })

    console.log('🏛️ Created sample markets')

    // Create options for markets
    const btcYes = await db.option.create({
      data: {
        market_id: market1.id,
        label: 'YES',
        current_odds: 0.65
      }
    })

    const btcNo = await db.option.create({
      data: {
        market_id: market1.id,
        label: 'NO',
        current_odds: 0.35
      }
    })

    const agiYes = await db.option.create({
      data: {
        market_id: market2.id,
        label: 'YES',
        current_odds: 0.45
      }
    })

    const agiNo = await db.option.create({
      data: {
        market_id: market2.id,
        label: 'NO',
        current_odds: 0.55
      }
    })

    console.log('📝 Created market options')

    // Create sample trades
    const trades = [
      {
        user_id: user1.id,
        option_id: btcYes.id,
        amount: 100.0,
        price: 0.65
      },
      {
        user_id: user2.id,
        option_id: btcNo.id,
        amount: 75.0,
        price: 0.35
      },
      {
        user_id: user1.id,
        option_id: agiYes.id,
        amount: 200.0,
        price: 0.45
      },
      {
        user_id: user2.id,
        option_id: agiNo.id,
        amount: 150.0,
        price: 0.55
      }
    ]

    for (const trade of trades) {
      await db.trade.create({ data: trade })
    }

    console.log('💰 Created sample trades')

    // Summary
    const totalUsers = await db.user.count()
    const totalMarkets = await db.market.count()
    const totalTrades = await db.trade.count()

    console.log('\n✅ Sample data seeded successfully!')
    console.log(`📊 Database now contains:`)
    console.log(`   - ${totalUsers} users`)
    console.log(`   - ${totalMarkets} markets`) 
    console.log(`   - ${totalTrades} trades`)
    console.log('\n🎯 Your RecentActivity component will now show real data!')

  } catch (error) {
    console.error('❌ Error seeding data:', error)
  } finally {
    await db.$disconnect()
  }
}

seedSampleData()
