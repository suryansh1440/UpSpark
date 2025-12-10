import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <div className="text-white">INT222 • Connecting founders, investors & mentors.</div>
        <div className="flex flex-wrap gap-4">
          {['About', 'FAQ', 'Contact', 'Terms', 'Privacy'].map((item) => (
            <Link key={item} to="#" className="hover:text-white">
              {item}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer

