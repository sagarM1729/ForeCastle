import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request, { params }) {
  try {
    console.log('GET /api/markets/[id] - Request received for ID:', params.id)
    
    const market = await db.market.findUnique({
      where: {
        id: params.id
      },
      include: {
        creator: {
          select: {
            id: true,
            wallet_address: true
          }
        },
        options: true,
        trades: {
          include: {
            user: {
              select: {
                wallet_address: true
              }
            },
            option: true
          },
          orderBy: {
            created_at: 'desc'
          },
          take: 10 // Get latest 10 trades
        }
      }
    })

    if (!market) {
      return NextResponse.json(
        { success: false, error: 'Market not found' },
        { status: 404 }
      )
    }

    // Calculate some derived fields for display
    const totalVolume = market.trades.reduce((sum, trade) => sum + trade.amount, 0)
    const participants = new Set(market.trades.map(trade => trade.user.wallet_address)).size

    // Get YES option probability (assuming first option is YES)
    const yesOption = market.options.find(opt => opt.label === 'YES')
    const probability = yesOption ? yesOption.current_odds : 0.5

    const enrichedMarket = {
      ...market,
      totalVolume,
      participants,
      probability,
      yesPrice: yesOption?.current_odds || 0.5,
      noPrice: 1 - (yesOption?.current_odds || 0.5),
      // Default values for fields that don't exist yet
      longDescription: market.description,
      trending: false,
      tags: [market.category],
      totalShares: totalVolume * 2, // Rough estimate
      yesShares: totalVolume * (yesOption?.current_odds || 0.5),
      noShares: totalVolume * (1 - (yesOption?.current_odds || 0.5)),
      liquidityPool: totalVolume * 0.1, // Rough estimate
      rules: [
        'Market resolves based on outcome verification',
        'Trading continues until market end date',
        'Final resolution will be determined by market creator',
        'All trades are final and cannot be reversed'
      ],
      sources: [
        'Market Creator Verification',
        'Community Consensus',
        'Official Announcements'
      ],
      endDate: market.end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days from now
      resolutionDate: market.resolution_date || new Date(Date.now() + 32 * 24 * 60 * 60 * 1000), // Default 32 days from now
      createdAt: market.created_at
    }

    return NextResponse.json({
      success: true,
      market: enrichedMarket
    })
    
  } catch (error) {
    console.error('Error fetching market:', error)
    return NextResponse.json(
      { error: 'Failed to fetch market' },
      { status: 500 }
    )
  }
}

export async function PATCH(request, { params }) {
  try {
    const body = await request.json()
    
    // TODO: Add authentication/authorization
    // TODO: Validate ownership or admin role
    
    const market = await db.market.update({
      where: { id: params.id },
      data: {
        ...body,
        updatedAt: new Date()
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            walletAddress: true
          }
        }
      }
    })
    
    return NextResponse.json(market)
    
  } catch (error) {
    console.error('Error updating market:', error)
    return NextResponse.json(
      { error: 'Failed to update market' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    console.log('DELETE /api/markets/[id] - Request received for ID:', params.id)
    
    // Check if market exists
    const market = await db.market.findUnique({
      where: { id: params.id },
      include: {
        trades: true,
        options: true,
        resolution: true
      }
    })

    if (!market) {
      return NextResponse.json(
        { success: false, error: 'Market not found' },
        { status: 404 }
      )
    }

    // Use a transaction to ensure all related data is deleted properly
    await db.$transaction(async (prisma) => {
      // Delete trades first (no cascade delete defined)
      await prisma.trade.deleteMany({
        where: { market_id: params.id }
      })

      // Delete resolution if exists (has cascade delete, but explicit is safer)
      if (market.resolution) {
        await prisma.resolution.delete({
          where: { market_id: params.id }
        })
      }

      // Delete options (has cascade delete, but explicit is safer)
      await prisma.option.deleteMany({
        where: { market_id: params.id }
      })

      // Finally delete the market
      await prisma.market.delete({
        where: { id: params.id }
      })
    })

    console.log(`Market ${params.id} and all related data deleted successfully`)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Market and all related data deleted successfully' 
    })
    
  } catch (error) {
    console.error('Error deleting market:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete market',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
