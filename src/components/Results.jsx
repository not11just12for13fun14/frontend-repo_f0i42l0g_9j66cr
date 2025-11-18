export default function Results({ result, onGenerate, opportunities }) {
  if (!result) return null

  return (
    <div className="bg-slate-800/60 border border-blue-500/20 rounded-2xl p-6 space-y-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-white font-semibold text-lg">Evaluation</h3>
        <span className="text-blue-300">Fit score: <strong>{result.fit_score}%</strong></span>
      </div>
      <p className="text-blue-200/90">{result.evaluation}</p>
      <div>
        <h4 className="text-white font-semibold mb-2">Top Matches</h4>
        <ul className="space-y-2">
          {opportunities.map((o, i) => (
            <li key={i} className="bg-slate-900/60 border border-slate-700 rounded p-3 text-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{o.title}</p>
                  <p className="text-sm text-blue-300/80">{o.programme}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a className="text-sm text-blue-400 hover:underline" href={o.url} target="_blank" rel="noreferrer">Open</a>
                  <button onClick={() => onGenerate(i)} className="text-sm px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white">Generate draft</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
