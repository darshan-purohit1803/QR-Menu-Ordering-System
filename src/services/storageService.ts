import type { Order, OrderStatus, SeatingGroup } from '../types'

const STORAGE_KEY_ORDERS = 'shree_orders_v1'
const STORAGE_KEY_SEATING = 'shree_seating_groups_v1'
export const STORAGE_CHANGE_EVENT = 'shree_storage_changed'

export const INITIAL_SEATING_GROUPS: SeatingGroup[] = [
  {
    id: 'G12',
    name: 'Tables 07 + 08',
    tables: ['07', '08'],
    active: false, // Can be toggled by staff during the demo
  },
]

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'SR-1041',
    orderNumber: '#SR-1041',
    tableNumber: '02',
    seatingGroup: null,
    items: [
      { id: 'guj-1', name: 'Gujarati Thali', price: 280, quantity: 2, category: 'Gujarati Food' },
      { id: 'bev-1', name: 'Masala Chaas', price: 40, quantity: 2, category: 'Beverages & Cold Drinks' },
      { id: 'des-1', name: 'Gulab Jamun (2 Pcs)', price: 80, quantity: 1, category: 'Desserts' },
    ],
    subtotal: 720,
    tax: 36, // 5% GST
    total: 756,
    status: 'ready',
    customerNotes: 'Please serve Chaas chilled before the thali.',
    createdAt: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 'SR-1042',
    orderNumber: '#SR-1042',
    tableNumber: '05',
    seatingGroup: null,
    items: [
      { id: 'starter-1', name: 'Paneer Tikka', price: 240, quantity: 1, category: 'Starters / Appetizers' },
      { id: 'pun-1', name: 'Paneer Butter Masala', price: 260, quantity: 1, category: 'Punjabi Food' },
      { id: 'roti-4', name: 'Butter Naan', price: 55, quantity: 3, category: 'Roti & Naan' },
      { id: 'rice-2', name: 'Jeera Rice', price: 150, quantity: 1, category: 'Rice' },
    ],
    subtotal: 815,
    tax: 40.75,
    total: 855.75,
    status: 'preparing',
    customerNotes: 'Medium spicy paneer butter masala please.',
    createdAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: 'SR-1043',
    orderNumber: '#SR-1043',
    tableNumber: '01',
    seatingGroup: null,
    items: [
      { id: 'jain-5', name: 'Jain Special Thali', price: 290, quantity: 2, category: 'Jain Food' },
      { id: 'bev-2', name: 'Sweet Punjabi Lassi', price: 70, quantity: 2, category: 'Beverages & Cold Drinks' },
    ],
    subtotal: 720,
    tax: 36,
    total: 756,
    status: 'served',
    customerNotes: 'Strict Jain preparation.',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
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
  items: { id: string; name: string; price: number; quantity: number; category: any }[],
  customerNotes?: string
): Order {
  const orders = getOrders()
  const randomSuffix = Math.floor(1000 + Math.random() * 9000)
  const orderId = `SR-${randomSuffix}`
  
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
