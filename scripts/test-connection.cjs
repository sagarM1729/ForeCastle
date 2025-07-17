const { PrismaClient } = require('@prisma/client')

async function testConnection() {
  const db = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  })
  
  try {
    console.log('Testing database connection...')
    const result = await db.$queryRaw`SELECT 1 as test`
    console.log('✅ Database connected successfully!')
    console.log('Result:', result)
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
  } finally {
    await db.$disconnect()
    console.log('Disconnected from database')
  }
}

testConnection()
