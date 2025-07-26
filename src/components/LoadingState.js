'use client'

import Loader from './Loader'

// Reusable loading state component with enhanced loader
export default function LoadingState({ 
  message = "Loading", 
  size = "medium",
  className = ""
}) {
  const loaderSize = size === "lg" ? "large" : size === "sm" ? "small" : "medium"
  
  return (
    <div className={`text-center py-12 ${className}`}>
      <Loader text={message} size={loaderSize} />
    </div>
  )
}
