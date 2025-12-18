import {create} from 'zustand'
import { axiosInstance } from '../lib/axios';
import {toast} from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  user:null,
  isLoggingIn: false,
  isSigningUp: false,
  isLoggingOut: false,
  isCheckingAuth: false,
  isAddingRole: false,
  isChangingRole: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get('/auth/check-auth');
      set({ user: res.data });
    }catch (error) {
      console.log("Check auth error:", error);
      set({ user: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post('/auth/login', data);
      set({ user: res.data.user });
      toast.success("Logged in Successfully");
    } catch (error) {
      console.log("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post('/auth/signup', data);
      set({ user: res.data.user });
      toast.success(res.data?.message || 'Registered successfully');
    } catch (error) {
      console.log('Signup error:', error);
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      set({ isSigningUp: false});
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    try{
      await axiosInstance.post('/auth/logout');
      set({ user: null });
      toast.success("Logged out successfully");
    }catch(error){
      console.log("Logout error:", error);
      // If logout API fails, clear local user state so UI reflects logout action
      set({ user: null });
      toast.error(error.response?.data?.message || "Logout failed");
    } finally {
      set({ isLoggingOut: false });
    }
  },

  addRole: async(role)=>{
    set({isAddingRole:true});
    try{
        const res = await axiosInstance.put('/auth/add-role',{role});
        // Refresh user from server to ensure server-side state is authoritative
        const me = await axiosInstance.get('/auth/check-auth');
        set({ user: me.data });
        toast.success(res?.data?.message || "Role added successfully");
    }catch(error){
      console.log("Add role error:", error);
      toast.error(error.response?.data?.message || "Failed to add role");
    } finally{
      set({isAddingRole:false});
    }
  },

  changeRole: async(role)=>{
    set({isChangingRole:true});
    try{
        await axiosInstance.put('/auth/change-role',{role});
        // Refresh user from server to get canonical state
        const me = await axiosInstance.get('/auth/check-auth');
        set({ user: me.data });
        // toast.success(res?.data?.message || "Role changed successfully");
    }catch(error){
      console.log("Change role error:", error);
      toast.error(error.response?.data?.message || "Failed to change role");
    } finally{
      set({isChangingRole:false});
    }
  },
   
}))