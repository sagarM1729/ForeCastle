// Date utility functions to prevent hydration errors
export function formatDate(dateString) {
  try {
    const date = new Date(dateString)
    // Use consistent formatting to prevent hydration errors
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch (error) {
    return dateString
  }
}

export function formatDateLong(dateString) {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    return dateString
  }
}

export function formatDateShort(dateString) {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    return dateString
  }
}

// Number formatting utility to prevent hydration errors
export function formatNumber(number) {
  try {
    return new Intl.NumberFormat('en-US').format(number)
  } catch (error) {
    return number.toString()
  }
}

export function formatCurrency(number) {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number)
  } catch (error) {
    return `$${number}`
  }
}
