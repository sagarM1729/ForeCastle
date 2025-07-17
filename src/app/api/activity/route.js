import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get recent trades with market and user info
    const recentTrades = await db.trade.findMany({
      take: 10,
      orderBy: { created_at: 'desc' },
      include: {
        user: {
          select: {
            wallet_address: true
          }
        },
        option: {
          select: {
            label: true,
            market: {
              select: {
                title: true,
                id: true
              }
            }
          }
        }
      }
    })

    // Get recent markets created
    const recentMarkets = await db.market.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        creator: {
          select: {
            wallet_address: true
          }
        }
      }
    })

    // Get recent resolutions
    const recentResolutions = await db.resolution.findMany({
      take: 3,
      orderBy: { resolved_at: 'desc' },
      include: {
        market: {
          select: {
            title: true,
            id: true
          }
        },
        resolver: {
          select: {
            wallet_address: true
          }
        },
        winning_option: {
          select: {
            label: true
          }
        }
      }
    })

    // Combine and format activities
    const activities = []

    // Add trades
    recentTrades.forEach(trade => {
      activities.push({
        id: `trade-${trade.id}`,
        type: 'trade',
        user: trade.user.wallet_address.slice(0, 6) + '...' + trade.user.wallet_address.slice(-4),
        action: `bought ${trade.option.label} shares`,
        market: trade.option.market.title,
        marketId: trade.option.market.id,
        amount: parseFloat(trade.amount),
        timestamp: formatTimeAgo(trade.created_at),
        icon: trade.option.label === 'YES' ? '📈' : '📉',
        color: trade.option.label === 'YES' ? 'text-green-600' : 'text-red-600'
      })
    })

    // Add market creations
    recentMarkets.forEach(market => {
      activities.push({
        id: `market-${market.id}`,
        type: 'creation',
        user: market.creator.wallet_address.slice(0, 6) + '...' + market.creator.wallet_address.slice(-4),
        action: 'created new market',
        market: market.title,
        marketId: market.id,
        amount: null,
        timestamp: formatTimeAgo(market.created_at),
        icon: '🆕',
        color: 'text-blue-600'
      })
    })

    // Add resolutions
    recentResolutions.forEach(resolution => {
      activities.push({
        id: `resolution-${resolution.id}`,
        type: 'resolution',
        user: 'System',
        action: `resolved market - ${resolution.winning_option.label} won`,
        market: resolution.market.title,
        marketId: resolution.market.id,
        amount: null,
        timestamp: formatTimeAgo(resolution.resolved_at),
        icon: '✅',
        color: 'text-emerald-600'
      })
    })

    // Sort by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    return NextResponse.json({
      success: true,
      data: activities.slice(0, 15) // Return top 15 activities
    })

  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch recent activity',
        details: error.message
      },
      { status: 500 }
    )
  }
}

function formatTimeAgo(date) {
  const now = new Date()
  const diffInMs = now - new Date(date)
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
}
