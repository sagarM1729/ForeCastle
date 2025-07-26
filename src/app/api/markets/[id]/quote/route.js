import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/markets/[id]/quote - Get real-time price quote for a trade
export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url)
    const side = searchParams.get('side') // YES or NO
    const amount = parseFloat(searchParams.get('amount') || '0')
    
    if (!side || !['YES', 'NO'].includes(side)) {
      return NextResponse.json(
        { success: false, error: 'Invalid side. Must be YES or NO' },
        { status: 400 }
      )
    }
    
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Get market with trades
    const market = await db.market.findUnique({
      where: { id: params.id },
      include: {
        options: true,
        trades: {
          orderBy: { created_at: 'desc' },
          take: 100
        }
      }
    })

    if (!market) {
      return NextResponse.json(
        { success: false, error: 'Market not found' },
        { status: 404 }
      )
    }

    if (market.status === 'RESOLVED') {
      return NextResponse.json(
        { success: false, error: 'Market is resolved' },
        { status: 400 }
      )
    }

    // Get current volumes
    const yesVolume = market.trades
      .filter(t => {
        const tradeOption = market.options.find(opt => opt.id === t.option_id)
        return tradeOption?.label === 'YES'
      })
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)
    
    const noVolume = market.trades
      .filter(t => {
        const tradeOption = market.options.find(opt => opt.id === t.option_id)
        return tradeOption?.label === 'NO'
      })
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)

    const liquidityConstant = 100
    const yesPool = yesVolume + liquidityConstant
    const noPool = noVolume + liquidityConstant
    const totalPool = yesPool + noPool

    // Calculate current odds
    const currentYesOdds = yesPool / totalPool
    const currentNoOdds = 1 - currentYesOdds

    // Calculate price for this trade (including impact)
    const newPrice = side === 'YES' ? 
      (yesPool + amount) / (totalPool + amount) :
      (noPool + amount) / (totalPool + amount)

    // Ensure price is within bounds
    const finalPrice = Math.max(0.05, Math.min(0.95, newPrice))
    
    // Calculate price impact
    const currentPrice = side === 'YES' ? currentYesOdds : currentNoOdds
    const priceImpact = Math.abs(finalPrice - currentPrice) / currentPrice * 100

    // Calculate what user gets
    const shares = amount / finalPrice
    const fee = amount * 0.01 // 1% fee
    const netAmount = amount - fee

    return NextResponse.json({
      success: true,
      data: {
        side,
        amount,
        price: finalPrice,
        currentPrice,
        priceImpact: priceImpact.toFixed(2) + '%',
        shares: shares.toFixed(4),
        fee: fee.toFixed(2),
        netAmount: netAmount.toFixed(2),
        currentOdds: {
          yes: currentYesOdds.toFixed(4),
          no: currentNoOdds.toFixed(4)
        },
        marketStats: {
          totalVolume: (yesVolume + noVolume).toFixed(2),
          yesVolume: yesVolume.toFixed(2),
          noVolume: noVolume.toFixed(2),
          totalTrades: market.trades.length
        }
      }
    })

  } catch (error) {
    console.error('Error getting price quote:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to get price quote',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
