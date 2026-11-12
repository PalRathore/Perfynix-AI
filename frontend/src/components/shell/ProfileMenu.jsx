import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Settings, UserRound } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function ProfileMenu({ onClose }) {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const menuRef = useRef(null);

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

  const go = (path) => {
    onClose();
    navigate(path);
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() || 'P';

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="profile-menu"
    >
      <div className="profile-summary">
        <div className="avatar large">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover rounded-full" />
          ) : (
            initial
          )}
        </div>
        <div className="min-w-0 flex-1">
          <strong className="truncate block">{user?.name || 'User'}</strong>
          <span className="truncate block">{user?.email || 'user@example.com'}</span>
        </div>
      </div>
      <div className="menu-divider" />
      <button onClick={() => go('/profile')}>
        <UserRound size={17} /> Profile
      </button>
      <button onClick={() => go('/settings')}>
        <Settings size={17} /> Settings
      </button>
      <div className="menu-divider" />
      <button
        className="logout"
        onClick={() => {
          logout();
          go('/login');
        }}
      >
        <LogOut size={17} /> Logout
      </button>
    </motion.div>
  );
}
