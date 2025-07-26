'use client'

import PrimaryButton from './PrimaryButton'

// Reusable error state component
export default function ErrorState({ 
  title = "Something went wrong", 
  message = "An unexpected error occurred",
  onRetry,
  retryText = "Try Again"
}) {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
      <p className="text-gray-300 mb-6">{message}</p>
      {onRetry && (
        <PrimaryButton onClick={onRetry}>
          {retryText}
        </PrimaryButton>
      )}
    </div>
  )
}
