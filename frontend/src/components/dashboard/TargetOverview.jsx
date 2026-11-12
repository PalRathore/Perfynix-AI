import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, ArrowRight, CheckCircle2, Clock, Server, ExternalLink, ShieldCheck, Lock } from 'lucide-react';
import GlassCard from '../common/GlassCard';

export default function TargetOverview({
  target,
}) {
  const navigate = useNavigate();

  const activeTarget = {
    domain: 'example.com',
    ip: '93.184.216.34',
    httpStatus: '200 OK',
    scannedAt: `Today, ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}`,
    scannedRelative: 'Just now',
    ...target,
  };

  return (
    <GlassCard variant="elevated" className="p-5 sm:p-6 w-full min-w-0 relative overflow-hidden group">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -top-12 -left-12 w-44 h-44 bg-gradient-to-br from-brand-600/15 via-cyan-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-12 -right-12 w-44 h-44 bg-gradient-to-tl from-accent-600/15 via-brand-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 w-full min-w-0">
        {/* Left Target Info */}
        <div className="flex items-start sm:items-center gap-4 min-w-0">
          <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 via-cyan-500 to-accent-600 text-white shadow-lg shadow-brand-500/25 border border-white/20">
            <Globe size={24} className="group-hover:scale-110 transition-transform duration-300" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <ShieldCheck size={12} className="text-brand-500" />
                Target Security Scope
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Target Endpoint
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20">
                <Lock size={11} />
                TLS 1.3 HTTPS
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight truncate flex items-center gap-2">
              <span>{activeTarget.domain}</span>
              <a
                href={`https://${activeTarget.domain}`}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-brand-600 dark:hover:text-cyan-400 transition-colors text-xs font-normal"
                title="Open target in new tab"
              >
                <ExternalLink size={16} />
              </a>
            </h2>

            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium flex-wrap mt-1.5">
              <span className="inline-flex items-center gap-1.5 font-mono-tech font-semibold text-slate-700 dark:text-slate-200 bg-slate-100/70 dark:bg-slate-900/40 px-2 py-0.5 rounded-md border border-slate-200/50 dark:border-slate-800/60">
                <Server size={13} className="text-brand-500" />
                {activeTarget.ip}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono-tech font-semibold">
                <CheckCircle2 size={14} />
                HTTP {activeTarget.httpStatus}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <Clock size={14} />
                Scanned {activeTarget.scannedRelative}
              </span>
            </div>
          </div>
        </div>

        {/* Right View Results Action */}
        <div className="shrink-0 pt-2 md:pt-0">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/results')}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-brand-600 via-cyan-500 to-accent-600 hover:from-brand-500 hover:to-accent-500 shadow-xl shadow-brand-500/25 border border-white/20 transition-all cursor-pointer group/btn"
          >
            <ShieldCheck size={17} />
            <span>Explore Security Results</span>
            <ArrowRight size={17} className="group-hover/btn:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>
    </GlassCard>
  );
}
