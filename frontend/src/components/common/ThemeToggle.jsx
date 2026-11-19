import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

/**
 * Canonical ThemeToggle component.
 * Provides a uniform, accessible Light/Dark theme button across all application pages.
 */
export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`
        relative
        flex
        h-10
        w-10
        shrink-0
        items-center
        justify-center
        rounded-xl
        border
        backdrop-blur-md
        transition-colors
        transition-shadow
        duration-300
        bg-white/75
        dark:bg-slate-900/75
        hover:bg-white
        dark:hover:bg-slate-800
        border-slate-200/90
        dark:border-slate-700/80
        text-slate-700
        dark:text-amber-400
        hover:text-brand-600
        shadow-sm
        dark:shadow-md
        ${className}
      `}
    >
      {isDark ? (
        <Sun size={18} className="text-amber-400 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon size={18} className="text-slate-700 transition-transform duration-300 hover:-rotate-12" />
      )}
    </motion.button>
  );
}
