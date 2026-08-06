import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-slate-800 dark:text-slate-100">
      <Navbar onToggleMobileSidebar={() => setMobileOpen((prev) => !prev)} />

      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <main
        className={`min-h-screen pt-16 transition-[padding] duration-300 ease-in-out
          ${collapsed ? 'lg:pl-20' : 'lg:pl-64'}`}
      >
        <div className="custom-scrollbar h-[calc(100vh-4rem)] overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
