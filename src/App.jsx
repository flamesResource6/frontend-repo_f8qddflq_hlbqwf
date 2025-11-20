import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import Reader from './components/Reader'
import Sidebar from './components/Sidebar'

function App() {
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [showSettings, setShowSettings] = useState(false)
  const [audioToggle, setAudioToggle] = useState(false)
  const [results, setResults] = useState([])
  const [user] = useState('demo-user')

  const onSearch = async (q, viaVoice=false) => {
    if (!q?.trim()) return
    const res = await fetch(`${backend}/api/${viaVoice ? 'voice-search' : 'search'}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q, limit: 20 })
    })
    const data = await res.json()
    setResults(data)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto p-4 space-y-4">
        <Header onSearch={onSearch} onToggleAudio={()=>setAudioToggle(v=>!v)} onOpenSettings={()=>setShowSettings(true)} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 space-y-4">
            {results.length > 0 && (
              <div className="bg-slate-900/40 rounded-xl border border-slate-700/40 p-3">
                <h3 className="text-slate-300 text-sm mb-2">Search results</h3>
                <div className="space-y-1">
                  {results.map((r, i)=> (
                    <div key={i} className="text-slate-200 text-sm">
                      <span className="text-slate-400 mr-2">{r.reference} ({r.translation})</span>
                      <span>{r.snippet}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Reader backend={backend} />
          </div>
          <div className="lg:col-span-4">
            <Sidebar backend={backend} user={user} />
          </div>
        </div>

        <footer className="text-center text-slate-500 text-xs py-6">FlowBible • Theme: Dark • Parallel, Audio, Search, Notes (MVP)</footer>
      </div>
    </div>
  )
}

export default App
