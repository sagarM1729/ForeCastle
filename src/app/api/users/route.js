import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('walletAddress')
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }
    
    const user = await db.user.findUnique({
      where: { walletAddress },
      include: {
        createdMarkets: {
          select: {
            id: true,
            title: true,
            totalVolume: true
          }
        },
        trades: {
          select: {
            id: true,
            amount: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        },
        positions: {
          include: {
            market: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      }
    })
    
    return NextResponse.json(user)
    
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    // TODO: Validate input with Zod schema
    
    const user = await db.user.upsert({
      where: { walletAddress: body.walletAddress },
      update: {
        username: body.username,
        email: body.email,
        avatar: body.avatar
      },
      create: {
        walletAddress: body.walletAddress,
        username: body.username,
        email: body.email,
        avatar: body.avatar
      }
    })
    
    return NextResponse.json(user, { status: 201 })
    
  } catch (error) {
    console.error('Error creating/updating user:', error)
    return NextResponse.json(
      { error: 'Failed to create/update user' },
      { status: 500 }
    )
  }
}
