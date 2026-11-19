import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import TargetOverview from '../../components/dashboard/TargetOverview';
import DashboardKpiCard from '../../components/dashboard/DashboardKpiCard';
import CRSIGauge from '../../components/dashboard/CRSIGauge';
import SHAPDriverChart from '../../components/dashboard/SHAPDriverChart';
import SeverityDistribution from '../../components/dashboard/SeverityDistribution';
import TopPriorityFindings from '../../components/dashboard/TopPriorityFindings';
import AssessmentCoverage from '../../components/dashboard/AssessmentCoverage';
import AIRecommendationsCTA from '../../components/dashboard/AIRecommendationsCTA';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const getCurrentFormattedTime = () => {
  const now = new Date();
  return `Today, ${now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}`;
};

// Rich local mock dataset for scanned target
const MOCK_DASHBOARD_DATA = {
  target: {
    domain: 'example.com',
    ip: '93.184.216.34',
    httpStatus: '200 OK',
    scannedAt: getCurrentFormattedTime(),
    scannedRelative: 'Just now',
  },
  kpis: {
    lighthouse: {
      score: 92,
      lcp: '1.8s',
      cls: '0.04',
      tbt: '120ms',
    },
    securityHeaders: {
      passed: 7,
      total: 10,
      missing: 3,
    },
    sslTls: {
      protocol: 'TLS 1.3',
      cipher: 'Strong',
      daysRemaining: 82,
    },
  },
  crsi: {
    score: 87,
    priority: 'HIGH',
    summary: 'Security assessment completed across active scanner modules and security headers.',
    confidence: '99.86%',
  },
  shapDrivers: [
    { key: 'kev_status', label: 'KEV Status (Known Exploited)', weight: 0.38, gradient: 'from-blue-600 via-cyan-500 to-violet-600', detail: 'Match in CISA Known Exploited Vulnerabilities catalog (+0.38 SHAP weight)' },
    { key: 'epss_score', label: 'EPSS Exploit Score', weight: 0.29, gradient: 'from-blue-500 via-cyan-400 to-indigo-500', detail: 'High 89th percentile active exploitation prediction probability (+0.29 SHAP weight)' },
    { key: 'cvss_score', label: 'CVSS Severity Rating', weight: 0.22, gradient: 'from-brand-600 via-blue-500 to-violet-500', detail: 'CVSS v3.1 base severity rating calculation (+0.22 SHAP weight)' },
    { key: 'cvss_epss_divergence', label: 'CVSS/EPSS Divergence', weight: 0.18, gradient: 'from-cyan-500 via-blue-500 to-accent-600', detail: 'Priority divergence indicator between theoretical severity & active exploitation (+0.18 SHAP weight)' },
  ],
  severityDistribution: [
    { severity: 'Critical', count: 0, dotColor: '#DC2626' },
    { severity: 'High', count: 2, dotColor: '#EA580C' },
    { severity: 'Medium', count: 3, dotColor: '#CA8A04' },
    { severity: 'Low', count: 1, dotColor: '#0891B2' },
  ],
};

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

export default function Dashboard() {
  const location = useLocation();
  const passedTarget = location.state?.target || (() => {
    try {
      const saved = sessionStorage.getItem('perfynix-target');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const realScanResult = useMemo(() => {
    try {
      const saved = sessionStorage.getItem('latest_scan_result');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, []);

  const selectedScanners = useMemo(() => {
    if (passedTarget?.selectedScanners && Array.isArray(passedTarget.selectedScanners)) {
      return passedTarget.selectedScanners;
    }
    if (realScanResult?.selected_scanners && Array.isArray(realScanResult.selected_scanners)) {
      return realScanResult.selected_scanners;
    }
    try {
      const saved = sessionStorage.getItem('perfynix-target');
      const parsed = saved ? JSON.parse(saved) : null;
      if (parsed?.selectedScanners && Array.isArray(parsed.selectedScanners)) {
        return parsed.selectedScanners;
      }
    } catch {
      /* ignore */
    }
    return ['lighthouse', 'zap', 'headers', 'ssl'];
  }, [passedTarget, realScanResult]);

  const formatScannedData = (target) => {
    const currentFormattedTime = getCurrentFormattedTime();

    if (!target) {
      return {
        ...MOCK_DASHBOARD_DATA.target,
        scannedAt: currentFormattedTime,
        scannedRelative: 'Just now',
      };
    }

    let scannedAt = target.scannedAt;
    let scannedRelative = target.scannedRelative;

    if (target.timestamp) {
      const elapsedMs = Date.now() - target.timestamp;
      const elapsedMins = Math.floor(elapsedMs / 60000);

      const dateObj = new Date(target.timestamp);
      const timeStr = dateObj.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
      scannedAt = `Today, ${timeStr}`;

      if (elapsedMins < 1) {
        scannedRelative = 'Just now';
      } else if (elapsedMins < 60) {
        scannedRelative = `${elapsedMins} min ago`;
      } else {
        const hours = Math.floor(elapsedMins / 60);
        scannedRelative = `${hours}h ago`;
      }
    } else if (!scannedAt || scannedAt === 'Just now' || scannedAt.includes('2:42')) {
      scannedAt = currentFormattedTime;
      scannedRelative = 'Just now';
    }

    return {
      ...MOCK_DASHBOARD_DATA.target,
      domain: target.domain || MOCK_DASHBOARD_DATA.target.domain,
      scannedAt: scannedAt || currentFormattedTime,
      scannedRelative: scannedRelative || 'Just now',
    };
  };

  const data = useMemo(() => {
    const formattedTarget = formatScannedData(passedTarget);

    if (!realScanResult) {
      return {
        ...MOCK_DASHBOARD_DATA,
        target: formattedTarget,
        topFindings: [],
      };
    }

    const lh = realScanResult.assessment?.lighthouse || {};
    const hdr = realScanResult.assessment?.headers || {};
    const ssl = realScanResult.assessment?.ssl || {};
    const trustScore = realScanResult.overall_trust_score ?? 80;
    const remediations = realScanResult.remediations || [];

    let criticalCount = 0, highCount = 0, mediumCount = 0, lowCount = 0;
    const formattedTopFindings = [];

    remediations.forEach((r, idx) => {
      const p = (r.priority_label || r.priority || '').toUpperCase();
      if (p === 'CRITICAL') criticalCount++;
      else if (p === 'HIGH') highCount++;
      else if (p === 'MEDIUM') mediumCount++;
      else lowCount++;

      if (idx < 3) {
        formattedTopFindings.push({
          id: `top-${idx + 1}`,
          title: r.finding_title || r.title || 'Security Finding',
          cwe: r.cwe_id || 'CWE-693',
          source: (r.cwe_id || '').includes('295') ? 'SSL/TLS' : 'Security Headers',
          severity: p || 'MEDIUM',
          confidence: '99.2%',
        });
      }
    });

    const calculatedPriority =
      criticalCount > 0
        ? 'CRITICAL'
        : highCount > 0 || trustScore < 70
        ? 'HIGH'
        : trustScore < 85
        ? 'MEDIUM'
        : 'LOW';

    const threatSummary =
      criticalCount > 0
        ? `Critical security vulnerabilities identified on ${formattedTarget.domain}. Immediate mitigation recommended.`
        : highCount > 0
        ? `High-priority security directives (e.g. CSP/HSTS) missing on ${formattedTarget.domain}.`
        : mediumCount > 0
        ? `Moderate security exposure on ${formattedTarget.domain}. Standard server hardening directives suggested.`
        : `Strong security posture detected on ${formattedTarget.domain}. Minimal findings identified across scanners.`;

    return {
      target: {
        ...formattedTarget,
        domain: realScanResult.target_url ? new URL(realScanResult.target_url).hostname : formattedTarget.domain,
      },
      kpis: {
        lighthouse: {
          score: lh.performance_score !== undefined && lh.performance_score !== null ? Math.round(lh.performance_score) : MOCK_DASHBOARD_DATA.kpis.lighthouse.score,
          lcp: lh.lcp_ms ? `${(lh.lcp_ms / 1000).toFixed(1)}s` : (lh.lcp || MOCK_DASHBOARD_DATA.kpis.lighthouse.lcp),
          cls: lh.cls_score !== undefined && lh.cls_score !== null ? String(lh.cls_score) : (lh.cls || MOCK_DASHBOARD_DATA.kpis.lighthouse.cls),
          tbt: lh.tbt_ms !== undefined && lh.tbt_ms !== null ? `${Math.round(lh.tbt_ms)}ms` : (lh.tbt || MOCK_DASHBOARD_DATA.kpis.lighthouse.tbt),
        },
        securityHeaders: {
          passed: hdr.score !== undefined && hdr.score !== null ? Math.round((hdr.score / 100) * 10) : MOCK_DASHBOARD_DATA.kpis.securityHeaders.passed,
          total: 10,
          missing: hdr.findings ? hdr.findings.length : (hdr.missing ? hdr.missing.length : MOCK_DASHBOARD_DATA.kpis.securityHeaders.missing),
        },
        sslTls: {
          protocol: ssl.tls_version || ssl.protocol || MOCK_DASHBOARD_DATA.kpis.sslTls.protocol,
          cipher: (ssl.is_valid || ssl.valid) ? 'Strong' : 'Weak / Missing',
          daysRemaining: ssl.days_to_expiry ?? ssl.days_remaining ?? MOCK_DASHBOARD_DATA.kpis.sslTls.daysRemaining,
        },
      },
      crsi: {
        score: trustScore,
        priority: calculatedPriority,
        summary: threatSummary,
        confidence: '99.86%',
      },
      shapDrivers: MOCK_DASHBOARD_DATA.shapDrivers,
      severityDistribution: [
        { severity: 'Critical', count: criticalCount, dotColor: '#DC2626' },
        { severity: 'High', count: highCount, dotColor: '#EA580C' },
        { severity: 'Medium', count: mediumCount, dotColor: '#CA8A04' },
        { severity: 'Low', count: lowCount, dotColor: '#0891B2' },
      ],
      topFindings: formattedTopFindings,
    };
  }, [passedTarget, realScanResult]);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-none min-w-0 px-2 sm:px-4 lg:px-6 py-4 sm:py-6 box-border space-y-6 sm:space-y-7"
    >
      {/* 1. Compact Dashboard Header */}
      <motion.div variants={cardItem}>
        <DashboardHeader lastScanned={data.target.scannedAt} />
      </motion.div>

      {/* 2. Target Overview Glass Card */}
      <motion.div variants={cardItem}>
        <TargetOverview target={data.target} />
      </motion.div>

      {/* 3. 3 Core KPI Cards (Performance, Security Headers, SSL/TLS) */}
      <motion.div variants={cardItem}>
        <DashboardKpiCard kpis={data.kpis} selectedScanners={selectedScanners} />
      </motion.div>

      {/* 4. CRSI Primary Intelligence Centerpiece */}
      <motion.div variants={cardItem}>
        <CRSIGauge
          score={data.crsi.score}
          priority={data.crsi.priority}
          summary={data.crsi.summary}
          confidence={data.crsi.confidence}
        />
      </motion.div>

      {/* 5. SHAP Explainability & Severity Distribution Analytics (Side-by-Side) */}
      <motion.div
        variants={cardItem}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch"
      >
        <SHAPDriverChart drivers={data.shapDrivers} />
        <SeverityDistribution data={data.severityDistribution} />
      </motion.div>

      {/* 6. Top Priority Findings & AI Remediation CTA */}
      <motion.div
        variants={cardItem}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch"
      >
        <TopPriorityFindings findings={data.topFindings} />
        <AIRecommendationsCTA />
      </motion.div>

      {/* 7. Assessment Coverage Multi-Engine Status Strip */}
      <motion.div variants={cardItem}>
        <AssessmentCoverage selectedScanners={selectedScanners} />
      </motion.div>
    </motion.div>
  );
}
