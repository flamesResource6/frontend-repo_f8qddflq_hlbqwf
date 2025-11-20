import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause } from 'lucide-react'

const translations = ['ESV','NIV']

export default function Reader({ backend }) {
  const [reference, setReference] = useState('John 3:16')
  const [left, setLeft] = useState('ESV')
  const [right, setRight] = useState('NIV')
  const [leftText, setLeftText] = useState('')
  const [rightText, setRightText] = useState('')
  const [audioOn, setAudioOn] = useState(false)
  const [audioData, setAudioData] = useState(null)
  const audioRef = useRef(null)

  const base = backend

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${base}/api/parallel?reference=${encodeURIComponent(reference)}&translations=${left},${right}`)
      const data = await res.json()
      const l = data.items.find(i => i.translation === left)
      const r = data.items.find(i => i.translation === right)
      setLeftText(l?.text || '')
      setRightText(r?.text || '')
    }
    load()
  }, [reference, left, right, base])

  useEffect(() => {
    if (!audioOn) return
    const run = async () => {
      const res = await fetch(`${base}/api/audio?reference=${encodeURIComponent(reference)}&translation=${left}`)
      const data = await res.json()
      setAudioData(data)
    }
    run()
  }, [audioOn, reference, left, base])

  const words = useMemo(() => leftText.split(' '), [leftText])

  const toggleAudio = () => {
    setAudioOn(v => !v)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="flex items-center gap-2">
        <input value={reference} onChange={(e)=>setReference(e.target.value)} className="bg-slate-800/70 border border-slate-700/40 rounded-lg px-3 py-2 text-slate-100 w-48" />
        <select value={left} onChange={(e)=>setLeft(e.target.value)} className="bg-slate-800/70 border border-slate-700/40 rounded-lg px-3 py-2 text-slate-100">
          {translations.map(t=> <option key={t}>{t}</option>)}
        </select>
        <span className="text-slate-400">Parallel</span>
        <select value={right} onChange={(e)=>setRight(e.target.value)} className="bg-slate-800/70 border border-slate-700/40 rounded-lg px-3 py-2 text-slate-100">
          {translations.map(t=> <option key={t}>{t}</option>)}
        </select>
        <button onClick={toggleAudio} className="ml-auto flex items-center gap-2 text-slate-200 bg-slate-800/70 hover:bg-slate-700/60 px-3 py-2 rounded-lg border border-slate-700/40">
          {audioOn ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />} <span className="text-sm">Audio</span>
        </button>
      </div>
      <div className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-4">
        <h3 className="text-slate-200 text-sm mb-2">{left} — {reference}</h3>
        <p className="text-xl leading-9 text-slate-100">
          {audioOn && audioData?.timings?.length ? (
            words.map((w, i) => (
              <span key={i} className="transition-colors" style={{
                backgroundColor: audioRef.current && audioRef.current.currentTime >= (audioData.timings[i]||Infinity) ? 'rgba(147,197,253,0.25)' : 'transparent'
              }}> {w} </span>
            ))
          ) : (
            leftText
          )}
        </p>
      </div>
      <div className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-4">
        <h3 className="text-slate-200 text-sm mb-2">{right} — {reference}</h3>
        <p className="text-xl leading-9 text-slate-100">{rightText}</p>
      </div>

      {audioOn && (
        <audio ref={audioRef} controls className="col-span-1 lg:col-span-2 w-full">
          <source src={audioData?.audio_url} type="audio/mpeg" />
        </audio>
      )}
    </div>
  )
}
