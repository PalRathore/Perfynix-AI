import { CheckCircle2, Layers, Globe, FileCheck, Lock, Zap, Bug, Ban } from 'lucide-react';
import GlassCard from '../common/GlassCard';

export default function AssessmentCoverage({ selectedScanners = ['lighthouse', 'zap', 'headers', 'ssl'] }) {
  // Mapping the 4 user-selectable scanner engines
  const allEngines = [
    {
      id: 'headers',
      name: 'Security Headers',
      category: 'Policy & CSP',
      icon: FileCheck,
      tone: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      id: 'ssl',
      name: 'SSL / TLS Inspector',
      category: 'Transport Security',
      icon: Lock,
      tone: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      id: 'lighthouse',
      name: 'Lighthouse Engine',
      category: 'Performance & UX',
      icon: Zap,
      tone: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
    {
      id: 'zap',
      name: 'OWASP ZAP Scanner',
      category: 'Vulnerability Audit',
      icon: Bug,
      tone: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    },
  ];

  const activeCount = allEngines.filter((e) => selectedScanners.includes(e.id)).length;

  return (
    <GlassCard variant="subtle" className="p-4 sm:p-5 w-full min-w-0">
      <div className="flex flex-col gap-3.5 w-full min-w-0">
        {/* Header Title & Status Badge Row */}
        <div className="flex items-center justify-between gap-3 flex-wrap border-b border-slate-200/50 dark:border-slate-800/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-cyan-400 border border-brand-500/20 shadow-xs">
              <Layers size={18} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                Multi-Engine Security Infrastructure
              </span>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                Assessment Coverage &amp; Active Engines
              </h4>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 border ${
              activeCount === allEngines.length
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                : activeCount > 0
                ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
                : 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20'
            }`}
          >
            <CheckCircle2 size={13} />
            <span>
              {activeCount} / {allEngines.length} Selected Engines Active
            </span>
          </span>
        </div>

        {/* 4 Scanner Engines Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full min-w-0">
          {allEngines.map((engine) => {
            const Icon = engine.icon;
            const isEnabled = selectedScanners.includes(engine.id);

            return (
              <div
                key={engine.id}
                className={`flex items-center justify-between gap-2 px-3.5 py-3 rounded-xl text-xs font-bold transition-all min-w-0 border ${
                  isEnabled
                    ? 'bg-white/80 dark:bg-slate-900/70 border-slate-200/70 dark:border-slate-800/80 shadow-xs text-slate-800 dark:text-slate-200'
                    : 'bg-slate-100/50 dark:bg-slate-900/20 border-dashed border-slate-200 dark:border-slate-800/50 opacity-45 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`p-1.5 rounded-lg border shrink-0 ${isEnabled ? engine.tone : 'text-slate-400 bg-slate-200/40 border-slate-300 dark:border-slate-700'}`}>
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0">
                    <span className="truncate font-bold block leading-tight">{engine.name}</span>
                    <span className="text-[10px] font-medium text-slate-400 block mt-0.5 truncate">{engine.category}</span>
                  </div>
                </div>

                {isEnabled ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0 ml-1">
                    <CheckCircle2 size={14} />
                    <span>Active</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 shrink-0 ml-1">
                    <Ban size={13} />
                    <span>Excluded</span>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}
