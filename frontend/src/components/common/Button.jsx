import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const VARIANTS = {
  primary:
    'bg-gradient-to-r from-brand-600 via-cyan-500 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white shadow-lg shadow-brand-500/25 border border-white/20',
  secondary:
    'border border-slate-200/80 bg-white/70 text-slate-700 hover:bg-slate-100 hover:border-slate-300 dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800 shadow-sm',
  ghost:
    'text-slate-700 hover:bg-slate-500/10 dark:text-slate-200 border border-transparent',
  success:
    'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 border border-white/20',
  danger:
    'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 shadow-lg shadow-rose-500/25 border border-white/20',
  dangerGhost:
    'text-rose-600 hover:bg-rose-500/10 dark:text-rose-400',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs rounded-xl font-semibold tracking-wide',
  md: 'px-4 py-2.5 text-sm rounded-xl font-semibold tracking-wide',
  lg: 'px-6 py-3 text-sm sm:text-base rounded-2xl font-semibold tracking-wide',
};

export default function Button({
  children,
  type = 'button',
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size,
  className = '',
  ...props
}) {
  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  const sizeClass = size ? SIZES[size] : 'h-11 w-full text-sm rounded-xl font-semibold tracking-wide';

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ y: disabled || loading ? 0 : -1 }}
      whileTap={{ y: 0 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap',
        variantClass,
        sizeClass,
        className
      )}
      {...props}
    >
      {loading && <Loader2 size={18} className="animate-spin" />}
      {children}
    </motion.button>
  );
}
