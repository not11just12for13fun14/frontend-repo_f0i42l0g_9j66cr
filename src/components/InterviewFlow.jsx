import { useState } from 'react'

export default function InterviewFlow({ interview, onSubmit }) {
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

  if (!interview) return null

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/60 border border-blue-500/20 rounded-2xl p-6 space-y-6">
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
