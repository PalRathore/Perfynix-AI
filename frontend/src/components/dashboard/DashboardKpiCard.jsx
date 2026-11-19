import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Zap, ShieldCheck, Lock, CheckCircle2, AlertTriangle, Key, Shield, Ban } from 'lucide-react';
import GlassCard from '../common/GlassCard';

function AnimatedNumber({ value, duration = 800 }) {
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

export default function DashboardKpiCard({ kpis, selectedScanners = ['lighthouse', 'zap', 'headers', 'ssl'] }) {
  const isLighthouseActive = selectedScanners.includes('lighthouse');
  const isHeadersActive = selectedScanners.includes('headers');
  const isSslActive = selectedScanners.includes('ssl');

  const lighthouse = kpis?.lighthouse || {
    score: 92,
    lcp: '1.8s',
    cls: '0.04',
    tbt: '120ms',
  };

  const headers = kpis?.securityHeaders || {
    passed: 7,
    total: 10,
    missing: 3,
  };

  const ssl = kpis?.sslTls || {
    protocol: 'TLS 1.3',
    cipher: 'Strong',
    daysRemaining: 82,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 w-full min-w-0">
      {/* CARD 1 — LIGHTHOUSE PERFORMANCE */}
      <GlassCard
        variant="standard"
        className={`p-5 sm:p-6 flex flex-col justify-between group transition-all ${
          !isLighthouseActive ? 'opacity-50 grayscale-[40%]' : ''
        }`}
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:text-cyan-300 bg-brand-500/10 px-2.5 py-1 rounded-xl border border-brand-500/20">
              <Zap size={14} className="text-cyan-500" />
              Lighthouse Performance
            </span>
            <span className="text-[11px] font-mono-tech font-semibold text-slate-400">
              {isLighthouseActive ? 'Core Web Vitals' : 'Engine Inactive'}
            </span>
          </div>

          {isLighthouseActive ? (
            <div className="flex items-center justify-between gap-4 my-2">
              {/* Circular Gauge Visualization */}
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <defs>
                    <linearGradient id="perfGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2563EB" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="9"
                    className="text-slate-200/80 dark:text-slate-800"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="url(#perfGaugeGrad)"
                    strokeWidth="9"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{ strokeDashoffset: (2 * Math.PI * 40) * (1 - lighthouse.score / 100) }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold font-mono-tech text-slate-900 dark:text-white leading-none">
                    <AnimatedNumber value={lighthouse.score} duration={800} />
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 mt-0.5">/ 100</span>
                </div>
              </div>

              {/* Core Web Vitals Metrics */}
              <div className="flex-1 space-y-2 text-xs font-medium">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/60">
                  <span className="text-slate-500">LCP</span>
                  <span className="font-mono-tech text-emerald-600 dark:text-emerald-400 font-semibold">{lighthouse.lcp}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/60">
                  <span className="text-slate-500">CLS</span>
                  <span className="font-mono-tech text-emerald-600 dark:text-emerald-400 font-semibold">{lighthouse.cls}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/60">
                  <span className="text-slate-500">TBT</span>
                  <span className="font-mono-tech text-emerald-600 dark:text-emerald-400 font-semibold">{lighthouse.tbt}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="my-6 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-400 flex flex-col items-center gap-1.5">
              <Ban size={20} className="text-slate-400" />
              <span>Lighthouse engine excluded from scan</span>
            </div>
          )}
        </div>

        <div className="pt-3 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between font-medium border-t border-slate-200/50 dark:border-slate-800/60 mt-3">
          <span>Performance Score</span>
          <span className={isLighthouseActive ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-slate-400"}>
            {isLighthouseActive ? (lighthouse.score >= 85 ? "Good Health" : "Needs Optimization") : "Skipped"}
          </span>
        </div>
      </GlassCard>

      {/* CARD 2 — SECURITY HEADERS */}
      <GlassCard
        variant="standard"
        className={`p-5 sm:p-6 flex flex-col justify-between group transition-all ${
          !isHeadersActive ? 'opacity-50 grayscale-[40%]' : ''
        }`}
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:text-cyan-300 bg-brand-500/10 px-2.5 py-1 rounded-xl border border-brand-500/20">
              <ShieldCheck size={14} className="text-brand-500" />
              Security Headers
            </span>
            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              {isHeadersActive ? (headers.passed >= 8 ? 'Grade A' : headers.passed >= 5 ? 'Grade B+' : 'Grade C') : 'Skipped'}
            </span>
          </div>

          {isHeadersActive ? (
            <div className="my-2 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono-tech text-slate-900 dark:text-white">
                  <AnimatedNumber value={headers.passed} duration={700} /> <span className="text-sm font-semibold text-slate-400 font-sans">/ {headers.total}</span>
                </span>
                <span className="text-xs font-semibold font-mono-tech text-brand-600 dark:text-cyan-400">
                  <AnimatedNumber value={Math.round((headers.passed / headers.total) * 100)} duration={700} />% Enforced
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700/60">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(headers.passed / headers.total) * 100}%` }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full bg-gradient-to-r from-brand-600 via-cyan-500 to-emerald-500 shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-semibold pt-1">
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  <CheckCircle2 size={13} className="text-emerald-500" />
                  <span className="font-mono-tech"><AnimatedNumber value={headers.passed} duration={600} /> Passed</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                  <AlertTriangle size={13} className="text-amber-500" />
                  <span className="font-mono-tech"><AnimatedNumber value={headers.missing} duration={600} /> Missing</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="my-6 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-400 flex flex-col items-center gap-1.5">
              <Ban size={20} className="text-slate-400" />
              <span>Security headers engine excluded</span>
            </div>
          )}
        </div>

        <div className="pt-3 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between font-medium border-t border-slate-200/50 dark:border-slate-800/60 mt-3">
          <span>Headers Status</span>
          <span className={isHeadersActive ? "text-amber-600 dark:text-amber-400 font-semibold" : "text-slate-400"}>
            {isHeadersActive ? (headers.missing > 0 ? `${headers.missing} Directives Missing` : 'All Enforced') : 'Skipped'}
          </span>
        </div>
      </GlassCard>

      {/* CARD 3 — SSL / TLS */}
      <GlassCard
        variant="standard"
        className={`p-5 sm:p-6 flex flex-col justify-between group transition-all ${
          !isSslActive ? 'opacity-50 grayscale-[40%]' : ''
        }`}
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-xl border border-cyan-500/20">
              <Lock size={14} className="text-cyan-500" />
              SSL / TLS
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <Shield size={12} />
              {isSslActive ? (ssl.cipher === 'Strong' ? 'Secure' : 'Review Cipher') : 'Skipped'}
            </span>
          </div>

          {isSslActive ? (
            <div className="my-2 space-y-2 text-xs font-medium">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/60">
                <span className="text-slate-500">Protocol</span>
                <span className="font-mono-tech font-semibold text-slate-900 dark:text-white bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  {ssl.protocol}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/60">
                <span className="text-slate-500 flex items-center gap-1">
                  <Key size={13} className="text-cyan-500" /> Cipher Suite
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{ssl.cipher}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/60">
                <span className="text-slate-500">Certificate Expiry</span>
                <span className="font-semibold font-mono-tech text-emerald-600 dark:text-emerald-400">
                  <AnimatedNumber value={ssl.daysRemaining} duration={800} /> days remaining
                </span>
              </div>
            </div>
          ) : (
            <div className="my-6 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-400 flex flex-col items-center gap-1.5">
              <Ban size={20} className="text-slate-400" />
              <span>SSL / TLS engine excluded</span>
            </div>
          )}
        </div>

        <div className="pt-3 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between font-medium border-t border-slate-200/50 dark:border-slate-800/60 mt-3">
          <span>Certificate Status</span>
          <span className={isSslActive ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-slate-400"}>
            {isSslActive ? 'Valid & Encrypted' : 'Skipped'}
          </span>
        </div>
      </GlassCard>
    </div>
  );
}
