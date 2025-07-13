import { clsx } from 'clsx'

export function cn(...inputs) {
  return clsx(inputs)
}

export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatPercentage(value) {
  return `${(value * 100).toFixed(1)}%`
}

export function formatAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function calculateImpliedProbability(price) {
  return price / 100
}

export function calculatePotentialReturn(amount, price) {
  return amount / price
}
