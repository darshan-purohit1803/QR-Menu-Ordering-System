import React from 'react'
import { ShoppingBag, Sparkles } from 'lucide-react'
import { VegIndicator } from '../common/VegIndicator'
import type { SeatingGroup } from '../../types'

interface CustomerHeaderProps {
  tableNumber: string
  seatingGroup?: SeatingGroup | null
  cartCount: number
  onCartClick: () => void
}

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({
  tableNumber,
  seatingGroup,
  cartCount,
  onCartClick,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAE3D6] transition-all">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Restaurant Brand & Table Badge */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#A3432B] text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
            श्री
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-lg font-bold tracking-tight text-[#26201B] truncate">
                Shree Restaurant
              </h1>
              <VegIndicator size="sm" />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {seatingGroup && seatingGroup.active ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#A3432B] bg-[#A3432B]/10 px-2 py-0.5 rounded-full border border-[#A3432B]/20">
                  <Sparkles className="w-3 h-3" />
                  Table {tableNumber} (Group G12 &bull; {seatingGroup.name})
                </span>
              ) : (
                <span className="inline-flex items-center text-[11px] font-semibold text-[#4A3E36] bg-[#ECE5DA] px-2 py-0.5 rounded-full">
                  Table {tableNumber}
                </span>
              )}
              <span className="text-[11px] text-[#8C7E72] hidden sm:inline">&bull; Nadiad</span>
            </div>
          </div>
        </div>

        {/* Cart Button */}
        <button
          onClick={onCartClick}
          aria-label={`Shopping cart with ${cartCount} items`}
          className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#E0D8CA] hover:border-[#A3432B]/40 shadow-xs hover:shadow-sm text-[#26201B] transition-all cursor-pointer active:scale-95"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-[#A3432B]" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#A3432B] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in-75 duration-150">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </div>
          <span className="text-xs font-semibold hidden xs:inline text-[#26201B]">
            Cart
          </span>
        </button>
      </div>
    </header>
  )
}
