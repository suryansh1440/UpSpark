import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuthStore } from '../store/useAuthStore';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const PublicLayout = () => {
  const {isCheckingAuth,checkAuth,user} = useAuthStore();
  
    useEffect(()=>{
      checkAuth();
    },[checkAuth])
  
    if(isCheckingAuth && !user) return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin' />
  
      </div>
    )
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
        <Outlet />
      </main>
      <Footer />
      <Toaster/>
    </div>
  )
}

export default PublicLayout

