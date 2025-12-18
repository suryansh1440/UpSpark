import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/useAuthStore'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { user, login, isLoggingIn } = useAuthStore()


  useEffect(() => {
    if (user) {
      const roleDashMap = {
        founder: '/dashboard',
        investor: '/dashboard/investor',
        mentor: '/dashboard/mentor',
        collaborator: '/dashboard/collaborator',
        admin: '/dashboard/admin',
      }
      const redirectTo = roleDashMap[user?.activeRole] || '/dashboard'
      navigate(redirectTo)
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    await login({ email, password })
  }

  if (user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-950 text-white">
        <div className="space-y-4 text-center">
          <div className="text-lg font-semibold">Already logged in.</div>
          <Link to="/dashboard" className="text-indigo-200 underline">
            Go to dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-slate-950 px-4 py-10">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-white shadow-2xl shadow-indigo-500/20">
        <div className="absolute -left-10 top-6 h-24 w-24 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -right-10 bottom-6 h-24 w-24 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-lg font-bold">
              INT
            </div>
            <h1 className="text-2xl font-semibold">Welcome back 👋</h1>
            <p className="text-sm text-slate-400">Login to continue building</p>
          </div>
            <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-300">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-indigo-400/50"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-indigo-400/50"
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 disabled:opacity-60">
              {isLoggingIn ? 'Logging in…' : 'Login'}
            </button>
            <button className="w-full rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:border-white/30">
              Login with Google
            </button>
          </div>
          <p className="text-center text-sm text-slate-400">
            Don’t have an account?{' '}
            <Link to="/register" className="font-semibold text-indigo-200 hover:text-white">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

