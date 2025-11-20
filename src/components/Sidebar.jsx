import { useEffect, useState } from 'react'
import { Bookmark, Highlighter, NotebookPen, Star, ListMusic } from 'lucide-react'

export default function Sidebar({ backend, user }) {
  const [highlights, setHighlights] = useState([])
  const [bookmarks, setBookmarks] = useState([])
  const [notes, setNotes] = useState([])
  const [playlists, setPlaylists] = useState([])

  const load = async () => {
    const base = backend
    const [h,b,n,p] = await Promise.all([
      fetch(`${base}/api/highlights?user_id=${user}`).then(r=>r.json()),
      fetch(`${base}/api/bookmarks?user_id=${user}`).then(r=>r.json()),
      fetch(`${base}/api/notes?user_id=${user}`).then(r=>r.json()),
      fetch(`${base}/api/playlists?user_id=${user}`).then(r=>r.json()),
    ])
    setHighlights(h)
    setBookmarks(b)
    setNotes(n)
    setPlaylists(p)
  }

  useEffect(()=>{ load() }, [])

  return (
    <div className="space-y-4">
      <Section icon={<Highlighter className="w-4 h-4" />} title="Highlights">
        {highlights.length ? highlights.map(h => (
          <Item key={h.id} title={h.reference} subtitle={h.color} />
        )) : <Empty text="No highlights yet" />}
      </Section>
      <Section icon={<Bookmark className="w-4 h-4" />} title="Bookmarks">
        {bookmarks.length ? bookmarks.map(b => (
          <Item key={b.id} title={b.reference} subtitle={b.label || b.translation} />
        )) : <Empty text="No bookmarks yet" />}
      </Section>
      <Section icon={<NotebookPen className="w-4 h-4" />} title="Notes">
        {notes.length ? notes.map(n => (
          <Item key={n.id} title={n.reference} subtitle={n.content.slice(0,40)} />
        )) : <Empty text="No notes yet" />}
      </Section>
      <Section icon={<ListMusic className="w-4 h-4" />} title="Verse Playlists">
        {playlists.length ? playlists.map(p => (
          <Item key={p.id} title={p.title} subtitle={(p.mood||p.theme)||`${p.references.length} verses`} />
        )) : <Empty text="No playlists yet" />}
      </Section>
    </div>
  )
}

function Section({ icon, title, children }){
  return (
    <div className="bg-slate-900/40 rounded-xl border border-slate-700/40">
      <div className="flex items-center gap-2 p-3 text-slate-200 border-b border-slate-700/40">
        <div className="text-blue-300">{icon}</div>
        <h4 className="font-medium">{title}</h4>
      </div>
      <div className="p-3 space-y-2 max-h-64 overflow-auto">
        {children}
      </div>
    </div>
  )
}

function Item({ title, subtitle }){
  return (
    <div className="text-slate-300">
      <div className="text-sm">{title}</div>
      <div className="text-xs text-slate-400">{subtitle}</div>
    </div>
  )
}

function Empty({ text }){
  return <div className="text-xs text-slate-500">{text}</div>
}
