import React from 'react'
import { Plus, Minus, Clock, Flame, Sparkles } from 'lucide-react'
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
      className={`group bg-white rounded-3xl border border-[#EBE2D5] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden ${
        !item.isAvailable ? 'opacity-70 grayscale-[20%]' : ''
      }`}
    >
      {/* 1. BIG Hero Pizza Image Container */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#F4EFE6] select-none">
        <FoodImageWithFallback
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Gradient Scrim for readable badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

        {/* Floating Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="p-1 rounded-md bg-white/95 backdrop-blur-xs shadow-xs">
              <VegIndicator isVeg={true} size="sm" />
            </div>

            {item.badge && (
              <span className="text-[11px] font-bold tracking-wide text-white bg-[#C0392B] px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                {item.badge}
              </span>
            )}

            {item.isSpicy && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-rose-700 px-2 py-0.5 rounded-full shadow-xs">
                <Flame className="w-3 h-3 fill-amber-300 text-amber-300" />
                Spicy
              </span>
            )}
          </div>

          {item.prepTimeMinutes && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 shadow-xs">
              <Clock className="w-3 h-3 text-amber-300" />
              {item.prepTimeMinutes}m
            </span>
          )}
        </div>

        {/* Bottom Crust Info on Image */}
        {item.crustInfo && (
          <div className="absolute bottom-2.5 left-3 pointer-events-none">
            <span className="text-[11px] font-semibold tracking-wide text-white/95 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15">
              {item.crustInfo}
            </span>
          </div>
        )}
      </div>

      {/* 2. Pizza Details & Artisanal Description */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-0.5">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1E1B18] tracking-tight group-hover:text-[#C0392B] transition-colors">
              {item.name}
            </h3>
          </div>

          {item.italianSubtitle && (
            <div className="font-serif italic text-xs text-[#8C7662] mb-2 font-medium">
              {item.italianSubtitle}
            </div>
          )}

          <p className="text-xs sm:text-sm text-[#5C4F44] line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* 3. Bottom Bar: Price & Large Action Button */}
        <div className="pt-4 mt-3 border-t border-[#F2ECE2] flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#8C7662]">
              Price
            </div>
            <div className="font-sans text-xl font-extrabold text-[#1E1B18] tracking-tight">
              ₹{item.price}
            </div>
          </div>

          {/* Action Control */}
          <div>
            {!item.isAvailable ? (
              <span className="inline-block text-xs font-bold py-2 px-4 rounded-xl bg-stone-200 text-stone-600">
                Sold Out
              </span>
            ) : quantity === 0 ? (
              <button
                onClick={onAdd}
                aria-label={`Add ${item.name} to order`}
                className="flex items-center gap-1.5 text-xs font-bold py-2.5 px-5 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>ADD TO ORDER</span>
              </button>
            ) : (
              <div className="flex items-center bg-white rounded-xl border-2 border-[#C0392B] shadow-xs p-1">
                <button
                  onClick={() => onUpdateQuantity(quantity - 1)}
                  aria-label={`Decrease quantity of ${item.name}`}
                  className="w-8 h-8 flex items-center justify-center text-[#C0392B] hover:bg-[#C0392B]/10 rounded-lg font-bold cursor-pointer transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-[#1E1B18]">
                  {quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(quantity + 1)}
                  aria-label={`Increase quantity of ${item.name}`}
                  className="w-8 h-8 flex items-center justify-center text-[#C0392B] hover:bg-[#C0392B]/10 rounded-lg font-bold cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
