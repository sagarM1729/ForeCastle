// Database connection test script
// Run this with: npm run db:test

import { config } from 'dotenv'
import { resolve } from 'path'
import { db } from '../src/lib/db.js'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

async function testDatabaseConnection() {
  try {
    console.log('🔄 Testing database connection...')
    console.log('📍 Database URL:', process.env.DATABASE_URL?.replace(/:[^:]*@/, ':***@') || 'Not set')
    
    // Test basic connection
    await db.$connect()
    console.log('✅ Database connected successfully!')
    
    // Test a simple query
    const result = await db.$queryRaw`SELECT version()`
    console.log('📊 PostgreSQL Version:', result[0].version)
    
    // Test if we can read from the database
    try {
      const userCount = await db.user.count()
      console.log('👥 Current users in database:', userCount)
    } catch (error) {
      console.log('⚠️  Tables not yet created. Run "npm run db:push" to create them.')
    }
    
    await db.$disconnect()
    console.log('✅ Connection test completed successfully!')
    
  } catch (error) {
    console.error('❌ Database connection failed:')
    console.error('Error:', error.message)
    
    if (error.message.includes('password authentication failed')) {
      console.log('\n💡 Tips:')
      console.log('- Check your username and password in .env.local')
      console.log('- Make sure the database user has the correct permissions')
    }
    
    if (error.message.includes('no such host') || error.message.includes('connection refused')) {
      console.log('\n💡 Tips:')
      console.log('- Check if the RDS instance is running')
      console.log('- Verify the endpoint URL is correct')
      console.log('- Check security group settings to allow connections')
    }
    
    if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.log('\n💡 Tips:')
      console.log('- Create the database first in AWS RDS')
      console.log('- Or update the database name in your DATABASE_URL')
    }

    if (error.message.includes('localhost')) {
      console.log('\n💡 Environment Issue:')
      console.log('- The script is connecting to localhost instead of AWS RDS')
      console.log('- Make sure your .env.local file contains the correct DATABASE_URL')
      console.log('- Current DATABASE_URL:', process.env.DATABASE_URL || 'Not found')
    }
    
    process.exit(1)
  }
}

testDatabaseConnection()
