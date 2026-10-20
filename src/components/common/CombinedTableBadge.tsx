import React from 'react'
import { Users2 } from 'lucide-react'

interface CombinedTableBadgeProps {
  tableNumber: string
  groupName?: string
  className?: string
}

export const CombinedTableBadge: React.FC<CombinedTableBadgeProps> = ({
  tableNumber,
  groupName = 'Tables 07 + 08',
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C0392B]/10 text-[#C0392B] border border-[#C0392B]/20 text-xs font-medium ${className}`}
      title={`Combined Seating Group G12 (${groupName})`}
    >
      <Users2 className="w-3.5 h-3.5" />
      <span>Table {tableNumber} (Group G12 &bull; {groupName})</span>
    </div>
  )
}
