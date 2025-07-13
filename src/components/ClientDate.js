'use client'

import { useState, useEffect } from 'react'
import { formatDate, formatDateShort, formatDateLong } from '@/utils/dateUtils'

// Component to handle client-side date rendering to prevent hydration errors
export default function ClientDate({ date, format = 'short', fallback = '' }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <span>{fallback}</span>
  }

  const formatters = {
    short: formatDateShort,
    long: formatDateLong,
    default: formatDate
  }

  const formatter = formatters[format] || formatters.default
  return <span>{formatter(date)}</span>
}
