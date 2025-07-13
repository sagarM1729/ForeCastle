import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/trades - Execute a trade
export async function POST(request) {
  try {
    const body = await request.json()
    const {
      marketId,
      userId,
      side, // YES or NO
      amount, // USD amount to trade
      maxPrice // Maximum price willing to pay (slippage protection)
    } = body
    
    // Validation
    if (!marketId || !userId || !side || !amount) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields: marketId, userId, side, amount' 
        },
        { status: 400 }
      )
    }
    
    if (!['YES', 'NO'].includes(side)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid side. Must be YES or NO' 
        },
        { status: 400 }
      )
    }
    
    if (amount <= 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Amount must be positive' 
        },
        { status: 400 }
      )
    }
    
    // Start transaction for trade execution
    const result = await db.$transaction(async (tx) => {
      // Get market and verify it's active
      const market = await tx.market.findUnique({
        where: { id: marketId },
        include: {
          trades: {
            orderBy: { createdAt: 'desc' },
            take: 100 // For price calculation
          }
        }
      })
      
      if (!market) {
        throw new Error('Market not found')
      }
      
      if (market.resolved) {
        throw new Error('Market is already resolved')
      }
      
      if (new Date(market.endDate) <= new Date()) {
        throw new Error('Market has ended')
      }
      
      // Calculate current price using simple AMM
      const currentYesPrice = parseFloat(market.yesPrice)
      const currentNoPrice = parseFloat(market.noPrice)
      const currentPrice = side === 'YES' ? currentYesPrice : currentNoPrice
      
      // Check slippage protection
      if (maxPrice && currentPrice > maxPrice) {
        throw new Error(`Price ${currentPrice.toFixed(4)} exceeds maximum price ${maxPrice}`)
      }
      
      // Calculate shares received
      const shares = amount / currentPrice
      const tradeFee = amount * 0.01 // 1% trading fee
      const netAmount = amount - tradeFee
      
      // Verify user exists
      const user = await tx.user.findUnique({
        where: { id: userId }
      })
      
      if (!user) {
        throw new Error('User not found')
      }
      
      // Create the trade
      const trade = await tx.trade.create({
        data: {
          userId,
          marketId,
          side,
          amount: netAmount,
          price: currentPrice,
          shares: shares
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              walletAddress: true,
              avatar: true
            }
          },
          market: {
            select: {
              id: true,
              title: true,
              category: true
            }
          }
        }
      })
      
      // Update or create user position
      const existingPosition = await tx.position.findUnique({
        where: {
          userId_marketId_side: {
            userId,
            marketId,
            side
          }
        }
      })
      
      if (existingPosition) {
        // Update existing position with weighted average
        const existingShares = parseFloat(existingPosition.shares)
        const existingPrice = parseFloat(existingPosition.avgPrice)
        const newTotalShares = existingShares + shares
        const newAvgPrice = ((existingShares * existingPrice) + (shares * currentPrice)) / newTotalShares
        
        await tx.position.update({
          where: { id: existingPosition.id },
          data: {
            shares: newTotalShares,
            avgPrice: newAvgPrice
          }
        })
      } else {
        // Create new position
        await tx.position.create({
          data: {
            userId,
            marketId,
            side,
            shares: shares,
            avgPrice: currentPrice
          }
        })
      }
      
      // Calculate new market prices using AMM formula
      const allTrades = [...market.trades, trade]
      const yesShares = allTrades
        .filter(t => t.side === 'YES')
        .reduce((sum, t) => sum + parseFloat(t.shares), 0)
      const noShares = allTrades
        .filter(t => t.side === 'NO')
        .reduce((sum, t) => sum + parseFloat(t.shares), 0)
      
      const totalShares = yesShares + noShares
      const newYesPrice = totalShares > 0 ? Math.max(0.01, Math.min(0.99, yesShares / totalShares)) : 0.5
      const newNoPrice = 1 - newYesPrice
      
      // Update market statistics
      await tx.market.update({
        where: { id: marketId },
        data: {
          totalVolume: {
            increment: netAmount
          },
          yesPrice: newYesPrice,
          noPrice: newNoPrice,
          liquidityPool: {
            increment: tradeFee // Trading fees go to liquidity pool
          }
        }
      })
      
      // Update user stats
      await tx.user.update({
        where: { id: userId },
        data: {
          totalVolume: {
            increment: netAmount
          }
        }
      })
      
      return {
        ...trade,
        fee: tradeFee,
        newPrice: side === 'YES' ? newYesPrice : newNoPrice,
        sharesReceived: shares
      }
    })
    
    return NextResponse.json({
      success: true,
      data: result,
      message: 'Trade executed successfully'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error executing trade:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to execute trade',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const marketId = searchParams.get('marketId')
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    const where = {}
    
    if (marketId) {
      where.marketId = marketId
    }
    
    if (userId) {
      where.userId = userId
    }
    
    const trades = await db.trade.findMany({
      where,
      include: {
        market: {
          select: {
            id: true,
            title: true
          }
        },
        user: {
          select: {
            id: true,
            username: true,
            walletAddress: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit
    })
    
    const total = await db.trade.count({ where })
    
    return NextResponse.json({
      success: true,
      data: trades,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: page * limit < total
      },
      stats
    })
    
  } catch (error) {
    console.error('Error fetching trades:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch trades',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
