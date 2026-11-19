import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import GlassCard from '../common/GlassCard';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { useUser } from '../../context/UserContext';

export default function SignOutCard({ onSignOut }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useUser();

  const handleConfirmSignOut = () => {
    setOpen(false);
    logout();
    if (onSignOut) {
      onSignOut();
    }
    navigate('/login');
  };

  return (
    <GlassCard variant="subtle" className="p-4 sm:p-5 flex items-center justify-end w-full">
      <Button variant="dangerGhost" onClick={() => setOpen(true)} className="h-10 px-5 text-xs font-semibold">
        <LogOut className="h-4 w-4 mr-1.5" /> Sign Out
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="Sign out of Perfynix AI?" maxWidth="max-w-md">
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Are you sure you want to sign out of your Perfynix AI workspace? You will need to log back in to access your security reports and assessments.
        </p>
        <div className="mt-6 flex items-center justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={() => setOpen(false)} className="h-10 px-4 text-xs font-semibold w-auto">
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmSignOut} className="h-10 px-5 text-xs font-semibold w-auto">
            <LogOut className="h-4 w-4 mr-1.5" /> Sign Out
          </Button>
        </div>
      </Modal>
    </GlassCard>
  );
}
