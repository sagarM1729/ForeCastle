'use client'

import PrimaryButton from './PrimaryButton'

// Reusable empty state component
export default function EmptyState({ 
  title = "No items found", 
  message = "There are no items to display",
  actionText,
  actionHref,
  onAction,
  icon = "📭"
}) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
      <p className="text-gray-300 mb-6">{message}</p>
      {(actionText && (actionHref || onAction)) && (
        <PrimaryButton 
          href={actionHref} 
          onClick={onAction}
          sparkle={true}
        >
          {actionText}
        </PrimaryButton>
      )}
    </div>
  )
}
