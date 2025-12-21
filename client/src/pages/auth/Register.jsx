import { useEffect, useState } from 'react'
import { roles } from '../../data/mockData'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import {toast} from 'react-hot-toast';

const Register = () => {
  const [step, setStep] = useState(1)
  const [selectedRole, setSelectedRole] = useState('founder')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()
  const { user, signup, isSigningUp } = useAuthStore()

  const step1Missing = !name.trim() || !email.trim() || !password || !confirmPassword
  const passwordsMismatch = password && confirmPassword && password !== confirmPassword
  const isStep1Valid = !step1Missing && !passwordsMismatch

  useEffect(() => {
    if (user) {
      const roleDashMap = {
        founder: '/dashboard',
        investor: '/dashboard/investor',
        collaborator: '/dashboard/collaborator',
        admin: '/dashboard/admin',
      }
      const redirectTo = roleDashMap[user?.activeRole] || '/dashboard'
      navigate(redirectTo)
    }
  }, [user, navigate]);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      toast('Please fill name, email and password')
      return
    }
    if (password !== confirmPassword) {
      toast('Passwords do not match')
      return
    }

    await signup({ name, email, password, role: selectedRole })
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-slate-950 px-4 py-10">
      <div className="w-full max-w-2xl space-y-6 rounded-2xl border border-white/10 bg-white/5 p-8 text-white shadow-2xl shadow-indigo-500/20">
        <div className="flex items-center justify-between text-sm text-slate-300">
          <span className="font-semibold text-indigo-200">Step {step} / 2</span>
          <span className="text-slate-400">Create your account</span>
        </div>
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-300">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-indigo-400/50"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-indigo-400/50"
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-sm text-slate-300">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-indigo-400/50"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-indigo-400/50"
                />
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-sm text-red-400" aria-live="polite">
                {step1Missing ? 'All fields are required.' : passwordsMismatch ? 'Passwords do not match.' : ''}
              </div>
              <button
                type="button"
                onClick={() => isStep1Valid && setStep(2)}
                disabled={!isStep1Valid}
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="text-sm text-slate-300">What best describes you?</div>
            <div className="grid gap-3 md:grid-cols-2">
              {roles.map((role) => (
                <button
                  key={role.role}
                  onClick={() => setSelectedRole(role.role)}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${selectedRole === role.role
                      ? 'border-indigo-400/50 bg-indigo-500/10 text-white'
                      : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/30'
                    }`}
                >
                  <div className={`mb-3 h-10 w-10 rounded-xl bg-gradient-to-br ${role.color}`} />
                  <div className="text-base font-semibold">{role.title}</div>
                  <div className="text-sm text-slate-400">Tailored onboarding</div>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:border-white/30"
              >
                ← Back
              </button>
              <button
                onClick={handleSignup}
                disabled={isSigningUp}
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {isSigningUp ? 'Signing up…' : 'Complete Registration'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Register

