import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, Sparkles, AlertCircle, HeartHandshake } from 'lucide-react'
import { MENU_CATEGORIES, MENU_ITEMS } from '../data/menuData'
import type { MenuCategory, MenuItem } from '../types'
import { useCart } from '../context/CartContext'
import { CustomerHeader } from '../components/customer/CustomerHeader'
import { CategoryNav } from '../components/customer/CategoryNav'
import { FoodCard } from '../components/customer/FoodCard'
import { StickyCartBar } from '../components/customer/StickyCartBar'
import { CartDrawer } from '../components/customer/CartDrawer'
import { getTableSeatingGroup, STORAGE_CHANGE_EVENT } from '../services/storageService'

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
  const [jainOnlyFilter, setJainOnlyFilter] = useState(false)
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
      counts[cat] = MENU_ITEMS.filter(item => {
        if (item.category !== cat) return false
        if (jainOnlyFilter && !item.isJainAvailable) return false
        return true
      }).length
    })
    return counts
  }, [jainOnlyFilter])

  // Handle search input: when user searches, expand to All Items so they can find dishes anywhere
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    if (query.trim() && activeCategory !== 'All') {
      setActiveCategory('All')
    }
  }

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      // Category filter (only apply if not actively searching, or if user explicitly chose category after searching)
      if (activeCategory !== 'All' && item.category !== activeCategory) {
        return false
      }
      // Jain only toggle
      if (jainOnlyFilter && !item.isJainAvailable) {
        return false
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchName = item.name.toLowerCase().includes(query)
        const matchDesc = item.description.toLowerCase().includes(query)
        const matchCat = item.category.toLowerCase().includes(query)
        if (!matchName && !matchDesc && !matchCat) return false
      }
      return true
    })
  }, [activeCategory, jainOnlyFilter, searchQuery])

  // Group filtered items by category if "All" is active
  const groupedItems = useMemo(() => {
    if (activeCategory !== 'All' || searchQuery.trim()) {
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
  }, [activeCategory, searchQuery, filteredItems])

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#26201B] flex flex-col pb-28">
      {/* Header */}
      <CustomerHeader
        tableNumber={tableNumber}
        seatingGroup={seatingGroup}
        cartCount={totalCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* Welcome & Table Greeting */}
      <section className="bg-white border-b border-[#EAE3D6] py-3.5 px-4 shadow-2xs">
        <div className="max-w-3xl mx-auto">
          {seatingGroup && seatingGroup.active && (
            <div className="mb-2.5 p-2.5 rounded-xl bg-[#A3432B]/10 border border-[#A3432B]/20 text-[#A3432B] flex items-center gap-2 text-xs font-medium">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>
                <strong>Combined Seating Active:</strong> Your table is linked to <strong>Group G12 ({seatingGroup.name})</strong>. All orders will be coordinated together.
              </span>
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs text-[#7A6B5F] font-medium">
                Welcome to Shree Restaurant &bull; Station Road, Nadiad
              </p>
              <h2 className="text-sm font-semibold text-[#26201B]">
                Ordering for Table {tableNumber}
              </h2>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[11px] font-semibold text-[#1E7E34] bg-[#E8F5E9] px-2.5 py-1 rounded-full border border-[#C8E6C9] inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E7E34]" />
                100% Pure Veg
              </span>
            </div>
          </div>

          {/* Search bar & quick filters */}
          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8C7E72] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => handleSearchChange(e.target.value)}
                placeholder="Search dishes..."
                className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-[#FAF7F2] border border-[#E0D8CA] focus:outline-none focus:ring-1 focus:ring-[#A3432B] focus:bg-white text-[#26201B] placeholder:text-[#8C7E72] transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C7E72] hover:text-[#26201B] p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Jain Filter Toggle */}
            <button
              onClick={() => setJainOnlyFilter(prev => !prev)}
              aria-pressed={jainOnlyFilter}
              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                jainOnlyFilter
                  ? 'bg-[#7C662B] text-white border-[#7C662B] shadow-xs'
                  : 'bg-[#FAF7F2] text-[#6B5E52] border-[#E0D8CA] hover:bg-white'
              }`}
            >
              <span>Jain Friendly Only</span>
              {jainOnlyFilter && <span className="text-[10px]">&#10003;</span>}
            </button>
          </div>
        </div>
      </section>

      {/* Horizontal Category Tabs */}
      <CategoryNav
        activeCategory={activeCategory}
        onSelectCategory={cat => {
          setActiveCategory(cat)
          if (searchQuery) setSearchQuery('')
        }}
        categoryCounts={categoryCounts}
      />

      {/* Menu Dishes Listing */}
      <main className="max-w-3xl mx-auto px-4 py-4 w-full flex-1">
        {/* Jain disclaimer note */}
        <div className="mb-4 p-2.5 rounded-xl bg-[#F8F4EC] border border-[#EBE3D3] text-[11px] text-[#7A6B5F] flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-[#A3432B] shrink-0" />
          <span>
            Jain preparations avoid onion, garlic & root vegetables as sample menu claims. Please communicate severe dietary constraints to server.
          </span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="py-16 text-center text-[#7A6B5F]">
            <Search className="w-8 h-8 text-[#A39688] mx-auto mb-2 opacity-50" />
            <h3 className="font-serif text-base font-semibold text-[#26201B]">
              No dishes found
            </h3>
            <p className="text-xs text-[#7A6B5F] mt-1">
              Try searching with another keyword or clear the current category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setActiveCategory('All')
                setJainOnlyFilter(false)
              }}
              className="mt-3 text-xs font-bold text-[#A3432B] hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : groupedItems ? (
          // Grouped by category when "All" is active and no search query
          <div className="space-y-6">
            {Array.from(groupedItems.entries()).map(([cat, items]) => (
              <section key={cat} className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#EAE3D6] pb-1.5">
                  <h3 className="font-serif text-base font-bold text-[#26201B]">
                    {cat}
                  </h3>
                  <span className="text-xs text-[#7A6B5F]">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                <div className="space-y-3">
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
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 text-xs text-[#7A6B5F]">
              <span>
                Showing <strong>{filteredItems.length}</strong> {activeCategory !== 'All' ? activeCategory : 'matching'} dishes
              </span>
            </div>

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
        )}

        {/* Footer note for customers */}
        <footer className="mt-10 pt-4 border-t border-[#EAE3D6] text-center text-xs text-[#8C7E72] space-y-1">
          <div className="flex items-center justify-center gap-1.5 font-medium text-[#5C4F44]">
            <HeartHandshake className="w-3.5 h-3.5 text-[#A3432B]" />
            <span>Shree Pure Veg Restaurant &bull; Authentic Gujarati & Punjabi Dining</span>
          </div>
          <p className="text-[11px] text-[#A39688]">
            Station Road, Nadiad, Gujarat &bull; Fast table-side digital demo ordering
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
