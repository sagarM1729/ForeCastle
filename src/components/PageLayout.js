'use client'

// Reusable page layout component to eliminate code duplication
export default function PageLayout({ 
  children, 
  className = "", 
  showBackgroundElements = true,
  minHeight = "min-h-screen" 
}) {
  return (
    <div className={`${minHeight} bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 ${className}`}>
      {/* Background Elements */}
      {showBackgroundElements && (
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-blue-400/10 to-indigo-500/10 rounded-full blur-3xl"></div>
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
