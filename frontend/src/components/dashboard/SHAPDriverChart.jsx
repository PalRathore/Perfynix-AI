import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Info, HelpCircle } from 'lucide-react';
import GlassCard from '../common/GlassCard';

export default function SHAPDriverChart({ drivers = [] }) {
  const [activeHover, setActiveHover] = useState(null);

  const defaultDrivers = [
    { key: 'kev_status', label: 'KEV Status', weight: 0.38, gradient: 'from-blue-600 via-cyan-500 to-violet-600', detail: 'Match in CISA Known Exploited Vulnerabilities catalog (+0.38 SHAP weight)' },
    { key: 'epss_score', label: 'EPSS Exploit Score', weight: 0.29, gradient: 'from-blue-500 via-cyan-400 to-indigo-500', detail: 'High 89th percentile active exploitation prediction probability (+0.29 SHAP weight)' },
    { key: 'cvss_score', label: 'CVSS Severity Rating', weight: 0.22, gradient: 'from-brand-600 via-blue-500 to-violet-500', detail: 'CVSS v3.1 base severity rating calculation (8.8 High/Critical) (+0.22 SHAP weight)' },
    { key: 'cvss_epss_divergence', label: 'CVSS/EPSS Divergence', weight: 0.18, gradient: 'from-cyan-500 via-blue-500 to-accent-600', detail: 'Priority divergence indicator between theoretical severity & active exploitation (+0.18 SHAP weight)' },
  ];

  const chartData = drivers.length > 0 ? drivers : defaultDrivers;
  const maxWeight = Math.max(...chartData.map((d) => d.weight), 0.5);

  return (
    <GlassCard variant="standard" className="p-6 sm:p-7 w-full min-w-0 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide text-brand-700 bg-brand-500/10 border border-brand-500/20 dark:text-cyan-300">
              <Sparkles size={13} className="animate-pulse text-cyan-500" />
              AI Explainability
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            SHAP Explainability
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-normal">
            Top factors influencing the AI priority rating
          </p>
        </div>

        <div className="shrink-0 p-2 rounded-xl text-slate-400 hover:text-brand-600 dark:hover:text-cyan-400 transition-colors" title="SHAP (Shapley Additive exPlanations) quantifies each feature's contribution to the final risk score.">
          <HelpCircle size={19} />
        </div>
      </div>

      {/* Horizontal Bar Chart */}
      <div className="space-y-4 my-2">
        {chartData.map((driver, index) => {
          const percentage = Math.round((driver.weight / maxWeight) * 100);
          const isHovered = activeHover === driver.key;

          return (
            <div
              key={driver.key || index}
              className={`group relative p-2.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                isHovered
                  ? 'bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-md scale-[1.01]'
                  : 'bg-transparent border border-transparent'
              }`}
              onMouseEnter={() => setActiveHover(driver.key)}
              onMouseLeave={() => setActiveHover(null)}
            >
              {/* Label & Numeric Badge */}
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-2">
                <span className="text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-cyan-300 transition-colors flex items-center gap-2 truncate max-w-[75%]">
                  <span className="h-2 w-2 rounded-full bg-cyan-500 shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                  <span className="truncate font-semibold">{driver.label}</span>
                </span>
                <span className="font-mono-tech font-semibold text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-lg border border-cyan-500/25 text-xs shadow-sm">
                  +{driver.weight.toFixed(2)}
                </span>
              </div>

              {/* Progress Bar Container */}
              <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700/60 relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.9, delay: 0.1 * index, ease: [0.22, 1, 0.36, 1] }}
                  className={`h-full rounded-full bg-gradient-to-r ${driver.gradient || 'from-brand-600 via-cyan-500 to-accent-600'} shadow-[0_0_12px_rgba(6,182,212,0.35)] relative`}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-full" />
                </motion.div>
              </div>

              {/* Hover Tooltip Detail */}
              {isHovered && driver.detail && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 px-3 py-1.5 rounded-xl bg-slate-900/95 dark:bg-slate-800/95 text-[11px] text-slate-200 shadow-xl border border-slate-700/80 flex items-center gap-2"
                >
                  <Info size={13} className="text-cyan-400 shrink-0" />
                  <span>{driver.detail}</span>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Insight */}
      <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          Engine: Perfynix LightGBM SHAP Explainer
        </span>
        <span className="font-mono-tech text-brand-600 dark:text-cyan-400 font-semibold text-[11px]">
          High Feature Impact
        </span>
      </div>
    </GlassCard>
  );
}
