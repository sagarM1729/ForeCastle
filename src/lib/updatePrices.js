import { db } from '@/lib/db'

// Update option odds based on recent trades
export async function updateOptionOdds(marketId) {
  try {
    console.log('Updating option odds for market:', marketId)
    
    // Get all options for this market
    const options = await db.option.findMany({
      where: { market_id: marketId }
    })
    
    // Get recent trades (last 50) to calculate new odds
    const recentTrades = await db.trade.findMany({
      where: { market_id: marketId },
      orderBy: { created_at: 'desc' },
      take: 50,
      include: {
        option: true
      }
    })
    
    if (recentTrades.length === 0) {
      console.log('No trades found, keeping default odds')
      return
    }
    
    // Calculate volume-weighted average price for each option
    const optionStats = {}
    
    recentTrades.forEach(trade => {
      const optionId = trade.option_id
      if (!optionStats[optionId]) {
        optionStats[optionId] = {
          totalVolume: 0,
          weightedPriceSum: 0,
          tradeCount: 0
        }
      }
      
      const amount = parseFloat(trade.amount)
      const price = parseFloat(trade.price)
      
      optionStats[optionId].totalVolume += amount
      optionStats[optionId].weightedPriceSum += amount * price
      optionStats[optionId].tradeCount += 1
    })
    
    // Update each option with new odds
    for (const option of options) {
      const stats = optionStats[option.id]
      
      if (stats && stats.totalVolume > 0) {
        // Calculate volume-weighted average price
        const newOdds = stats.weightedPriceSum / stats.totalVolume
        
        // Ensure odds are between 0.01 and 0.99
        const clampedOdds = Math.max(0.01, Math.min(0.99, newOdds))
        
        await db.option.update({
          where: { id: option.id },
          data: { current_odds: clampedOdds }
        })
        
        console.log(`Updated option ${option.label} odds to ${clampedOdds}`)
      }
    }
    
    // For YES/NO markets, ensure they sum to 1
    if (options.length === 2) {
      const yesOption = options.find(opt => opt.label === 'YES')
      const noOption = options.find(opt => opt.label === 'NO')
      
      if (yesOption && noOption) {
        const yesStats = optionStats[yesOption.id]
        if (yesStats && yesStats.totalVolume > 0) {
          const yesOdds = yesStats.weightedPriceSum / yesStats.totalVolume
          const noOdds = 1 - yesOdds
          
          await db.option.updateMany({
            where: { market_id: marketId, label: 'YES' },
            data: { current_odds: Math.max(0.01, Math.min(0.99, yesOdds)) }
          })
          
          await db.option.updateMany({
            where: { market_id: marketId, label: 'NO' },
            data: { current_odds: Math.max(0.01, Math.min(0.99, noOdds)) }
          })
        }
      }
    }
    
    console.log('Option odds updated successfully')
  } catch (error) {
    console.error('Error updating option odds:', error)
  }
}
