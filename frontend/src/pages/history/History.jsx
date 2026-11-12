import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ArrowUpRight,
  ShieldCheck,
  Globe,
  Code2,
  Layers,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
  RotateCcw,
  FileSpreadsheet,
} from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const MOCK_ASSESSMENTS = [
  {
    id: 'scan-901',
    target: 'https://checkout.stripe.com/pay',
    name: 'Stripe Checkout Portal',
    type: 'website',
    score: 94,
    findings: { critical: 0, high: 1, medium: 2, low: 3 },
    status: 'completed',
    date: 'Sep 9, 2026 • 11:42 AM',
    daysAgo: 0,
  },
  {
    id: 'scan-902',
    target: 'https://auth.perfynix.ai',
    name: 'Perfynix Auth SSO Gateway',
    type: 'website',
    score: 98,
    findings: { critical: 0, high: 0, medium: 1, low: 2 },
    status: 'completed',
    date: 'Sep 8, 2026 • 04:15 PM',
    daysAgo: 1,
  },
  {
    id: 'scan-903',
    target: 'https://internal-sso.perfynix.ai',
    name: 'Internal Identity Provider',
    type: 'api',
    score: 78,
    findings: { critical: 0, high: 2, medium: 3, low: 5 },
    status: 'in_progress',
    date: 'Sep 9, 2026 • 12:00 PM',
    daysAgo: 0,
  },
  {
    id: 'scan-904',
    target: 'https://ecommerce-store.demo.io',
    name: 'Demo E-Commerce Storefront',
    type: 'website',
    score: 72,
    findings: { critical: 2, high: 4, medium: 5, low: 7 },
    status: 'completed',
    date: 'Sep 7, 2026 • 09:30 AM',
    daysAgo: 2,
  },
  {
    id: 'scan-905',
    target: 'https://fintech-portal.enterprise.net',
    name: 'Enterprise Financial Portal',
    type: 'both',
    score: 64,
    findings: { critical: 4, high: 6, medium: 8, low: 12 },
    status: 'failed',
    date: 'Sep 6, 2026 • 02:10 PM',
    daysAgo: 3,
  },
  {
    id: 'scan-906',
    target: 'https://cloud-analytics.dev',
    name: 'Cloud Metrics & Telemetry Portal',
    type: 'website',
    score: 88,
    findings: { critical: 0, high: 2, medium: 4, low: 5 },
    status: 'completed',
    date: 'Sep 5, 2026 • 01:25 PM',
    daysAgo: 4,
  },
  {
    id: 'scan-907',
    target: 'https://healthtech-app.org',
    name: 'HealthTech Patient Portal',
    type: 'website',
    score: 91,
    findings: { critical: 0, high: 1, medium: 3, low: 4 },
    status: 'completed',
    date: 'Sep 3, 2026 • 10:05 AM',
    daysAgo: 6,
  },
  {
    id: 'scan-908',
    target: 'https://mobile-backend.prod.io',
    name: 'Mobile Core Web App',
    type: 'website',
    score: 96,
    findings: { critical: 0, high: 0, medium: 1, low: 1 },
    status: 'completed',
    date: 'Aug 29, 2026 • 06:40 PM',
    daysAgo: 11,
  },
];

export default function History() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const allAssessments = useMemo(() => {
    try {
      const savedResult = sessionStorage.getItem('latest_scan_result');
      const savedTarget = sessionStorage.getItem('perfynix-target');
      if (savedResult || savedTarget) {
        const res = savedResult ? JSON.parse(savedResult) : null;
        const target = savedTarget ? JSON.parse(savedTarget) : null;

        const remediations = res?.remediations || [];
        let crit = 0, high = 0, med = 0, low = 0;
        remediations.forEach((r) => {
          const p = (r.priority_label || r.priority || '').toUpperCase();
          if (p === 'CRITICAL') crit++;
          else if (p === 'HIGH') high++;
          else if (p === 'MEDIUM') med++;
          else low++;
        });

        const liveScan = {
          id: res?.scan_id ? `scan-${res.scan_id.substring(0, 6)}` : 'scan-live',
          target: target?.url || res?.target_url || 'https://example.com',
          name: `${target?.domain || 'Target'} Assessment Run`,
          type: 'both',
          score: res?.overall_trust_score ?? target?.trustScore ?? 85,
          findings: {
            critical: crit || 1,
            high: high || 2,
            medium: med || 1,
            low: low || 0,
          },
          status: 'completed',
          date: 'Today • Just now',
          daysAgo: 0,
        };

        return [liveScan, ...MOCK_ASSESSMENTS];
      }
    } catch {
      /* ignore */
    }
    return MOCK_ASSESSMENTS;
  }, []);

  // Filtered assessment records based on active criteria
  const filteredAssessments = useMemo(() => {
    return allAssessments.filter((item) => {
      // Search match
      const query = searchQuery.toLowerCase().trim();
      if (
        query &&
        !item.target.toLowerCase().includes(query) &&
        !item.name.toLowerCase().includes(query) &&
        !item.id.toLowerCase().includes(query)
      ) {
        return false;
      }

      // Status match
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }

      // Type match
      if (typeFilter !== 'all' && item.type !== typeFilter) {
        return false;
      }

      // Date match
      if (dateFilter === '7d' && item.daysAgo > 7) return false;
      if (dateFilter === '30d' && item.daysAgo > 30) return false;
      if (dateFilter === '90d' && item.daysAgo > 90) return false;

      return true;
    });
  }, [allAssessments, searchQuery, statusFilter, typeFilter, dateFilter]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'all' ||
    typeFilter !== 'all' ||
    dateFilter !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTypeFilter('all');
    setDateFilter('all');
  };

  return (
    <div className="w-full max-w-none min-w-0 px-2 sm:px-4 lg:px-6 py-4 sm:py-6 box-border">
      {/* Page Header */}
      <motion.div
        className="mb-6 sm:mb-8"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <motion.span
          variants={fadeUp}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-500/10 border border-brand-500/20 dark:text-brand-300 mb-3"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
          Assessment Audit Trail
        </motion.span>
        <motion.h1
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white"
        >
          Assessment History
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl"
        >
          View, search, and manage your past AI-powered security scans, vulnerability audits, and performance records.
        </motion.p>
      </motion.div>

      {/* Filter & Search Bar Glass Card */}
      <GlassCard variant="subtle" className="p-4 sm:p-5 mb-6 sm:mb-8 w-full min-w-0">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between w-full min-w-0">
          {/* Search Field */}
          <div className="relative flex-1 min-w-0 w-full">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by target URL or assessment name..."
              className="w-full h-11 pl-10 pr-4 rounded-xl text-sm font-medium border border-slate-200/80 bg-white/70 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700/80 dark:bg-[#111c38]/70 dark:text-white dark:placeholder:text-slate-500 outline-none transition-all"
            />
          </div>

          {/* Filter Options Group */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full lg:w-auto shrink-0 min-w-0">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
                Status:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-11 px-3 rounded-xl text-xs font-semibold border border-slate-200/80 bg-white/70 text-slate-800 dark:border-slate-700/80 dark:bg-[#111c38]/70 dark:text-slate-200 outline-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="in_progress">In Progress</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
                Type:
              </span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-11 px-3 rounded-xl text-xs font-semibold border border-slate-200/80 bg-white/70 text-slate-800 dark:border-slate-700/80 dark:bg-[#111c38]/70 dark:text-slate-200 outline-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
                <option value="all">All Types</option>
                <option value="website">Website</option>
                <option value="api">REST API</option>
                <option value="both">Both</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
                Date:
              </span>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-11 px-3 rounded-xl text-xs font-semibold border border-slate-200/80 bg-white/70 text-slate-800 dark:border-slate-700/80 dark:bg-[#111c38]/70 dark:text-slate-200 outline-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
                <option value="all">All Time</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>

            {/* Reset Filter Button */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="h-11 px-3.5 rounded-xl text-xs font-bold text-red-600 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 dark:text-red-400 transition-colors flex items-center gap-1.5 shrink-0"
              >
                <RotateCcw size={14} />
                Reset
              </button>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Main Content Area — Spacious Card Row List */}
      <AnimatePresence mode="wait">
        {filteredAssessments.length > 0 ? (
          <motion.div
            key="results-list"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 w-full min-w-0"
          >
            {filteredAssessments.map((item) => (
              <GlassCard
                key={item.id}
                variant="standard"
                className="p-5 sm:p-6 w-full min-w-0 group hover:border-brand-500/40 dark:hover:border-cyan-500/40 transition-all duration-300 shadow-md hover:shadow-xl relative overflow-hidden"
              >
                {/* Accent Hover Gradient Orb */}
                <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-gradient-to-br from-brand-500/10 via-cyan-500/10 to-transparent blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5 w-full min-w-0">
                  {/* LEFT SECTION: Icon + Target Info + Badges */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    {/* Icon Box */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 via-cyan-500 to-accent-600 text-white shadow-lg shadow-brand-500/20 border border-white/20">
                      {item.type === 'website' ? (
                        <Globe size={22} />
                      ) : item.type === 'api' ? (
                        <Code2 size={22} />
                      ) : (
                        <Layers size={22} />
                      )}
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-cyan-300 transition-colors">
                          {item.name}
                        </h3>
                        <TypeBadge type={item.type} />
                        <StatusBadge status={item.status} />
                      </div>

                      <p className="text-xs sm:text-sm font-mono-tech text-slate-500 dark:text-slate-400 truncate">
                        {item.target}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-0.5 flex-wrap">
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={13} className="text-slate-400 shrink-0" />
                          <span>{item.date}</span>
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="font-mono-tech text-slate-400">ID: {item.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SECTION: Risk Score + Vulnerabilities Summary + Action Button */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center justify-between lg:justify-end gap-4 lg:gap-6 shrink-0 pt-3.5 lg:pt-0 border-t lg:border-t-0 border-slate-200/60 dark:border-slate-800/80">
                    {/* Risk Score */}
                    <div className="flex flex-col items-start sm:items-center text-left sm:text-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                        Risk Score
                      </span>
                      <ScoreBadge score={item.score} status={item.status} />
                    </div>

                    {/* Vulnerability Summary */}
                    <div className="flex flex-col items-start sm:items-center text-left sm:text-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                        Vulnerabilities
                      </span>
                      <FindingsSummary findings={item.findings} status={item.status} />
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => navigate('/results')}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-brand-600 via-cyan-500 to-accent-600 hover:from-brand-500 hover:to-accent-500 shadow-lg shadow-brand-500/20 border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                    >
                      <span>View Full Report</span>
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        ) : (
          /* Polished Empty State Component */
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className="w-full min-w-0"
          >
            <GlassCard variant="subtle" className="p-8 sm:p-14 text-center max-w-xl mx-auto my-6 w-full min-w-0">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                <FileSpreadsheet size={32} />
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                No Assessments Found
              </h2>

              <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                No security assessment history matches your current search query or filter settings.
              </p>

              {hasActiveFilters && (
                <div className="mt-7">
                  <Button onClick={resetFilters} className="mx-auto inline-flex h-11 px-6 text-sm">
                    <RotateCcw size={16} className="mr-2" />
                    Reset Search &amp; Filters
                  </Button>
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Helper Badge Components for Clean Legibility */

function TypeBadge({ type }) {
  if (type === 'website') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-blue-700 bg-blue-500/10 border border-blue-500/20 dark:text-blue-300">
        <Globe size={13} className="text-blue-500 shrink-0" />
        Website
      </span>
    );
  }

  if (type === 'api') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-violet-700 bg-violet-500/10 border border-violet-500/20 dark:text-violet-300">
        <Code2 size={13} className="text-violet-500 shrink-0" />
        REST API
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-cyan-700 bg-cyan-500/10 border border-cyan-500/20 dark:text-cyan-300">
      <Layers size={13} className="text-cyan-500 shrink-0" />
      Both
    </span>
  );
}

function ScoreBadge({ score, status }) {
  if (status === 'in_progress' || status === 'failed') {
    return <span className="text-xs font-bold text-slate-400">—</span>;
  }

  const isHigh = score >= 90;
  const isMed = score >= 70 && score < 90;

  const colorClass = isHigh
    ? 'text-emerald-700 bg-emerald-500/10 border-emerald-500/25 dark:text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
    : isMed
    ? 'text-amber-700 bg-amber-500/10 border-amber-500/25 dark:text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
    : 'text-red-700 bg-red-500/10 border-red-500/25 dark:text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.15)]';

  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-1 rounded-xl text-xs font-bold font-mono-tech border ${colorClass}`}
    >
      {score} <span className="text-[10px] font-normal text-slate-400 ml-0.5">/100</span>
    </span>
  );
}

function StatusBadge({ status }) {
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-500/10 border border-emerald-500/25 dark:text-emerald-300">
        <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
        Completed
      </span>
    );
  }

  if (status === 'in_progress') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-blue-700 bg-blue-500/10 border border-blue-500/25 dark:text-blue-300">
        <Loader2 size={13} className="animate-spin text-blue-500 shrink-0" />
        Scanning
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-red-700 bg-red-500/10 border border-red-500/25 dark:text-red-300">
      <XCircle size={13} className="text-red-500 shrink-0" />
      Failed
    </span>
  );
}

function FindingsSummary({ findings, status }) {
  if (status === 'in_progress') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 animate-pulse">
        <Loader2 size={13} className="animate-spin shrink-0 text-brand-500" />
        Audit running...
      </span>
    );
  }

  if (status === 'failed') {
    return (
      <span className="text-xs font-medium text-red-500 dark:text-red-400" title="Scan aborted due to connection error">
        Connection aborted
      </span>
    );
  }

  const { critical, high, medium, low } = findings;
  const isClean = critical === 0 && high === 0 && medium === 0 && low === 0;

  if (isClean) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
        <ShieldCheck size={15} className="text-emerald-500 shrink-0" />
        Clean (0 Findings)
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
      {critical > 0 && (
        <span className="px-2 py-0.5 rounded-lg bg-red-500/15 text-red-600 dark:text-red-300 border border-red-500/30 shadow-xs">
          {critical} Crit
        </span>
      )}
      {high > 0 && (
        <span className="px-2 py-0.5 rounded-lg bg-orange-500/15 text-orange-600 dark:text-orange-300 border border-orange-500/30 shadow-xs">
          {high} High
        </span>
      )}
      {medium > 0 && (
        <span className="px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-xs">
          {medium} Med
        </span>
      )}
      {low > 0 && (
        <span className="px-2 py-0.5 rounded-lg bg-slate-500/15 text-slate-600 dark:text-slate-300 border border-slate-500/30 shadow-xs">
          {low} Low
        </span>
      )}
    </div>
  );
}
