import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { generatePDFReport } from '../../utils/generatePDFReport';
import { MOCK_TARGET_SUMMARY, MOCK_FINDINGS } from './mockResultsData';

export default function ResultsHeader({ summary = MOCK_TARGET_SUMMARY, findings = MOCK_FINDINGS }) {
  const navigate = useNavigate();
  const [downloadToast, setDownloadToast] = useState(false);

  const handleDownloadPDF = () => {
    generatePDFReport(summary, findings);
    setDownloadToast(true);
    setTimeout(() => setDownloadToast(false), 3000);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full min-w-0 pb-1 relative">
      {/* Title & Eyebrow */}
      <div className="space-y-1.5 min-w-0">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-md">
            <ShieldCheck size={14} className="text-cyan-500 animate-pulse" />
            Security Assessment Workspace
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Assessment Results
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed max-w-2xl">
          Automated vulnerability findings, explainable AI risk scoring, and developer remediation patches.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto flex-wrap">
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all cursor-pointer whitespace-nowrap"
        >
          <ArrowLeft size={16} />
          <span>Dashboard</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDownloadPDF}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-brand-600 via-cyan-500 to-accent-600 hover:opacity-95 shadow-md shadow-brand-500/20 border border-white/20 transition-all cursor-pointer whitespace-nowrap"
        >
          <Download size={16} />
          <span>Export PDF Report</span>
        </motion.button>
      </div>

      {/* Download Toast Notification */}
      <AnimatePresence>
        {downloadToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-3 px-4 py-2.5 rounded-xl bg-slate-900/95 text-white text-xs font-bold shadow-2xl border border-cyan-500/40 flex items-center gap-2 z-50 backdrop-blur-md"
          >
            <CheckCircle2 size={16} className="text-cyan-400" />
            <span>Perfynix AI Assessment Report downloaded successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
