const { PrismaClient } = require('@prisma/client')

const db = new PrismaClient()

async function printMarkets() {
  try {
    console.log('📊 Fetching all markets from AWS PostgreSQL...\n')

    const markets = await db.market.findMany({
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
          }
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
      orderBy: {
        created_at: 'desc'
      }
    })

    if (markets.length === 0) {
      console.log('🈳 No markets found in the database')
      console.log('💡 Run: node scripts/seed-sample-data.js to create sample markets')
      return
    }

    console.log(`🎯 Found ${markets.length} market(s) in AWS PostgreSQL:\n`)

    markets.forEach((market, index) => {
      console.log(`═══════════════════════════════════════════════════════════════`)
      console.log(`🏛️  MARKET #${index + 1} (ID: ${market.id})`)
      console.log(`═══════════════════════════════════════════════════════════════`)
      console.log(`📝 Title: ${market.title}`)
      console.log(`📄 Description: ${market.description}`)
      console.log(`🏷️  Category: ${market.category}`)
      console.log(`📊 Status: ${market.status}`)
      console.log(`📅 Created: ${market.created_at}`)
      console.log(`👤 Creator: ${market.creator.wallet_address}`)
      
      console.log(`\n📋 OPTIONS (${market.options.length}):`)
      market.options.forEach(option => {
        console.log(`   • ${option.label}: ${(option.current_odds * 100).toFixed(1)}% odds`)
      })

      console.log(`\n💰 TRADES (${market.trades.length}):`)
      if (market.trades.length === 0) {
        console.log(`   📭 No trades yet`)
      } else {
        market.trades.forEach(trade => {
          const trader = trade.user.wallet_address.slice(0, 6) + '...' + trade.user.wallet_address.slice(-4)
          console.log(`   • ${trader} traded $${trade.amount} at ${(trade.price * 100).toFixed(1)}% (${trade.created_at})`)
        })
      }

      if (market.resolution) {
        console.log(`\n✅ RESOLUTION:`)
        console.log(`   • Resolved at: ${market.resolution.resolved_at}`)
        console.log(`   • Winning option ID: ${market.resolution.winning_option_id}`)
        console.log(`   • Resolver: ${market.resolution.resolver.wallet_address}`)
      } else {
        console.log(`\n⏳ Status: UNRESOLVED`)
      }

      console.log(`\n📈 STATS:`)
      console.log(`   • Total trades: ${market._count.trades}`)
      console.log(`   • Total options: ${market._count.options}`)
      
      console.log(`\n`)
    })

    // Summary stats
    const activeMarkets = markets.filter(m => m.status === 'ACTIVE').length
    const resolvedMarkets = markets.filter(m => m.status === 'RESOLVED').length
    const totalTrades = markets.reduce((sum, m) => sum + m._count.trades, 0)

    console.log(`📊 DATABASE SUMMARY:`)
    console.log(`   🟢 Active Markets: ${activeMarkets}`)
    console.log(`   ✅ Resolved Markets: ${resolvedMarkets}`)
    console.log(`   💰 Total Trades: ${totalTrades}`)
    console.log(`   👥 Unique Creators: ${new Set(markets.map(m => m.creator.wallet_address)).size}`)

  } catch (error) {
    console.error('❌ Error fetching markets:', error)
  } finally {
    await db.$disconnect()
  }
}

printMarkets()
