import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';

// Pages are not built yet — this placeholder proves the Outlet works.
// Replace with real page imports as they're built, e.g.:
// import Dashboard from './pages/Dashboard';
function Placeholder({ title }) {
  return (
    <div className="rounded-xl border border-slate-200/70 dark:border-white/10
      bg-surface p-8 text-slate-500 dark:text-slate-400">
      {title} page goes here.
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Placeholder title="Dashboard" />} />
            <Route path="dashboard" element={<Placeholder title="Dashboard" />} />
            <Route path="assessment" element={<Placeholder title="Assessment" />} />
            <Route path="results" element={<Placeholder title="Results" />} />
            <Route path="reports" element={<Placeholder title="Reports" />} />
            <Route path="history" element={<Placeholder title="History" />} />
            <Route path="settings" element={<Placeholder title="Settings" />} />
            <Route path="profile" element={<Placeholder title="Profile" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
