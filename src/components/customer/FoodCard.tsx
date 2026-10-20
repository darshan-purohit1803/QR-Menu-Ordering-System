import React from 'react'
import { Plus, Minus, Clock } from 'lucide-react'
import type { MenuItem } from '../../types'
import { VegIndicator } from '../common/VegIndicator'
import { FoodImageWithFallback } from '../common/FoodImageWithFallback'

interface FoodCardProps {
  item: MenuItem
  quantity: number
  onAdd: () => void
  onUpdateQuantity: (qty: number) => void
}

export const FoodCard: React.FC<FoodCardProps> = ({
  item,
  quantity,
  onAdd,
  onUpdateQuantity,
}) => {
  return (
    <article
      className={`bg-white rounded-2xl border border-[#EBE4D8] p-3.5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between gap-3 ${
        !item.isAvailable ? 'opacity-70 grayscale-[20%]' : ''
      }`}
    >
      <div className="flex gap-3.5 items-start">
        {/* Left / Main Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <VegIndicator size="sm" />
            {item.badge && (
              <span className="text-[10px] font-semibold tracking-wide text-[#A3432B] bg-[#A3432B]/10 px-2 py-0.5 rounded-md">
                {item.badge}
              </span>
            )}
            {item.isJainAvailable && (
              <span className="text-[10px] font-medium text-[#7C662B] bg-[#F8F3DC] px-1.5 py-0.5 rounded-sm">
                Jain Option
              </span>
            )}
          </div>

          <h3 className="font-serif text-base font-semibold text-[#26201B] tracking-tight leading-snug">
            {item.name}
          </h3>

          <div className="flex items-baseline gap-2 my-1">
            <span className="font-sans text-base font-bold text-[#26201B]">
              ₹{item.price}
            </span>
            {item.prepTimeMinutes && (
              <span className="inline-flex items-center gap-1 text-[11px] text-[#8C7E72]">
                <Clock className="w-3 h-3 text-[#A39688]" />
                {item.prepTimeMinutes}m
              </span>
            )}
          </div>

          <p className="text-xs text-[#6B5E52] line-clamp-2 leading-relaxed mt-0.5">
            {item.description}
          </p>
        </div>

        {/* Right Food Photo with Add Control */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden border border-[#EBE4D8] flex flex-col items-center justify-end">
          <FoodImageWithFallback
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full absolute inset-0"
          />

          {/* Action button overlay at bottom of image */}
          <div className="relative z-10 w-full p-1.5 flex justify-center">
            {!item.isAvailable ? (
              <span className="w-full text-center text-[10px] font-semibold py-1 px-2 rounded-lg bg-[#332A24]/90 text-stone-200 backdrop-blur-xs">
                Unavailable
              </span>
            ) : quantity === 0 ? (
              <button
                onClick={onAdd}
                aria-label={`Add ${item.name} to order`}
                className="w-full flex items-center justify-center gap-1 text-xs font-bold py-1.5 px-3 rounded-lg bg-white/95 text-[#A3432B] hover:bg-[#FAF7F2] border border-[#E5DDD0] shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD</span>
              </button>
            ) : (
              <div className="w-full flex items-center justify-between bg-white rounded-lg border border-[#A3432B] shadow-sm py-0.5 px-1">
                <button
                  onClick={() => onUpdateQuantity(quantity - 1)}
                  aria-label={`Decrease quantity of ${item.name}`}
                  className="w-6 h-6 flex items-center justify-center text-[#A3432B] hover:bg-[#A3432B]/10 rounded font-bold cursor-pointer transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs font-bold text-[#26201B] px-1">
                  {quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(quantity + 1)}
                  aria-label={`Increase quantity of ${item.name}`}
                  className="w-6 h-6 flex items-center justify-center text-[#A3432B] hover:bg-[#A3432B]/10 rounded font-bold cursor-pointer transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
