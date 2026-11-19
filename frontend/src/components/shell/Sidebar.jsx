import { NavLink } from 'react-router-dom';
import {
  BarChart3, Clock3, Grid2X2, Menu, PlusCircle, Sparkles, X
} from 'lucide-react';
import Brand from './Brand';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: Grid2X2 },
  { label: 'New Assessment', to: '/assessment', icon: PlusCircle },
  { label: 'Results', to: '/results', icon: BarChart3 },
  { label: 'History', to: '/history', icon: Clock3 },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  return (
    <>
      {mobileOpen && <button className="scrim" aria-label="Close menu" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-mobile-open' : ''}`}>
        <div className="sidebar-top">
          <Brand collapsed={collapsed} />
          <button
            className="sidebar-toggle-btn"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu size={18} />
          </button>
          <button className="mobile-close" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
            <X size={18} />
          </button>
        </div>
        <nav className="nav-list" aria-label="Primary navigation">
          <span className="nav-label">Workspace</span>
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="status-card">
            <span className="status-dot" />
            <div>
              <strong>System status</strong>
              <span>All engines active</span>
            </div>
            <Sparkles size={17} />
          </div>
        </div>
      </aside>
    </>
  );
}
