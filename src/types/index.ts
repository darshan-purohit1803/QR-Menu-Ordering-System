export type MenuCategory =
  | 'Starters / Appetizers'
  | 'Gujarati Food'
  | 'Jain Food'
  | 'Punjabi Food'
  | 'Veg Subji'
  | 'Chinese'
  | 'Rice'
  | 'Roti & Naan'
  | 'Beverages & Cold Drinks'
  | 'Desserts'

export interface MenuItem {
  id: string
  name: string
  category: MenuCategory
  description: string
  price: number
  isVeg: boolean
  isJainAvailable?: boolean
  isAvailable: boolean
  prepTimeMinutes?: number
  spicyLevel?: 0 | 1 | 2 | 3
  imageUrl: string
  badge?: string
}

export interface CartItem {
  item: MenuItem
  quantity: number
  notes?: string
}

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'served' | 'rejected'

export interface OrderLineItem {
  id: string
  name: string
  price: number
  quantity: number
  category: MenuCategory
}

export interface Order {
  id: string
  orderNumber: string
  tableNumber: string
  seatingGroup?: string | null
  items: OrderLineItem[]
  subtotal: number
  tax: number
  total: number
  status: OrderStatus
  customerNotes?: string
  createdAt: string
  updatedAt: string
}

export interface SeatingGroup {
  id: string
  name: string
  tables: string[]
  active: boolean
}
