import { motion } from 'framer-motion';
import { Activity, ArrowUpRight, Gauge, ShieldCheck, Target } from 'lucide-react';
import GlassCard from '../common/GlassCard';

const STATS = [
  { label: 'Total Assessments', value: '24', trend: '+12% this month', icon: Activity, accent: 'text-brand-600 dark:text-brand-300', bar: 'w-[76%]' },
  { label: 'Completed Scans', value: '22', trend: '+8% this month', icon: Target, accent: 'text-cyan-600 dark:text-cyan-300', bar: 'w-[88%]' },
  { label: 'Average Security Score', value: '87', trend: '+5% this month', icon: ShieldCheck, accent: 'text-emerald-600 dark:text-emerald-300', bar: 'w-[87%]' },
  { label: 'Average Performance Score', value: '91', trend: '+7% this month', icon: Gauge, accent: 'text-accent-600 dark:text-accent-300', bar: 'w-[91%]' },
];

export default function AccountStats() {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="section-kicker">Security activity</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Account Activity</h3>
        </div>
        <span className="hidden text-xs text-slate-400 sm:block">Updated moments ago</span>
      </div>
      <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map(({ label, value, trend, icon: Icon, accent, bar }) => (
          <motion.div key={label} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}>
            <GlassCard variant="subtle" className="stat-card p-5">
              <div className="flex items-center justify-between">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/[0.04] dark:bg-white/[0.06] ${accent}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="mt-5 text-3xl font-extrabold font-mono-tech tracking-tight text-slate-900 dark:text-white">{value}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
              <div className="mt-4 flex items-center justify-between text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <span>{trend}</span>
                <span className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                  <span className={`block h-full rounded-full bg-emerald-500 ${bar}`} />
                </span>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
