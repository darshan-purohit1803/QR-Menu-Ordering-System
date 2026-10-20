import React from 'react'
import { ArrowRight, ShoppingBag } from 'lucide-react'

interface StickyCartBarProps {
  itemCount: number
  subtotal: number
  onViewCart: () => void
}

export const StickyCartBar: React.FC<StickyCartBarProps> = ({
  itemCount,
  subtotal,
  onViewCart,
}) => {
  if (itemCount === 0) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 p-3 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <div className="bg-[#26201B] text-white rounded-2xl p-3 shadow-xl border border-white/10 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#A3432B] flex items-center justify-center font-bold text-white shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-stone-300 font-medium">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in order
              </div>
              <div className="text-base font-bold text-white tracking-tight">
                ₹{subtotal.toFixed(0)} <span className="text-[11px] font-normal text-stone-400">+ tax</span>
              </div>
            </div>
          </div>

          <button
            onClick={onViewCart}
            aria-label="View order details and checkout"
            className="flex items-center gap-2 bg-[#A3432B] hover:bg-[#8C3720] text-white px-4 py-2.5 rounded-xl font-semibold text-xs transition-colors shadow-sm cursor-pointer active:scale-95"
          >
            <span>View Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
