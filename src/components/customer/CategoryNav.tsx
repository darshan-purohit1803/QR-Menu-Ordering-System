import React, { useRef, useEffect } from 'react'
import type { MenuCategory } from '../../types'
import { MENU_CATEGORIES } from '../../data/menuData'

interface CategoryNavProps {
  activeCategory: MenuCategory | 'All'
  onSelectCategory: (category: MenuCategory | 'All') => void
  categoryCounts?: Record<string, number>
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  onSelectCategory,
  categoryCounts = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll active tab into view horizontally if needed
  useEffect(() => {
    if (!containerRef.current) return
    const activeEl = containerRef.current.querySelector('[data-active="true"]') as HTMLElement
    if (activeEl) {
      const container = containerRef.current
      const left = activeEl.offsetLeft - container.offsetWidth / 2 + activeEl.offsetWidth / 2
      container.scrollTo({ left, behavior: 'smooth' })
    }
  }, [activeCategory])

  return (
    <nav aria-label="Menu categories" className="sticky top-[57px] z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAE3D6] py-2.5">
      <div
        ref={containerRef}
        className="max-w-3xl mx-auto px-4 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth"
      >
        <button
          data-active={activeCategory === 'All'}
          onClick={() => onSelectCategory('All')}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
            activeCategory === 'All'
              ? 'bg-[#A3432B] text-white shadow-xs font-semibold'
              : 'bg-white/80 hover:bg-white text-[#5C4F44] border border-[#E5DDD0]'
          }`}
        >
          All Items
        </button>

        {MENU_CATEGORIES.map(category => {
          const isActive = activeCategory === category
          const count = categoryCounts[category]

          return (
            <button
              key={category}
              data-active={isActive}
              onClick={() => onSelectCategory(category)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#A3432B] text-white shadow-xs font-semibold'
                  : 'bg-white/80 hover:bg-white text-[#5C4F44] border border-[#E5DDD0]'
              }`}
            >
              <span>{category}</span>
              {count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#EFE9DF] text-[#7A6B5F]'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
