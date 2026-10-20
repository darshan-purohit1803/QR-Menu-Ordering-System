import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import {
  CheckCircle2,
  Clock,
  ArrowLeft,
  LayoutDashboard,
  Flame,
  BellRing,
  Sparkles,
  Info,
  Pizza,
} from 'lucide-react'
import { getOrderById, STORAGE_CHANGE_EVENT } from '../services/storageService'
import type { Order, OrderStatus } from '../types'
import { VegIndicator } from '../components/common/VegIndicator'

const STATUS_STEPS: { key: OrderStatus; label: string; sublabel: string; icon: React.ElementType }[] = [
  { key: 'received', label: 'Received', sublabel: 'Order queued', icon: CheckCircle2 },
  { key: 'preparing', label: 'In Woodfired Oven', sublabel: 'Baking at 450°C', icon: Flame },
  { key: 'ready', label: 'Fresh from Oven', sublabel: 'Plated & garnished', icon: BellRing },
  { key: 'served', label: 'Served', sublabel: 'Enjoy your pizza!', icon: Sparkles },
]

export const OrderConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const orderId = searchParams.get('orderId') || ''
  const tableParam = searchParams.get('table') || '07'

  const [order, setOrder] = useState<Order | undefined>(() => getOrderById(orderId))

  useEffect(() => {
    const handleUpdate = () => {
      setOrder(getOrderById(orderId))
    }
    window.addEventListener(STORAGE_CHANGE_EVENT, handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener(STORAGE_CHANGE_EVENT, handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [orderId])

  const getStepStatus = (stepKey: OrderStatus) => {
    if (!order) return 'upcoming'
    const stepOrder: OrderStatus[] = ['received', 'preparing', 'ready', 'served']
    const currentIndex = stepOrder.indexOf(order.status)
    const targetIndex = stepOrder.indexOf(stepKey)

    if (order.status === 'rejected') return 'rejected'
    if (currentIndex === targetIndex) return 'current'
    if (currentIndex > targetIndex) return 'completed'
    return 'upcoming'
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1B18] flex flex-col py-8 px-4">
      <div className="max-w-xl mx-auto w-full space-y-6">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(`/menu?table=${tableParam}`)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#8C7662] hover:text-[#1E1B18] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Pizza Menu (Table {tableParam})</span>
          </button>
          <div className="flex items-center gap-1.5 font-serif font-bold text-xs text-[#C0392B]">
            <Pizza className="w-4 h-4" />
            <span>Authentic Neapolitan Pizza</span>
          </div>
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-3xl border border-[#EAE2D5] p-6 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-[#C0392B]/10 text-[#C0392B] flex items-center justify-center mx-auto shadow-2xs border border-[#C0392B]/20">
              <Pizza className="w-8 h-8" />
            </div>
            <span className="inline-block text-[11px] font-bold text-[#8C7662] uppercase tracking-wider">
              Demonstration Order Placed
            </span>
            <h1 className="font-serif text-2xl font-bold text-[#1E1B18]">
              Order Confirmed & Baking!
            </h1>
            <p className="text-xs text-[#5C4F44] max-w-sm mx-auto">
              Your simulated pizza order is being prepared and is now live on the Pizzaiolo kitchen display system.
            </p>
          </div>

          {/* Order Details Badge */}
          <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#E3D9CC] grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <div className="text-[#8C7662] text-[11px]">Order Number</div>
              <div className="font-mono font-bold text-[#1E1B18] text-sm">
                {order?.orderNumber || `#${orderId || 'NP-DEMO'}`}
              </div>
            </div>
            <div>
              <div className="text-[#8C7662] text-[11px]">Table Assignment</div>
              <div className="font-bold text-[#1E1B18] text-sm">
                Table {order?.tableNumber || tableParam}
              </div>
              {order?.seatingGroup && (
                <div className="text-[10px] text-[#C0392B] font-semibold">
                  {order.seatingGroup}
                </div>
              )}
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-[#8C7662] text-[11px]">Order Time</div>
              <div className="font-medium text-[#1E1B18]">
                {order ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
              </div>
            </div>
          </div>

          {/* Status Progression Tracker */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-[#1E1B18]">
              <span className="font-serif font-bold">Woodfired Oven Progress</span>
              <span className="text-[11px] font-medium text-[#C0392B] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Live Status: <strong className="capitalize">{order?.status === 'preparing' ? 'Baking in Oven' : order?.status || 'received'}</strong>
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-1">
              {STATUS_STEPS.map((step, idx) => {
                const state = getStepStatus(step.key)
                const Icon = step.icon

                let pillColor = 'bg-[#FAF7F2] text-[#A39688] border-[#EAE2D5]'
                if (state === 'completed') {
                  pillColor = 'bg-[#2E7D32] text-white border-[#2E7D32]'
                } else if (state === 'current') {
                  pillColor = 'bg-[#C0392B] text-white border-[#C0392B] shadow-xs ring-2 ring-[#C0392B]/20'
                }

                return (
                  <div key={step.key} className="flex flex-col items-center text-center gap-1.5">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${pillColor}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-[#382F28] leading-tight">
                      {step.label}
                    </span>
                    <span className="text-[9px] text-[#8C7662]">Step {idx + 1}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Itemized summary */}
          <div className="border-t border-[#EAE2D5] pt-4 space-y-3">
            <h2 className="text-xs font-bold text-[#4A3D34] uppercase tracking-wider">
              Pizzas & Items in this demo order
            </h2>

            {order?.items && order.items.length > 0 ? (
              <div className="space-y-2.5">
                {order.items.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-xs py-1.5 border-b border-[#FAF7F2]"
                  >
                    <div className="flex items-center gap-2">
                      <VegIndicator isVeg={true} size="sm" />
                      <div>
                        <span className="font-semibold text-[#1E1B18]">
                          {item.name}
                        </span>
                        <span className="text-[#8C7662] font-semibold ml-1.5">
                          &times; {item.quantity}
                        </span>
                        {item.crustInfo && (
                          <div className="text-[10px] text-[#7C5A38]">
                            {item.crustInfo}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-[#1E1B18]">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}

                {order.customerNotes && (
                  <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E3D9CC] text-xs text-[#5A4D43]">
                    <span className="font-bold text-[#382F28]">Kitchen instructions:</span>{' '}
                    {order.customerNotes}
                  </div>
                )}

                <div className="pt-2 text-xs text-[#5A4D43] space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{order.subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>GST (5% Demo)</span>
                    <span className="font-medium">₹{order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-[#1E1B18] pt-1 border-t border-[#EAE2D5]">
                    <span className="font-serif">Total Amount</span>
                    <span className="text-[#C0392B] font-extrabold text-base">₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#8C7662] py-2">
                Order details saved in local browser storage.
              </div>
            )}
          </div>

          {/* Demo simulation disclaimer */}
          <div className="p-3 bg-[#EFE8DD]/80 rounded-2xl border border-[#E2D6C5] flex items-start gap-2.5 text-xs text-[#5A4D43]">
            <Info className="w-4 h-4 text-[#C0392B] shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Sales Demonstration Notice:</strong> This ordering journey is simulated to showcase the table-side digital QR experience for Authentic Neapolitan Pizza. No actual payment was charged.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <Link
              to={`/menu?table=${tableParam}`}
              className="flex-1 py-3 px-4 rounded-xl border border-[#D5C8B7] hover:bg-[#FAF7F2] text-[#382F28] font-semibold text-xs flex items-center justify-center gap-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Order Another Pizza</span>
            </Link>

            <Link
              to="/staff"
              className="flex-1 py-3 px-4 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>View in Pizzaiolo Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
