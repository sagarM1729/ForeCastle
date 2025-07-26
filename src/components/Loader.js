'use client'

// Custom animated loader component
export default function Loader({ 
  text = "Loading", 
  size = "medium", 
  className = "" 
}) {
  const sizeClass = size === "large" ? "large" : size === "small" ? "small" : ""
  
  return (
    <div className={`loader ${sizeClass} ${className}`}>
      <div className="loading-text">
        {text}
        <span className="dot">.</span>
        <span className="dot">.</span>
        <span className="dot">.</span>
      </div>
      <div className="loading-bar-background">
        <div className="loading-bar">
          <div className="white-bars-container">
            <div className="white-bar"></div>
            <div className="white-bar"></div>
            <div className="white-bar"></div>
            <div className="white-bar"></div>
            <div className="white-bar"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
