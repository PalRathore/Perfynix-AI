import { useState } from 'react';
import { KeyRound, LockKeyhole, ShieldCheck, Smartphone } from 'lucide-react';
import GlassCard from '../common/GlassCard';
import Button from '../common/Button';
import ChangePasswordModal from './ChangePasswordModal';

export default function SecurityCard({ onChangePassword }) {
  const [open, setOpen] = useState(false);
  const showPassword = () => { setOpen(true); onChangePassword?.(); };

  return (
    <GlassCard variant="standard" className="h-full p-6 sm:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="section-kicker">Account protection</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Security &amp; Authentication</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Protect your Perfynix AI account and manage authentication settings.</p>
        </div>
        <span className="hidden h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-300 sm:flex"><ShieldCheck className="h-5 w-5" /></span>
      </div>
      <div className="space-y-3">
        <SecurityRow icon={LockKeyhole} title="Password" detail="Last changed 30 days ago" action={<span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">Protected</span>} />
        <SecurityRow icon={Smartphone} title="Two-Factor Authentication" detail="Add an extra layer of protection" action={<Button variant="secondary" size="sm" onClick={() => {}}>Enable 2FA</Button>} />
      </div>
      <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.06] px-3.5 py-3 text-xs text-emerald-700 dark:text-emerald-300"><KeyRound className="h-4 w-4" /> Your account is protected by Perfynix AI security controls.</div>
    </GlassCard>
  );
}

function SecurityRow({ icon: Icon, title, detail, action }) {
  return <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/70 bg-white/30 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-slate-950/20"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-300"><Icon className="h-4 w-4" /></span><div><p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</p><p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{detail}</p></div></div>{action}</div>;
}
