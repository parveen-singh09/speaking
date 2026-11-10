import { useEffect, useState } from 'react'
import { fetchMe, updateProfile, type Me } from '../lib/auth'
import { AppShell } from '../components/AppShell'

const LEVELS = ['beginner', 'intermediate', 'advanced'] as const

export function Profile() {
  const [me, setMe] = useState<Me | null>(null)
  const [bio, setBio] = useState('')
  const [level, setLevel] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => {
    fetchMe()
      .then((m) => {
        setMe(m)
        setBio(m.bio ?? '')
        setLevel(m.englishLevel ?? '')
      })
      .catch(() => setStatus('error'))
  }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('saving')
    try {
      await updateProfile({ bio, englishLevel: level || undefined })
      setStatus('saved')
    } catch {
      setStatus('error')
    }
  }

  if (!me) {
    return (
      <AppShell>
        <p className="feed-empty" aria-busy="true">Loading…</p>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <h1 className="shell-h1">Your Profile</h1>
      <form className="panel" onSubmit={save}>
        <label className="shell-field">
          <span className="shell-field-label">English level</span>
          <select className="shell-input" value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="">Not set</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l[0].toUpperCase() + l.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <label className="shell-field">
          <span className="shell-field-label">Bio</span>
          <textarea
            className="shell-input shell-textarea"
            value={bio}
            maxLength={500}
            rows={4}
            placeholder="A sentence or two about you and what you want to practise…"
            onChange={(e) => setBio(e.target.value)}
          />
        </label>

        <button className="shell-btn" type="submit" disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving…' : 'Save Profile'}
        </button>
        {status === 'saved' && <span className="shell-saved" role="status">Saved</span>}
        {status === 'error' && <span className="shell-error" role="alert">Could not save. Try again.</span>}
      </form>
    </AppShell>
  )
}
