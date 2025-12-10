import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/startups', label: 'Explore Startups' },
  { to: '/investor/dashboard', label: 'Investors' },
  { to: '/mentors', label: 'Mentors' },
  { to: '/how-it-works', label: 'How it works' },
]

const Navbar = () => {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-lg font-bold">INT</span>
          <span>INT222</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-200 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `transition hover:text-white ${isActive ? 'text-white font-semibold' : 'text-slate-200'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
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
        </div>
      </div>
    </header>
  )
}

export default Navbar

