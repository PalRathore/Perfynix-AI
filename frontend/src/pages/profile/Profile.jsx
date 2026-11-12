import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Camera, X, Check, Image as ImageIcon, Upload, Trash2 } from 'lucide-react';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileInformation from '../../components/profile/ProfileInformation';
import AccountStats from '../../components/profile/AccountStats';
import SignOutCard from '../../components/profile/SignOutCard';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useUser } from '../../context/UserContext';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=256&q=80',
];

export default function Profile() {
  const { user, updateUser } = useUser();
  const [editing, setEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('Profile updated successfully');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState(user.avatarUrl || '');

  const handleSaveProfile = (updatedData) => {
    updateUser(updatedData);
    setToastMsg('Profile information updated successfully!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const handleSaveAvatar = (url) => {
    updateUser({ avatarUrl: url });
    setShowAvatarModal(false);
    setToastMsg('Profile picture updated successfully!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setToastMsg('Image size must be under 5MB');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3500);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          setCustomAvatarUrl(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="profile-page space-y-8 pb-10 relative"
    >
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

      {/* Avatar Change Modal */}
      <Modal open={showAvatarModal} onClose={() => setShowAvatarModal(false)} title="Change Profile Picture" maxWidth="max-w-md">
        <div className="space-y-5">
          {/* Live Preview */}
          <div className="flex flex-col items-center justify-center pb-2">
            <div className="relative h-24 w-24 rounded-full p-1 bg-gradient-to-br from-brand-500 via-accent-500 to-cyan-400 shadow-lg">
              <div className="h-full w-full rounded-full overflow-hidden bg-slate-900 flex items-center justify-center text-3xl font-bold text-white">
                {customAvatarUrl ? (
                  <img src={customAvatarUrl} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  user?.name?.charAt(0)?.toUpperCase() || 'P'
                )}
              </div>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-2">
              Profile Picture Preview
            </span>
          </div>

          {/* Device File Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Upload Photo from Computer
            </label>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="avatar-file-input"
              onChange={handleFileUpload}
            />
            <label
              htmlFor="avatar-file-input"
              className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-400 rounded-2xl p-4 cursor-pointer bg-slate-50/50 dark:bg-slate-900/40 transition-colors text-center group"
            >
              <Upload className="h-6 w-6 text-brand-600 dark:text-cyan-400 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Click to browse photo from device
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                Supports PNG, JPG, WEBP or GIF (Max 5MB)
              </span>
            </label>
          </div>

          {/* Paste Image URL */}
          <Input
            label="Or Paste Image URL"
            placeholder="https://example.com/photo.jpg"
            value={customAvatarUrl}
            onChange={(e) => setCustomAvatarUrl(e.target.value)}
            icon={ImageIcon}
          />

          {/* Preset Avatars */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Or Choose Preset Avatar
            </label>
            <div className="flex items-center gap-3 justify-center">
              {PRESET_AVATARS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCustomAvatarUrl(url)}
                  className={`h-12 w-12 rounded-full overflow-hidden border-2 transition-all hover:scale-105 ${
                    customAvatarUrl === url ? 'border-brand-500 ring-2 ring-brand-500/40' : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <img src={url} alt={`Preset ${idx}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-800">
            {user.avatarUrl ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCustomAvatarUrl('');
                  handleSaveAvatar('');
                }}
                className="text-xs text-red-500 hover:bg-red-500/10 px-2.5"
              >
                <Trash2 size={14} /> Remove Photo
              </Button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => setShowAvatarModal(false)} className="px-4">
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={() => handleSaveAvatar(customAvatarUrl)} className="px-4 font-bold">
                <Check size={14} /> Save Photo
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Page Header Title */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Profile
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5" /> Account Secure
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Manage your account details, workspace role, and security credentials.
          </p>
        </div>
      </div>

      <ProfileHeader
        user={user}
        onAvatarChange={() => setShowAvatarModal(true)}
      />

      <ProfileInformation
        user={user}
        onSave={handleSaveProfile}
        startEditing={editing}
        onEditingChange={setEditing}
      />

      <AccountStats />

      <SignOutCard onSignOut={() => {}} />

      <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="h-3.5 w-3.5 text-brand-500" /> Perfynix AI keeps your security workspace protected.
      </div>
    </motion.div>
  );
}
