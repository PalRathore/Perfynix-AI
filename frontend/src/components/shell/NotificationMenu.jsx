import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Info,
  AlertTriangle,
  CheckCheck,
  ArrowRight,
} from 'lucide-react';

export default function NotificationMenu({
  notifications,
  onClose,
  onMarkAllRead,
  onNotificationClick,
}) {
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [onClose]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="absolute right-0 top-12 z-[100] w-[340px] sm:w-[380px] max-w-[calc(100vw-24px)] rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-[#09122b]/95 backdrop-blur-2xl shadow-2xl overflow-hidden"
    >
      {/* Menu Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/70 dark:border-slate-700/70 bg-slate-50/50 dark:bg-[#0f1b3b]/50">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-slate-900 dark:text-white">
            Notifications
          </span>
          {unreadCount > 0 ? (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold text-violet-600 bg-violet-500/10 border border-violet-500/20 dark:text-violet-300">
              {unreadCount} Unread
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium text-slate-500 bg-slate-500/10 dark:text-slate-400">
              All Read
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
          >
            <CheckCheck size={14} />
            Mark all read
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
        {notifications.map((item) => (
          <div
            key={item.id}
            onClick={() => onNotificationClick(item)}
            className={`group relative flex items-start gap-3 p-3.5 text-left cursor-pointer transition-colors duration-150 ${
              item.unread
                ? 'bg-brand-500/[0.04] dark:bg-brand-500/[0.06] hover:bg-brand-500/[0.08] dark:hover:bg-brand-500/[0.12]'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
            }`}
          >
            {/* Type/Severity Icon Badge */}
            <div className="mt-0.5 shrink-0">
              <NotificationIcon type={item.type} />
            </div>

            {/* Notification Content */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">
                  {item.title}
                </span>
                {item.unread && (
                  <span className="h-2 w-2 rounded-full bg-violet-600 dark:bg-violet-400 shrink-0" />
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 truncate font-medium">
                {item.target}
              </p>
              <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                <span>{item.time}</span>
                <span className="font-semibold capitalize text-slate-500 dark:text-slate-400">
                  {item.severityLabel || item.type}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer link */}
      <div className="p-2.5 text-center border-t border-slate-200/70 dark:border-slate-700/70 bg-slate-50/40 dark:bg-[#0b142d]/40">
        <button
          onClick={() => {
            onClose();
            navigate('/results');
          }}
          className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300 transition-colors"
        >
          View Full Audit Results
          <ArrowRight size={13} />
        </button>
      </div>
    </motion.div>
  );
}

function NotificationIcon({ type }) {
  if (type === 'critical') {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border border-red-500/20">
        <ShieldAlert size={16} />
      </div>
    );
  }
  if (type === 'high') {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 border border-orange-500/20">
        <AlertTriangle size={16} />
      </div>
    );
  }
  if (type === 'error') {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-500/20">
        <XCircle size={16} />
      </div>
    );
  }
  if (type === 'success') {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20">
        <CheckCircle2 size={16} />
      </div>
    );
  }
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-500/20">
      <Info size={16} />
    </div>
  );
}
