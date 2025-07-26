// Test environment variables
console.log('Environment Variables Check:')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'NOT SET')
console.log('DATABASE_URL value:', process.env.DATABASE_URL)

// Test database connection
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function testConnection() {
  try {
    console.log('Testing database connection...')
    const result = await prisma.$queryRaw`SELECT version();`
    console.log('✅ Database connection successful:', result)
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
