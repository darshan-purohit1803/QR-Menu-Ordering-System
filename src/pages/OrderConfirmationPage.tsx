import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import {
  CheckCircle2,
  Clock,
  ArrowLeft,
  LayoutDashboard,
  ChefHat,
  BellRing,
  Sparkles,
  Info,
} from 'lucide-react'
import { getOrderById, STORAGE_CHANGE_EVENT } from '../services/storageService'
import type { Order, OrderStatus } from '../types'
import { VegIndicator } from '../components/common/VegIndicator'

const STATUS_STEPS: { key: OrderStatus; label: string; icon: React.ElementType }[] = [
  { key: 'received', label: 'Received', icon: CheckCircle2 },
  { key: 'preparing', label: 'Preparing', icon: ChefHat },
  { key: 'ready', label: 'Ready', icon: BellRing },
  { key: 'served', label: 'Served', icon: Sparkles },
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
    <div className="min-h-screen bg-[#FAF7F2] text-[#26201B] flex flex-col py-8 px-4">
      <div className="max-w-xl mx-auto w-full space-y-6">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(`/menu?table=${tableParam}`)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#7A6B5F] hover:text-[#26201B] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Menu (Table {tableParam})</span>
          </button>
          <span className="text-xs font-serif font-bold text-[#A3432B]">
            Shree Restaurant
          </span>
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-3xl border border-[#EAE3D6] p-6 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-[#E8F5E9] text-[#1E7E34] flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="inline-block text-[11px] font-semibold text-[#7A6B5F] uppercase tracking-wider">
              Demonstration Order Placed
            </span>
            <h1 className="font-serif text-2xl font-bold text-[#26201B]">
              Order Confirmed!
            </h1>
            <p className="text-xs text-[#6B5E52] max-w-sm mx-auto">
              Your simulated order has been registered and is now visible on the kitchen staff dashboard.
            </p>
          </div>

          {/* Order Details Badge */}
          <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#E5DDD0] grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <div className="text-[#8C7E72] text-[11px]">Order Number</div>
              <div className="font-bold text-[#26201B] text-sm">
                {order?.orderNumber || `#${orderId || 'SR-DEMO'}`}
              </div>
            </div>
            <div>
              <div className="text-[#8C7E72] text-[11px]">Table Assignment</div>
              <div className="font-bold text-[#26201B] text-sm">
                Table {order?.tableNumber || tableParam}
              </div>
              {order?.seatingGroup && (
                <div className="text-[10px] text-[#A3432B] font-semibold">
                  {order.seatingGroup}
                </div>
              )}
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-[#8C7E72] text-[11px]">Placed At</div>
              <div className="font-medium text-[#26201B]">
                {order ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
              </div>
            </div>
          </div>

          {/* Status Progression Tracker */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-[#26201B]">
              <span>Kitchen Progress Tracker</span>
              <span className="text-[11px] font-medium text-[#A3432B] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Live Status: <strong className="capitalize">{order?.status || 'received'}</strong>
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-1">
              {STATUS_STEPS.map((step, idx) => {
                const state = getStepStatus(step.key)
                const Icon = step.icon

                let pillColor = 'bg-[#FAF7F2] text-[#A39688] border-[#EAE3D6]'
                if (state === 'completed') {
                  pillColor = 'bg-[#1E7E34] text-white border-[#1E7E34]'
                } else if (state === 'current') {
                  pillColor = 'bg-[#A3432B] text-white border-[#A3432B] shadow-xs'
                }

                return (
                  <div key={step.key} className="flex flex-col items-center text-center gap-1.5">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${pillColor}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-medium text-[#4A3E36]">
                      {step.label}
                    </span>
                    <span className="text-[9px] text-[#8C7E72]">Step {idx + 1}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Itemized summary */}
          <div className="border-t border-[#EAE3D6] pt-4 space-y-3">
            <h2 className="text-xs font-bold text-[#4A3E36] uppercase tracking-wider">
              Dishes in this demo order
            </h2>

            {order?.items && order.items.length > 0 ? (
              <div className="space-y-2">
                {order.items.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-xs py-1.5 border-b border-[#FAF7F2]"
                  >
                    <div className="flex items-center gap-2">
                      <VegIndicator size="sm" />
                      <span className="font-medium text-[#26201B]">
                        {item.name}
                      </span>
                      <span className="text-[#8C7E72] font-semibold">
                        &times; {item.quantity}
                      </span>
                    </div>
                    <span className="font-semibold text-[#26201B]">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}

                {order.customerNotes && (
                  <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DDD0] text-xs text-[#5C4F44]">
                    <span className="font-semibold text-[#382F27]">Special instructions:</span>{' '}
                    {order.customerNotes}
                  </div>
                )}

                <div className="pt-2 text-xs text-[#5C4F44] space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{order.subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>GST (5% Demo)</span>
                    <span className="font-medium">₹{order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-[#26201B] pt-1 border-t border-[#EAE3D6]">
                    <span>Total Amount</span>
                    <span className="text-[#A3432B] font-extrabold">₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#8C7E72] py-2">
                Order details recorded in local browser storage.
              </div>
            )}
          </div>

          {/* Demo simulation disclaimer */}
          <div className="p-3 bg-[#EFE9DF]/80 rounded-2xl border border-[#E0D8CA] flex items-start gap-2.5 text-xs text-[#6B5E52]">
            <Info className="w-4 h-4 text-[#A3432B] shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Sales Demonstration Notice:</strong> This ordering journey is purely simulated for demonstration in Nadiad. No payment was charged and no live food was prepared.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <Link
              to={`/menu?table=${tableParam}`}
              className="flex-1 py-3 px-4 rounded-xl border border-[#D5C9B8] hover:bg-[#FAF7F2] text-[#3D332B] font-semibold text-xs flex items-center justify-center gap-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Order More Dishes</span>
            </Link>

            <Link
              to="/staff"
              className="flex-1 py-3 px-4 rounded-xl bg-[#A3432B] hover:bg-[#8C3720] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>View in Staff Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
