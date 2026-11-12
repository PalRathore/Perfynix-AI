import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, Eye, EyeOff, Info, KeyRound, RefreshCw, ShieldCheck } from 'lucide-react';
import GlassCard from '../common/GlassCard';
import Button from '../common/Button';
import Modal from '../common/Modal';

const MOCK_KEY = 'sk_live_9f3a7c2e1d8b4a6f0c5e2d7b9a1f3c4e';
const API_STATUS = [
  { label: 'Authentication', value: 'Protected' },
  { label: 'Authorization', value: 'Protected' },
  { label: 'HTTPS', value: 'Protected' },
  { label: 'Rate Limiting', value: 'Protected' },
];

export default function ApiKeyCard() {
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [keyTail, setKeyTail] = useState(MOCK_KEY.slice(-12));

  const masked = `sk_live_••••••••••••••••••••${keyTail}`;
  const display = revealed ? `sk_live_${keyTail}_x9f3a7c2e` : masked;

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(display); } catch { /* ignore */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleRegenerate = () => {
    const tail = Math.random().toString(16).slice(2, 14).padEnd(12, '0');
    setKeyTail(tail);
    setConfirmOpen(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }}>
      <GlassCard variant="standard" className="h-full p-6 sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="section-kicker">Developer credentials</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">API Access</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage credentials used to access the Perfynix AI API.</p>
          </div>
          <span className="hidden h-10 w-10 items-center justify-center rounded-xl bg-accent-500/10 text-accent-600 dark:text-accent-300 sm:flex"><KeyRound className="h-5 w-5" /></span>
        </div>

        {/* Key row */}
        <div className="rounded-2xl border border-slate-200/70 bg-white/40 p-4 dark:border-white/10 dark:bg-slate-950/20">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Your API Key</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <code className="overflow-x-auto whitespace-nowrap rounded-xl bg-slate-900/[0.04] px-3.5 py-2.5 font-mono-tech text-sm text-slate-700 dark:bg-white/[0.06] dark:text-slate-200">{display}</code>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={handleCopy}>
                {copied ? <motion.span key="copied" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400"><Check className="h-3.5 w-3.5" /> Copied</motion.span> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setRevealed((r) => !r)} aria-label={revealed ? 'Hide API key' : 'Reveal API key'}>
                {revealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />} {revealed ? 'Hide' : 'Reveal'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmOpen(true)}><RefreshCw className="h-3.5 w-3.5" /> Regenerate</Button>
            </div>
          </div>
        </div>

        {/* API security visualization */}
        <div className="mt-5 rounded-2xl border border-brand-500/15 bg-brand-500/[0.04] p-4">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-300"><ShieldCheck className="h-3.5 w-3.5" /> API Security</div>
          <div className="grid grid-cols-2 gap-2.5">
            {API_STATUS.map((row) => (
              <div key={row.label} className="flex items-center justify-between rounded-xl bg-white/40 px-3 py-2 dark:bg-slate-950/30">
                <span className="text-xs text-slate-500 dark:text-slate-400">{row.label}</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" /> {row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-slate-200/60 bg-white/30 p-3.5 dark:border-white/10 dark:bg-slate-950/20">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">Your API key authenticates requests to the Perfynix AI API. Keep it secret — never expose it in client-side code or public repositories.</p>
        </div>

        <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Regenerate API Key?" maxWidth="max-w-sm">
          <p className="text-sm text-slate-600 dark:text-slate-300">Your existing API key will immediately stop working. Any services using the current key will need to be updated.</p>
          <div className="mt-6 flex justify-end gap-3"><Button variant="ghost" onClick={() => setConfirmOpen(false)}>Cancel</Button><Button variant="danger" onClick={handleRegenerate}><RefreshCw className="h-4 w-4" /> Regenerate Key</Button></div>
        </Modal>
      </GlassCard>
    </motion.div>
  );
}
