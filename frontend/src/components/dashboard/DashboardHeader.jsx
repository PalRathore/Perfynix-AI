import { motion } from 'framer-motion';
import { Clock, Sparkles, ShieldCheck, Radar, Lock } from 'lucide-react';

export default function DashboardHeader({
  lastScanned,
}) {
  const displayTime = lastScanned || `Today, ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}`;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full min-w-0 pb-1">
      {/* Left Eyebrow & Title */}
      <div className="space-y-1.5 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase text-brand-700 bg-brand-500/10 border border-brand-500/20 dark:text-cyan-300">
            <ShieldCheck size={13} className="text-cyan-500 animate-pulse" />
            AI Security Intelligence &amp; Threat Hub
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            Real-Time Defense Active
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          <span>Security Dashboard</span>
          <Radar size={28} className="text-brand-500 dark:text-cyan-400" />
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl">
          Visual security intelligence, threat explainability, and multi-engine vulnerability analytics for your target endpoints.
        </p>
      </div>

      {/* Right Last Scanned & Status Info */}
      <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-md text-xs font-medium">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-cyan-400 border border-brand-500/20">
            <Clock size={16} />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Last Security Assessment</span>
            <span className="text-slate-900 dark:text-slate-100 font-bold font-mono-tech leading-tight mt-1">{displayTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
