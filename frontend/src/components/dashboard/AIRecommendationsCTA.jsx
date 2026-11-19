import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Code2, FileCode, Lock, Cpu } from 'lucide-react';
import GlassCard from '../common/GlassCard';

export default function AIRecommendationsCTA() {
  const navigate = useNavigate();

  const highlights = [
    {
      label: 'AI-Powered Fixes',
      desc: 'Automated patch generation',
      icon: Sparkles,
      color: 'text-brand-600 dark:text-cyan-400',
      bg: 'bg-brand-500/10 border-brand-500/20',
    },
    {
      label: 'Code Snippets',
      desc: 'Copy-paste ready solutions',
      icon: Code2,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/20',
    },
    {
      label: 'Step-by-Step',
      desc: 'Guided remediation guide',
      icon: FileCode,
      color: 'text-cyan-600 dark:text-cyan-300',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      label: 'Risk Reduction',
      desc: 'Proactive security defense',
      icon: Lock,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <GlassCard variant="elevated" className="p-6 sm:p-7 w-full min-w-0 relative overflow-hidden group flex flex-col justify-between">
      {/* Ambient Gradient Backdrop Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-cyan-500/5 to-violet-600/10 opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full justify-between space-y-5">
        {/* Top Header Row */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-brand-500/10 border border-brand-500/25 dark:text-cyan-300">
              <Cpu size={13} className="animate-pulse" />
              AI Remediation Engine
            </span>

            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              Instant Patches
            </span>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 via-cyan-500 to-accent-600 text-white shadow-lg shadow-brand-500/25 border border-white/20">
              <Sparkles size={24} className="text-white" />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                AI Recommendations &amp; Fixes
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium leading-relaxed">
                Explore automated risk analysis, prioritized vulnerabilities, and AI-generated code patches ready for deployment.
              </p>
            </div>
          </div>
        </div>

        {/* 2x2 Feature Matrix Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-1">
          {highlights.map((h) => {
            const Icon = h.icon;
            return (
              <div
                key={h.label}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800/80 hover:border-brand-500/30 dark:hover:border-cyan-500/30 transition-colors"
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${h.bg} ${h.color}`}>
                  <Icon size={18} />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block truncate leading-tight">
                    {h.label}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                    {h.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full-Width Action Button */}
        <div className="pt-2">
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/results')}
            className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 via-cyan-500 to-accent-600 hover:from-brand-500 hover:to-accent-500 shadow-lg shadow-brand-500/25 border border-white/20 transition-all cursor-pointer group/btn"
          >
            <ShieldCheck size={18} />
            <span>Explore AI Recommendations</span>
            <ArrowRight size={18} className="group-hover/btn:translate-x-1.5 transition-transform" />
          </motion.button>
        </div>
      </div>
    </GlassCard>
  );
}
