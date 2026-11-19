import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Lock } from 'lucide-react'
import AuthLayout from "../../components/auth/AuthLayout";
import GlassCard from "../../components/common/GlassCard";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";
import BrandLogo from "../../components/common/BrandLogo";

export default function ForgotPassword() {
  return (
    <AuthLayout>
      <GlassCard variant="elevated" className="p-7 sm:p-9">
        {/* Back to login */}
        <Link
          to="/login"
          className="group mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-300"
        >
          <motion.span
            whileHover={{ x: -3 }}
            className="flex items-center gap-1.5"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
            Back to Login
          </motion.span>
        </Link>

        {/* Logo + name */}
        <div className="mb-6">
          <BrandLogo size={44} titleClassName="text-xl sm:text-[22px]" subtitleClassName="text-[10px] sm:text-[11px]" showText={true} />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-700 dark:text-white">
          Forgot your password?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          No worries. Enter your registered email address and we&apos;ll send
          you a secure password reset link.
        </p>

        <div className="mt-7">
          <ForgotPasswordForm />
        </div>
      </GlassCard>
    </AuthLayout>
  )
}
