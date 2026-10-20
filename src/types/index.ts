export type MenuCategory =
  | 'Classic Neapolitan'
  | 'Signature & Truffle'
  | 'Spicy & Diavola'
  | 'White Pizzas (Pizza Bianca)'
  | 'Veggie Garden & Pesto'
  | 'Gourmet Artisan Specials'
  | 'Calzones & Stuffed Crust'
  | 'Artisan Crust Bites & Starters'
  | 'Italian Beverages & Craft Soda'
  | 'Dolci & Artisan Gelato'

export interface MenuItem {
  id: string
  name: string
  italianSubtitle?: string
  category: MenuCategory
  description: string
  price: number
  isVeg: boolean
  isSpicy?: boolean
  isAvailable: boolean
  prepTimeMinutes?: number
  crustInfo?: string
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
  crustInfo?: string
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
