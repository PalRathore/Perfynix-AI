import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Menu, Search } from 'lucide-react';
import ProfileMenu from './ProfileMenu';
import NotificationMenu from './NotificationMenu';
import ThemeToggle from '../common/ThemeToggle';
import { useUser } from '../../context/UserContext';

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Critical vulnerability found',
    target: 'Stripe Payment Gateway',
    time: '2 min ago',
    type: 'critical',
    severityLabel: 'Critical severity',
    unread: true,
  },
  {
    id: 2,
    title: 'Assessment completed',
    target: 'Perfynix Auth SSO Gateway',
    time: '18 min ago',
    type: 'success',
    severityLabel: 'Success',
    unread: true,
  },
  {
    id: 3,
    title: 'Scan failed',
    target: 'Enterprise Financial Portal',
    time: '1 hour ago',
    type: 'error',
    severityLabel: 'Error',
    unread: true,
  },
  {
    id: 4,
    title: 'Assessment started',
    target: 'Internal Identity Provider',
    time: '2 hours ago',
    type: 'info',
    severityLabel: 'Info',
    unread: false,
  },
  {
    id: 5,
    title: 'High-risk finding detected',
    target: 'Demo E-Commerce Storefront',
    time: '3 hours ago',
    type: 'high',
    severityLabel: 'High severity',
    unread: false,
  },
];

export default function Header({ setMobileOpen }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const searchInputRef = useRef(null);

  // Global Cmd+K / Ctrl+K keyboard shortcut listener to focus search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const initial = user?.name?.charAt(0)?.toUpperCase() || 'P';

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (item) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
    );
    setNotificationsOpen(false);
    navigate('/results');
  };

  return (
    <header className="header">
      <button className="mobile-menu" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
        <Menu size={20} />
      </button>
      <div className="search-box flex items-center relative min-w-0">
        <Search size={16} className="shrink-0 text-slate-400 mr-2" />
        <input
          ref={searchInputRef}
          aria-label="Search"
          placeholder="Search assessments, history, hosts..."
          className="w-full bg-transparent text-xs outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400 font-medium"
        />
      </div>
      <div className="header-actions">
        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            className={`icon-button notification ${notificationsOpen ? 'selected' : ''}`}
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            onClick={() => {
              setNotificationsOpen((prev) => !prev);
              if (profileOpen) setProfileOpen(false);
            }}
            style={{ display: 'grid' }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 rounded-full bg-violet-600 dark:bg-violet-400 shadow-[0_0_8px_rgba(124,58,237,0.8)] animate-pulse" />
            )}
          </button>

          <AnimatePresence>
            {notificationsOpen && (
              <NotificationMenu
                notifications={notifications}
                onClose={() => setNotificationsOpen(false)}
                onMarkAllRead={handleMarkAllRead}
                onNotificationClick={handleNotificationClick}
              />
            )}
          </AnimatePresence>
        </div>

        <ThemeToggle />
        <div className="profile-wrap">
          <button
            className={`avatar ${profileOpen ? 'selected' : ''}`}
            aria-label="Open profile menu"
            aria-expanded={profileOpen}
            onClick={() => {
              setProfileOpen((prev) => !prev);
              if (notificationsOpen) setNotificationsOpen(false);
            }}
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              initial
            )}
          </button>
          <AnimatePresence>
            {profileOpen && <ProfileMenu onClose={() => setProfileOpen(false)} />}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
