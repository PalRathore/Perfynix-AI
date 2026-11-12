import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Check, X } from 'lucide-react';
import Button from '../common/Button';
import Modal from '../common/Modal';

const RULES = [
  { test: (p) => p.length >= 8, label: 'At least 8 characters' },
  { test: (p) => /[A-Z]/.test(p), label: 'One uppercase letter' },
  { test: (p) => /[a-z]/.test(p), label: 'One lowercase letter' },
  { test: (p) => /[0-9]/.test(p), label: 'One number' },
];

export default function ChangePasswordModal({ open, onClose }) {
  const [show, setShow] = useState({ cur: true, new: true, conf: true });
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const reset = () => {
    setForm({ current: '', next: '', confirm: '' });
    setError('');
    setSuccess(false);
  };

  const handleClose = () => {
    reset();
    onClose?.();
  };

  const passed = RULES.filter((r) => r.test(form.next));
  const allRulesPass = passed.length === RULES.length;

  const handleSubmit = (e) => {
    e?.preventDefault();
    setError('');
    if (!form.current || !form.next || !form.confirm) {
      setError('All fields are required.');
      return;
    }
    if (!allRulesPass) {
      setError('New password does not meet all requirements.');
      return;
    }
    if (form.next !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setSuccess(true);
    setTimeout(handleClose, 1200);
  };

  return (
    <Modal open={open} onClose={handleClose} title="Change Password" maxWidth="max-w-md">
      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-3 py-8 text-center"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/15 text-green-600 dark:text-green-400">
            <Check className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Password updated successfully
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordField
            label="Current Password"
            value={form.current}
            show={show.cur}
            onToggle={() => setShow({ ...show, cur: !show.cur })}
            onChange={(v) => setForm({ ...form, current: v })}
          />
          <PasswordField
            label="New Password"
            value={form.next}
            show={show.new}
            onToggle={() => setShow({ ...show, new: !show.new })}
            onChange={(v) => setForm({ ...form, next: v })}
          />
          <PasswordField
            label="Confirm Password"
            value={form.confirm}
            show={show.conf}
            onToggle={() => setShow({ ...show, conf: !show.conf })}
            onChange={(v) => setForm({ ...form, confirm: v })}
          />

          {/* Password rules */}
          <div className="rounded-xl border border-slate-200/70 bg-white/40 p-3 dark:border-white/10 dark:bg-slate-900/30">
            <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              Password requirements
            </p>
            <ul className="grid grid-cols-2 gap-1.5">
              {RULES.map((r) => {
                const ok = r.test(form.next);
                return (
                  <li
                    key={r.label}
                    className={`flex items-center gap-1.5 text-xs ${
                      ok ? 'text-green-600 dark:text-green-400' : 'text-slate-400'
                    }`}
                  >
                    {ok ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <X className="h-3.5 w-3.5" />
                    )}
                    {r.label}
                  </li>
                );
              })}
            </ul>
          </div>

          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <Lock className="h-4 w-4" />
              Update Password
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

function PasswordField({ label, value, show, onToggle, onChange }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          style={{ WebkitTextSecurity: show ? 'none' : 'disc' }}
          className="w-full h-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111c38] px-3.5 py-2 pr-10 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-mono-tech select-text"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-cyan-400 transition-colors z-10"
        >
          {show ? (
            <Eye className="h-4 w-4 text-brand-600 dark:text-cyan-400" />
          ) : (
            <EyeOff className="h-4 w-4 text-slate-400" />
          )}
        </button>
      </div>
    </div>
  );
}
