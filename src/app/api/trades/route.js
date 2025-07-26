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
          options: true,
          trades: {
            orderBy: { created_at: 'desc' },
            take: 100 // For price calculation
          }
        }
      })
      
      if (!market) {
        throw new Error('Market not found')
      }
      
      if (market.status === 'RESOLVED') {
        throw new Error('Market is already resolved')
      }
      
      // Find or create user based on wallet address
      let user = await tx.user.findUnique({
        where: { wallet_address: userId }
      })
      
      if (!user) {
        user = await tx.user.create({
          data: {
            wallet_address: userId
          }
        })
      }
      
      // Find the option (YES/NO)
      const option = market.options.find(opt => opt.label === side)
      if (!option) {
        throw new Error(`Option ${side} not found for this market`)
      }
      
      // Calculate current price using improved AMM with price impact prediction
      const currentTrades = market.trades
      
      // Get current volumes
      const currentYesVolume = currentTrades
        .filter(t => {
          const tradeOption = market.options.find(opt => opt.id === t.option_id)
          return tradeOption?.label === 'YES'
        })
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)
      
      const currentNoVolume = currentTrades
        .filter(t => {
          const tradeOption = market.options.find(opt => opt.id === t.option_id)
          return tradeOption?.label === 'NO'
        })
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)
      
      const liquidityConstant = 100 // Liquidity constant
      const currentYesPool = currentYesVolume + liquidityConstant
      const currentNoPool = currentNoVolume + liquidityConstant
      const currentTotalPool = currentYesPool + currentNoPool
      
      // Calculate current price (what user will pay)
      const currentPrice = side === 'YES' ? 
        (currentYesPool + amount) / (currentTotalPool + amount) :
        (currentNoPool + amount) / (currentTotalPool + amount)
      
      // Ensure price is within reasonable bounds
      const finalPrice = Math.max(0.05, Math.min(0.95, currentPrice))
      
      // Check slippage protection
      if (maxPrice && finalPrice > maxPrice) {
        throw new Error(`Price ${finalPrice.toFixed(4)} exceeds maximum price ${maxPrice}`)
      }
      
      // Calculate shares received
      const shares = amount / finalPrice
      const tradeFee = amount * 0.01 // 1% trading fee
      const netAmount = amount - tradeFee
      
      // Create the trade
      const trade = await tx.trade.create({
        data: {
          user_id: user.id,
          market_id: marketId,
          option_id: option.id,
          amount: netAmount,
          price: finalPrice
        },
        include: {
          user: {
            select: {
              id: true,
              wallet_address: true
            }
          },
          market: {
            select: {
              id: true,
              title: true,
              category: true
            }
          },
          option: {
            select: {
              id: true,
              label: true
            }
          }
        }
      })
      
      // Calculate new odds using improved AMM formula with liquidity consideration
      const allTrades = [...market.trades, trade]
      
      // Calculate total volume for each side
      const yesVolume = allTrades
        .filter(t => {
          const tradeOption = market.options.find(opt => opt.id === t.option_id)
          return tradeOption?.label === 'YES'
        })
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)
      
      const noVolume = allTrades
        .filter(t => {
          const tradeOption = market.options.find(opt => opt.id === t.option_id)
          return tradeOption?.label === 'NO'
        })
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)
      
      // Improved AMM formula with liquidity smoothing
      const totalVolume = yesVolume + noVolume
      const liquidityK = 100 // Liquidity constant - higher means less price impact
      
      // Use constant product formula with liquidity pools
      const yesPool = yesVolume + liquidityK
      const noPool = noVolume + liquidityK
      const totalPool = yesPool + noPool
      
      // Calculate probability based on pool ratios with smoothing
      let newYesOdds = yesPool / totalPool
      
      // Add some momentum based on recent trades (last 10 trades)
      const recentTrades = allTrades.slice(-10)
      const recentYesTrades = recentTrades.filter(t => {
        const tradeOption = market.options.find(opt => opt.id === t.option_id)
        return tradeOption?.label === 'YES'
      }).length
      
      const momentum = (recentYesTrades / Math.max(1, recentTrades.length) - 0.5) * 0.1 // 10% momentum factor
      newYesOdds = Math.max(0.05, Math.min(0.95, newYesOdds + momentum))
      
      const newNoOdds = 1 - newYesOdds
      
      // Update option odds
      for (const opt of market.options) {
        const newOdds = opt.label === 'YES' ? newYesOdds : newNoOdds
        await tx.option.update({
          where: { id: opt.id },
          data: { current_odds: newOdds }
        })
      }
      
      return {
        ...trade,
        fee: tradeFee,
        newPrice: finalPrice,
        sharesReceived: shares,
        side: option.label
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
      where.market_id = marketId
    }
    
    if (userId) {
      where.user_id = userId
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
            wallet_address: true
          }
        },
        option: {
          select: {
            id: true,
            label: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
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
      }
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
