// PostgreSQL connection test with timeout
const { PrismaClient } = require('@prisma/client')
const { config } = require('dotenv')

// Load .env file
config()

console.log('🔍 Testing PostgreSQL connection...')
console.log('Database URL exists:', !!process.env.DATABASE_URL)

const prisma = new PrismaClient({
  log: ['error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

// Add timeout to prevent hanging
const timeoutMs = 10000 // 10 seconds

async function testWithTimeout() {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), timeoutMs)
  })

  const testPromise = async () => {
    try {
      console.log('⏳ Connecting to database...')
      await prisma.$connect()
      console.log('✅ Connected successfully!')
      
      console.log('⏳ Testing basic query...')
      const result = await prisma.$queryRaw`SELECT version()`
      console.log('📊 PostgreSQL version:', result[0].version.substring(0, 50) + '...')
      
      console.log('⏳ Checking tables...')
      try {
        const userCount = await prisma.user.count()
        const marketCount = await prisma.market.count()
        console.log('📈 Users:', userCount, 'Markets:', marketCount)
      } catch (tableError) {
        console.log('⚠️  Tables not created yet. Need to run: npx prisma db push')
        console.log('Table error:', tableError.message)
      }
      
    } catch (error) {
      console.error('❌ Connection failed:', error.message)
      
      if (error.message.includes('password authentication failed')) {
        console.log('\n💡 Authentication issue - check username/password')
      } else if (error.message.includes('no such host') || error.message.includes('getaddrinfo ENOTFOUND')) {
        console.log('\n💡 DNS/Network issue - check RDS endpoint URL')
      } else if (error.message.includes('connection refused')) {
        console.log('\n💡 Connection refused - check security groups and RDS status')
      } else if (error.message.includes('timeout')) {
        console.log('\n💡 Timeout - check network connectivity and RDS availability')
      }
      
      throw error
    } finally {
      await prisma.$disconnect()
      console.log('🔌 Disconnected from database')
    }
  }

  return Promise.race([testPromise(), timeoutPromise])
}

testWithTimeout()
  .then(() => {
    console.log('🎉 Database test completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Database test failed:', error.message)
    process.exit(1)
  })
