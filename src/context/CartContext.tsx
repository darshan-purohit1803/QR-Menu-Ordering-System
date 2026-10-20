import React, { createContext, useContext, useState, useEffect } from 'react'
import type { CartItem, MenuItem } from '../types'

interface CartContextType {
  items: CartItem[]
  addItem: (item: MenuItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  getItemQuantity: (itemId: string) => number
  clearCart: () => void
  subtotal: number
  tax: number
  total: number
  totalCount: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  specialInstructions: string
  setSpecialInstructions: (instructions: string) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'shree_active_cart'

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = sessionStorage.getItem(CART_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [specialInstructions, setSpecialInstructions] = useState('')

  useEffect(() => {
    try {
      sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore
    }
  }, [items])

  const addItem = (item: MenuItem) => {
    if (!item.isAvailable) return
    setItems(prev => {
      const existing = prev.find(i => i.item.id === item.id)
      if (existing) {
        return prev.map(i =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { item, quantity: 1 }]
    })
  }

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(i => i.item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }
    setItems(prev =>
      prev.map(i => (i.item.id === itemId ? { ...i, quantity } : i))
    )
  }

  const getItemQuantity = (itemId: string): number => {
    const found = items.find(i => i.item.id === itemId)
    return found ? found.quantity : 0
  }

  const clearCart = () => {
    setItems([])
    setSpecialInstructions('')
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.item.price * item.quantity,
    0
  )
  const tax = Math.round(subtotal * 0.05 * 100) / 100 // 5% GST
  const total = subtotal + tax

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        getItemQuantity,
        clearCart,
        subtotal,
        tax,
        total,
        totalCount,
        isCartOpen,
        setIsCartOpen,
        specialInstructions,
        setSpecialInstructions,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
