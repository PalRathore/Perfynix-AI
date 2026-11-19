import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, Check, Globe2, Mail, Pencil, Phone, ShieldCheck, UserRound, X, FileText } from 'lucide-react';
import GlassCard from '../common/GlassCard';
import Button from '../common/Button';
import Input from '../common/Input';

const FIELDS = [
  { key: 'name', label: 'Full Name', icon: UserRound },
  { key: 'email', label: 'Email', icon: Mail },
  { key: 'role', label: 'Role', icon: ShieldCheck },
  { key: 'organization', label: 'Organization', icon: Building2 },
  { key: 'location', label: 'Location', icon: Globe2 },
  { key: 'phone', label: 'Phone', icon: Phone },
];

export default function ProfileInformation({ user, onSave, startEditing = false, onEditingChange }) {
  const [editing, setEditing] = useState(startEditing);
  const [form, setForm] = useState(user);
  const [prevUser, setPrevUser] = useState(user);
  const [errors, setErrors] = useState({});

  if (user !== prevUser) {
    setPrevUser(user);
    setForm(user);
  }

  useEffect(() => {
    if (startEditing) {
      setEditing(true);
    }
  }, [startEditing]);

  useEffect(() => {
    onEditingChange?.(editing);
  }, [editing, onEditingChange]);

  const beginEditing = () => setEditing(true);

  const cancel = () => {
    setForm(user);
    setErrors({});
    setEditing(false);
  };

  const save = () => {
    const nextErrors = {};
    if (!form.name || !form.name.trim()) nextErrors.name = 'Full name is required';
    if (!form.email || !form.email.trim()) {
      nextErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Enter a valid email address';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onSave(form);
      setEditing(false);
    }
  };

  return (
    <GlassCard variant="standard" className="p-6 sm:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-brand-600 dark:text-cyan-400">
            Personal Workspace
          </p>
          <h3 className="mt-1 text-xl font-black tracking-tight text-slate-900 dark:text-white">
            Account Information
          </h3>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            Manage your personal details, workspace role, and security profile preferences.
          </p>
        </div>
        {!editing && (
          <Button variant="secondary" size="sm" onClick={beginEditing} className="h-9 px-4 text-xs font-bold">
            <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit Profile
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {editing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-5"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Full Name"
                name="name"
                value={form.name || ''}
                error={errors.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={form.email || ''}
                error={errors.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Input
                label="Role / Title"
                name="role"
                value={form.role || ''}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
              <Input
                label="Organization"
                name="organization"
                value={form.organization || ''}
                onChange={(e) => setForm({ ...form, organization: e.target.value })}
              />
              <Input
                label="Location"
                name="location"
                value={form.location || ''}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
              <Input
                label="Phone Number"
                name="phone"
                value={form.phone || ''}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Executive Bio / Summary
              </label>
              <textarea
                rows={3}
                value={form.bio || ''}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Write a short bio detailing your role and security responsibilities..."
                className="w-full p-3 rounded-xl text-xs sm:text-sm font-medium border border-slate-200/90 dark:border-slate-700/80 bg-white/90 dark:bg-[#111c38] text-slate-900 dark:text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={cancel} className="h-10 px-4 text-xs font-bold">
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
              <Button onClick={save} className="h-10 px-5 text-xs font-bold">
                <Check className="h-4 w-4 mr-1" /> Save Changes
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-6"
          >
            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              {FIELDS.map(({ key, label, icon: Icon }) => (
                <div key={key} className="p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <Icon className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                    <span>{label}</span>
                  </div>
                  <p className="mt-1.5 truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                    {user[key] || 'Not specified'}
                  </p>
                </div>
              ))}
            </div>

            {user.bio && (
              <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                  <FileText className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
                  <span>Executive Bio</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                  {user.bio}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
