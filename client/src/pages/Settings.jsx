import { useEffect, useRef, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import useUserStore from '../store/useUserStore'

const AVAILABLE_ROLES = ['founder', 'investor', 'collaborator', 'admin']

const Settings = () => {
  const { user, checkAuth, addRole, changeRole, isAddingRole, isChangingRole } = useAuthStore()
  const { isUpdating, isUploadingAvatar, updateProfile, updateAvatar } = useUserStore()

  const [form, setForm] = useState({ name: '', bio: '', website: '', linkedinUrl: '', location: '' })
  const [roleToAdd, setRoleToAdd] = useState('')
  const [roleToSwitch, setRoleToSwitch] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const fileRef = useRef(null)

  useEffect(() => {
    if (!user) {
      checkAuth()
    } else {
      setForm({
        name: user.name || '',
        bio: user.bio || '',
        website: user.website || '',
        linkedinUrl: user.linkedinUrl || '',
        location: user.location || '',
      })
    }
  }, [user, checkAuth])

  useEffect(() => {
    if (!selectedFile) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(selectedFile)
    setPreview(url)
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [selectedFile])

  const handleSave = async () => {
    try {
      await updateProfile(form)
    } catch {
      // error message comes from store
    }
  }

  const handleAddRole = async () => {
    if (!roleToAdd) return
    await addRole(roleToAdd)
    setRoleToAdd('')
  }

  const handleChangeRole = async () => {
    if (!roleToSwitch) return
    await changeRole(roleToSwitch)
    setRoleToSwitch('')
  }

  const handleSelectFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setSelectedFile(f)
  }

  const handleUploadAvatar = async () => {
    if (!selectedFile) return
    try {
      await updateAvatar(selectedFile)
      setSelectedFile(null)
    } catch {
      // handled by store
    }
  }

  const rolesNotAdded = AVAILABLE_ROLES.filter((r) => !(user?.roles || []).includes(r))

  return (
    <div className="space-y-6 text-white">
      <div className="grid gap-6 md:grid-cols-[320px,1fr]">
        <aside className="space-y-6 rounded-2xl border border-white/8 bg-gradient-to-b from-slate-900/60 to-slate-900/40 p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative rounded-full overflow-hidden h-28 w-28 bg-slate-800 ring-1 ring-white/10 shadow-md">
              {preview ? (
                <img src={preview} alt="avatar preview" className="h-full w-full object-cover" />
              ) : user?.avatar ? (
                <img src={user.avatar} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-slate-300">{(user?.name || 'U').charAt(0).toUpperCase()}</div>
              )}
            </div>
            <div className="mt-4 text-sm text-slate-300">Your public profile photo</div>
            <div className="mt-4 flex items-center gap-2">
              <button onClick={() => fileRef.current?.click()} className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium">Choose</button>
              <button disabled={!selectedFile || isUploadingAvatar} onClick={handleUploadAvatar} className="rounded-md bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-md disabled:opacity-60">
                {isUploadingAvatar ? 'Uploading...' : 'Upload'}
              </button>
            </div>
            <div className="text-xs text-slate-400 mt-2">PNG, JPG up to 2MB</div>
            {selectedFile && <div className="text-sm text-slate-300 mt-2">Selected: {selectedFile.name}</div>}
            <input ref={fileRef} onChange={handleSelectFile} accept="image/*" type="file" className="hidden" />
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Roles</h4>
            <div className="flex items-center gap-2">
              <select value={roleToAdd} onChange={(e)=>setRoleToAdd(e.target.value)} className="flex-1 rounded-md bg-white/5 px-3 py-2">
                <option value="">Add role...</option>
                {rolesNotAdded.map(r=> <option key={r} value={r}>{r}</option>)}
              </select>
              <button disabled={!roleToAdd || isAddingRole} onClick={handleAddRole} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white">
                {isAddingRole ? 'Adding...' : 'Add'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <select value={roleToSwitch} onChange={(e)=>setRoleToSwitch(e.target.value)} className="flex-1 rounded-md bg-white/5 px-3 py-2">
                <option value="">Switch active role...</option>
                {(user?.roles || []).map(r=> <option key={r} value={r}>{r}</option>)}
              </select>
              <button disabled={!roleToSwitch || isChangingRole} onClick={handleChangeRole} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white">
                {isChangingRole ? 'Switching...' : 'Switch'}
              </button>
            </div>
          </div>
        </aside>

        <main className="rounded-2xl border border-white/8 bg-white/3 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Profile</h3>
            <p className="text-sm text-slate-400">Update your name, bio and links.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-slate-300">Name</label>
              <input value={form.name} onChange={(e)=>setForm(s=>({...s,name:e.target.value}))} className="mt-2 w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-indigo-400/50" />
            </div>
            <div>
              <label className="text-sm text-slate-300">Title</label>
              <input className="mt-2 w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-indigo-400/50" />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-slate-300">Bio</label>
              <textarea value={form.bio} onChange={(e)=>setForm(s=>({...s,bio:e.target.value}))} className="mt-2 w-full rounded-xl bg-white/5 px-3 py-3 text-sm outline-none ring-1 ring-white/10 focus:ring-indigo-400/50" />
            </div>

            <div>
              <label className="text-sm text-slate-300">LinkedIn</label>
              <input value={form.linkedinUrl} onChange={(e)=>setForm(s=>({...s,linkedinUrl:e.target.value}))} className="mt-2 w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-indigo-400/50" />
            </div>
            <div>
              <label className="text-sm text-slate-300">Website</label>
              <input value={form.website} onChange={(e)=>setForm(s=>({...s,website:e.target.value}))} className="mt-2 w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-indigo-400/50" />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button onClick={handleSave} disabled={isUpdating} className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-2 text-sm font-semibold text-white shadow-md disabled:opacity-60">
              {isUpdating ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Settings

