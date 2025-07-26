'use client'

// Reusable button component with consistent styling
export default function PrimaryButton({ 
  children, 
  onClick, 
  href, 
  className = "", 
  size = "md",
  variant = "gradient",
  sparkle = false,
  type = "button",
  disabled = false,
  ...props 
}) {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl"
  }

  const variantClasses = {
    gradient: "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-2xl hover:shadow-orange-500/25",
    outline: "border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white",
    secondary: "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-600/50"
  }

  // If sparkle is enabled, use sparkle button styling
  if (sparkle) {
    const sparkleVariant = variant === 'gradient' ? 'primary' : 'secondary'
    const sparkleClasses = `sparkle-button ${sparkleVariant} ${className}`.trim()
    
    const sparkleContent = (
      <>
        <span className="spark"></span>
        <span className="backdrop"></span>
        <svg className="sparkle" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0L13.09 8.91L22 10L13.09 11.09L12 20L10.91 11.09L2 10L10.91 8.91L12 0Z"/>
          <path d="M19 4L19.5 6.5L22 7L19.5 7.5L19 10L18.5 7.5L16 7L18.5 6.5L19 4Z"/>
          <path d="M5 14L5.5 16.5L8 17L5.5 17.5L5 20L4.5 17.5L2 17L4.5 16.5L5 14Z"/>
        </svg>
        <span className="text">{children}</span>
      </>
    )

    if (href) {
      const Link = require('next/link').default
      return (
        <div className="sp">
          <Link href={href} className={sparkleClasses} {...props}>
            {sparkleContent}
          </Link>
        </div>
      )
    }

    return (
      <div className="sp">
        <button 
          type={type}
          className={sparkleClasses}
          onClick={onClick}
          disabled={disabled}
          {...props}
        >
          {sparkleContent}
        </button>
      </div>
    )
  }

  const baseClasses = `
    inline-flex items-center justify-center 
    rounded-xl font-semibold 
    transition-all duration-300 
    transform hover:scale-105
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${sizeClasses[size]} 
    ${variantClasses[variant]} 
    ${className}
  `.trim().replace(/\s+/g, ' ')

  if (href) {
    const Link = require('next/link').default
    return (
      <Link href={href} className={baseClasses} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={baseClasses}
      {...props}
    >
      {children}
    </button>
  )
}
