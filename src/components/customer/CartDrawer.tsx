import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Trash2, Plus, Minus, ArrowRight, ShieldAlert, Sparkles, CheckCircle2, Pizza } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { VegIndicator } from '../common/VegIndicator'
import { createDemoOrder, getTableSeatingGroup } from '../../services/storageService'

interface CartDrawerProps {
  tableNumber: string
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ tableNumber }) => {
  const navigate = useNavigate()
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    tax,
    total,
    specialInstructions,
    setSpecialInstructions,
  } = useCart()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const seatingGroup = getTableSeatingGroup(tableNumber)

  if (!isCartOpen) return null

  const handlePlaceOrder = () => {
    if (items.length === 0) return
    setIsSubmitting(true)

    setTimeout(() => {
      const lineItems = items.map(ci => ({
        id: ci.item.id,
        name: ci.item.name,
        price: ci.item.price,
        quantity: ci.quantity,
        category: ci.item.category,
        crustInfo: ci.item.crustInfo,
      }))

      const newOrder = createDemoOrder(
        tableNumber,
        lineItems,
        specialInstructions
      )

      clearCart()
      setIsSubmitting(false)
      setIsCartOpen(false)
      navigate(`/order-confirmation?orderId=${newOrder.id}&table=${tableNumber}`)
    }, 450)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pizza order summary and checkout"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1E1B18]/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col justify-between border-l border-[#E5DDD0]">
          {/* Header */}
          <div className="p-4 border-b border-[#EAE2D5] bg-white flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-bold text-[#1E1B18]">
                  Your Pizza Order
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EFE8DD] text-[#5A4D43]">
                  Table {tableNumber}
                </span>
              </div>
              {seatingGroup && seatingGroup.active && (
                <p className="text-[11px] text-[#C0392B] font-medium mt-0.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Combined Seating: Group G12 ({seatingGroup.name})
                </p>
              )}
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-[#8C7662] hover:text-[#1E1B18] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#8C7662]">
                <div className="w-16 h-16 rounded-full bg-[#EFE8DD] flex items-center justify-center mb-3">
                  <Pizza className="w-8 h-8 text-[#C0392B]/50" />
                </div>
                <h3 className="font-serif text-base font-semibold text-[#1E1B18] mb-1">
                  Your pizza cart is empty
                </h3>
                <p className="text-xs text-[#7A6756] max-w-xs">
                  Browse our artisanal Neapolitan woodfired pizzas, calzones, and starters to begin ordering for Table {tableNumber}.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-1 border-b border-[#EAE2D5]">
                  <span className="text-xs font-medium text-[#7A6756]">
                    {items.reduce((s, i) => s + i.quantity, 0)} items selected
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-xs text-[#C0392B] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Order</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {items.map(({ item, quantity }) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl p-3 border border-[#E8DFC8] shadow-2xs flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <VegIndicator isVeg={item.isVeg} size="sm" />
                          <h4 className="text-xs font-bold text-[#1E1B18] truncate">
                            {item.name}
                          </h4>
                        </div>
                        {item.crustInfo && (
                          <div className="text-[10px] text-[#7C5A38] font-medium">
                            {item.crustInfo}
                          </div>
                        )}
                        <div className="text-xs text-[#7A6756] mt-0.5">
                          ₹{item.price} &bull; <span className="font-semibold text-[#1E1B18]">₹{item.price * quantity}</span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-[#FAF7F2] rounded-lg border border-[#E3D9CC] p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-[#C0392B] hover:bg-white rounded cursor-pointer transition"
                            aria-label={`Reduce quantity of ${item.name}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-[#1E1B18]">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-[#C0392B] hover:bg-white rounded cursor-pointer transition"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg transition cursor-pointer"
                          title="Remove item"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cooking Instructions Field */}
                <div className="pt-2">
                  <label htmlFor="special-instructions" className="block text-xs font-semibold text-[#4A3D34] mb-1">
                    Kitchen Instructions (Optional)
                  </label>
                  <textarea
                    id="special-instructions"
                    rows={2}
                    value={specialInstructions}
                    onChange={e => setSpecialInstructions(e.target.value)}
                    placeholder="e.g., Cut into 6 slices, well-done crust, extra chili oil on the side..."
                    className="w-full text-xs p-2.5 rounded-xl border border-[#DCD1C2] bg-white focus:outline-none focus:ring-1 focus:ring-[#C0392B] text-[#1E1B18] placeholder:text-[#A39688]"
                  />
                </div>

                {/* Demo Flow Banner */}
                <div className="rounded-xl p-3 bg-[#EFE8DD]/80 border border-[#E2D6C5] text-xs text-[#5A4D43] space-y-1">
                  <div className="font-semibold flex items-center gap-1.5 text-[#3D3128]">
                    <ShieldAlert className="w-4 h-4 text-[#C0392B]" />
                    <span>Artisanal Pizzeria Demo Ordering</span>
                  </div>
                  <p className="text-[11px] text-[#6E5C4E] leading-relaxed">
                    No login or credit card required. When you submit, the order appears live on the Pizzaiolo kitchen display screen.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-4 bg-white border-t border-[#EAE2D5] space-y-3">
              <div className="space-y-1.5 text-xs text-[#5A4D43]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#1E1B18]">₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <span>GST (5% Demo)</span>
                    <span className="text-[10px] text-[#8C7662]">(CGST 2.5% + SGST 2.5%)</span>
                  </span>
                  <span className="font-medium text-[#1E1B18]">₹{tax.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-[#EAE2D5] flex justify-between items-baseline text-sm">
                  <span className="font-serif font-bold text-[#1E1B18]">Total to Pay</span>
                  <span className="font-sans font-extrabold text-base text-[#C0392B]">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-[#C0392B] hover:bg-[#A93226] disabled:bg-stone-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending to Woodfired Oven...</span>
                  </span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Send Pizza Order &bull; Table {tableNumber}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
