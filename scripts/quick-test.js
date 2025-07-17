// Simple database connection test
import { db } from '../src/lib/db.js'

async function quickTest() {
  try {
    console.log('✅ Testing basic connection...')
    await db.$connect()
    console.log('✅ Connected to database successfully!')
    
    console.log('✅ Testing query...')
    const result = await db.$queryRaw`SELECT NOW() as current_time`
    console.log('✅ Current database time:', result[0].current_time)
    
    await db.$disconnect()
    console.log('✅ All tests passed!')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

quickTest()
