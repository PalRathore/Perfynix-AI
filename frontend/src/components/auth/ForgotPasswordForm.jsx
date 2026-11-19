import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle2, Send } from 'lucide-react'
import Input from "../common/Input";
import Button from "../common/Button";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const validate = (value) => {
    if (!value.trim()) return 'Email is required'
    if (!EMAIL_RE.test(value)) return 'Enter a valid email address'
    return ''
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const msg = validate(email)
    if (msg) {
      setError(msg)
      return
    }
    setError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 1400)
  }

  const handleResend = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1200)
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 220, damping: 14 }}
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-success-500 to-success-600 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.7)]"
        >
          <CheckCircle2 size={34} className="text-slate-700 dark:text-white" />
        </motion.div>

        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-700 dark:text-white">
          Check Your Inbox
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          A password reset link has been sent to your registered email address.
          Please check your inbox and follow the instructions to reset your
          password.
        </p>

        <div className="mt-7 space-y-3">
          <Link to="/login">
            <Button variant="primary">
              <ArrowLeft size={18} /> Back to Login
            </Button>
          </Link>
          <Button variant="ghost" onClick={handleResend} loading={loading}>
            <Send size={16} /> Resend Email
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input
        label="Registered email address"
        type="email"
        name="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          if (error) setError('')
        }}
        onBlur={(e) => {
          if (e.target.value.trim()) setError(validate(e.target.value))
        }}
        icon={Mail}
        error={!!error}
        autoComplete="email"
        required
        aria-describedby={error ? 'fp-email-error' : undefined}
      />

      <AnimatePresence>
        {error && (
          <motion.p
            id="fp-email-error"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 pl-1 text-xs font-medium text-error-500"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="mt-6">
        <Button type="submit" loading={loading}>
          {loading ? 'Sending…' : 'Send Reset Link'}
        </Button>
      </div>
    </form>
  )
}
