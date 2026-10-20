import React from 'react'

interface VegIndicatorProps {
  className?: string
  size?: 'sm' | 'md'
}

export const VegIndicator: React.FC<VegIndicatorProps> = ({ className = '', size = 'md' }) => {
  const outerSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'
  const innerSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'

  return (
    <div
      className={`inline-flex items-center justify-center border border-[#1E7E34] p-0.5 rounded-xs bg-white/90 ${outerSize} ${className}`}
      title="100% Vegetarian"
      aria-label="Vegetarian"
    >
      <div className={`rounded-full bg-[#1E7E34] ${innerSize}`} />
    </div>
  )
}
