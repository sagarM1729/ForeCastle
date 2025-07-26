import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request, { params }) {
  try {
    console.log('GET /api/markets/[id]/prices - Request received for ID:', params.id)
    
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '7d' // 1h, 24h, 7d, 30d, all
    const interval = searchParams.get('interval') || 'hour' // minute, hour, day
    
    // Calculate date range based on timeframe
    let startDate = new Date()
    switch (timeframe) {
      case '1h':
        startDate.setHours(startDate.getHours() - 1)
        break
      case '24h':
        startDate.setDate(startDate.getDate() - 1)
        break
      case '7d':
        startDate.setDate(startDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(startDate.getDate() - 30)
        break
      case 'all':
        startDate = new Date(0) // Beginning of time
        break
      default:
        startDate.setDate(startDate.getDate() - 7)
    }

    // Fetch trades for price history
    const trades = await db.trade.findMany({
      where: {
        market_id: params.id,
        created_at: {
          gte: startDate
        }
      },
      include: {
        option: {
          select: {
            label: true
          }
        }
      },
      orderBy: {
        created_at: 'asc'
      }
    })

    // Group trades by time intervals and calculate average prices
    const priceHistory = []
    const intervalMs = getIntervalMs(interval)
    
    if (trades.length === 0) {
      // Return default price history if no trades
      const now = new Date()
      const defaultPrice = 0.5
      
      for (let i = 0; i < 24; i++) {
        const time = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000)
        priceHistory.push({
          timestamp: time.toISOString(),
          price: defaultPrice + (Math.random() - 0.5) * 0.1, // Small random variation
          volume: 0,
          trades_count: 0
        })
      }
    } else {
      // Group trades by intervals
      const groupedTrades = {}
      
      trades.forEach(trade => {
        const intervalKey = Math.floor(new Date(trade.created_at).getTime() / intervalMs) * intervalMs
        
        if (!groupedTrades[intervalKey]) {
          groupedTrades[intervalKey] = {
            prices: [],
            volumes: [],
            timestamp: new Date(intervalKey)
          }
        }
        
        groupedTrades[intervalKey].prices.push(parseFloat(trade.price))
        groupedTrades[intervalKey].volumes.push(parseFloat(trade.amount))
      })
      
      // Calculate averages for each interval
      Object.values(groupedTrades)
        .sort((a, b) => a.timestamp - b.timestamp)
        .forEach(group => {
          const avgPrice = group.prices.reduce((sum, p) => sum + p, 0) / group.prices.length
          const totalVolume = group.volumes.reduce((sum, v) => sum + v, 0)
          
          priceHistory.push({
            timestamp: group.timestamp.toISOString(),
            price: avgPrice,
            volume: totalVolume,
            trades_count: group.prices.length
          })
        })
    }

    // Get current market info for context
    const market = await db.market.findUnique({
      where: { id: params.id },
      include: {
        options: {
          select: {
            label: true,
            current_odds: true
          }
        }
      }
    })

    const yesOption = market?.options.find(opt => opt.label === 'YES')
    const currentPrice = yesOption ? parseFloat(yesOption.current_odds) : 0.5

    return NextResponse.json({
      success: true,
      data: {
        price_history: priceHistory,
        current_price: currentPrice,
        timeframe,
        interval,
        market_id: params.id,
        total_points: priceHistory.length
      }
    })

  } catch (error) {
    console.error('Error fetching price history:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch price history' },
      { status: 500 }
    )
  }
}

function getIntervalMs(interval) {
  switch (interval) {
    case 'minute':
      return 60 * 1000
    case 'hour':
      return 60 * 60 * 1000
    case 'day':
      return 24 * 60 * 60 * 1000
    default:
      return 60 * 60 * 1000 // hour
  }
}
