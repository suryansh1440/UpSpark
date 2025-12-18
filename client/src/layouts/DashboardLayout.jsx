import { Outlet } from 'react-router-dom'
import Sidebar from '../components/dashboard/Sidebar'
import Topbar from '../components/dashboard/Topbar'
import { useAuthStore } from '../store/useAuthStore';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const DashboardLayout = () => {
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
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar />
        <main className="flex-1 bg-gradient-to-b from-slate-950 to-slate-900 px-4 py-6">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
      <Toaster/>
    </div>
  )
}

export default DashboardLayout

