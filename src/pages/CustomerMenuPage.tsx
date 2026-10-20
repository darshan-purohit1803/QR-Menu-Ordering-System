import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, Sparkles, Flame, Pizza, HeartHandshake, Leaf } from 'lucide-react'
import { MENU_CATEGORIES, MENU_ITEMS } from '../data/menuData'
import type { MenuCategory, MenuItem } from '../types'
import { useCart } from '../context/CartContext'
import { CustomerHeader } from '../components/customer/CustomerHeader'
import { CategoryNav } from '../components/customer/CategoryNav'
import { FoodCard } from '../components/customer/FoodCard'
import { StickyCartBar } from '../components/customer/StickyCartBar'
import { CartDrawer } from '../components/customer/CartDrawer'
import { getTableSeatingGroup, STORAGE_CHANGE_EVENT } from '../services/storageService'

const QUICK_FILTERS = [
  { id: 'all', label: 'All Pizzas & Items' },
  { id: 'bestseller', label: '⭐ Bestsellers' },
  { id: 'truffle', label: '🍄 Truffle & Porcini' },
  { id: 'spicy', label: '🌶️ Spicy Crusts' },
  { id: 'calzone', label: '🥟 Calzones' },
]

export const CustomerMenuPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const tableParam = searchParams.get('table') || '07'
  const tableNumber = tableParam.padStart(2, '0')

  const {
    addItem,
    updateQuantity,
    getItemQuantity,
    totalCount,
    subtotal,
    setIsCartOpen,
  } = useCart()

  const [activeCategory, setActiveCategory] = useState<MenuCategory | 'All'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeQuickFilter, setActiveQuickFilter] = useState('all')
  const [seatingGroup, setSeatingGroup] = useState(() => getTableSeatingGroup(tableNumber))

  // Listen to storage events to reflect table combination changes immediately
  useEffect(() => {
    const checkGroup = () => {
      setSeatingGroup(getTableSeatingGroup(tableNumber))
    }
    window.addEventListener(STORAGE_CHANGE_EVENT, checkGroup)
    window.addEventListener('storage', checkGroup)
    return () => {
      window.removeEventListener(STORAGE_CHANGE_EVENT, checkGroup)
      window.removeEventListener('storage', checkGroup)
    }
  }, [tableNumber])

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    MENU_CATEGORIES.forEach(cat => {
      counts[cat] = MENU_ITEMS.filter(item => item.category === cat).length
    })
    return counts
  }, [])

  // Handle search input: when user searches, expand to All Items so they can find dishes anywhere
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    if (query.trim() && activeCategory !== 'All') {
      setActiveCategory('All')
    }
    if (query.trim() && activeQuickFilter !== 'all') {
      setActiveQuickFilter('all')
    }
  }

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      // Category filter
      if (activeCategory !== 'All' && item.category !== activeCategory) {
        return false
      }

      // Quick filter
      if (activeQuickFilter === 'bestseller' && !item.badge?.toLowerCase().includes('bestseller') && !item.badge?.toLowerCase().includes('gold') && !item.badge?.toLowerCase().includes('crown') && !item.badge?.toLowerCase().includes('favorite')) {
        return false
      }
      if (activeQuickFilter === 'truffle' && !item.name.toLowerCase().includes('truffle') && !item.name.toLowerCase().includes('tartufo') && !item.description.toLowerCase().includes('truffle')) {
        return false
      }
      if (activeQuickFilter === 'spicy' && !item.isSpicy) {
        return false
      }
      if (activeQuickFilter === 'calzone' && item.category !== 'Calzones & Stuffed Crust') {
        return false
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchName = item.name.toLowerCase().includes(query)
        const matchSub = (item.italianSubtitle || '').toLowerCase().includes(query)
        const matchDesc = item.description.toLowerCase().includes(query)
        const matchCat = item.category.toLowerCase().includes(query)
        if (!matchName && !matchSub && !matchDesc && !matchCat) return false
      }
      return true
    })
  }, [activeCategory, activeQuickFilter, searchQuery])

  // Group filtered items by category if "All" is active, no search query, and no specific quick filter
  const groupedItems = useMemo(() => {
    if (activeCategory !== 'All' || searchQuery.trim() || activeQuickFilter !== 'all') {
      return null
    }
    const map = new Map<MenuCategory, MenuItem[]>()
    MENU_CATEGORIES.forEach(cat => {
      const itemsInCat = filteredItems.filter(i => i.category === cat)
      if (itemsInCat.length > 0) {
        map.set(cat, itemsInCat)
      }
    })
    return map
  }, [activeCategory, activeQuickFilter, searchQuery, filteredItems])

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1B18] flex flex-col pb-28">
      {/* Header */}
      <CustomerHeader
        tableNumber={tableNumber}
        seatingGroup={seatingGroup}
        cartCount={totalCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* Modern Stylish Hero Section */}
      <section className="bg-gradient-to-b from-[#FFFDF9] to-[#FAF7F2] border-b border-[#EAE2D5] py-5 px-4 shadow-2xs">
        <div className="max-w-4xl mx-auto space-y-3.5">
          {seatingGroup && seatingGroup.active && (
            <div className="p-3 rounded-2xl bg-[#C0392B]/10 border border-[#C0392B]/20 text-[#C0392B] flex items-center gap-2.5 text-xs font-semibold">
              <Sparkles className="w-4 h-4 shrink-0 text-[#C0392B]" />
              <span>
                <strong>Combined Seating Active:</strong> Your table is linked with <strong>Group G12 ({seatingGroup.name})</strong>. Pizzas will be baked and served together.
              </span>
            </div>
          )}

          {/* Hero Branding Headline */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#8C7662] font-semibold mb-1">
                <span className="flex items-center gap-1 text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full border border-[#C8E6C9]">
                  <Leaf className="w-3 h-3" />
                  100% Pure Vegetarian
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1 text-[#C0392B]">
                  <Flame className="w-3.5 h-3.5" />
                  450°C Volcanic Stone Oven
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1E1B18] tracking-tight">
                Authentic Neapolitan Pizza
              </h2>
              <p className="text-xs sm:text-sm text-[#6E5C4E] mt-1 max-w-xl">
                48-hour cold fermented biga sourdough, San Marzano D.O.P. tomatoes, fresh Fior di Latte mozzarella & Italian extra virgin olive oil.
              </p>
            </div>

            {/* Table Badge on Hero */}
            <div className="shrink-0 bg-white border border-[#E3D9CC] rounded-2xl p-2.5 px-4 shadow-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#C0392B]/10 text-[#C0392B] flex items-center justify-center font-bold">
                <Pizza className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-[#8C7662]">Your Table</div>
                <div className="font-serif text-base font-bold text-[#1E1B18]">Table {tableNumber}</div>
              </div>
            </div>
          </div>

          {/* Modern Search Field */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#8C7662] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder="Search dishes (margherita, burrata, truffle, diavola, calzone, drinks)..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl text-xs sm:text-sm bg-white border border-[#DCD1C2] focus:outline-none focus:ring-2 focus:ring-[#C0392B]/20 focus:border-[#C0392B] text-[#1E1B18] placeholder:text-[#9A8675] shadow-xs transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7662] hover:text-[#1E1B18] p-0.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
            {QUICK_FILTERS.map(qf => (
              <button
                key={qf.id}
                onClick={() => {
                  setActiveQuickFilter(qf.id)
                  if (activeCategory !== 'All') setActiveCategory('All')
                }}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer border ${
                  activeQuickFilter === qf.id
                    ? 'bg-[#1E1B18] text-white border-[#1E1B18] shadow-xs'
                    : 'bg-white hover:bg-[#F6EFE5] text-[#5A4D43] border-[#E0D7C9]'
                }`}
              >
                {qf.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Horizontal Pizza Category Navigation Tabs */}
      <CategoryNav
        activeCategory={activeCategory}
        onSelectCategory={cat => {
          setActiveCategory(cat)
          if (searchQuery) setSearchQuery('')
          if (activeQuickFilter !== 'all') setActiveQuickFilter('all')
        }}
        categoryCounts={categoryCounts}
      />

      {/* Pizza Menu Dishes Listing */}
      <main className="max-w-4xl mx-auto px-4 py-6 w-full flex-1">
        {/* Quality Banner */}
        <div className="mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-[#FAF2E8] to-[#F6EDE2] border border-[#E8DFC8] text-xs text-[#6E5C4E] flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <Pizza className="w-5 h-5 text-[#C0392B] shrink-0" />
            <div>
              <span className="font-serif font-bold text-[#382F28]">100% Pure Vegetarian &bull; Fresh Woodfired Pizzas</span>
              <p className="text-[11px] text-[#7A6756] mt-0.5">
                Every pizza is hand-stretched and baked fresh for 90 seconds in our imported 450°C stone oven.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-bold text-[#C0392B] bg-white px-3 py-1 rounded-full border border-[#E3D9CC]">
            D.O.P. Certified
          </span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="py-20 text-center text-[#7A6756] bg-white rounded-3xl border border-[#E8DFC8] p-8 shadow-xs">
            <Pizza className="w-10 h-10 text-[#C0392B]/40 mx-auto mb-2 animate-bounce" />
            <h3 className="font-serif text-lg font-bold text-[#1E1B18]">
              No pizzas found matching your search
            </h3>
            <p className="text-xs text-[#7A6756] mt-1 max-w-sm mx-auto">
              Try searching with another keyword like "Margherita", "Truffle", "Burrata", or reset filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setActiveCategory('All')
                setActiveQuickFilter('all')
              }}
              className="mt-4 text-xs font-bold px-4 py-2 rounded-xl bg-[#C0392B] text-white hover:bg-[#A93226] transition shadow-xs cursor-pointer"
            >
              Show All Pizzas
            </button>
          </div>
        ) : groupedItems ? (
          // Grouped by category when "All" is active and no search query
          <div className="space-y-10">
            {Array.from(groupedItems.entries()).map(([cat, items]) => (
              <section key={cat} className="space-y-4">
                <div className="flex items-end justify-between border-b border-[#EAE2D5] pb-2">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1B18] tracking-tight">
                      {cat}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-[#8C7662] bg-[#EFE8DD] px-2.5 py-0.5 rounded-full">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {/* BIG Pizza Grid: 1 col on mobile, 2 cols on tablet & desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {items.map(item => (
                    <FoodCard
                      key={item.id}
                      item={item}
                      quantity={getItemQuantity(item.id)}
                      onAdd={() => addItem(item)}
                      onUpdateQuantity={qty => updateQuantity(item.id, qty)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          // Flat list when single category or search is active
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1 text-xs text-[#8C7662]">
              <span>
                Showing <strong>{filteredItems.length}</strong> {activeCategory !== 'All' ? activeCategory : 'matching'} pizzas & items
              </span>
            </div>

            {/* BIG Pizza Grid: 1 col on mobile, 2 cols on tablet & desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {filteredItems.map(item => (
                <FoodCard
                  key={item.id}
                  item={item}
                  quantity={getItemQuantity(item.id)}
                  onAdd={() => addItem(item)}
                  onUpdateQuantity={qty => updateQuantity(item.id, qty)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Footer note for customers */}
        <footer className="mt-12 pt-6 border-t border-[#EAE2D5] text-center text-xs text-[#8C7662] space-y-1.5">
          <div className="flex items-center justify-center gap-1.5 font-medium text-[#4A3D34]">
            <HeartHandshake className="w-4 h-4 text-[#C0392B]" />
            <span className="font-serif font-bold text-sm">Authentic Neapolitan Pizza</span>
            <span>&bull; 100% Pure Veg Artisanal Pizzeria</span>
          </div>
          <p className="text-[11px] text-[#A39688]">
            Tradizione Napoletana &bull; Fast table-side digital QR ordering demo
          </p>
        </footer>
      </main>

      {/* Sticky Bottom Cart Bar */}
      <StickyCartBar
        itemCount={totalCount}
        subtotal={subtotal}
        onViewCart={() => setIsCartOpen(true)}
      />

      {/* Checkout Drawer */}
      <CartDrawer tableNumber={tableNumber} />
    </div>
  )
}
