import type { Order, OrderStatus, SeatingGroup } from '../types'

const STORAGE_KEY_ORDERS = 'neapolitan_pureveg_orders_v3'
const STORAGE_KEY_SEATING = 'neapolitan_seating_groups_v3'
export const STORAGE_CHANGE_EVENT = 'neapolitan_storage_changed'

export const INITIAL_SEATING_GROUPS: SeatingGroup[] = [
  {
    id: 'G12',
    name: 'Tables 07 + 08',
    tables: ['07', '08'],
    active: false,
  },
]

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'NP-1041',
    orderNumber: '#NP-1041',
    tableNumber: '02',
    seatingGroup: null,
    items: [
      { id: 'piz-1', name: 'Margherita D.O.P.', price: 490, quantity: 2, category: 'Classic Neapolitan', crustInfo: '11" Woodfired 48h Dough' },
      { id: 'side-1', name: 'Truffle Garlic Dough Knots', price: 290, quantity: 1, category: 'Artisan Crust Bites & Starters' },
      { id: 'bev-1', name: 'San Pellegrino Blood Orange', price: 220, quantity: 2, category: 'Italian Beverages & Craft Soda' },
    ],
    subtotal: 1710,
    tax: 85.50, // 5% GST
    total: 1795.50,
    status: 'ready',
    customerNotes: 'Please slice the pizzas into 6 slices and serve hot chili oil on the side.',
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  },
  {
    id: 'NP-1042',
    orderNumber: '#NP-1042',
    tableNumber: '05',
    seatingGroup: null,
    items: [
      { id: 'truf-1', name: 'Tartufo Nero & Wild Funghi', price: 740, quantity: 1, category: 'Signature & Truffle', crustInfo: '11" Woodfired 48h Dough' },
      { id: 'diav-1', name: 'Diavola di Burrata & Chili Crisp', price: 640, quantity: 1, category: 'Spicy & Diavola', crustInfo: '11" Woodfired 48h Dough' },
      { id: 'bev-2', name: 'Iced Espresso Tonic al Limone', price: 190, quantity: 2, category: 'Italian Beverages & Craft Soda' },
    ],
    subtotal: 1760,
    tax: 88,
    total: 1848,
    status: 'preparing',
    customerNotes: 'Extra hot wildflower honey drizzle on the Diavola pizza please!',
    createdAt: new Date(Date.now() - 11 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
  },
  {
    id: 'NP-1043',
    orderNumber: '#NP-1043',
    tableNumber: '01',
    seatingGroup: null,
    items: [
      { id: 'piz-3', name: 'Burrata & Pomodorini', price: 680, quantity: 1, category: 'Classic Neapolitan', crustInfo: '11" Woodfired 48h Dough' },
      { id: 'des-1', name: 'Classic Tiramisù al Mascarpone', price: 320, quantity: 2, category: 'Dolci & Artisan Gelato' },
    ],
    subtotal: 1320,
    tax: 66,
    total: 1386,
    status: 'served',
    customerNotes: 'Serve dessert after pizza.',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
  },
]

function emitStorageChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(STORAGE_CHANGE_EVENT))
  }
}

export function getOrders(): Order[] {
  if (typeof window === 'undefined') return INITIAL_ORDERS
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ORDERS)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(INITIAL_ORDERS))
      return INITIAL_ORDERS
    }
    return JSON.parse(raw)
  } catch {
    return INITIAL_ORDERS
  }
}

export function getOrderById(id: string): Order | undefined {
  const orders = getOrders()
  return orders.find(o => o.id === id || o.orderNumber === id)
}

export function saveOrders(orders: Order[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders))
  emitStorageChange()
}

export function createDemoOrder(
  tableNumber: string,
  items: { id: string; name: string; price: number; quantity: number; category: any; crustInfo?: string }[],
  customerNotes?: string
): Order {
  const orders = getOrders()
  const randomSuffix = Math.floor(1000 + Math.random() * 9000)
  const orderId = `NP-${randomSuffix}`
  
  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = Math.round(subtotal * 0.05 * 100) / 100 // 5% GST
  const total = subtotal + tax

  // Check if table is part of active seating group
  const groupInfo = getTableSeatingGroup(tableNumber)

  const newOrder: Order = {
    id: orderId,
    orderNumber: `#${orderId}`,
    tableNumber,
    seatingGroup: groupInfo?.active ? `${groupInfo.id} (${groupInfo.name})` : null,
    items,
    subtotal,
    tax,
    total,
    status: 'received',
    customerNotes: customerNotes?.trim() || undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const updated = [newOrder, ...orders]
  saveOrders(updated)
  return newOrder
}

export function updateOrderStatus(orderId: string, status: OrderStatus): void {
  const orders = getOrders()
  const updated = orders.map(order => {
    if (order.id === orderId) {
      return {
        ...order,
        status,
        updatedAt: new Date().toISOString(),
      }
    }
    return order
  })
  saveOrders(updated)
}

export function rejectDemoOrder(orderId: string, reason?: string): void {
  const orders = getOrders()
  const updated = orders.map(order => {
    if (order.id === orderId) {
      return {
        ...order,
        status: 'rejected' as OrderStatus,
        customerNotes: reason ? `[Rejected: ${reason}] ${order.customerNotes || ''}` : order.customerNotes,
        updatedAt: new Date().toISOString(),
      }
    }
    return order
  })
  saveOrders(updated)
}

// Seating groups management
export function getSeatingGroups(): SeatingGroup[] {
  if (typeof window === 'undefined') return INITIAL_SEATING_GROUPS
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SEATING)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SEATING, JSON.stringify(INITIAL_SEATING_GROUPS))
      return INITIAL_SEATING_GROUPS
    }
    return JSON.parse(raw)
  } catch {
    return INITIAL_SEATING_GROUPS
  }
}

export function saveSeatingGroups(groups: SeatingGroup[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY_SEATING, JSON.stringify(groups))
  emitStorageChange()
}

export function toggleTableCombination(groupId: string): boolean {
  const groups = getSeatingGroups()
  let newState = false
  const updated = groups.map(g => {
    if (g.id === groupId) {
      newState = !g.active
      return { ...g, active: newState }
    }
    return g
  })
  saveSeatingGroups(updated)
  return newState
}

export function getTableSeatingGroup(tableNumber: string): SeatingGroup | null {
  const groups = getSeatingGroups()
  const cleanNum = tableNumber.padStart(2, '0')
  const found = groups.find(g => g.tables.includes(cleanNum) || g.tables.includes(tableNumber))
  return found || null
}

export function resetDemo(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(INITIAL_ORDERS))
  localStorage.setItem(STORAGE_KEY_SEATING, JSON.stringify(INITIAL_SEATING_GROUPS))
  emitStorageChange()
}
