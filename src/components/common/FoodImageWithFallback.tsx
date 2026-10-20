import React, { useState } from 'react'
import { Utensils } from 'lucide-react'

interface FoodImageProps {
  src: string
  alt: string
  className?: string
}

export const FoodImageWithFallback: React.FC<FoodImageProps> = ({ src, alt, className = '' }) => {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  if (hasError) {
    return (
      <div className={`bg-[#EFE9DF] flex flex-col items-center justify-center text-[#8C7E72] p-4 ${className}`}>
        <Utensils className="w-8 h-8 opacity-40 mb-1" />
        <span className="text-[10px] uppercase tracking-wider font-medium opacity-70 text-center">
          Shree Pure Veg
        </span>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden bg-[#EFE9DF] ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-[#EFE9DF] animate-pulse flex items-center justify-center">
          <Utensils className="w-6 h-6 text-[#A39688]/30" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  )
}
