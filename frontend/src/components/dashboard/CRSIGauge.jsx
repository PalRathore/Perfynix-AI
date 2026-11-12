import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Shield, AlertTriangle, Cpu, Activity } from 'lucide-react';
import GlassCard from '../common/GlassCard';

function AnimatedNumber({ value, duration = 900 }) {
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(shouldReduceMotion ? value : 0);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(value);
      return;
    }

    let startTimestamp = null;
    const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      const current = Math.floor(numericValue * easeOutQuad);
      setDisplayValue(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(numericValue);
      }
    };

    requestAnimationFrame(step);
  }, [value, duration, shouldReduceMotion]);

  return <>{displayValue}</>;
}

export default function CRSIGauge({
  score = 87,
  priority = 'CRITICAL',
  summary = 'High-confidence threat exposure detected across target application and missing security headers.',
  confidence = '99.86%',
}) {
  // Normalize priority
  const normalizedPriority = (priority || 'MEDIUM').toUpperCase();

  // Priority color configs
  const priorityConfig = {
    CRITICAL: {
      label: 'CRITICAL THREAT',
      badgeBg: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]',
      textColor: 'text-red-600 dark:text-red-400',
      icon: ShieldAlert,
      exploitLabel: 'Active Exploits Detected',
      exploitColor: 'text-red-600 dark:text-red-400',
    },
    HIGH: {
      label: 'HIGH THREAT',
      badgeBg: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]',
      textColor: 'text-orange-600 dark:text-orange-400',
      icon: AlertTriangle,
      exploitLabel: 'Elevated Risk Factors',
      exploitColor: 'text-orange-600 dark:text-orange-400',
    },
    MEDIUM: {
      label: 'MODERATE RISK',
      badgeBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]',
      textColor: 'text-amber-600 dark:text-amber-400',
      icon: Shield,
      exploitLabel: 'Policy Hardening Needed',
      exploitColor: 'text-amber-600 dark:text-amber-400',
    },
    LOW: {
      label: 'LOW THREAT',
      badgeBg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      icon: ShieldCheck,
      exploitLabel: 'Strong Posture',
      exploitColor: 'text-emerald-600 dark:text-emerald-400',
    },
  }[normalizedPriority] || {
    label: 'MODERATE RISK',
    badgeBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
    textColor: 'text-amber-600 dark:text-amber-400',
    icon: Shield,
    exploitLabel: 'Audit Complete',
    exploitColor: 'text-amber-600 dark:text-amber-400',
  };

  const PriorityIcon = priorityConfig.icon;

  // Semi-circle radial arc geometry (180 deg gauge)
  const radius = 80;
  const strokeWidth = 14;
  const circumference = Math.PI * radius; // Arc perimeter for semi-circle
  const fillPercentage = Math.min(Math.max(score, 0), 100) / 100;
  const strokeDashoffset = circumference * (1 - fillPercentage);

  const crsiFactors = [
    { key: 'cvss', name: 'CVSS Base Severity', shortName: 'CVSS', weight: 40, rawScore: '8.8 / 10', gradient: 'from-blue-600 to-indigo-600' },
    { key: 'epss', name: 'EPSS Exploit Prediction', shortName: 'EPSS', weight: 35, rawScore: '0.89 (89th %ile)', gradient: 'from-cyan-500 to-blue-600' },
    { key: 'kev', name: 'CISA KEV Catalog Match', shortName: 'KEV', weight: 25, rawScore: 'Active Match', gradient: 'from-violet-600 to-cyan-500' },
    { key: 'recency', name: 'Threat Exposure Recency', shortName: 'Recency', weight: 5, rawScore: 'Immediate', gradient: 'from-indigo-500 to-violet-500' },
  ];

  return (
    <GlassCard variant="elevated" className="p-6 sm:p-8 w-full min-w-0 relative overflow-hidden">
      {/* Background Subtle Glow Orbs */}
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-gradient-to-br from-brand-600/15 via-cyan-500/10 to-accent-600/15 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-gradient-to-tr from-accent-600/10 via-brand-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-200/60 dark:border-slate-800/80 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide text-accent-700 bg-accent-500/10 border border-accent-500/20 dark:text-cyan-300">
              <Cpu size={13} className="text-cyan-500" />
              AI Risk Intelligence
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Composite Risk Score Index (CRSI)
          </h3>
        </div>

        {/* Priority Badge & Confidence */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wide">
              AI Confidence
            </span>
            <span className="text-xs font-mono-tech font-semibold text-emerald-600 dark:text-emerald-400">
              {confidence}
            </span>
          </div>

          <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-xs font-semibold uppercase tracking-wide border ${priorityConfig.badgeBg}`}>
            <PriorityIcon size={15} />
            {normalizedPriority} RISK
          </span>
        </div>
      </div>

      {/* Balanced 3-Column Layout on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10 my-2">
        {/* COLUMN 1: CRSI Gauge Arc (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-4 sm:p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50 h-full">
          <div className="relative w-60 h-34 flex items-center justify-center my-2">
            <svg viewBox="0 0 200 115" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="crsiArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="50%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
                <filter id="crsiGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Track Arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                className="text-slate-200/80 dark:text-slate-800/80"
              />

              {/* Animated Gradient Arc */}
              <motion.path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="url(#crsiArcGrad)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                filter="url(#crsiGlow)"
              />
            </svg>

            {/* Central Score Overlay */}
            <div className="absolute top-14 flex flex-col items-center justify-center text-center">
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono-tech leading-none"
              >
                <AnimatedNumber value={score} duration={900} />
              </motion.span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                OUT OF 100
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">
            <Activity size={14} className="text-cyan-500" />
            <span>Composite Risk Score Index</span>
          </div>
        </div>

        {/* COLUMN 2: Risk Posture (4 Cols) */}
        <div className="lg:col-span-4 space-y-4 p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50 h-full flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 block mb-1">
              Risk Posture &amp; Threat Analysis
            </span>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xl font-bold ${priorityConfig.textColor}`}>
                {priorityConfig.label}
              </span>
              <span className="text-xs font-mono-tech font-semibold text-slate-400">({score}/100)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {summary}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[11px] font-medium text-slate-400 block">Model Certainty</span>
              <span className="font-semibold font-mono-tech text-emerald-600 dark:text-emerald-400">{confidence}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[11px] font-medium text-slate-400 block">Threat Status</span>
              <span className={`font-semibold ${priorityConfig.exploitColor}`}>{priorityConfig.exploitLabel}</span>
            </div>
          </div>
        </div>

        {/* COLUMN 3: CRSI Component Factor Breakdown — Vertical Bar Chart (4 Cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              CRSI Factor Weights
            </span>
            <span className="text-[10px] font-mono-tech text-cyan-600 dark:text-cyan-400 font-semibold">
              100% Total
            </span>
          </div>

          {/* Rectangular Vertical Bar Chart Graphic */}
          <div className="relative w-full h-44 pt-4 pb-2 px-2 flex flex-col justify-between">
            {/* Background Horizontal Grid Lines */}
            <div className="absolute inset-x-2 top-8 bottom-8 flex flex-col justify-between pointer-events-none opacity-40">
              <div className="border-b border-dashed border-slate-300 dark:border-slate-700 w-full" />
              <div className="border-b border-dashed border-slate-300 dark:border-slate-700 w-full" />
              <div className="border-b border-dashed border-slate-300 dark:border-slate-700 w-full" />
            </div>

            {/* Bar Columns Grid */}
            <div className="grid grid-cols-4 gap-3 items-end h-32 relative z-10 border-b border-slate-300/80 dark:border-slate-700/80 pb-0.5">
              {crsiFactors.map((factor, index) => {
                const heightPercentage = Math.round((factor.weight / 40) * 100);

                return (
                  <div key={factor.key} className="flex flex-col items-center justify-end h-full w-full group relative">
                    {/* Value Badge on top of rectangular bar */}
                    <span className="text-[11px] font-mono-tech font-bold text-slate-800 dark:text-slate-200 mb-1 transition-transform duration-200 group-hover:-translate-y-0.5">
                      {factor.weight}%
                    </span>

                    {/* Rectangular Bar Container & Animated Column */}
                    <div className="w-full max-w-[44px] h-full flex flex-col justify-end bg-slate-100/60 dark:bg-slate-800/40 rounded-t-sm overflow-hidden p-0.5">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercentage}%` }}
                        transition={{ duration: 0.85, delay: 0.12 * index, ease: [0.22, 1, 0.36, 1] }}
                        className={`w-full rounded-t-md bg-gradient-to-t ${factor.gradient} shadow-sm relative group-hover:brightness-110 transition-all`}
                      >
                        {/* Rectangular Top Highlight */}
                        <div className="h-1 w-full bg-white/40 rounded-t-md" />
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Labels under baseline */}
            <div className="grid grid-cols-4 gap-3 text-center pt-1.5 relative z-10">
              {crsiFactors.map((factor) => (
                <div key={factor.key} className="flex flex-col items-center">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {factor.shortName}
                  </span>
                  <span className="text-[9px] text-slate-400 hidden sm:block truncate max-w-full">
                    {factor.name.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
