import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchMe, updateProfile, type Me } from '../lib/auth'

const LEVELS = ['beginner', 'intermediate', 'advanced'] as const

export function Profile() {
  const navigate = useNavigate()
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
      <main className="center-state" aria-busy="true">
        Loading…
      </main>
    )
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="wordmark" type="button" onClick={() => navigate('/home')}>
          Peer<span>Up</span>
        </button>
      </header>

      <main className="home-main">
        <h1 className="home-greeting">Your Profile</h1>
        <form className="action-card" onSubmit={save}>
          <label className="field">
            <span className="field-label">English level</span>
            <select
              className="call-input"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="">Not set</option>
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l[0].toUpperCase() + l.slice(1)}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field-label">Bio</span>
            <textarea
              className="call-input bio-input"
              value={bio}
              maxLength={500}
              rows={4}
              placeholder="A sentence or two about you and what you want to practise…"
              onChange={(e) => setBio(e.target.value)}
            />
          </label>

          <button className="btn-primary" type="submit" disabled={status === 'saving'}>
            {status === 'saving' ? 'Saving…' : 'Save Profile'}
          </button>
          {status === 'saved' && (
            <span className="online-tag" role="status">
              Saved
            </span>
          )}
          {status === 'error' && (
            <span className="landing-error" role="alert">
              Could not save. Try again.
            </span>
          )}
        </form>
      </main>
    </div>
  )
}
