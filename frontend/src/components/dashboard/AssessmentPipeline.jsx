import { motion } from 'framer-motion';
import {
  Globe,
  ShieldCheck,
  Lock,
  Gauge,
  Search,
  Cpu,
  BarChart3,
  Sparkles,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import GlassCard from '../common/GlassCard';

export default function AssessmentPipeline() {
  const steps = [
    { id: 1, name: 'Target Validation', status: 'Completed', icon: Globe, ready: false },
    { id: 2, name: 'Security Headers', status: 'Completed', icon: ShieldCheck, ready: false },
    { id: 3, name: 'SSL/TLS Analysis', status: 'Completed', icon: Lock, ready: false },
    { id: 4, name: 'Performance Audit', status: 'Completed', icon: Gauge, ready: false },
    { id: 5, name: 'Vulnerability Scan', status: 'Completed', icon: Search, ready: false },
    { id: 6, name: 'AI Risk Analysis', status: 'Completed', icon: Cpu, ready: false },
    { id: 7, name: 'Explainability (SHAP)', status: 'Completed', icon: BarChart3, ready: false },
    { id: 8, name: 'AI Recommendations', status: 'Ready', icon: Sparkles, ready: true },
  ];

  return (
    <GlassCard variant="subtle" className="p-3 sm:p-4 w-full min-w-0 overflow-hidden">
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-1 px-1 min-w-0">
        {steps.map((step, idx) => {
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  step.ready
                    ? 'bg-gradient-to-r from-brand-500/10 via-cyan-500/10 to-accent-500/10 border-brand-500/30 text-brand-700 dark:text-cyan-300 shadow-sm'
                    : 'bg-slate-50/80 dark:bg-slate-900/60 border-slate-200/70 dark:border-slate-800/80 text-slate-700 dark:text-slate-200'
                }`}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                    step.ready
                      ? 'bg-cyan-500/20 text-cyan-500'
                      : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  <Icon size={13} />
                </div>

                <div className="flex flex-col text-left">
                  <span className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight whitespace-nowrap">
                    {step.id}. {step.name}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-semibold leading-none mt-0.5">
                    {step.ready ? (
                      <span className="text-cyan-600 dark:text-cyan-400 font-extrabold uppercase tracking-wider">
                        {step.status}
                      </span>
                    ) : (
                      <>
                        <CheckCircle2 size={11} className="text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">{step.status}</span>
                      </>
                    )}
                  </span>
                </div>
              </motion.div>

              {idx < steps.length - 1 && (
                <ChevronRight size={14} className="text-slate-300 dark:text-slate-700 shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
