import { useEffect, useState } from 'react'
import { BookOpen, Search, Headphones, Settings, Sparkles } from 'lucide-react'

export default function Header({ onSearch, onToggleAudio, onOpenSettings }) {
  const [query, setQuery] = useState('')
  const [listening, setListening] = useState(false)

  // Voice search using Web Speech API (if available)
  const handleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      onSearch(query)
      return
    }
    const rec = new SpeechRecognition()
    rec.lang = 'en-US'
    rec.interimResults = false
    setListening(true)
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript
      setQuery(transcript)
      onSearch(transcript, true)
      setListening(false)
    }
    rec.onerror = () => setListening(false)
    rec.onend = () => setListening(false)
    rec.start()
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-slate-900/60 backdrop-blur supports-[backdrop-filter]:bg-slate-900/40 rounded-xl border border-slate-700/40">
      <div className="flex items-center gap-2 text-white/90">
        <BookOpen className="w-5 h-5 text-blue-400" />
        <span className="font-semibold">FlowBible</span>
      </div>

      <div className="flex-1 flex items-center gap-2">
        <div className="flex items-center gap-2 bg-slate-800/70 rounded-lg px-3 py-2 w-full border border-slate-700/40">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch(query)}
            placeholder="Search verses, topics, people…"
            className="bg-transparent outline-none text-slate-100 placeholder:text-slate-400 w-full"
          />
          <button onClick={() => onSearch(query)} className="text-xs px-2 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-500">Search</button>
          <button onClick={handleVoice} className={`text-xs px-2 py-1 rounded-md ${listening ? 'bg-emerald-600' : 'bg-slate-700 hover:bg-slate-600'} text-white`}>{listening ? 'Listening…' : 'Voice'}</button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onToggleAudio} className="px-3 py-2 rounded-lg bg-slate-800/70 text-slate-200 hover:bg-slate-700/60 border border-slate-700/40">
          <Headphones className="w-4 h-4" />
        </button>
        <button onClick={onOpenSettings} className="px-3 py-2 rounded-lg bg-slate-800/70 text-slate-200 hover:bg-slate-700/60 border border-slate-700/40">
          <Settings className="w-4 h-4" />
        </button>
        <div className="hidden sm:flex items-center gap-1 text-amber-300/90 bg-amber-500/10 border border-amber-400/30 px-2 py-1 rounded-md">
          <Sparkles className="w-4 h-4" /><span className="text-xs">AI</span>
        </div>
      </div>
    </div>
  )
}
