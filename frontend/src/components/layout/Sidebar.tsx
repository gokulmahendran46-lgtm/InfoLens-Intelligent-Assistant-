import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  GitCompare,
  MessageSquare,
  Lightbulb,
  Settings,
  Zap,
  ChevronRight,
  X,
} from 'lucide-react'
import clsx from 'clsx'

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/documents', label: 'Documents', icon: FileText },
  { path: '/compare', label: 'Compare', icon: GitCompare },
  { path: '/assistant', label: 'AI Assistant', icon: MessageSquare },
  { path: '/insights', label: 'Insights', icon: Lightbulb },
  { path: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ mobileMenuOpen, setMobileMenuOpen }: { mobileMenuOpen?: boolean; setMobileMenuOpen?: (val: boolean) => void }) {
  const location = useLocation()

  return (
    <aside className={clsx(
      "w-64 bg-white border-r border-slate-200 flex flex-col h-full fixed left-0 top-0 z-20 transition-transform duration-300 md:translate-x-0",
      mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      {/* Mobile close button */}
      <button 
        className="absolute top-4 right-4 md:hidden text-slate-500 hover:text-slate-900"
        onClick={() => setMobileMenuOpen?.(false)}
      >
        <X size={20} />
      </button>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
        <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
          <Zap size={18} className="text-white" fill="white" />
        </div>
        <div>
          <h1 className="text-[15px] font-bold text-slate-900 leading-tight">InfoLens</h1>
          <p className="text-[10px] text-slate-500 leading-tight">Intelligent Assistant</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
          return (
            <NavLink
              key={path}
              to={path}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <Icon
                size={18}
                className={clsx(
                  'flex-shrink-0 transition-colors',
                  isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'
                )}
              />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight size={14} className="text-primary-400" />}
            </NavLink>
          )
        })}
      </nav>

      {/* Demo badge */}
      <div className="px-3 py-4 border-t border-slate-100">
        <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-3 border border-primary-100">
          <p className="text-xs font-semibold text-primary-700">🎓 Hackathon Demo</p>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            College Administration<br />Use Case – Gokul Mahendran
          </p>
        </div>
      </div>
    </aside>
  )
}
