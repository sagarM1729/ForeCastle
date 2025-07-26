import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
    DATABASE_URL_PARTIAL: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 50) + '...' : 'Not set',
    NODE_ENV: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  })
}
