const { PrismaClient } = require('@prisma/client')

const db = new PrismaClient()

async function testMarketCreation() {
  try {
    console.log('🧪 Testing market creation functionality...')
    
    // Test data for creating a market
    const testWallet = '0x1234567890abcdef'
    const marketData = {
      title: 'Will Bitcoin reach $100,000 by end of 2024?',
      description: 'A prediction market for Bitcoin price reaching $100,000 USD by December 31, 2024',
      category: 'Crypto',
      creator_wallet: testWallet
    }

    console.log('📊 Creating test market with data:', marketData)

    // Find or create user
    let user = await db.user.findUnique({
      where: { wallet_address: testWallet }
    })

    if (!user) {
      console.log('👤 Creating new user...')
      user = await db.user.create({
        data: {
          wallet_address: testWallet
        }
      })
      console.log('✅ User created:', user)
    } else {
      console.log('👤 Found existing user:', user)
    }

    // Create market
    console.log('🏛️ Creating market...')
    const market = await db.market.create({
      data: {
        title: marketData.title,
        description: marketData.description,
        category: marketData.category,
        created_by: user.id,
        status: 'ACTIVE'
      },
      include: {
        creator: {
          select: {
            id: true,
            wallet_address: true
          }
        }
      }
    })
    console.log('✅ Market created:', market)

    // Create options
    console.log('📝 Creating YES/NO options...')
    const yesOption = await db.option.create({
      data: {
        market_id: market.id,
        label: 'YES',
        current_odds: 0.5
      }
    })

    const noOption = await db.option.create({
      data: {
        market_id: market.id,
        label: 'NO',
        current_odds: 0.5
      }
    })
    console.log('✅ Options created:')
    console.log('  YES option:', yesOption)
    console.log('  NO option:', noOption)

    // Fetch the complete market
    console.log('📋 Fetching complete market data...')
    const completeMarket = await db.market.findUnique({
      where: { id: market.id },
      include: {
        creator: true,
        options: true,
        trades: true,
        resolution: true
      }
    })
    console.log('🎯 Complete market:', JSON.stringify(completeMarket, null, 2))

    // Test fetching all markets
    console.log('📊 Testing market listing...')
    const allMarkets = await db.market.findMany({
      include: {
        creator: {
          select: {
            id: true,
            wallet_address: true
          }
        },
        options: {
          select: {
            id: true,
            label: true,
            current_odds: true
          }
        },
        _count: {
          select: {
            trades: true,
            options: true
          }
        }
      }
    })
    console.log(`📈 Found ${allMarkets.length} total markets`)
    
    console.log('✅ Market creation test completed successfully!')
    return true

  } catch (error) {
    console.error('❌ Market creation test failed:', error)
    return false
  } finally {
    await db.$disconnect()
  }
}

// Run the test
testMarketCreation()
  .then(success => {
    if (success) {
      console.log('🎉 All tests passed!')
      process.exit(0)
    } else {
      console.log('💥 Tests failed!')
      process.exit(1)
    }
  })
  .catch(error => {
    console.error('🔥 Test execution failed:', error)
    process.exit(1)
  })
