import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request, { params }) {
  try {
    const market = await db.market.findUnique({
      where: { id: params.id },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            walletAddress: true,
            reputation: true
          }
        },
        trades: {
          include: {
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
          take: 50
        },
        _count: {
          select: {
            trades: true,
            positions: true
          }
        }
      }
    })
    
    if (!market) {
      return NextResponse.json(
        { error: 'Market not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(market)
    
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
    // TODO: Add authentication/authorization
    // TODO: Validate ownership or admin role
    // TODO: Check if market has trades (might not allow deletion)
    
    await db.market.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Error deleting market:', error)
    return NextResponse.json(
      { error: 'Failed to delete market' },
      { status: 500 }
    )
  }
}
