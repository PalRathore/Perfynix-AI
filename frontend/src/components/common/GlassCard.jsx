import { motion } from 'framer-motion';

export default function GlassCard({
  children,
  className = '',
  variant = 'standard', // 'subtle' | 'standard' | 'elevated'
  hover = true,
  glow = true,
  glowTone = 'brand', // 'brand' | 'violet' | 'cyan' | 'rose' | 'amber'
  ...props
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'subtle':
        return 'glass-card-subtle';
      case 'elevated':
        return 'glass-card-elevated';
      case 'standard':
      default:
        return 'glass-card-standard';
    }
  };

  const getGlowClasses = () => {
    switch (glowTone) {
      case 'violet':
        return 'from-violet-500/30 via-fuchsia-500/20 to-transparent';
      case 'cyan':
        return 'from-cyan-500/30 via-blue-500/20 to-transparent';
      case 'rose':
        return 'from-rose-500/30 via-pink-500/20 to-transparent';
      case 'amber':
        return 'from-amber-500/30 via-orange-500/20 to-transparent';
      case 'brand':
      default:
        return 'from-brand-500/30 via-cyan-500/20 to-transparent';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -2 } : undefined}
      transition={{
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`
        relative
        overflow-hidden
        rounded-3xl
        transition-all
        duration-300
        ${getVariantStyles()}
        ${hover ? 'glass-card-hover' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Background Ambient Color Blob behind glass surface (matches Figma/Dribbble glass card reference) */}
      {glow && (
        <div
          className={`pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-gradient-to-br ${getGlowClasses()} blur-2xl opacity-75 transition-opacity duration-500 group-hover:opacity-100`}
        />
      )}

      {/* Top Glass Edge Light Reflection */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 dark:via-white/40 to-transparent" />

      {/* Card Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
