import { AnimatePresence, motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  History,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  UserCircle,
  X,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Assessment', to: '/assessment', icon: ShieldCheck },
  { label: 'Results', to: '/results', icon: BarChart3 },
  { label: 'Reports', to: '/reports', icon: FileText },
  { label: 'History', to: '/history', icon: History },
  { label: 'Settings', to: '/settings', icon: Settings },
  { label: 'Profile', to: '/profile', icon: UserCircle },
];

export default function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) {
  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobile}
            className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`glass fixed left-0 top-0 z-50 flex h-full w-64 flex-col
          border-r transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 ${collapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b
          border-slate-200/60 px-4 dark:border-white/10">
          {!collapsed && (
            <span className="text-xs font-semibold uppercase tracking-wider
              text-slate-400">
              Navigation
            </span>
          )}

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
            className="flex h-8 w-8 items-center justify-center rounded-lg
              text-slate-500 hover:bg-slate-900/5 dark:hover:bg-white/10 lg:hidden"
          >
            <X size={18} />
          </button>

          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden h-8 w-8 items-center justify-center rounded-lg
              text-slate-500 hover:bg-slate-900/5 dark:hover:bg-white/10 lg:flex"
          >
            {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          </button>
        </div>

        {/* Nav items */}
        <nav className="custom-scrollbar flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-lg px-3 py-2.5
                text-sm font-medium transition-colors
                ${
                  isActive
                    ? 'bg-gradient-to-r from-primary/15 to-accent/10 text-primary dark:text-white'
                    : 'text-slate-600 hover:bg-slate-900/5 dark:text-slate-300 dark:hover:bg-white/10'
                }
                ${collapsed ? 'lg:justify-center' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 top-1/2 h-5 w-1
                        -translate-y-1/2 rounded-r-full
                        bg-gradient-to-b from-primary to-accent"
                    />
                  )}
                  <motion.span
                    whileHover={{ scale: 1.12 }}
                    className="flex shrink-0 items-center justify-center"
                  >
                    <Icon size={19} />
                  </motion.span>
                  {!collapsed && <span className="truncate lg:block">{label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-200/60 p-3 dark:border-white/10">
          {!collapsed && (
            <div className="rounded-lg bg-gradient-to-br from-primary/10
              to-accent/10 p-3 text-xs text-slate-500 dark:text-slate-400">
              SentinelAI v1.0
              <br />
              Enterprise Security Suite
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
