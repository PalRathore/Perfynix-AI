import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";

import AuthLayout from "../../components/auth/AuthLayout";
import GlassCard from "../../components/common/GlassCard";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import BrandLogo from "../../components/common/BrandLogo";
import { useUser } from "../../context/UserContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [readOnly, setReadOnly] = useState(true);

  const handleFocus = () => {
    if (readOnly) setReadOnly(false);
  };

  const validate = () => {
    const next = {};

    if (!email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email address";
    }

    if (!password) {
      next.password = "Password is required";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setLoading(true);

    try {
      login(email, password);
      setTimeout(() => {
        setLoading(false);
        navigate("/assessment");
      }, 500);
    } catch (err) {
      setLoading(false);
      setServerError(err.message || "Invalid credentials. Please verify your email and password.");
    }
  };

  return (
    <AuthLayout>
      <GlassCard variant="elevated" className="p-7 sm:p-9">
        {/* Perfynix AI Branding */}
        <div className="mb-5">
          <BrandLogo size={44} titleClassName="text-xl sm:text-[22px]" subtitleClassName="text-[10px] sm:text-[11px]" showText={true} />
        </div>

        {/* Card Title & Subtitle */}
        <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-slate-900 dark:text-white">
          Welcome back
        </h2>

        <p className="mt-2 text-sm leading-[1.55] text-slate-600 dark:text-slate-400 font-normal">
          Sign in to access your security workspace and AI insights.
        </p>

        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-2"
          >
            <AlertCircle size={16} className="shrink-0" />
            <span>{serverError}</span>
          </motion.div>
        )}

        {/* Dummy inputs to intercept Chrome/Edge password autofill heuristics */}
        <input type="text" style={{ display: "none" }} tabIndex={-1} aria-hidden="true" />
        <input type="password" style={{ display: "none" }} tabIndex={-1} aria-hidden="true" />

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4" autoComplete="off">
          <div>
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (serverError) setServerError("");
              }}
              onFocus={handleFocus}
              readOnly={readOnly}
              icon={Mail}
              error={!!errors.email}
              autoComplete="new-password"
            />

            {errors.email && <FieldError msg={errors.email} />}
          </div>

          <div>
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (serverError) setServerError("");
              }}
              onFocus={handleFocus}
              readOnly={readOnly}
              icon={Lock}
              error={!!errors.password}
              autoComplete="new-password"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-slate-400 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-300 transition-colors p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            {errors.password && <FieldError msg={errors.password} />}
          </div>

          {/* Form Options */}
          <div className="flex items-center justify-between text-xs sm:text-sm pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300 font-normal select-none">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-slate-700 dark:bg-[#131d35]"
              />
              Remember me
            </label>

            <Link
              to="/forgot-password"
              className="font-semibold text-xs sm:text-sm text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Action */}
          <Button type="submit" loading={loading} className="mt-2 text-sm font-semibold">
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-7 text-center text-sm font-normal text-slate-600 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
          >
            Sign up
          </Link>
        </p>
      </GlassCard>
    </AuthLayout>
  );
}

function FieldError({ msg }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-1.5 pl-1 text-xs font-semibold text-red-500 dark:text-red-400"
    >
      {msg}
    </motion.p>
  );
}
