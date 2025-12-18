import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

const roleDashMap = {
  founder: '/dashboard/founder',
  investor: '/dashboard/investor',
  mentor: '/dashboard/mentor',
  collaborator: '/dashboard/collaborator',
  admin: '/dashboard/admin',
}

const Navbar = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-white">
          <img src="/logo.png" alt="UpSpark logo" className="h-8 w-auto sm:h-9 md:h-10" />
          <span className="sr-only">UpSpark</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-200 md:flex" />
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden flex-col text-right text-sm text-slate-200 sm:flex">
                <span className="font-semibold">{user?.name ?? 'User'}</span>
                <span className="text-xs text-slate-400">{user?.email ?? ''}</span>
              </div>
              <button onClick={() => navigate(roleDashMap[user?.activeRole])} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-100 transition bg-slate-800 hover:border-white/30 hover:text-white">Dashboard</button>
              <button
                onClick={async () => {
                  await logout()
                  navigate('/')
                }}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-100 transition hover:border-white/30"
              >
                Logout
              </button>
            </div>
          ) : null}
          {!user ? (
            <>
              <Link
                to="/login"
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-100 transition hover:border-white/30"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110"
              >
                Sign up
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </header>
  )
}

export default Navbar

