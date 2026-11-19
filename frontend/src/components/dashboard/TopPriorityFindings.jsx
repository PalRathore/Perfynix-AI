import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, AlertOctagon, AlertTriangle, AlertCircle, Info, ArrowRight } from 'lucide-react';
import GlassCard from '../common/GlassCard';

export default function TopPriorityFindings({ findings = [] }) {
  const navigate = useNavigate();

  const defaultTop = [
    {
      id: 'f-101',
      title: 'Missing Content-Security-Policy',
      cwe: 'CWE-693',
      source: 'Security Headers',
      severity: 'HIGH',
      confidence: '99.8%',
      badgeBg: 'bg-orange-500/20 text-orange-600 dark:text-orange-300 font-bold border border-orange-500/40 shadow-[0_0_10px_rgba(255,119,0,0.2)]',
      icon: AlertTriangle,
      iconColor: 'text-orange-500',
    },
    {
      id: 'f-102',
      title: 'Missing HSTS Header',
      cwe: 'CWE-319',
      source: 'Security Headers',
      severity: 'HIGH',
      confidence: '98.4%',
      badgeBg: 'bg-orange-500/20 text-orange-600 dark:text-orange-300 font-bold border border-orange-500/40 shadow-[0_0_10px_rgba(255,119,0,0.2)]',
      icon: AlertTriangle,
      iconColor: 'text-orange-500',
    },
    {
      id: 'f-103',
      title: 'Missing X-Frame-Options Header',
      cwe: 'CWE-1021',
      source: 'Security Headers',
      severity: 'MEDIUM',
      confidence: '96.1%',
      badgeBg: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/40 shadow-[0_0_10px_rgba(255,214,0,0.2)]',
      icon: AlertCircle,
      iconColor: 'text-amber-500',
    },
  ];

  const items = findings && findings.length > 0 ? findings : defaultTop;

  return (
    <GlassCard variant="standard" className="p-6 sm:p-7 w-full min-w-0">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide text-brand-700 bg-brand-500/10 border border-brand-500/20 dark:text-cyan-300 mb-1">
            <ShieldAlert size={13} />
            Immediate Action Required
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Top Priority Findings
          </h3>
        </div>

        <button
          onClick={() => navigate('/results')}
          className="text-xs font-semibold text-brand-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="space-y-3">
        {items.slice(0, 3).map((item) => {
          const sev = (item.severity || 'MEDIUM').toUpperCase();
          const Icon =
            sev === 'CRITICAL'
              ? AlertOctagon
              : sev === 'HIGH'
              ? AlertTriangle
              : sev === 'MEDIUM'
              ? AlertCircle
              : Info;

          const badgeClass =
            sev === 'CRITICAL'
              ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300 font-black border border-rose-500/40 shadow-[0_0_10px_rgba(255,0,85,0.25)]'
              : sev === 'HIGH'
              ? 'bg-orange-500/20 text-orange-600 dark:text-orange-300 font-bold border border-orange-500/40 shadow-[0_0_10px_rgba(255,119,0,0.2)]'
              : sev === 'MEDIUM'
              ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/40'
              : 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-bold border border-cyan-500/40';

          const iconColor =
            sev === 'CRITICAL'
              ? 'text-rose-500'
              : sev === 'HIGH'
              ? 'text-orange-500'
              : sev === 'MEDIUM'
              ? 'text-amber-500'
              : 'text-cyan-500';

          return (
            <motion.div
              key={item.id}
              whileHover={{ x: 4, scale: 1.005 }}
              onClick={() => navigate('/results')}
              className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800/70 hover:border-brand-500/40 dark:hover:border-cyan-500/40 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <Icon size={20} className={iconColor} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wide border ${badgeClass}`}
                    >
                      {sev}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-cyan-300 transition-colors truncate">
                      {item.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                    <span className="font-mono-tech font-semibold text-slate-700 dark:text-slate-300">{item.cwe}</span>
                    <span>•</span>
                    <span>{item.source}</span>
                    <span>•</span>
                    <span className="font-mono-tech text-emerald-600 dark:text-emerald-400 font-semibold">{item.confidence || '99.2%'} confidence</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-1 sm:pt-0">
                <div className="p-2 rounded-xl text-slate-400 group-hover:text-brand-600 dark:group-hover:text-cyan-300 group-hover:bg-brand-500/10 transition-colors">
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}
