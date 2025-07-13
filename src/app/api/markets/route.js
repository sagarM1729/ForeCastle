import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'createdAt'
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
    
    if (status === 'active') {
      where.resolved = false
      where.endDate = { gt: new Date() }
    } else if (status === 'ended') {
      where.endDate = { lt: new Date() }
    } else if (status === 'resolved') {
      where.resolved = true
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
    
    // Build orderBy clause
    const orderBy = {}
    if (sort === 'volume') {
      orderBy.totalVolume = order
    } else if (sort === 'endDate') {
      orderBy.endDate = order
    } else if (sort === 'popularity') {
      // We'll sort by trade count as a proxy for popularity
      orderBy.trades = { _count: order }
    } else {
      orderBy.createdAt = order
    }
    
    const markets = await db.market.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            walletAddress: true,
            avatar: true
          }
        },
        trades: {
          select: {
            id: true,
            side: true,
            amount: true,
            price: true,
            createdAt: true,
            user: {
              select: {
                username: true,
                walletAddress: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5 // Recent trades for preview
        },
        _count: {
          select: {
            trades: true,
            positions: true
          }
        }
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit
    })
    
    // Enrich markets with calculated fields
    const enrichedMarkets = markets.map(market => ({
      ...market,
      participants: market._count.positions,
      tradesCount: market._count.trades,
      probability: parseFloat(market.yesPrice),
      isActive: !market.resolved && new Date(market.endDate) > new Date(),
      timeRemaining: new Date(market.endDate) - new Date(),
      trending: market._count.trades > 10 && 
                new Date(market.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }))
    
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
          where: { resolved: false, endDate: { gt: new Date() } } 
        }),
        resolvedMarkets: await db.market.count({ 
          where: { resolved: true } 
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
    const body = await request.json()
    
    // Validation
    const {
      title,
      description,
      category,
      endDate,
      tags,
      sourceUrl,
      imageUrl,
      creatorId,
      initialLiquidity = 1000
    } = body
    
    if (!title || !description || !category || !endDate || !creatorId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields: title, description, category, endDate, creatorId' 
        },
        { status: 400 }
      )
    }
    
    // Validate end date is in the future
    if (new Date(endDate) <= new Date()) {
      return NextResponse.json(
        { 
          success: false,
          error: 'End date must be in the future' 
        },
        { status: 400 }
      )
    }
    
    // Verify creator exists
    const creator = await db.user.findUnique({
      where: { id: creatorId }
    })
    
    if (!creator) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Creator not found' 
        },
        { status: 404 }
      )
    }
    
    const market = await db.market.create({
      data: {
        title,
        description,
        category,
        endDate: new Date(endDate),
        tags: tags || [],
        sourceUrl,
        imageUrl,
        creatorId,
        liquidityPool: initialLiquidity,
        yesPrice: 0.5,
        noPrice: 0.5
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            walletAddress: true,
            avatar: true
          }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: market,
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

export async function POST(request) {
  try {
    const body = await request.json()
    
    // TODO: Add authentication/authorization
    // TODO: Validate input with Zod schema
    
    const market = await db.market.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        endDate: new Date(body.endDate),
        tags: body.tags || [],
        sourceUrl: body.sourceUrl,
        imageUrl: body.imageUrl,
        creatorId: body.creatorId, // TODO: Get from authenticated user
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
    
    return NextResponse.json(market, { status: 201 })
    
  } catch (error) {
    console.error('Error creating market:', error)
    return NextResponse.json(
      { error: 'Failed to create market' },
      { status: 500 }
    )
  }
}
