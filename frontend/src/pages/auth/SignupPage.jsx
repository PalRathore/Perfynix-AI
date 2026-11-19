import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Lock } from 'lucide-react'
import AuthLayout from "../../components/auth/AuthLayout";
import GlassCard from "../../components/common/GlassCard";
import Button from "../../components/common/Button";
import SignupForm from "../../components/auth/SignupForm";
import BrandLogo from "../../components/common/BrandLogo";

export default function Signup() {
  const [created, setCreated] = useState(false)

  return (
    <AuthLayout>
      <GlassCard variant="elevated" className="p-7 sm:p-9">
        {!created ? <>
          <div className="mb-5">
            <BrandLogo size={44} titleClassName="text-xl sm:text-[22px]" subtitleClassName="text-[10px] sm:text-[11px]" showText={true} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-700 dark:text-white">Create Your Account</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">Create your account to start AI-powered security and performance assessments.</p>
          <div className="mt-6"><SignupForm onSuccess={() => setCreated(true)} /></div>
          <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">Already have an account? <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">Sign In</Link></p>
        </> : <SuccessState />}
      </GlassCard>
    </AuthLayout>
  )
}

function SuccessState() {
  return <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="py-8 text-center">
    <motion.div initial={{ scale: 0, rotate: -25 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.1, type: 'spring', stiffness: 220, damping: 14 }} className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-success-500 to-success-600 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.7)]"><CheckCircle2 size={34} className="text-slate-700 dark:text-white" /></motion.div>
    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-700 dark:text-white">Account Created Successfully</h2>
    <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">Your account has been created successfully. You can now sign in to continue.</p>
    <Link to="/login" className="mt-7 block"><Button>Go to Login</Button></Link>
  </motion.div>
}
