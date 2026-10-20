import React from 'react'

interface VegIndicatorProps {
  isVeg?: boolean
  className?: string
  size?: 'sm' | 'md'
}

export const VegIndicator: React.FC<VegIndicatorProps> = ({ isVeg = true, className = '', size = 'md' }) => {
  const outerSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'
  const innerDot = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'

  if (isVeg) {
    return (
      <div
        className={`inline-flex items-center justify-center border border-[#2E7D32] p-0.5 rounded-xs bg-white/95 shrink-0 ${outerSize} ${className}`}
        title="Vegetarian Pizza"
        aria-label="Vegetarian"
      >
        <div className={`rounded-full bg-[#2E7D32] ${innerDot}`} />
      </div>
    )
  }

  return (
    <div
      className={`inline-flex items-center justify-center border border-[#C0392B] p-0.5 rounded-xs bg-white/95 shrink-0 ${outerSize} ${className}`}
      title="Non-Vegetarian / Meat Pizza"
      aria-label="Non-Vegetarian"
    >
      <div
        className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[6px] border-b-[#C0392B]"
      />
    </div>
  )
}
