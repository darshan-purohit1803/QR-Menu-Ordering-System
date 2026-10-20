import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { X, ExternalLink, QrCode, Copy, Check } from 'lucide-react'

interface QrTableModalProps {
  isOpen: boolean
  onClose: () => void
}

const SAMPLE_TABLES = ['07', '08', '01', '02', '03', '05', '09', '12']

export const QrTableModal: React.FC<QrTableModalProps> = ({ isOpen, onClose }) => {
  const [selectedTable, setSelectedTable] = useState('07')
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'
  const menuUrl = `${origin}/menu?table=${selectedTable}`

  const handleCopy = () => {
    navigator.clipboard.writeText(menuUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Table QR Codes"
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-[#26201B]/60 backdrop-blur-xs"
    >
      <div className="bg-white rounded-3xl border border-[#E0D8CA] max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#EAE3D6] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#A3432B]/10 text-[#A3432B] flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-[#26201B]">
                Table QR Codes Generator
              </h2>
              <p className="text-[11px] text-[#7A6B5F]">
                Scannable QR codes for table-side digital ordering
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8C7E72] hover:text-[#26201B] hover:bg-[#FAF7F2] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Table Selector Pills */}
        <div>
          <label className="block text-xs font-semibold text-[#4A3E36] mb-2">
            Select Table to Generate QR:
          </label>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_TABLES.map(tbl => (
              <button
                key={tbl}
                onClick={() => setSelectedTable(tbl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedTable === tbl
                    ? 'bg-[#A3432B] text-white shadow-xs'
                    : 'bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#5C4F44] border border-[#E5DDD0]'
                }`}
              >
                Table {tbl}
                {(tbl === '07' || tbl === '08') && (
                  <span className="ml-1 text-[9px] opacity-75 font-normal">&bull; Demo</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* QR Code Card Display */}
        <div className="bg-[#FAF7F2] border border-[#E2D8CA] rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3">
          <div className="p-3 bg-white rounded-2xl border border-[#EAE3D6] shadow-sm">
            <QRCodeSVG
              value={menuUrl}
              size={180}
              level="M"
              fgColor="#26201B"
              bgColor="#FFFFFF"
            />
          </div>

          <div className="space-y-1">
            <div className="font-serif text-lg font-bold text-[#26201B]">
              Shree Restaurant &bull; Table {selectedTable}
            </div>
            <p className="text-xs text-[#7A6B5F] max-w-xs">
              Scan with phone camera to open digital menu directly for this table
            </p>
          </div>

          <div className="w-full flex items-center justify-between bg-white rounded-xl border border-[#E0D8CA] px-3 py-2 text-xs text-[#5C4F44]">
            <span className="font-mono text-[11px] truncate mr-2 select-all text-[#3D332B]">
              {menuUrl}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handleCopy}
                className="p-1 text-[#8C7E72] hover:text-[#26201B] rounded transition"
                title="Copy URL"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href={menuUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1 text-[#A3432B] hover:text-[#8C3720] rounded transition"
                title="Open menu in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-[#EAE3D6]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5C4F44] hover:bg-[#FAF7F2] border border-[#E0D8CA] transition cursor-pointer"
          >
            Close
          </button>
          <a
            href={menuUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#A3432B] hover:bg-[#8C3720] text-white flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <span>Open Table {selectedTable} Menu</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}
