import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function simpleTest() {
  try {
    console.log('🧪 Simple market creation test...')
    
    // Create a user
    const user = await db.user.create({
      data: {
        wallet_address: '0x' + Math.random().toString(16).substr(2, 40)
      }
    })
    console.log('✅ User created:', user.wallet_address)
    
    // Create a market
    const market = await db.market.create({
      data: {
        title: 'Test Market',
        description: 'A test market',
        category: 'Test',
        created_by: user.id,
        status: 'ACTIVE'
      }
    })
    console.log('✅ Market created:', market.title)
    
    // Create options
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
    console.log('✅ Options created: YES, NO')
    
    console.log('🎉 Market creation works!')
    console.log('📊 Data IS stored in AWS PostgreSQL')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await db.$disconnect()
  }
}

simpleTest()
