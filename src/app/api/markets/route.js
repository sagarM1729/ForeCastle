import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'created_at'
    const order = searchParams.get('order') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    
    const where = {}
    
    if (category && category !== 'all') {
      where.category = {
        equals: category,
        mode: 'insensitive'
      }
    }
    
    if (status && status !== 'all') {
      where.status = status.toUpperCase() // ACTIVE, CLOSED, RESOLVED
    }
    
    // Add search functionality
    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ]
    }

    // Set up ordering
    const orderBy = {}
    if (sort === 'created_at') {
      orderBy.created_at = order
    } else if (sort === 'title') {
      orderBy.title = order
    } else if (sort === 'category') {
      orderBy.category = order
    } else if (sort === 'popularity' || sort === 'volume') {
      // Sort by trade count as a proxy for popularity/volume
      orderBy.trades = { _count: order }
    } else {
      // Default: newest first
      orderBy.created_at = 'desc'
    }
    
    const markets = await db.market.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            wallet_address: true
          }
        },
        options: {
          select: {
            id: true,
            label: true,
            current_odds: true
          }
        },
        trades: {
          select: {
            id: true,
            amount: true,
            price: true,
            created_at: true,
            user: {
              select: {
                wallet_address: true
              }
            }
          },
          orderBy: {
            created_at: 'desc'
          },
          take: 5 // Recent trades for preview
        },
        resolution: {
          select: {
            winning_option_id: true,
            resolved_at: true,
            resolver: {
              select: {
                wallet_address: true
              }
            }
          }
        },
        _count: {
          select: {
            trades: true,
            options: true
          }
        }
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit
    })
    
    // Enrich markets with calculated fields
    const enrichedMarkets = markets.map(market => {
      // Calculate probability from YES option
      const yesOption = market.options.find(opt => opt.label === 'YES')
      const probability = yesOption ? yesOption.current_odds : 0.5
      const yesPrice = probability
      const noPrice = 1 - probability
      const totalVolume = market.trades.reduce((sum, trade) => sum + trade.amount, 0)
      const participants = new Set(market.trades.map(t => t.user.wallet_address)).size
      
      return {
        ...market,
        probability,
        yesPrice,
        noPrice,
        totalVolume,
        participants,
        tradesCount: market._count.trades,
        optionsCount: market._count.options,
        isActive: market.status === 'ACTIVE',
        isResolved: market.status === 'RESOLVED',
        trending: market._count.trades > 5 && 
                  new Date(market.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        // Add missing fields for display
        endDate: market.end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        tags: [market.category]
      }
    })
    
    const total = await db.market.count({ where })
    
    return NextResponse.json({
      success: true,
      data: enrichedMarkets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: page * limit < total
      },
      stats: {
        totalMarkets: total,
        activeMarkets: await db.market.count({ 
          where: { status: 'ACTIVE' } 
        }),
        resolvedMarkets: await db.market.count({ 
          where: { status: 'RESOLVED' } 
        })
      }
    })
    
  } catch (error) {
    console.error('Error fetching markets:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch markets',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    console.log('POST /api/markets - Request received')
    
    const body = await request.json()
    console.log('Request body:', body)
    
    const { title, description, category, creator_wallet } = body
    
    if (!title || !description || !category || !creator_wallet) {
      console.error('Missing required fields:', { title: !!title, description: !!description, category: !!category, creator_wallet: !!creator_wallet })
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: title, description, category, creator_wallet'
        },
        { status: 400 }
      )
    }

    console.log('Finding/creating user for wallet:', creator_wallet)
    
    // Find or create user based on wallet address
    let user = await db.user.findUnique({
      where: { wallet_address: creator_wallet }
    })

    if (!user) {
      console.log('Creating new user for wallet:', creator_wallet)
      user = await db.user.create({
        data: {
          wallet_address: creator_wallet
        }
      })
    }
    
    console.log('User found/created:', user.id)

    // Create market
    console.log('Creating market with data:', { title, description, category, created_by: user.id })
    const market = await db.market.create({
      data: {
        title,
        description,
        category,
        created_by: user.id,
        status: 'ACTIVE'
      },
      include: {
        creator: {
          select: {
            id: true,
            wallet_address: true
          }
        }
      }
    })

    // Create default YES/NO options
    const yesOption = await db.option.create({
      data: {
        market_id: market.id,
        label: 'YES',
        current_odds: 0.5
      }
    })

    const noOption = await db.option.create({
      data: {
        market_id: market.id,
        label: 'NO', 
        current_odds: 0.5
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        ...market,
        options: [yesOption, noOption]
      },
      message: 'Market created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating market:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create market',
        details: error.message
      },
      { status: 500 }
    )
  }
}
