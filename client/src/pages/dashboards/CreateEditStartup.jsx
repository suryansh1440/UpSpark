import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useStartupStore from '../../store/useStartupStore'
import { useAuthStore } from '../../store/useAuthStore'
import { Loader } from 'lucide-react'

const stages = ['idea', 'mvp', 'seed', 'series-a']

const fieldClass = 'w-full rounded-md border border-white/10 bg-white/3 px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500'

const CreateEditStartup = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const createStartup = useStartupStore((s) => s.createStartup)
  const updateStartup = useStartupStore((s) => s.updateStartup)
  const fetchStartup = useStartupStore((s) => s.fetchStartup)
  const current = useStartupStore((s) => s.currentStartup)
  const isCreating = useStartupStore((s) => s.isCreating)
  const isUpdating = useStartupStore((s) => s.isUpdating)

  const [form, setForm] = React.useState({
    name: '',
    tagline: '',
    industry: '',
    stage: 'idea',
    location: '',
    website: '',
    problem: '',
    solution: '',
    fundingRequired: '',
    equityOffered: '',
  })

  React.useEffect(() => {
    if (id) {
      fetchStartup(id)
    }
  }, [id, fetchStartup])

  React.useEffect(() => {
    if (id && current && current._id === id) {
      setForm({
        name: current.name || '',
        tagline: current.tagline || '',
        industry: current.industry || '',
        stage: current.stage || 'idea',
        location: current.location || '',
        website: current.website || '',
        problem: current.problem || '',
        solution: current.solution || '',
        fundingRequired: current.fundingRequired || '',
        equityOffered: current.equityOffered || '',
      })
    }
  }, [id, current])

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      if (id) {
        await updateStartup(id, { ...form, fundingRequired: Number(form.fundingRequired), equityOffered: Number(form.equityOffered) })
        navigate('/dashboard/my-startup')
      } else {
        await createStartup({ ...form, fundingRequired: Number(form.fundingRequired), equityOffered: Number(form.equityOffered) })
        navigate('/dashboard/my-startup')
      }
    } catch (err) {
      console.error('create/update error:', err)
      // errors surfaced via toast in store
    }
  }

  if (!user || user.activeRole !== 'founder') return <div className="text-white">Not allowed</div>

  return (
    <div className="space-y-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{id ? 'Edit Startup' : 'Create Startup'}</h1>
          <p className="text-sm text-slate-400 mt-1">Describe your startup clearly so founders, advisors, and investors understand your mission.</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-slate-300">Name</label>
          <input name="name" value={form.name} onChange={onChange} placeholder="Name" className={`${fieldClass} mt-1`} required />
        </div>

        <div>
          <label className="text-sm text-slate-300">Tagline</label>
          <input name="tagline" value={form.tagline} onChange={onChange} placeholder="Short, catchy summary" className={`${fieldClass} mt-1`} />
        </div>

        <div>
          <label className="text-sm text-slate-300">Industry</label>
          <input name="industry" value={form.industry} onChange={onChange} placeholder="Industry (e.g., Fintech)" className={`${fieldClass} mt-1`} required />
        </div>

        <div>
          <label className="text-sm text-slate-300">Stage</label>
          <select name="stage" value={form.stage} onChange={onChange} className={`${fieldClass} mt-1`}>
            {stages.map((s) => (
              <option className="bg-slate-800 text-white" key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-slate-300">Location</label>
          <input name="location" value={form.location} onChange={onChange} placeholder="City, Country" className={`${fieldClass} mt-1`} />
        </div>

        <div>
          <label className="text-sm text-slate-300">Website</label>
          <input name="website" value={form.website} onChange={onChange} placeholder="https://" className={`${fieldClass} mt-1`} />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-slate-300">Problem</label>
          <textarea name="problem" value={form.problem} onChange={onChange} placeholder="Describe the problem you're solving" className={`${fieldClass} mt-1 min-h-[120px]`} rows={4} required />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-slate-300">Solution</label>
          <textarea name="solution" value={form.solution} onChange={onChange} placeholder="Describe your solution and key differentiators" className={`${fieldClass} mt-1 min-h-[120px]`} rows={4} required />
        </div>

        <div>
          <label className="text-sm text-slate-300">Funding required (USD)</label>
          <input name="fundingRequired" value={form.fundingRequired} onChange={onChange} type="number" placeholder="Amount" className={`${fieldClass} mt-1`} />
        </div>

        <div>
          <label className="text-sm text-slate-300">Equity offered (%)</label>
          <input name="equityOffered" value={form.equityOffered} onChange={onChange} type="number" placeholder="Percent" className={`${fieldClass} mt-1`} />
        </div>

        <div className="md:col-span-2 flex gap-2">
          <button disabled={isCreating || isUpdating} type="submit" className="rounded-xl bg-indigo-500/90 px-6 py-2 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            {(isCreating || isUpdating) && <Loader className="animate-spin" size={16} />}
            {id ? (isUpdating ? 'Updating...' : 'Update') : (isCreating ? 'Creating...' : 'Create')}
          </button>
          <button type="button" onClick={() => navigate('/dashboard/my-startup')} className="rounded-xl border border-white/10 px-6 py-2">Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default CreateEditStartup
