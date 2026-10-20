import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { RotateCcw, ChevronDown, ChevronUp, ExternalLink, ShieldCheck, LayoutDashboard } from 'lucide-react'
import { resetDemo } from '../../services/storageService'

export const PresenterBar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isExpanded, setIsExpanded] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)

  const currentPath = location.pathname
  const searchParams = new URLSearchParams(location.search)
  const currentTable = searchParams.get('table')

  const handleReset = () => {
    if (window.confirm('Reset demo orders and table assignments to default sample state?')) {
      resetDemo()
      setResetSuccess(true)
      setTimeout(() => setResetSuccess(false), 2000)
    }
  }

  return (
    <aside 
      aria-label="Presenter Demo Switcher" 
      className="fixed bottom-20 sm:bottom-3 right-3 z-50 print:hidden select-none"
    >
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#26201B]/90 hover:bg-[#26201B] text-white shadow-lg text-xs font-medium backdrop-blur-md border border-white/10 transition-all cursor-pointer"
          title="Open presenter controls"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Demo Controls</span>
          <ChevronUp className="w-3.5 h-3.5 text-stone-300" />
        </button>
      ) : (
        <div className="bg-[#26201B] text-stone-200 rounded-2xl shadow-2xl border border-stone-700/60 p-3.5 w-72 backdrop-blur-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-100 tracking-wide">
              <ShieldCheck className="w-4 h-4 text-[#C05621]" />
              <span>Sales Demo Switcher</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-stone-400 hover:text-white p-1 rounded-md"
              aria-label="Collapse demo controls"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="text-[11px] uppercase tracking-wider text-stone-400 font-medium px-1">
              Customer QR Views
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  navigate('/menu?table=07')
                  setIsExpanded(false)
                }}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-medium transition-colors ${
                  currentPath === '/menu' && currentTable === '07'
                    ? 'bg-[#A3432B] text-white font-semibold'
                    : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                }`}
              >
                <span>Table 07</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </button>
              <button
                onClick={() => {
                  navigate('/menu?table=08')
                  setIsExpanded(false)
                }}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-medium transition-colors ${
                  currentPath === '/menu' && currentTable === '08'
                    ? 'bg-[#A3432B] text-white font-semibold'
                    : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                }`}
              >
                <span>Table 08</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </button>
            </div>

            <div className="text-[11px] uppercase tracking-wider text-stone-400 font-medium px-1 pt-1">
              Restaurant Ops
            </div>
            <button
              onClick={() => {
                navigate('/staff')
                setIsExpanded(false)
              }}
              className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium transition-colors ${
                currentPath === '/staff'
                  ? 'bg-amber-700 text-white font-semibold'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Staff Kitchen Dashboard</span>
            </button>

            <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
              <span className="text-[10px] text-stone-400">Nadiad Pitch Demo</span>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-[11px] text-stone-300 hover:text-white px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 transition"
                title="Reset sample orders and table groups"
              >
                <RotateCcw className={`w-3 h-3 ${resetSuccess ? 'text-emerald-400' : ''}`} />
                <span>{resetSuccess ? 'Reset Done!' : 'Reset Demo'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
