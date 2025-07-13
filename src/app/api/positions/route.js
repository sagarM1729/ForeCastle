import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/positions - Get user positions with filtering
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const marketId = searchParams.get('marketId')
    const side = searchParams.get('side')
    const status = searchParams.get('status') // active, resolved
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    const where = {}
    
    if (userId) {
      where.userId = userId
    }
    
    if (marketId) {
      where.marketId = marketId
    }
    
    if (side && ['YES', 'NO'].includes(side)) {
      where.side = side
    }
    
    // Filter by position status
    if (status === 'active') {
      where.market = {
        resolved: false,
        endDate: {
          gt: new Date()
        }
      }
    } else if (status === 'resolved') {
      where.market = {
        resolved: true
      }
    }
    
    const positions = await db.position.findMany({
      where,
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
            category: true,
            yesPrice: true,
            noPrice: true,
            resolved: true,
            outcome: true,
            endDate: true,
            totalVolume: true
          }
        }
      },
      orderBy: [
        { shares: 'desc' },
        { createdAt: 'desc' }
      ],
      skip: (page - 1) * limit,
      take: limit
    })
    
    // Enrich positions with calculated metrics
    const enrichedPositions = positions.map(position => {
      const market = position.market
      const currentPrice = position.side === 'YES' 
        ? parseFloat(market.yesPrice) 
        : parseFloat(market.noPrice)
      
      const shares = parseFloat(position.shares)
      const avgPrice = parseFloat(position.avgPrice)
      const currentValue = shares * currentPrice
      const costBasis = shares * avgPrice
      
      let pnl = 0
      let pnlPercent = 0
      
      if (market.resolved) {
        // Calculate realized P&L
        if (market.outcome === position.side) {
          pnl = shares - costBasis // Winners get 1.0 per share
        } else {
          pnl = -costBasis // Losers get 0
        }
      } else {
        // Calculate unrealized P&L
        pnl = currentValue - costBasis
      }
      
      pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0
      
      return {
        ...position,
        metrics: {
          shares,
          avgPrice,
          currentPrice,
          currentValue,
          costBasis,
          pnl,
          pnlPercent,
          isWinner: market.resolved ? market.outcome === position.side : null,
          isActive: !market.resolved && new Date(market.endDate) > new Date()
        }
      }
    })
    
    const total = await db.position.count({ where })
    
    // Calculate portfolio statistics for the filtered positions
    const portfolioStats = {
      totalPositions: total,
      totalValue: enrichedPositions.reduce((sum, pos) => sum + pos.metrics.currentValue, 0),
      totalCost: enrichedPositions.reduce((sum, pos) => sum + pos.metrics.costBasis, 0),
      totalPnL: enrichedPositions.reduce((sum, pos) => sum + pos.metrics.pnl, 0),
      winningPositions: enrichedPositions.filter(pos => pos.metrics.pnl > 0).length,
      losingPositions: enrichedPositions.filter(pos => pos.metrics.pnl < 0).length,
      activePositions: enrichedPositions.filter(pos => pos.metrics.isActive).length,
      resolvedPositions: enrichedPositions.filter(pos => !pos.metrics.isActive).length
    }
    
    portfolioStats.winRate = portfolioStats.totalPositions > 0 
      ? (portfolioStats.winningPositions / portfolioStats.totalPositions) * 100 
      : 0
    
    portfolioStats.totalPnLPercent = portfolioStats.totalCost > 0 
      ? (portfolioStats.totalPnL / portfolioStats.totalCost) * 100 
      : 0
    
    return NextResponse.json({
      success: true,
      data: enrichedPositions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: page * limit < total
      },
      portfolioStats
    })
    
  } catch (error) {
    console.error('Error fetching positions:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch positions',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

// POST /api/positions - Create or update position (usually handled by trades)
export async function POST(request) {
  try {
    // This endpoint is mainly for administrative purposes
    // Normal position updates happen through the trades API
    
    const body = await request.json()
    const { userId, marketId, side, shares, avgPrice, adminKey } = body
    
    // Simple admin check
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    if (!userId || !marketId || !side || !shares || !avgPrice) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields: userId, marketId, side, shares, avgPrice' 
        },
        { status: 400 }
      )
    }
    
    // Check if position exists
    const existingPosition = await db.position.findUnique({
      where: {
        userId_marketId_side: {
          userId,
          marketId,
          side
        }
      }
    })
    
    let position
    if (existingPosition) {
      // Update existing position
      position = await db.position.update({
        where: { id: existingPosition.id },
        data: {
          shares,
          avgPrice
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              walletAddress: true
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
    } else {
      // Create new position
      position = await db.position.create({
        data: {
          userId,
          marketId,
          side,
          shares,
          avgPrice
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              walletAddress: true
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
    }
    
    return NextResponse.json({
      success: true,
      data: position,
      message: existingPosition ? 'Position updated' : 'Position created'
    })
    
  } catch (error) {
    console.error('Error creating/updating position:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create/update position',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
