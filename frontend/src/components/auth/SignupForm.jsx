import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Eye, EyeOff, Lock, Mail, UserRound, AlertCircle } from 'lucide-react'
import Input from "../common/Input";
import Button from "../common/Button";
import { useUser } from "../../context/UserContext";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const REQUIREMENTS = [
  { key: 'length', label: 'Minimum 8 characters', test: (value) => value.length >= 8 },
  { key: 'upper', label: 'One uppercase letter', test: (value) => /[A-Z]/.test(value) },
  { key: 'lower', label: 'One lowercase letter', test: (value) => /[a-z]/.test(value) },
  { key: 'number', label: 'One number', test: (value) => /\d/.test(value) },
  { key: 'special', label: 'One special character', test: (value) => /[^A-Za-z0-9]/.test(value) },
]

export default function SignupForm({ onSuccess }) {
  const { signup } = useUser()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: '' }))
    if (serverError) setServerError('')
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Full name is required'
    if (!form.email.trim()) next.email = 'Email is required'
    else if (!EMAIL_RE.test(form.email)) next.email = 'Enter a valid email address'
    if (!form.password) next.password = 'Password is required'
    else if (!REQUIREMENTS.every(({ test }) => test(form.password))) next.password = 'Choose a stronger password'
    if (!form.confirmPassword) next.confirmPassword = 'Please confirm your password'
    else if (form.password !== form.confirmPassword) next.confirmPassword = 'Passwords do not match'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setServerError('')
    if (!validate()) return

    setLoading(true)
    try {
      signup({
        name: form.name,
        email: form.email,
        password: form.password,
      })
      setTimeout(() => {
        setLoading(false)
        onSuccess()
      }, 700)
    } catch (err) {
      setLoading(false)
      setServerError(err.message || 'Failed to create account. Please try again.')
    }
  }

  const strength = REQUIREMENTS.filter(({ test }) => test(form.password)).length
  const strengthLabel = strength === 0 ? '' : strength < 3 ? 'Weak' : strength < 5 ? 'Good' : 'Strong'
  const strengthColor = strength < 3 ? 'bg-error-500' : strength < 5 ? 'bg-warning-500' : 'bg-success-500'

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
      {serverError && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-2"
        >
          <AlertCircle size={16} className="shrink-0" />
          <span>{serverError}</span>
        </motion.div>
      )}

      <Field>
        <Input label="Full name" name="name" value={form.name} onChange={(event) => updateField('name', event.target.value)} icon={UserRound} error={!!errors.name} autoComplete="name" required />
        <FieldError message={errors.name} />
      </Field>

      <Field>
        <Input label="Email address" type="email" name="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} icon={Mail} error={!!errors.email} autoComplete="email" required />
        <FieldError message={errors.email} />
      </Field>

      <Field>
        <PasswordInput label="Password" name="password" value={form.password} onChange={(event) => updateField('password', event.target.value)} visible={showPassword} onToggle={() => setShowPassword((value) => !value)} error={!!errors.password} autoComplete="new-password" />
        <AnimatePresence initial={false}>
          {form.password && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden pt-2">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex flex-1 gap-1" aria-label={`Password strength: ${strengthLabel || 'empty'}`}>
                  {REQUIREMENTS.map(({ key }, index) => <span key={key} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${index < strength ? strengthColor : 'bg-slate-200 dark:bg-slate-700'}`} />)}
                </div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{strengthLabel}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                {REQUIREMENTS.map(({ key, label, test }) => <Requirement key={key} label={label} valid={test(form.password)} />)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <FieldError message={errors.password} />
      </Field>

      <Field>
        <PasswordInput label="Confirm password" name="confirmPassword" value={form.confirmPassword} onChange={(event) => updateField('confirmPassword', event.target.value)} visible={showConfirmPassword} onToggle={() => setShowConfirmPassword((value) => !value)} error={!!errors.confirmPassword} autoComplete="new-password" />
        <FieldError message={errors.confirmPassword} />
      </Field>

      <label className="flex items-start gap-2 pt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
        <input type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
        <span>I agree to the <button type="button" className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">Terms &amp; Conditions</button> and Privacy Policy.</span>
      </label>

      <Button type="submit" loading={loading}>{loading ? 'Creating account…' : 'Create Account'}</Button>
    </form>
  )
}

function Field({ children }) { return <div>{children}</div> }

function FieldError({ message }) {
  return <AnimatePresence>{message && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1 pl-1 text-xs font-medium text-error-500" role="alert">{message}</motion.p>}</AnimatePresence>
}

function PasswordInput({ label, name, value, onChange, visible, onToggle, error, autoComplete }) {
  return <div className="relative"><Input label={label} type={visible ? 'text' : 'password'} name={name} value={value} onChange={onChange} icon={Lock} error={error} autoComplete={autoComplete} required /><button type="button" onClick={onToggle} aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200">{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
}

function Requirement({ label, valid }) {
  return <span className={`flex items-center gap-1 text-[10px] transition-colors ${valid ? 'text-success-600 dark:text-success-400' : 'text-slate-400 dark:text-slate-500'}`}><Check size={12} className={valid ? 'opacity-100' : 'opacity-30'} />{label}</span>
}
