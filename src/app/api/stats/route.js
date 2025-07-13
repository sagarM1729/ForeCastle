import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/stats - Get platform statistics
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7d' // 1d, 7d, 30d, all
    
    // Calculate date range
    let dateFilter = {}
    const now = new Date()
    
    switch (period) {
      case '1d':
        dateFilter = {
          gte: new Date(now.getTime() - 24 * 60 * 60 * 1000)
        }
        break
      case '7d':
        dateFilter = {
          gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        }
        break
      case '30d':
        dateFilter = {
          gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        }
        break
      case 'all':
      default:
        // No date filter for all time
        break
    }
    
    // Run all queries in parallel for better performance
    const [
      totalMarkets,
      activeMarkets,
      resolvedMarkets,
      totalUsers,
      totalTrades,
      totalVolume,
      recentTrades,
      topMarkets,
      categoryStats,
      dailyVolume
    ] = await Promise.all([
      // Total markets
      db.market.count(),
      
      // Active markets
      db.market.count({
        where: {
          resolved: false,
          endDate: {
            gt: new Date()
          }
        }
      }),
      
      // Resolved markets
      db.market.count({
        where: {
          resolved: true
        }
      }),
      
      // Total users
      db.user.count(),
      
      // Total trades (filtered by period)
      db.trade.count({
        where: {
          createdAt: dateFilter.gte ? dateFilter : undefined
        }
      }),
      
      // Total volume (filtered by period)
      db.trade.aggregate({
        _sum: {
          amount: true
        },
        where: {
          createdAt: dateFilter.gte ? dateFilter : undefined
        }
      }),
      
      // Recent trades for activity feed
      db.trade.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
            select: {
              username: true,
              walletAddress: true
            }
          },
          market: {
            select: {
              title: true,
              category: true
            }
          }
        }
      }),
      
      // Top markets by volume
      db.market.findMany({
        take: 10,
        orderBy: {
          totalVolume: 'desc'
        },
        include: {
          creator: {
            select: {
              username: true,
              walletAddress: true
            }
          },
          _count: {
            select: {
              trades: true,
              positions: true
            }
          }
        }
      }),
      
      // Category statistics
      db.market.groupBy({
        by: ['category'],
        _count: {
          _all: true
        },
        _sum: {
          totalVolume: true
        }
      }),
      
      // Daily volume for the last 30 days
      db.$queryRaw`
        SELECT 
          DATE(created_at) as date,
          SUM(amount) as volume,
          COUNT(*) as trades
        FROM trades 
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `
    ])
    
    // Calculate growth metrics
    const previousPeriodFilter = {}
    if (dateFilter.gte) {
      const periodLength = now.getTime() - dateFilter.gte.getTime()
      previousPeriodFilter.gte = new Date(dateFilter.gte.getTime() - periodLength)
      previousPeriodFilter.lt = dateFilter.gte
    }
    
    let previousVolume = { _sum: { amount: 0 } }
    let previousTrades = 0
    
    if (Object.keys(previousPeriodFilter).length > 0) {
      [previousVolume, previousTrades] = await Promise.all([
        db.trade.aggregate({
          _sum: {
            amount: true
          },
          where: {
            createdAt: previousPeriodFilter
          }
        }),
        db.trade.count({
          where: {
            createdAt: previousPeriodFilter
          }
        })
      ])
    }
    
    // Calculate growth percentages
    const currentVolume = totalVolume._sum.amount || 0
    const prevVolume = previousVolume._sum.amount || 0
    const volumeGrowth = prevVolume > 0 
      ? ((currentVolume - prevVolume) / prevVolume) * 100 
      : 0
    
    const tradesGrowth = previousTrades > 0 
      ? ((totalTrades - previousTrades) / previousTrades) * 100 
      : 0
    
    // Format category stats
    const categoryStatsFormatted = categoryStats.map(cat => ({
      category: cat.category,
      markets: cat._count._all,
      volume: parseFloat(cat._sum.totalVolume || 0)
    }))
    
    // Format daily volume for charts
    const dailyVolumeFormatted = dailyVolume.map(day => ({
      date: day.date,
      volume: parseFloat(day.volume || 0),
      trades: parseInt(day.trades || 0)
    }))
    
    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalMarkets,
          activeMarkets,
          resolvedMarkets,
          totalUsers,
          totalTrades,
          totalVolume: currentVolume,
          volumeGrowth,
          tradesGrowth
        },
        recentActivity: recentTrades,
        topMarkets,
        categoryStats: categoryStatsFormatted,
        dailyVolume: dailyVolumeFormatted,
        period
      }
    })
    
  } catch (error) {
    console.error('Error fetching statistics:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch statistics',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
