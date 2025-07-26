import { PrismaClient } from '@prisma/client'

let prisma

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: ['error'],
  })
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['warn', 'error'],
    })
  }
  prisma = global.prisma
}

// Graceful shutdown
if (typeof window === 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
}

export { prisma as db }
