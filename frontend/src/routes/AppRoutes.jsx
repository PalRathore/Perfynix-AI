import { Routes, Route, Navigate } from "react-router-dom";

// Shell Layout
import ApplicationShell from "../components/shell/ApplicationShell";
import ProtectedRoute from "./ProtectedRoute";

// Authentication Pages
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";

// Standalone Assessment Page
import NewAssessment from "../pages/assessment/NewAssessment";

// Application Shell Pages
import Dashboard from "../pages/dashboard/Dashboard";
import Results from "../pages/results/Results";
import History from "../pages/history/History";
import Profile from "../pages/profile/Profile";
import Settings from "../pages/settings/Settings";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Root Redirect to Login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Authentication Routes (Public) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Standalone Assessment Page */}
        <Route path="/assessment" element={<NewAssessment />} />

        {/* Application Shell Pages */}
        <Route element={<ApplicationShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/results" element={<Results />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Catch-all Redirect to Login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
