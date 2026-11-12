import { Globe, Server, Clock, CheckCircle2, ShieldAlert, Cpu, Layers } from 'lucide-react';
import GlassCard from '../common/GlassCard';

export default function ResultsSummary({ summary }) {
  return (
    <GlassCard variant="elevated" className="p-5 sm:p-6 w-full min-w-0 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-12 -left-12 w-44 h-44 bg-gradient-to-br from-brand-600/15 via-cyan-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-12 -right-12 w-44 h-44 bg-gradient-to-tl from-accent-600/15 via-brand-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Target System Information */}
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 via-cyan-500 to-accent-600 text-white shadow-md border border-white/20">
            <Globe size={20} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Target System
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 size={11} />
                Scan Completed
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate">
              {summary.domain}
            </h3>

            <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium flex-wrap mt-1">
              <span className="inline-flex items-center gap-1 font-mono-tech font-semibold text-slate-700 dark:text-slate-200">
                <Server size={12} className="text-cyan-500" />
                {summary.ip}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono-tech font-semibold">
                HTTP {summary.httpStatus}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <Clock size={12} />
                Scanned {summary.scannedRelative}
              </span>
            </div>
          </div>
        </div>

        {/* Assessment Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left shrink-0">
          {/* CRSI Score */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              <Cpu size={12} className="text-cyan-500" />
              <span>CRSI Score</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black font-mono-tech text-slate-900 dark:text-white">
                {summary.crsiScore}
              </span>
              <span className="text-xs font-bold text-slate-400">/ 100</span>
            </div>
          </div>

          {/* Overall Risk */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              <ShieldAlert
                size={12}
                className={
                  summary.overallRisk === 'CRITICAL'
                    ? 'text-rose-500'
                    : summary.overallRisk === 'HIGH'
                    ? 'text-orange-500'
                    : summary.overallRisk === 'MEDIUM'
                    ? 'text-amber-500'
                    : 'text-emerald-500'
                }
              />
              <span>Overall Risk</span>
            </div>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold tracking-wide border ${
                summary.overallRisk === 'CRITICAL'
                  ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border-rose-500/30'
                  : summary.overallRisk === 'HIGH'
                  ? 'bg-orange-500/20 text-orange-600 dark:text-orange-300 border-orange-500/30'
                  : summary.overallRisk === 'MEDIUM'
                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
              }`}
            >
              {summary.overallRisk}
            </span>
          </div>

          {/* Total Findings */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Total Findings
            </div>
            <span className="text-2xl font-black font-mono-tech text-slate-900 dark:text-white">
              {summary.totalFindings}
            </span>
          </div>

          {/* Security Engines */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              <Layers size={12} className="text-brand-500" />
              <span>Engines</span>
            </div>
            <span className="text-2xl font-black font-mono-tech text-slate-900 dark:text-white">
              {summary.enginesRun}
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
