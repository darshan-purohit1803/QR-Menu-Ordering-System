import React, { useState } from 'react'
import { Pizza } from 'lucide-react'

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
      <div className={`bg-[#F4EFE6] flex flex-col items-center justify-center text-[#8C7662] p-4 ${className}`}>
        <Pizza className="w-8 h-8 opacity-50 mb-1 text-[#C0392B]" />
        <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80 text-center font-serif text-[#4A3B32]">
          Neapolitan Woodfired
        </span>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden bg-[#F4EFE6] ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-[#F4EFE6] animate-pulse flex items-center justify-center">
          <Pizza className="w-6 h-6 text-[#A39688]/40" />
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
