import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/users/[id] - Get user profile and stats
export async function GET(request, { params }) {
  try {
    const { id } = params
    
    const user = await db.user.findUnique({
      where: { id },
      include: {
        createdMarkets: {
          select: {
            id: true,
            title: true,
            category: true,
            totalVolume: true,
            resolved: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        },
        trades: {
          include: {
            market: {
              select: {
                id: true,
                title: true,
                category: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 20
        },
        positions: {
          include: {
            market: {
              select: {
                id: true,
                title: true,
                category: true,
                yesPrice: true,
                noPrice: true,
                resolved: true,
                outcome: true
              }
            }
          },
          where: {
            shares: {
              gt: 0
            }
          }
        },
        _count: {
          select: {
            createdMarkets: true,
            trades: true,
            positions: true
          }
        }
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          error: 'User not found' 
        },
        { status: 404 }
      )
    }
    
    // Calculate user statistics
    const totalTradeVolume = user.trades.reduce(
      (sum, trade) => sum + parseFloat(trade.amount), 0
    )
    
    const activePositionsValue = user.positions.reduce((sum, position) => {
      if (!position.market.resolved) {
        const currentPrice = position.side === 'YES' 
          ? position.market.yesPrice 
          : position.market.noPrice
        return sum + (parseFloat(position.shares) * parseFloat(currentPrice))
      }
      return sum
    }, 0)
    
    const realizedPnL = user.positions.reduce((sum, position) => {
      return sum + parseFloat(position.realized)
    }, 0)
    
    const marketsCreatedVolume = user.createdMarkets.reduce(
      (sum, market) => sum + parseFloat(market.totalVolume), 0
    )
    
    // Calculate win rate for resolved positions
    const resolvedPositions = user.positions.filter(
      pos => pos.market.resolved
    )
    const winningPositions = resolvedPositions.filter(
      pos => pos.market.outcome === pos.side
    )
    const winRate = resolvedPositions.length > 0 
      ? (winningPositions.length / resolvedPositions.length) * 100 
      : 0
    
    const userStats = {
      ...user,
      stats: {
        totalTradeVolume,
        activePositionsValue,
        realizedPnL,
        marketsCreatedVolume,
        winRate,
        totalTrades: user._count.trades,
        totalMarkets: user._count.createdMarkets,
        activePositions: user.positions.length,
        resolvedPositions: resolvedPositions.length
      }
    }
    
    return NextResponse.json({
      success: true,
      data: userStats
    })
    
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch user',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

// POST /api/users - Create or update user profile
export async function POST(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { walletAddress, username, email, avatar } = body
    
    if (!walletAddress) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Wallet address is required' 
        },
        { status: 400 }
      )
    }
    
    // Check if user exists, if not create new one
    const existingUser = await db.user.findUnique({
      where: { id }
    })
    
    let user
    if (existingUser) {
      // Update existing user
      user = await db.user.update({
        where: { id },
        data: {
          username,
          email,
          avatar
        }
      })
    } else {
      // Create new user
      user = await db.user.create({
        data: {
          id,
          walletAddress,
          username,
          email,
          avatar
        }
      })
    }
    
    return NextResponse.json({
      success: true,
      data: user,
      message: existingUser ? 'User updated successfully' : 'User created successfully'
    })
    
  } catch (error) {
    console.error('Error creating/updating user:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create/update user',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
