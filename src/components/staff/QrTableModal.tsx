import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { X, ExternalLink, Copy, Check, Pizza } from 'lucide-react'

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
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-[#1E1B18]/60 backdrop-blur-xs"
    >
      <div className="bg-white rounded-3xl border border-[#DFD6C8] max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#EAE2D5] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#C0392B]/10 text-[#C0392B] flex items-center justify-center">
              <Pizza className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-[#1E1B18]">
                Authentic Neapolitan Pizza &bull; Table QR
              </h2>
              <p className="text-[11px] text-[#7A6756]">
                Instant table-side ordering without app download
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8C7662] hover:text-[#1E1B18] hover:bg-[#FAF7F2] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Table Selector Pills */}
        <div>
          <label className="block text-xs font-semibold text-[#4A3D34] mb-2">
            Select Table to Generate QR:
          </label>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_TABLES.map(tbl => (
              <button
                key={tbl}
                onClick={() => setSelectedTable(tbl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedTable === tbl
                    ? 'bg-[#C0392B] text-white shadow-xs'
                    : 'bg-[#FAF7F2] hover:bg-[#EFE8DD] text-[#5A4D43] border border-[#E3D9CC]'
                }`}
              >
                Table {tbl}
                {(tbl === '07' || tbl === '08') && (
                  <span className="ml-1 text-[9px] opacity-80 font-normal">&bull; Demo</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* QR Code Card Display */}
        <div className="bg-[#FAF7F2] border border-[#E2D6C5] rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3">
          <div className="p-3 bg-white rounded-2xl border border-[#EAE2D5] shadow-sm">
            <QRCodeSVG
              value={menuUrl}
              size={180}
              level="M"
              fgColor="#1E1B18"
              bgColor="#FFFFFF"
            />
          </div>

          <div className="space-y-1">
            <div className="font-serif text-lg font-bold text-[#1E1B18]">
              Authentic Neapolitan Pizza &bull; Table {selectedTable}
            </div>
            <p className="text-xs text-[#7A6756] max-w-xs">
              Scan with phone camera to open pizza cafe menu directly for this table
            </p>
          </div>

          <div className="w-full flex items-center justify-between bg-white rounded-xl border border-[#DFD6C8] px-3 py-2 text-xs text-[#5A4D43]">
            <span className="font-mono text-[11px] truncate mr-2 select-all text-[#3D3128]">
              {menuUrl}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handleCopy}
                className="p-1 text-[#8C7662] hover:text-[#1E1B18] rounded transition cursor-pointer"
                title="Copy URL"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href={menuUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1 text-[#C0392B] hover:text-[#962D22] rounded transition cursor-pointer"
                title="Open menu in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-[#EAE2D5]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5A4D43] hover:bg-[#FAF7F2] border border-[#DFD6C8] transition cursor-pointer"
          >
            Close
          </button>
          <a
            href={menuUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#C0392B] hover:bg-[#A93226] text-white flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <span>Open Table {selectedTable} Menu</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}
