import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import GlassCard from '../common/GlassCard';

export default function SeverityDistribution({
  data = [
    {
      severity: 'Critical',
      count: 2,
      strokeColor: 'url(#gradientCritical)',
      dotColor: '#FF1E56',
      icon: AlertOctagon,
      iconColor: 'text-rose-500',
      badgeBg: 'bg-rose-500/20 text-rose-600 dark:text-rose-300 font-extrabold border border-rose-500/40 shadow-[0_0_10px_rgba(255,30,86,0.25)]',
    },
    {
      severity: 'High',
      count: 4,
      strokeColor: 'url(#gradientHigh)',
      dotColor: '#FF7700',
      icon: AlertTriangle,
      iconColor: 'text-orange-500',
      badgeBg: 'bg-orange-500/20 text-orange-600 dark:text-orange-300 font-extrabold border border-orange-500/40 shadow-[0_0_10px_rgba(255,119,0,0.25)]',
    },
    {
      severity: 'Medium',
      count: 5,
      strokeColor: 'url(#gradientMedium)',
      dotColor: '#FFD600',
      icon: AlertCircle,
      iconColor: 'text-amber-500',
      badgeBg: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold border border-amber-500/40 shadow-[0_0_10px_rgba(255,214,0,0.25)]',
    },
    {
      severity: 'Low',
      count: 1,
      strokeColor: 'url(#gradientLow)',
      dotColor: '#00F0FF',
      icon: Info,
      iconColor: 'text-cyan-500',
      badgeBg: 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-extrabold border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.25)]',
    },
  ],
}) {
  const [activeHover, setActiveHover] = useState(null);

  // Normalize data with styling
  const formattedData = useMemo(() => {
    return data.map((item) => {
      const sev = item.severity.toLowerCase();
      if (sev === 'critical') {
        return {
          ...item,
          strokeColor: 'url(#gradientCritical)',
          dotColor: '#FF1E56',
          icon: AlertOctagon,
          iconColor: 'text-rose-500',
          badgeBg: 'bg-rose-500/20 text-rose-600 dark:text-rose-300 font-extrabold border border-rose-500/40 shadow-[0_0_10px_rgba(255,30,86,0.25)]',
        };
      }
      if (sev === 'high') {
        return {
          ...item,
          strokeColor: 'url(#gradientHigh)',
          dotColor: '#FF7700',
          icon: AlertTriangle,
          iconColor: 'text-orange-500',
          badgeBg: 'bg-orange-500/20 text-orange-600 dark:text-orange-300 font-extrabold border border-orange-500/40 shadow-[0_0_10px_rgba(255,119,0,0.25)]',
        };
      }
      if (sev === 'medium') {
        return {
          ...item,
          strokeColor: 'url(#gradientMedium)',
          dotColor: '#FFD600',
          icon: AlertCircle,
          iconColor: 'text-amber-500',
          badgeBg: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold border border-amber-500/40 shadow-[0_0_10px_rgba(255,214,0,0.25)]',
        };
      }
      return {
        ...item,
        strokeColor: 'url(#gradientLow)',
        dotColor: '#00F0FF',
        icon: Info,
        iconColor: 'text-cyan-500',
        badgeBg: 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-extrabold border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.25)]',
      };
    });
  }, [data]);

  const total = formattedData.reduce((acc, curr) => acc + curr.count, 0) || 1;
  const criticalCount = formattedData.find((d) => d.severity.toLowerCase() === 'critical')?.count || 0;

  // SVG Donut Calculations
  const radius = 64;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  const segments = useMemo(() => {
    return formattedData.map((item, index) => {
      const percent = item.count / total;
      const prevPercentSum = formattedData
        .slice(0, index)
        .reduce((sum, d) => sum + d.count / total, 0);

      const strokeDashoffset = circumference * (1 - percent);
      const rotation = prevPercentSum * 360 - 90;

      return {
        ...item,
        percent: Math.round(percent * 100),
        strokeDashoffset,
        rotation,
      };
    });
  }, [formattedData, total, circumference]);

  return (
    <GlassCard variant="standard" className="p-6 sm:p-7 w-full min-w-0 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide text-brand-700 bg-brand-500/10 border border-brand-500/20 dark:text-cyan-300 mb-1">
            Severity Spectrum
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Severity Distribution
          </h3>
        </div>

        <span className="text-xs font-mono-tech font-semibold text-slate-400">
          {total} Total Issues
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center my-2">
        {/* Donut Chart Visualization (5 Cols) */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg viewBox="0 0 160 160" className="w-full h-full transform overflow-visible">
              <defs>
                <linearGradient id="gradientCritical" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF1E56" />
                  <stop offset="100%" stopColor="#BE123C" />
                </linearGradient>
                <linearGradient id="gradientHigh" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF7700" />
                  <stop offset="100%" stopColor="#EA580C" />
                </linearGradient>
                <linearGradient id="gradientMedium" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFD600" />
                  <stop offset="100%" stopColor="#CA8A04" />
                </linearGradient>
                <linearGradient id="gradientLow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00F0FF" />
                  <stop offset="100%" stopColor="#0891B2" />
                </linearGradient>
              </defs>

              {/* Background Track Circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-slate-200/70 dark:text-slate-800"
              />

              {/* Dynamic Animated Donut Segments */}
              {segments.map((seg) => (
                <motion.circle
                  key={seg.severity}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke={seg.strokeColor}
                  strokeWidth={activeHover === seg.severity ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: seg.strokeDashoffset }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    transformOrigin: '80px 80px',
                    transform: `rotate(${seg.rotation}deg)`,
                  }}
                  strokeLinecap="round"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setActiveHover(seg.severity)}
                  onMouseLeave={() => setActiveHover(null)}
                />
              ))}
            </svg>

            {/* Inner Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-3xl font-extrabold font-mono-tech text-slate-900 dark:text-white leading-none">
                {activeHover
                  ? formattedData.find((d) => d.severity === activeHover)?.count || 0
                  : total}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                {activeHover ? `${activeHover}` : 'Findings'}
              </span>
            </div>
          </div>
        </div>

        {/* Legend List (7 Cols) */}
        <div className="sm:col-span-7 space-y-2.5">
          {segments.map((item) => {
            const Icon = item.icon;
            const isHovered = activeHover === item.severity;

            return (
              <div
                key={item.severity}
                onMouseEnter={() => setActiveHover(item.severity)}
                onMouseLeave={() => setActiveHover(null)}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isHovered
                    ? 'bg-slate-100/90 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700'
                    : 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.dotColor }}
                  />
                  <div className="flex items-center gap-1.5">
                    <Icon size={14} className={item.iconColor} />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {item.severity}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono-tech font-semibold text-slate-500 dark:text-slate-400">
                    {item.percent}%
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold font-mono-tech shadow-sm ${item.badgeBg}`}>
                    {item.count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
        <span>Active Assessment Scope</span>
        <span
          className={`font-semibold flex items-center gap-1.5 ${
            criticalCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              criticalCount > 0
                ? 'bg-rose-500 shadow-[0_0_8px_rgba(255,0,85,0.8)]'
                : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
            }`}
          />
          {criticalCount > 0 ? `${criticalCount} Actionable Critical` : '0 Critical Threats'}
        </span>
      </div>
    </GlassCard>
  );
}
