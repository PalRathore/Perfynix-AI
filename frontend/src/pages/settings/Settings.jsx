import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Moon,
  Bell,
  Lock,
  LockKeyhole,
  RotateCcw,
  Check,
  CheckCircle2,
  KeyRound,
  X,
  Smartphone,
  ShieldCheck,
  AlertCircle,
  Copy,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';
import ChangePasswordModal from '../../components/profile/ChangePasswordModal';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const DEFAULT_SETTINGS = {
  // Scanner preferences
  scanScope: 'both', // 'website' | 'api' | 'both'
  autoSecurityChecks: true,
  deepVulnerabilityAnalysis: true,
  aiRecommendations: true,

  // Notifications
  notifyAssessmentCompleted: true,
  notifyCriticalAlerts: true,
  notifyScanFailure: true,
  notifyAiAnalysisCompleted: false,

  // Security
  is2FAConfigured: false,
  loginNotifications: true,
  sessionTimeout: '30m',
};

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('Settings saved successfully');
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Toggle helper
  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Scope selection helper
  const handleScopeChange = (scope) => {
    setSettings((prev) => ({ ...prev, scanScope: scope }));
  };

  // Save changes handler
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setToastMsg('Settings saved successfully');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    }, 400);
  };

  // Reset handler
  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setToastMsg('Settings reset to defaults');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  // Copy secret key helper
  const handleCopyKey = () => {
    try {
      navigator.clipboard.writeText('PERF-9021-AI-2FA-SECURE');
    } catch {
      /* ignore */
    }
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // 2FA enable handler
  const handleEnable2FA = (e) => {
    e?.preventDefault();
    if (!verificationCode || verificationCode.length < 6) {
      setToastMsg('Please enter a valid 6-digit code');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    setSettings((prev) => ({ ...prev, is2FAConfigured: true }));
    setShow2FAModal(false);
    setVerificationCode('');
    setToastMsg('Two-Factor Authentication successfully configured!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  return (
    <div className="w-full max-w-none min-w-0 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 box-border">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed top-6 right-6 z-[120] flex items-center gap-3 px-4 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 backdrop-blur-2xl shadow-2xl"
          >
            <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
            <span className="text-sm font-bold">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <ChangePasswordModal open={showPasswordModal} onClose={() => setShowPasswordModal(false)} />

      {/* 2FA Configuration Modal */}
      <AnimatePresence>
        {show2FAModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-md p-6 sm:p-7 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/95 dark:bg-[#0b1328]/95 backdrop-blur-2xl shadow-2xl"
            >
              <button
                onClick={() => setShow2FAModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-cyan-400 border border-brand-500/20">
                  <Smartphone size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Configure 2FA
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Authenticator App Verification
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                Scan the QR code below using your authenticator app (Google Authenticator, Authy, or 1Password).
              </p>

              {/* QR Graphic & Secret Key */}
              <div className="flex flex-col items-center justify-center p-4 mb-4 rounded-2xl border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-[#111c38]/70">
                <svg viewBox="0 0 100 100" className="h-32 w-32 bg-white p-2 rounded-xl shadow-md border border-slate-200">
                  <rect x="5" y="5" width="28" height="28" fill="#0f172a" rx="4" />
                  <rect x="10" y="10" width="18" height="18" fill="#ffffff" rx="2" />
                  <rect x="14" y="14" width="10" height="10" fill="#2563eb" rx="1.5" />

                  <rect x="67" y="5" width="28" height="28" fill="#0f172a" rx="4" />
                  <rect x="72" y="10" width="18" height="18" fill="#ffffff" rx="2" />
                  <rect x="76" y="14" width="10" height="10" fill="#2563eb" rx="1.5" />

                  <rect x="5" y="67" width="28" height="28" fill="#0f172a" rx="4" />
                  <rect x="10" y="72" width="18" height="18" fill="#ffffff" rx="2" />
                  <rect x="14" y="76" width="10" height="10" fill="#2563eb" rx="1.5" />

                  <rect x="40" y="6" width="6" height="6" fill="#0f172a" rx="1" />
                  <rect x="52" y="6" width="6" height="6" fill="#0f172a" rx="1" />
                  <rect x="40" y="18" width="6" height="6" fill="#2563eb" rx="1" />
                  <rect x="46" y="24" width="6" height="6" fill="#0f172a" rx="1" />
                  <rect x="58" y="18" width="6" height="6" fill="#0f172a" rx="1" />
                  <rect x="6" y="40" width="6" height="6" fill="#0f172a" rx="1" />
                  <rect x="18" y="40" width="6" height="6" fill="#0f172a" rx="1" />
                  <rect x="24" y="52" width="6" height="6" fill="#2563eb" rx="1" />
                  <rect x="40" y="40" width="20" height="20" fill="#06b6d4" rx="4" />
                  <rect x="67" y="40" width="6" height="6" fill="#0f172a" rx="1" />
                  <rect x="79" y="40" width="6" height="6" fill="#0f172a" rx="1" />
                  <rect x="85" y="52" width="6" height="6" fill="#2563eb" rx="1" />
                  <rect x="40" y="67" width="6" height="6" fill="#0f172a" rx="1" />
                  <rect x="52" y="67" width="6" height="6" fill="#2563eb" rx="1" />
                  <rect x="46" y="79" width="6" height="6" fill="#0f172a" rx="1" />
                  <rect x="58" y="85" width="6" height="6" fill="#0f172a" rx="1" />
                  <rect x="67" y="67" width="6" height="6" fill="#0f172a" rx="1" />
                  <rect x="79" y="79" width="6" height="6" fill="#2563eb" rx="1" />
                  <rect x="85" y="85" width="6" height="6" fill="#0f172a" rx="1" />

                  <circle cx="50" cy="50" r="7" fill="#ffffff" />
                  <circle cx="50" cy="50" r="5" fill="#2563eb" />
                </svg>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-600 dark:text-slate-300 font-semibold bg-slate-200/60 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg">
                    PERF-9021-AI-2FA-SECURE
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyKey}
                    className="p-1 rounded-lg text-slate-500 hover:text-brand-500 dark:hover:text-cyan-400 transition-colors"
                    title="Copy Secret Key"
                  >
                    {copiedKey ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <form onSubmit={handleEnable2FA} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Verification Code
                    </label>
                    <button
                      type="button"
                      onClick={() => setVerificationCode('123456')}
                      className="text-[11px] font-semibold text-brand-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <Sparkles size={12} /> Auto-fill Demo (123456)
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter 6-digit code (e.g. 123456)"
                    className="w-full h-11 px-3.5 rounded-xl text-sm font-mono-tech tracking-wider border border-slate-200/90 bg-white/90 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700/80 dark:bg-[#111c38] dark:text-white outline-none transition-all"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShow2FAModal(false)}
                    className="flex-1 h-11 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1 h-11 text-xs font-bold">
                    <ShieldCheck size={16} className="mr-1.5" />
                    Verify &amp; Enable
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <motion.div
        className="mb-6 sm:mb-8"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <motion.span
          variants={fadeUp}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide text-brand-600 bg-brand-500/10 border border-brand-500/20 dark:text-brand-300 mb-3"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
          System Preferences
        </motion.span>
        <motion.h1
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white"
        >
          Settings
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-3xl font-normal leading-relaxed"
        >
          Manage your preferences, security, notifications, and scanner configuration.
        </motion.p>
      </motion.div>

      {/* Settings Sections List */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="space-y-6 w-full min-w-0"
      >
        {/* 1. APPEARANCE SECTION */}
        <motion.div variants={fadeUp}>
          <GlassCard variant="standard" className="p-5 sm:p-7 w-full min-w-0">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400 font-semibold border border-brand-500/20">
                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Appearance
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Customize the interface theme and visual mode of Perfynix AI.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60 bg-slate-50/50 dark:bg-[#111c38]/50">
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white block">
                  Interface Theme
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Current theme: <strong className="capitalize">{theme} Mode</strong>
                </span>
              </div>

              {/* Light / Dark Mode Toggle Buttons */}
              <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 border border-slate-300/50 dark:border-slate-700/50">
                <button
                  type="button"
                  onClick={() => theme === 'dark' && toggleTheme()}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    theme === 'light'
                      ? 'bg-white text-slate-900 shadow-md border border-slate-200'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Sun size={15} className="text-amber-500" />
                  Light Mode
                </button>

                <button
                  type="button"
                  onClick={() => theme === 'light' && toggleTheme()}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    theme === 'dark'
                      ? 'bg-slate-900 text-white shadow-md border border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Moon size={15} className="text-violet-400" />
                  Dark Mode
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.div>



        {/* 3. NOTIFICATIONS SECTION */}
        <motion.div variants={fadeUp}>
          <GlassCard variant="standard" className="p-5 sm:p-7 w-full min-w-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400 font-semibold border border-brand-500/20">
                <Bell size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Notifications &amp; Alerts
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Select which security events and scan triggers generate instant notifications.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-200/60 dark:divide-slate-700/60">
              <SettingToggleRow
                title="Assessment Completed Notifications"
                description="Receive alerts in the header dropdown when security scans finish."
                checked={settings.notifyAssessmentCompleted}
                onChange={() => handleToggle('notifyAssessmentCompleted')}
              />

              <SettingToggleRow
                title="Critical Vulnerability Alerts"
                description="High-priority instant alert upon discovering critical severity vulnerabilities."
                checked={settings.notifyCriticalAlerts}
                onChange={() => handleToggle('notifyCriticalAlerts')}
              />

              <SettingToggleRow
                title="Scan Failure Notifications"
                description="Alert when a scan is aborted or fails connection to target host."
                checked={settings.notifyScanFailure}
                onChange={() => handleToggle('notifyScanFailure')}
              />

              <SettingToggleRow
                title="AI Analysis Completed Notifications"
                description="Notify when deep LLM security reasoning finishes generating insights."
                checked={settings.notifyAiAnalysisCompleted}
                onChange={() => handleToggle('notifyAiAnalysisCompleted')}
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* 4. SECURITY SECTION */}
        <motion.div variants={fadeUp}>
          <GlassCard variant="standard" className="p-5 sm:p-7 w-full min-w-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400 font-semibold border border-brand-500/20">
                <Lock size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Security &amp; Authentication
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Manage two-factor authentication, login alerts, and active session timeouts.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Password Row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60 bg-slate-50/50 dark:bg-[#111c38]/50">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    <LockKeyhole size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        Account Password
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 dark:text-emerald-300">
                        Protected
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Update your account security password and authentication rules.
                    </p>
                  </div>
                </div>

                <div className="shrink-0 w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    onClick={() => setShowPasswordModal(true)}
                    className="h-10 px-4 text-xs font-bold"
                  >
                    <LockKeyhole size={15} className="mr-1.5" />
                    Change Password
                  </Button>
                </div>
              </div>

              {/* 2FA Row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/60 bg-slate-50/50 dark:bg-[#111c38]/50">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <KeyRound size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        Two-Factor Authentication (2FA)
                      </span>
                      {settings.is2FAConfigured ? (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 dark:text-emerald-300">
                          Active &amp; Configured
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold text-amber-700 bg-amber-500/10 border border-amber-500/20 dark:text-amber-300">
                          Not configured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Add an extra layer of security to your Perfynix AI account using an authenticator app.
                    </p>
                  </div>
                </div>

                <div className="shrink-0 w-full sm:w-auto">
                  {settings.is2FAConfigured ? (
                    <Button
                      variant="secondary"
                      onClick={() => setSettings((prev) => ({ ...prev, is2FAConfigured: false }))}
                      className="h-10 px-4 text-xs font-bold text-red-600 bg-red-500/10 border-red-500/20 hover:bg-red-500/20"
                    >
                      Disable 2FA
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => setShow2FAModal(true)}
                      className="h-10 px-4 text-xs font-bold"
                    >
                      <ShieldCheck size={15} className="mr-1.5" />
                      Configure
                    </Button>
                  )}
                </div>
              </div>

              {/* Login Notifications & Session Timeout */}
              <div className="divide-y divide-slate-200/60 dark:divide-slate-700/60">
                <SettingToggleRow
                  title="Login Notifications"
                  description="Receive email notifications for logins from new devices or unrecognized IP locations."
                  checked={settings.loginNotifications}
                  onChange={() => handleToggle('loginNotifications')}
                />

                <div className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white block">
                      Session Timeout Preference
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Automatically sign out after a specified duration of inactivity.
                    </span>
                  </div>

                  <select
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings((prev) => ({ ...prev, sessionTimeout: e.target.value }))}
                    className="h-11 px-3.5 rounded-xl text-xs font-semibold border border-slate-200/80 bg-white/80 text-slate-800 dark:border-slate-700/80 dark:bg-[#111c38] dark:text-slate-200 outline-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors shrink-0 min-w-[150px]"
                  >
                    <option value="15m">15 Minutes</option>
                    <option value="30m">30 Minutes (Default)</option>
                    <option value="1h">1 Hour</option>
                    <option value="8h">8 Hours</option>
                    <option value="never">Never</option>
                  </select>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* 5. ACTION AREA (SAVE CHANGES & RESET) */}
        <motion.div variants={fadeUp}>
          <GlassCard variant="subtle" className="p-4 sm:p-5 w-full min-w-0">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <AlertCircle size={15} className="text-brand-500 shrink-0" />
                <span>Changes will be applied immediately across your active dashboard session.</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                <Button
                  variant="secondary"
                  onClick={handleReset}
                  className="flex-1 sm:flex-initial h-11 px-5 text-xs font-bold"
                >
                  <RotateCcw size={15} className="mr-1.5 text-slate-500" />
                  Reset to Defaults
                </Button>

                <Button
                  variant="primary"
                  loading={isSaving}
                  onClick={handleSave}
                  className="flex-1 sm:flex-initial h-11 px-6 text-xs font-bold"
                >
                  <Check size={16} className="mr-1.5" />
                  Save Changes
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* Helper Row Component for Toggle Switches */
function SettingToggleRow({ title, description, checked, onChange }) {
  return (
    <div className="py-4 flex items-center justify-between gap-4">
      <div className="pr-2">
        <span className="font-semibold text-sm text-slate-900 dark:text-white block">
          {title}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed block mt-0.5">
          {description}
        </span>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
          checked
            ? 'bg-brand-600 dark:bg-brand-500'
            : 'bg-slate-300 dark:bg-slate-700'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
