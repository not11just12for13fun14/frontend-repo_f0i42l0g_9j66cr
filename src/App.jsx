import { useState } from 'react'
import CompanyForm from './components/CompanyForm'
import InterviewFlow from './components/InterviewFlow'
import Results from './components/Results'

function App() {
  const [interview, setInterview] = useState(null)
  const [result, setResult] = useState(null)
  const [opps, setOpps] = useState([])
  const [proposal, setProposal] = useState(null)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const startInterview = async (company) => {
    const res = await fetch(`${baseUrl}/api/interview/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company })
    })
    if (!res.ok) throw new Error('Failed to start interview')
    const data = await res.json()
    setInterview({ id: data.interview_id, questions: data.questions })
    setOpps(data.opportunities)
  }

  const submitAnswers = async (answers) => {
    if (!interview) return
    const res = await fetch(`${baseUrl}/api/interview/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ interview_id: interview.id, answers })
    })
    if (!res.ok) throw new Error('Failed to evaluate interview')
    const data = await res.json()
    setResult(data)
  }

  const generateProposal = async (idx) => {
    const res = await fetch(`${baseUrl}/api/proposal/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ interview_id: interview?.id, chosen_opportunity_index: idx })
    })
    if (!res.ok) throw new Error('Failed to generate proposal')
    const data = await res.json()
    setProposal(data)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen flex items-center justify-center p-8">
        <div className="max-w-4xl w-full space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white tracking-tight">AI-Powered EU Funding Vetting</h1>
            <p className="text-blue-200 mt-2">Interview companies, match to calls, predict fit, and generate proposal outlines.</p>
          </div>

          {!interview && (
            <CompanyForm onStart={startInterview} />
          )}

          {interview && !result && (
            <InterviewFlow interview={interview} onSubmit={submitAnswers} />
          )}

          {result && (
            <Results result={result} opportunities={opps} onGenerate={generateProposal} />
          )}

          {proposal && (
            <div className="bg-slate-800/60 border border-blue-500/20 rounded-2xl p-6 space-y-3">
              <h3 className="text-white font-semibold text-lg">Proposal Draft</h3>
              <p className="text-blue-200">Opportunity: <a className="text-blue-400 hover:underline" href={proposal.opportunity_url} target="_blank" rel="noreferrer">{proposal.opportunity_title}</a></p>
              <div className="space-y-2">
                {Object.entries(proposal.outline || {}).map(([k, v]) => (
                  <div key={k} className="bg-slate-900/60 border border-slate-700 rounded p-3">
                    <p className="text-white font-medium">{k}</p>
                    <p className="text-blue-200/90 text-sm">{v}</p>
                  </div>
                ))}
              </div>
              {proposal.research_notes && (
                <p className="text-blue-300/80 text-sm">{proposal.research_notes}</p>
              )}
            </div>
          )}

          <div className="text-center">
            <a href="/test" className="text-blue-400 hover:underline text-sm">Check backend connection</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App