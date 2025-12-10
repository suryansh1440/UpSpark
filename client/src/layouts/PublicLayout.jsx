import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout

