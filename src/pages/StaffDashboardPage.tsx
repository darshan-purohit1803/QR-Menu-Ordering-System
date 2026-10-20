import React, { useState, useEffect, useMemo } from 'react'
import {
  ChefHat,
  BellRing,
  CheckCircle2,
  XCircle,
  QrCode,
  RotateCcw,
  Users2,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  UtensilsCrossed,
} from 'lucide-react'
import {
  getOrders,
  updateOrderStatus,
  rejectDemoOrder,
  getSeatingGroups,
  toggleTableCombination,
  resetDemo,
  STORAGE_CHANGE_EVENT,
} from '../services/storageService'
import type { Order, OrderStatus, SeatingGroup } from '../types'
import { VegIndicator } from '../components/common/VegIndicator'
import { QrTableModal } from '../components/staff/QrTableModal'

export const StaffDashboardPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(() => getOrders())
  const [seatingGroups, setSeatingGroups] = useState<SeatingGroup[]>(() => getSeatingGroups())
  const [selectedFilter, setSelectedFilter] = useState<OrderStatus | 'all'>('all')
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const [rejectingOrderId, setRejectingOrderId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('Item out of stock')
  const [currentTime, setCurrentTime] = useState(new Date())

  // Reload data on storage change
  useEffect(() => {
    const handleStorageUpdate = () => {
      setOrders(getOrders())
      setSeatingGroups(getSeatingGroups())
    }
    window.addEventListener(STORAGE_CHANGE_EVENT, handleStorageUpdate)
    window.addEventListener('storage', handleStorageUpdate)
    return () => {
      window.removeEventListener(STORAGE_CHANGE_EVENT, handleStorageUpdate)
      window.removeEventListener('storage', handleStorageUpdate)
    }
  }, [])

  // Clock tick every 30 seconds for elapsed time
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 30000)
    return () => clearInterval(interval)
  }, [])

  // Combined group G12 status
  const g12Group = seatingGroups.find(g => g.id === 'G12')
  const isG12Combined = !!g12Group?.active

  const handleToggleG12 = () => {
    toggleTableCombination('G12')
  }

  const handleStatusChange = (orderId: string, nextStatus: OrderStatus) => {
    updateOrderStatus(orderId, nextStatus)
  }

  const handleConfirmReject = () => {
    if (!rejectingOrderId) return
    rejectDemoOrder(rejectingOrderId, rejectReason)
    setRejectingOrderId(null)
  }

  const handleReset = () => {
    if (window.confirm('Reset all demo orders and table configurations to default sample state?')) {
      resetDemo()
    }
  }

  // Filtered orders
  const filteredOrders = useMemo(() => {
    if (selectedFilter === 'all') return orders
    return orders.filter(o => o.status === selectedFilter)
  }, [orders, selectedFilter])

  // Metrics
  const counts = useMemo(() => {
    return {
      all: orders.length,
      received: orders.filter(o => o.status === 'received').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      ready: orders.filter(o => o.status === 'ready').length,
      served: orders.filter(o => o.status === 'served').length,
      rejected: orders.filter(o => o.status === 'rejected').length,
    }
  }, [orders])

  const formatElapsed = (isoDate: string) => {
    const diffMs = currentTime.getTime() - new Date(isoDate).getTime()
    const diffMins = Math.max(1, Math.floor(diffMs / 60000))
    if (diffMins < 60) return `${diffMins}m ago`
    const hours = Math.floor(diffMins / 60)
    const rem = diffMins % 60
    return `${hours}h ${rem}m ago`
  }

  return (
    <div className="min-h-screen bg-[#F6F3EE] text-[#26201B] flex flex-col">
      {/* Top Bar with Demo Indicator and Actions */}
      <header className="bg-white border-b border-[#E2D9CC] sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#A3432B] text-white flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
              श्री
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg font-bold text-[#26201B]">
                  Shree Restaurant
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-700" />
                  Staff Demo Mode
                </span>
              </div>
              <p className="text-xs text-[#7A6B5F]">
                Kitchen Display System & Table Orders &bull; Nadiad
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#4A3E36] border border-[#E0D8CA] flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-[#A3432B]" />
              <span>Table QR Codes</span>
            </button>

            <a
              href="/menu?table=07"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#4A3E36] border border-[#E0D8CA] flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
              title="Open customer menu for Table 07 in new tab"
            >
              <span>Test Customer Table 07</span>
              <ExternalLink className="w-3 h-3 text-[#7A6B5F]" />
            </a>

            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#7A6B5F] hover:text-[#26201B] hover:bg-stone-100 border border-stone-200 flex items-center gap-1.5 transition cursor-pointer"
              title="Reset sample orders"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo State</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-5 w-full flex-1 space-y-5">
        {/* Table Management Banner (Combined Table 07 + 08 Demo) */}
        <div className="bg-white rounded-2xl border border-[#E2D9CC] p-4 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#A3432B]/10 text-[#A3432B] flex items-center justify-center shrink-0 mt-0.5">
              <Users2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-[#26201B]">
                  Combined Table Seating Demonstration
                </h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isG12Combined
                      ? 'bg-[#A3432B]/10 text-[#A3432B] border border-[#A3432B]/30'
                      : 'bg-stone-100 text-stone-600 border border-stone-200'
                  }`}
                >
                  {isG12Combined ? 'Group G12 Active' : 'Individual Tables'}
                </span>
              </div>
              <p className="text-xs text-[#7A6B5F] mt-0.5">
                {isG12Combined ? (
                  <span>
                    Table 07 and Table 08 are joined as <strong>Seating Group G12 (Tables 07 + 08)</strong>. Customer orders from either table code reflect this joint group.
                  </span>
                ) : (
                  <span>
                    Table 07 and Table 08 are currently operating as independent individual tables.
                  </span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleG12}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
              isG12Combined
                ? 'bg-stone-200 hover:bg-stone-300 text-[#26201B]'
                : 'bg-[#A3432B] hover:bg-[#8C3720] text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isG12Combined ? 'Separate into Individual Tables' : 'Combine Table 07 + 08 -> Group G12'}</span>
          </button>
        </div>

        {/* Status Metrics Cards */}
        <section aria-label="Order Status Metrics" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`p-3.5 rounded-2xl border text-left transition cursor-pointer shadow-2xs ${
              selectedFilter === 'all'
                ? 'bg-white border-[#26201B] ring-2 ring-[#26201B]/10'
                : 'bg-white border-[#E2D9CC] hover:border-stone-400'
            }`}
          >
            <div className="text-[11px] font-semibold text-[#7A6B5F] uppercase tracking-wider">
              Total Orders
            </div>
            <div className="font-serif text-2xl font-bold text-[#26201B] mt-1">
              {counts.all}
            </div>
            <div className="text-[10px] text-[#8C7E72] mt-0.5">All demo records</div>
          </button>

          <button
            onClick={() => setSelectedFilter('received')}
            className={`p-3.5 rounded-2xl border text-left transition cursor-pointer shadow-2xs ${
              selectedFilter === 'received'
                ? 'bg-amber-50/80 border-amber-600 ring-2 ring-amber-600/20'
                : 'bg-white border-[#E2D9CC] hover:border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
                New / Received
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            </div>
            <div className="font-serif text-2xl font-bold text-amber-900 mt-1">
              {counts.received}
            </div>
            <div className="text-[10px] text-amber-700 mt-0.5">Awaiting kitchen accept</div>
          </button>

          <button
            onClick={() => setSelectedFilter('preparing')}
            className={`p-3.5 rounded-2xl border text-left transition cursor-pointer shadow-2xs ${
              selectedFilter === 'preparing'
                ? 'bg-sky-50/80 border-sky-600 ring-2 ring-sky-600/20'
                : 'bg-white border-[#E2D9CC] hover:border-sky-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-sky-800 uppercase tracking-wider">
                Preparing
              </span>
              <ChefHat className="w-3.5 h-3.5 text-sky-600" />
            </div>
            <div className="font-serif text-2xl font-bold text-sky-900 mt-1">
              {counts.preparing}
            </div>
            <div className="text-[10px] text-sky-700 mt-0.5">In cooking progress</div>
          </button>

          <button
            onClick={() => setSelectedFilter('ready')}
            className={`p-3.5 rounded-2xl border text-left transition cursor-pointer shadow-2xs ${
              selectedFilter === 'ready'
                ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-600/20'
                : 'bg-white border-[#E2D9CC] hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                Ready to Serve
              </span>
              <BellRing className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="font-serif text-2xl font-bold text-emerald-900 mt-1">
              {counts.ready}
            </div>
            <div className="text-[10px] text-emerald-700 mt-0.5">Ready for floor dispatch</div>
          </button>

          <button
            onClick={() => setSelectedFilter('served')}
            className={`p-3.5 rounded-2xl border text-left transition cursor-pointer shadow-2xs ${
              selectedFilter === 'served'
                ? 'bg-stone-100 border-stone-500 ring-2 ring-stone-400/20'
                : 'bg-white border-[#E2D9CC] hover:border-stone-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-stone-700 uppercase tracking-wider">
                Served
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-stone-500" />
            </div>
            <div className="font-serif text-2xl font-bold text-stone-800 mt-1">
              {counts.served}
            </div>
            <div className="text-[10px] text-stone-600 mt-0.5">Fulfilled demo orders</div>
          </button>
        </section>

        {/* Order Cards Grid */}
        <section aria-label="Customer Orders List" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-base font-bold text-[#26201B]">
              Active Kitchen & Floor Orders ({filteredOrders.length})
            </h2>
            <div className="text-xs text-[#7A6B5F]">
              Showing: <span className="font-semibold capitalize text-[#26201B]">{selectedFilter}</span>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E2D9CC] p-12 text-center text-[#7A6B5F] space-y-2">
              <UtensilsCrossed className="w-8 h-8 text-[#A39688] mx-auto opacity-40" />
              <h3 className="font-serif text-base font-bold text-[#26201B]">
                No orders under "{selectedFilter}"
              </h3>
              <p className="text-xs text-[#7A6B5F] max-w-sm mx-auto">
                Place a demo order from the customer menu or switch the status filter to see other orders.
              </p>
              <button
                onClick={() => setSelectedFilter('all')}
                className="mt-2 text-xs font-semibold text-[#A3432B] hover:underline"
              >
                View all orders
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map(order => {
                let badgeClass = 'bg-stone-100 text-stone-700 border-stone-200'
                if (order.status === 'received') badgeClass = 'bg-amber-100 text-amber-800 border-amber-300'
                if (order.status === 'preparing') badgeClass = 'bg-sky-100 text-sky-800 border-sky-300'
                if (order.status === 'ready') badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300'
                if (order.status === 'served') badgeClass = 'bg-stone-100 text-stone-600 border-stone-200'
                if (order.status === 'rejected') badgeClass = 'bg-rose-100 text-rose-800 border-rose-300'

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-[#E2D9CC] shadow-2xs hover:shadow-xs transition flex flex-col justify-between overflow-hidden"
                  >
                    {/* Order Card Header */}
                    <div className="p-4 border-b border-[#EFE9DF] bg-[#FAF8F5]">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#26201B]">
                            {order.orderNumber}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeClass}`}>
                            {order.status}
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-[#7A6B5F] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#A39688]" />
                          {formatElapsed(order.createdAt)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm font-bold text-[#26201B]">
                          Table {order.tableNumber}
                          {order.seatingGroup && (
                            <span className="ml-1.5 text-xs font-semibold text-[#A3432B] bg-[#A3432B]/10 px-2 py-0.5 rounded-full">
                              {order.seatingGroup}
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-bold text-[#A3432B]">
                          ₹{order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Dish Items List */}
                    <div className="p-4 flex-1 space-y-2">
                      <div className="space-y-1.5">
                        {order.items.map(item => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between text-xs py-0.5"
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <VegIndicator size="sm" />
                              <span className="font-medium text-[#26201B] truncate">
                                {item.name}
                              </span>
                            </div>
                            <span className="font-bold text-[#4A3E36] shrink-0 ml-2">
                              &times; {item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      {order.customerNotes && (
                        <div className="mt-2 p-2 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900 leading-snug">
                          <span className="font-semibold text-amber-950">Note:</span> {order.customerNotes}
                        </div>
                      )}
                    </div>

                    {/* Action Controls */}
                    <div className="p-3 bg-[#FAF8F5] border-t border-[#EFE9DF] flex items-center gap-2">
                      {order.status === 'received' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(order.id, 'preparing')}
                            className="flex-1 py-2 px-3 rounded-xl bg-[#A3432B] hover:bg-[#8C3720] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer"
                          >
                            <ChefHat className="w-3.5 h-3.5" />
                            <span>Accept & Prepare</span>
                          </button>
                          <button
                            onClick={() => setRejectingOrderId(order.id)}
                            className="p-2 rounded-xl text-stone-400 hover:text-rose-700 hover:bg-rose-50 border border-stone-200 transition cursor-pointer"
                            title="Reject demo order"
                            aria-label={`Reject demo order ${order.orderNumber}`}
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {order.status === 'preparing' && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'ready')}
                          className="w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer"
                        >
                          <BellRing className="w-3.5 h-3.5" />
                          <span>Mark Ready to Serve</span>
                        </button>
                      )}

                      {order.status === 'ready' && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'served')}
                          className="w-full py-2 px-3 rounded-xl bg-[#26201B] hover:bg-stone-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Served to Table</span>
                        </button>
                      )}

                      {order.status === 'served' && (
                        <div className="w-full text-center text-xs font-medium text-stone-500 py-1 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Order Completed & Served</span>
                        </div>
                      )}

                      {order.status === 'rejected' && (
                        <div className="w-full text-center text-xs font-medium text-rose-700 py-1 flex items-center justify-center gap-1">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Rejected Demo Order</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </main>

      {/* Reject Order Confirmation Modal */}
      {rejectingOrderId && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirm reject demo order"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#26201B]/50 backdrop-blur-xs"
        >
          <div className="bg-white rounded-3xl border border-[#E2D9CC] max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-700">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-serif text-base font-bold text-[#26201B]">
                Reject Demo Order?
              </h3>
            </div>
            <p className="text-xs text-[#7A6B5F]">
              Confirm rejecting this simulated order. In a real restaurant, this would alert the customer or floor manager.
            </p>

            <div>
              <label htmlFor="reject-reason" className="block text-xs font-semibold text-[#4A3E36] mb-1">
                Reason for Rejection:
              </label>
              <select
                id="reject-reason"
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#D5C9B8] bg-[#FAF7F2] text-[#26201B] focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value="Item out of stock">Item out of stock</option>
                <option value="Kitchen overloaded">Kitchen overloaded</option>
                <option value="Invalid table request">Invalid table request</option>
                <option value="Testing demo rejection">Testing demo rejection</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#EAE3D6]">
              <button
                onClick={() => setRejectingOrderId(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#5C4F44] hover:bg-stone-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-700 hover:bg-rose-800 text-white transition cursor-pointer shadow-2xs"
              >
                Reject Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Codes Modal */}
      <QrTableModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />
    </div>
  )
}
