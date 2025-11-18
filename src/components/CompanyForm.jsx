import { useState } from 'react'

export default function CompanyForm({ onStart }) {
  const [form, setForm] = useState({
    name: '',
    website: '',
    country: '',
    sector: '',
    size: '',
    contact_email: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name) {
      setError('Please enter a company name')
      return
    }
    setLoading(true)
    try {
      await onStart({ ...form })
    } catch (err) {
      setError(err.message || 'Failed to start interview')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/60 border border-blue-500/20 rounded-2xl p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-blue-200 mb-1">Company Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 rounded bg-slate-900/70 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Acme Innovations" />
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Website</label>
          <input name="website" value={form.website} onChange={handleChange} className="w-full px-3 py-2 rounded bg-slate-900/70 border border-slate-700 text-white" placeholder="https://..." />
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Country</label>
          <input name="country" value={form.country} onChange={handleChange} className="w-full px-3 py-2 rounded bg-slate-900/70 border border-slate-700 text-white" placeholder="Germany" />
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Sector</label>
          <input name="sector" value={form.sector} onChange={handleChange} className="w-full px-3 py-2 rounded bg-slate-900/70 border border-slate-700 text-white" placeholder="AI / Manufacturing" />
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Size</label>
          <select name="size" value={form.size} onChange={handleChange} className="w-full px-3 py-2 rounded bg-slate-900/70 border border-slate-700 text-white">
            <option value="">Select</option>
            <option>Startup</option>
            <option>SME</option>
            <option>Large</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Contact Email</label>
          <input name="contact_email" value={form.contact_email} onChange={handleChange} className="w-full px-3 py-2 rounded bg-slate-900/70 border border-slate-700 text-white" placeholder="hello@company.com" />
        </div>
      </div>
      <div>
        <label className="block text-sm text-blue-200 mb-1">Project Brief</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 rounded bg-slate-900/70 border border-slate-700 text-white" placeholder="2-3 sentences about your idea" />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="flex justify-end">
        <button disabled={loading} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50">
          {loading ? 'Starting…' : 'Start Interview'}
        </button>
      </div>
    </form>
  )
}
