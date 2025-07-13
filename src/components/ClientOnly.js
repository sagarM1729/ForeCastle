'use client'

import { useState, useEffect } from 'react'

// Client-only wrapper to prevent hydration errors
export function ClientOnly({ children }) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return children
}
