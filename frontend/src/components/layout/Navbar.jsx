import { motion } from 'framer-motion';
import { Bell, Menu, Search, ShieldHalf } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ onToggleMobileSidebar }) {
  return (
    <header className="glass fixed inset-x-0 top-0 z-40 h-16 shadow-sm shadow-black/5">
      <div className="flex h-full items-center gap-3 px-4 sm:px-6">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation"
          className="flex h-9 w-9 items-center justify-center rounded-lg
            text-slate-600 dark:text-slate-300
            hover:bg-slate-900/5 dark:hover:bg-white/10 transition-colors lg:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Logo */}
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg
            bg-gradient-to-br from-primary to-accent text-white
            shadow-lg shadow-primary/30">
            <ShieldHalf size={20} />
          </div>
          <span className="hidden text-base font-semibold tracking-tight
            text-slate-900 dark:text-white sm:block">
            Sentinel<span className="text-primary">AI</span>
          </span>
        </div>

        {/* Search bar */}
        <div className="ml-2 hidden max-w-md flex-1 md:block">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2
                -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search assessments, reports, hosts..."
              className="w-full rounded-lg border border-slate-200/70
                dark:border-white/10 bg-white/70 dark:bg-white/5
                py-2 pl-9 pr-3 text-sm text-slate-700 dark:text-slate-200
                placeholder:text-slate-400 focus:outline-none
                focus:ring-2 focus:ring-primary/40 transition-shadow"
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <motion.button
            type="button"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center
              rounded-lg border border-slate-200/70 dark:border-white/10
              bg-white/70 dark:bg-white/5 text-slate-600 dark:text-slate-300
              hover:text-primary dark:hover:text-accent transition-colors"
          >
            <Bell size={18} />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full
              bg-secondary ring-2 ring-white dark:ring-[#111827]" />
          </motion.button>

          <ThemeToggle />

          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2
              hover:bg-slate-900/5 dark:hover:bg-white/10 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center
              rounded-full bg-gradient-to-br from-secondary to-primary
              text-xs font-semibold text-white">
              JD
            </div>
            <span className="hidden text-sm font-medium text-slate-700
              dark:text-slate-200 sm:block">
              Jane Doe
            </span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
