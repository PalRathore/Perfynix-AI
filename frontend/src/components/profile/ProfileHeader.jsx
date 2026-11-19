import { motion } from 'framer-motion';
import {
  CalendarDays,
  Camera,
  CheckCircle2,
  Mail,
  ShieldCheck,
} from 'lucide-react';

import GlassCard from '../common/GlassCard';

export default function ProfileHeader({
  user,
  onAvatarChange,
}) {
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <GlassCard variant="elevated" className="profile-hero relative z-10 overflow-hidden rounded-[28px] p-6 sm:p-8 lg:p-10">

          {/* Subtle background glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl dark:bg-brand-500/15" />

          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-accent-500/10 blur-3xl dark:bg-accent-500/10" />

          <div className="relative flex flex-col gap-7 md:flex-row md:items-center">

            {/* ==================== AVATAR ==================== */}
            <div className="flex flex-col items-center shrink-0 justify-center md:items-start">
              <motion.button
                type="button"
                onClick={onAvatarChange}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                aria-label="Change profile photo"
                className="focus-ring group relative h-28 w-28 rounded-full p-1 cursor-pointer"
              >
                {/* Gradient border */}
                <span className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-500 via-accent-500 to-cyan-400 shadow-[0_0_35px_rgba(51,102,255,0.35)]" />

                {/* Avatar */}
                <span className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white text-4xl font-semibold text-slate-700 dark:bg-slate-950 dark:text-white">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user?.name || 'User'} className="h-full w-full object-cover" />
                  ) : (
                    user?.name?.charAt(0)?.toUpperCase() || 'P'
                  )}

                  {/* Dark hover overlay */}
                  <span className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white gap-1 p-2">
                    <Camera className="h-5 w-5" />
                    <span className="text-[10px] font-bold tracking-tight">Change</span>
                  </span>
                </span>

                {/* Camera badge */}
                <span className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg ring-2 ring-white dark:ring-slate-950 group-hover:bg-brand-500 transition-colors">
                  <Camera className="h-4 w-4" />
                </span>
              </motion.button>
              <button
                type="button"
                onClick={onAvatarChange}
                className="mt-2 text-xs font-semibold text-brand-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
              >
                <Camera className="h-3 w-3" /> Change Photo
              </button>
            </div>

            {/* ==================== USER INFORMATION ==================== */}
            <div className="min-w-0 flex-1 text-center md:text-left">

              {/* Name + Active status */}
              <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  {user?.name || 'User'}
                </h2>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Active
                </span>
              </div>

              {/* Role */}
              <p className="mt-2 text-base font-medium text-brand-600 dark:text-brand-300">
                Perfynix AI {user?.role || 'Security Analyst'}
              </p>

              {/* Email */}
              <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 md:justify-start">
                <Mail className="h-3.5 w-3.5" />
                {user?.email || 'priya@example.com'}
              </p>

              {/* Account details */}
              <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-slate-400 md:justify-start">

                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-brand-500" />
                  Member since January 2026
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-cyan-500" />
                  Account secure
                </span>

              </div>
            </div>

          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
