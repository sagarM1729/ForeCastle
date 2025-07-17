// Test the new simplified database schema
import { config } from 'dotenv'
import { resolve } from 'path'
import { db } from '../src/lib/db.js'

// Load environment variables
config({ path: resolve(process.cwd(), '.env') })

async function testNewSchema() {
  try {
    console.log('🔄 Testing new simplified database schema...')
    
    // Connect to database
    await db.$connect()
    console.log('✅ Connected to AWS RDS PostgreSQL')
    
    // Test each table exists
    console.log('\n📊 Checking tables...')
    
    // 1. Users table
    try {
      const userCount = await db.user.count()
      console.log('✅ users table exists - count:', userCount)
    } catch (error) {
      console.log('❌ users table error:', error.message)
    }
    
    // 2. Markets table  
    try {
      const marketCount = await db.market.count()
      console.log('✅ markets table exists - count:', marketCount)
    } catch (error) {
      console.log('❌ markets table error:', error.message)
    }
    
    // 3. Options table
    try {
      const optionCount = await db.option.count()
      console.log('✅ options table exists - count:', optionCount)
    } catch (error) {
      console.log('❌ options table error:', error.message)
    }
    
    // 4. Trades table
    try {
      const tradeCount = await db.trade.count()
      console.log('✅ trades table exists - count:', tradeCount)
    } catch (error) {
      console.log('❌ trades table error:', error.message)
    }
    
    // 5. Resolutions table
    try {
      const resolutionCount = await db.resolution.count()
      console.log('✅ resolutions table exists - count:', resolutionCount)
    } catch (error) {
      console.log('❌ resolutions table error:', error.message)
    }
    
    await db.$disconnect()
    console.log('\n🎉 Database schema test completed!')
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message)
    process.exit(1)
  }
}

testNewSchema()
