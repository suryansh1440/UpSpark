import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import useCollaborationStore from '../store/useCollaborationStore'
import useStartupStore from '../store/useStartupStore'
import { toast } from 'react-hot-toast'

const CollaborationBoard = () => {
  const { user } = useAuthStore()
  const posts = useCollaborationStore((s) => s.posts)
  const myPosts = useCollaborationStore((s) => s.myPosts)
  const fetchPosts = useCollaborationStore((s) => s.fetchPosts)
  const fetchMyPosts = useCollaborationStore((s) => s.fetchMyPosts)
  const createPost = useCollaborationStore((s) => s.createPost)
  const deletePost = useCollaborationStore((s) => s.deletePost)
  const updatePost = useCollaborationStore((s) => s.updatePost)
  const applyToPost = useCollaborationStore((s) => s.applyToPost)
  const fetchApplications = useCollaborationStore((s) => s.fetchApplications)
  const selectPost = useCollaborationStore((s) => s.selectPost)
  const selectedPost = useCollaborationStore((s) => s.selectedPost)
  const applicationsMap = useCollaborationStore((s) => s.applications)
  const applications = selectedPost ? (applicationsMap[selectedPost._id] || []) : []

  const { myStartups, fetchMyStartups } = useStartupStore()

  const [showCreate, setShowCreate] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [isMyView, setIsMyView] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', roleNeeded: 'developer', skillsRequired: '', commitment: 'part-time', location: '', startup: '' })
  const [applyMsg, setApplyMsg] = useState('')

  useEffect(() => {
    fetchPosts()
    if (user) fetchMyPosts()
  }, [user])

  useEffect(() => {
    if (user) fetchMyStartups()
  }, [user])

  const openCreate = () => {
    if (!user) return toast.error('Please login to post')
    setShowCreate(true)
  }

  const submitCreate = async () => {
    try {
      const payload = { ...form, skillsRequired: form.skillsRequired ? form.skillsRequired.split(',').map((s) => s.trim()) : [] }
      if (selectedPost) {
        await updatePost(selectedPost._id, payload)
        useCollaborationStore.getState().clearSelection()
      } else {
        await createPost(payload)
      }
      setShowCreate(false)
      setForm({ title: '', description: '', roleNeeded: 'developer', skillsRequired: '', commitment: 'part-time', location: '', startup: '' })
    } catch (err) {
      // handled by store
    }
  }

  const openDetail = (post) => {
    selectPost(post)
    // if owner, prefetch applicants so owner sees freshest list
    if (String(post.postedBy?._id) === String(user?._id)) fetchApplications(post._id)
    setShowDetail(true)
  }

  const submitApply = async (postId) => {
    try {
      await applyToPost(postId, { message: applyMsg })
      setApplyMsg('')
      setShowDetail(false)
      toast.success('Application sent')
    } catch (err) {}
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return
    try {
      await deletePost(id)
    } catch (err) {}
  }

  const list = isMyView ? myPosts : posts

  return (
    <div className="bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Collaboration Board</h1>
            <p className="text-sm text-slate-400">Find co-founders, builders, and advisors.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={openCreate} className="rounded-xl bg-indigo-500/90 hover:bg-indigo-600/90 px-4 py-2 text-sm font-semibold text-white">+ Post Opportunity</button>
            <button onClick={() => setIsMyView((s) => !s)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white">{isMyView ? 'All Posts' : 'My Posts'}</button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {['Role needed', 'Skill tags', 'Commitment'].map((filter) => (
            <button key={filter} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:border-indigo-400/40 hover:text-white">{filter}</button>
          ))}
        </div>

        <div className="grid gap-4">
          <div className="space-y-3">
            {list.map((item) => (
              <div key={item._id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold">{item.title}</div>
                    <div className="text-xs text-slate-400">{item.startup?.name || item.postedBy?.name}</div>
                  </div>
                  <div className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-100">{item.commitment}</div>
                </div>
                <p className="mt-2 text-sm text-slate-300">{item.description}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
                  {(item.skillsRequired || []).map((skill) => (
                    <span key={skill} className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">{skill}</span>
                  ))}
                </div>
                <div className="mt-3 flex gap-3">
                  <button onClick={() => openDetail(item)} className="rounded-xl bg-indigo-500/90 px-4 py-2 text-sm font-semibold text-white">View Details</button>
                  {user?.roles?.includes('collaborator') && String(item.postedBy?._id) !== String(user?._id) && (
                    <button onClick={() => openDetail(item)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-indigo-400/40">Apply / Show Interest</button>
                  )}
                  {String(item.postedBy) === String(user?._id) && (
                    <>
                      <button onClick={() => { selectPost(item); setShowCreate(true); setForm({ title: item.title, description: item.description, roleNeeded: item.roleNeeded, skillsRequired: (item.skillsRequired || []).join(', '), commitment: item.commitment, location: item.location, startup: item.startup?._id || '' }) }} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white">Edit</button>
                      <button onClick={() => handleDelete(item._id)} className="rounded-xl border border-red-600/40 bg-white/5 px-4 py-2 text-sm font-semibold text-red-400">Delete</button>
                      <button onClick={async () => { await fetchApplications(item._id); selectPost(item); setShowDetail(true) }} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white">View Applicants</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create / Edit Modal */}
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={() => { setShowCreate(false); useCollaborationStore.getState().clearSelection(); setForm({ title: '', description: '', roleNeeded: 'developer', skillsRequired: '', commitment: 'part-time', location: '', startup: '' }) }} />
            <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-slate-900 p-6 text-white">
              <h3 className="text-lg font-semibold">{selectedPost ? 'Edit Post' : 'Create Post'}</h3>
              <div className="mt-4 grid grid-cols-1 gap-3">
                <input value={form.title} onChange={(e) => setForm((s) => ({...s, title: e.target.value}))} placeholder="Title" className="w-full rounded-md bg-slate-800 px-3 py-2" />
                <textarea value={form.description} onChange={(e) => setForm((s) => ({...s, description: e.target.value}))} placeholder="Description" className="w-full rounded-md bg-slate-800 px-3 py-2" rows={4} />
                <input value={form.skillsRequired} onChange={(e) => setForm((s) => ({...s, skillsRequired: e.target.value}))} placeholder="Skills (comma separated)" className="w-full rounded-md bg-slate-800 px-3 py-2" />
                <div className="flex gap-2">
                  <select value={form.roleNeeded} onChange={(e) => setForm((s) => ({...s, roleNeeded: e.target.value}))} className="rounded-md bg-slate-800 px-3 py-2">
                    <option value="developer">Developer</option>
                    <option value="designer">Designer</option>
                    <option value="marketer">Marketer</option>
                    <option value="co-founder">Co-founder</option>
                    <option value="other">Other</option>
                  </select>
                  <select value={form.commitment} onChange={(e) => setForm((s) => ({...s, commitment: e.target.value}))} className="rounded-md bg-slate-800 px-3 py-2">
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
                {myStartups && myStartups.length > 0 && (
                  <select value={form.startup} onChange={(e) => setForm((s) => ({...s, startup: e.target.value}))} className="rounded-md bg-slate-800 px-3 py-2">
                    <option value="">Post without startup</option>
                    {myStartups.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                )}
                <div className="flex justify-end gap-2 mt-3">
                  <button onClick={() => { setShowCreate(false); useCollaborationStore.getState().clearSelection() }} className="rounded-xl border border-white/10 px-4 py-2">Cancel</button>
                  <button onClick={() => submitCreate()} className="rounded-xl bg-indigo-500 px-4 py-2">{selectedPost ? 'Save' : 'Create'}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detail / Apply / Applicants Modal */}
        {showDetail && selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/70" onClick={() => { setShowDetail(false); useCollaborationStore.getState().clearSelection(); setApplyMsg('') }} />
            <div className="relative z-10 w-full max-w-4xl rounded-2xl bg-gradient-to-b from-slate-900 to-slate-800 p-6 text-white shadow-xl">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {selectedPost.postedBy?.avatar ? (
                    <img src={selectedPost.postedBy.avatar} alt={selectedPost.postedBy.name} className="h-14 w-14 rounded-full object-cover" />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-indigo-600 flex items-center justify-center font-semibold text-white">{(selectedPost.postedBy?.name || 'U').split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{selectedPost.title}</h3>
                      <div className="text-xs text-slate-400 mt-1">Posted by <span className="font-medium text-slate-200">{selectedPost.postedBy?.name}</span> • <span className="text-slate-400">{new Date(selectedPost.createdAt).toLocaleString()}</span></div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-indigo-100">{selectedPost.commitment}</div>
                      {selectedPost.startup?.name && <div className="mt-2 text-xs text-slate-300">Startup: <span className="font-medium text-slate-200">{selectedPost.startup.name}</span></div>}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-slate-300 leading-relaxed">{selectedPost.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(selectedPost.skillsRequired || []).map((s) => (
                          <span key={s} className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200">{s}</span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {user?.roles?.includes('collaborator') && String(selectedPost.postedBy) !== String(user?._id) && (
                        <div className="rounded-lg bg-slate-900/60 p-3">
                          <div className="text-sm text-slate-300">Send a short message when applying</div>
                          <textarea value={applyMsg} onChange={(e) => setApplyMsg(e.target.value)} placeholder="Brief intro & why you're interested" className="mt-2 w-full rounded-md bg-slate-800 px-3 py-2 text-sm" rows={4} />
                          <div className="mt-2 flex justify-end">
                            <button onClick={() => submitApply(selectedPost._id)} className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold">Apply</button>
                          </div>
                        </div>
                      )}

                      {String(selectedPost.postedBy?._id) === String(user?._id) && (
                        <div className="rounded-lg bg-slate-900/60 p-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">Applicants <span className="text-xs text-slate-400">({applications.length})</span></h4>
                            <button onClick={async () => { await fetchApplications(selectedPost._id) }} className="rounded-md border border-white/10 px-3 py-1 text-xs">Refresh</button>
                          </div>
                          <div className="mt-3 max-h-60 overflow-y-auto space-y-3">
                            {applications.length === 0 && <div className="text-sm text-slate-400">No applicants yet.</div>}
                            {applications.map((a) => (
                              <div key={String(a._id)} className="flex items-start gap-3 rounded-md border border-white/6 bg-white/2 p-3">
                                <div className="flex-shrink-0">
                                  {a.applicant?.avatar ? (
                                    <img src={a.applicant.avatar} alt={a.applicant.name} className="h-10 w-10 rounded-full object-cover" />
                                  ) : (
                                    <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center font-semibold text-white">{(a.applicant?.name || 'U').split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-semibold">{a.applicant?.name}</div>
                                      <div className="text-xs text-slate-400">{a.applicant?.email}</div>
                                    </div>
                                    <div className="text-xs text-slate-400">{a.status}</div>
                                  </div>
                                  <div className="mt-2 text-sm text-slate-300">{a.message || <span className="text-slate-500">—</span>}</div>
                                  <div className="mt-3 flex gap-2">
                                    {a.status === 'pending' && (
                                      <>
                                        <button onClick={async () => { await useCollaborationStore.getState().acceptApplication(selectedPost._id, a._id) }} className="rounded-md bg-emerald-600 px-3 py-1 text-xs">Accept</button>
                                        <button onClick={async () => { await useCollaborationStore.getState().rejectApplication(selectedPost._id, a._id) }} className="rounded-md bg-rose-600 px-3 py-1 text-xs">Reject</button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end"><button onClick={() => { setShowDetail(false); useCollaborationStore.getState().clearSelection(); setApplyMsg('') }} className="rounded-xl border border-white/10 px-4 py-2">Close</button></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CollaborationBoard

