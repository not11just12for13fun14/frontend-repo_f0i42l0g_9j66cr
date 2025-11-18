import { useState, useRef } from 'react'

export default function InterviewFlow({ interview, onSubmit }) {
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [info, setInfo] = useState('')
  const fileRef = useRef(null)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const handleChange = (id, value) => {
    setAnswers((a) => ({ ...a, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = Object.entries(answers).map(([question_id, answer]) => ({ question_id, answer }))
      await onSubmit(payload)
    } catch (err) {
      setError(err.message || 'Failed to evaluate')
    } finally {
      setLoading(false)
    }
  }

  const applyAutoFill = (list) => {
    const merged = { ...answers }
    list.forEach(({ question_id, answer }) => {
      if (!merged[question_id] || merged[question_id].length < 5) {
        merged[question_id] = answer
      }
    })
    setAnswers(merged)
  }

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    setInfo('Extracting answers from your document…')
    try {
      const form = new FormData()
      form.append('interview_id', interview.id)
      form.append('file', file)

      const res = await fetch(`${baseUrl}/api/interview/upload`, {
        method: 'POST',
        body: form
      })
      if (!res.ok) throw new Error('Failed to process file')
      const data = await res.json()
      applyAutoFill(data.answers || [])
      setInfo(data.summary ? `Summary: ${data.summary}` : 'Filled where possible from document.')
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  if (!interview) return null

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/60 border border-blue-500/20 rounded-2xl p-6 space-y-6">
      <div className="rounded-lg border border-slate-700 p-4 bg-slate-900/50">
        <p className="text-blue-200 text-sm mb-2">Optional: upload a brief, pitch deck, or draft (PDF, DOCX, or TXT). We'll auto-fill what we can.</p>
        <div className="flex items-center gap-3">
          <input ref={fileRef} onChange={handleUpload} type="file" accept=".pdf,.docx,.txt" className="text-blue-100 text-sm" />
          {uploading && <span className="text-blue-300 text-sm">Processing…</span>}
        </div>
        {info && <p className="text-blue-300/90 text-xs mt-2">{info}</p>}
      </div>

      {interview.questions.map((q) => (
        <div key={q.id}>
          <label className="block text-sm text-blue-200 mb-2">{q.text}</label>
          <textarea rows={3} value={answers[q.id] || ''} onChange={(e) => handleChange(q.id, e.target.value)} className="w-full px-3 py-2 rounded bg-slate-900/70 border border-slate-700 text-white" />
        </div>
      ))}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="flex justify-end">
        <button disabled={loading} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50">
          {loading ? 'Evaluating…' : 'Evaluate Fit'}
        </button>
      </div>
    </form>
  )
}
