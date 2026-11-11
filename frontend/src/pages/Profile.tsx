import { useEffect, useState } from 'react'
import { fetchMe, updateProfile, type Me } from '../lib/auth'
import { OCCUPATIONS } from '../lib/onboarding-data'
import { AppShell } from '../components/AppShell'

const LEVELS = ['beginner', 'intermediate', 'advanced', 'fluent'] as const

function titleCase(s: string): string {
  return s ? s[0].toUpperCase() + s.slice(1) : s
}

function occupationLabel(value: string | null): string {
  if (!value) return '—'
  return OCCUPATIONS.find((o) => o.value === value)?.label ?? titleCase(value.replace(/_/g, ' '))
}

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
      const updated = await updateProfile({ bio, englishLevel: level || undefined })
      setMe(updated)
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

      <section className="panel profile-head">
        {me.avatarUrl && <img className="profile-avatar" src={me.avatarUrl} alt="" width={88} height={88} />}
        <div>
          <div className="profile-name">{me.name ?? me.email}</div>
          <div className="profile-meta">{me.email}</div>
          {me.bio && <p className="profile-bio">{me.bio}</p>}
        </div>
      </section>

      <section className="panel">
        <h2>Details</h2>
        <dl className="profile-grid">
          <div><dt>Gender</dt><dd>{titleCase(me.gender ?? '') || '—'}</dd></div>
          <div><dt>English level</dt><dd>{titleCase(me.englishLevel ?? '') || '—'}</dd></div>
          <div><dt>Occupation</dt><dd>{occupationLabel(me.occupation)}</dd></div>
          <div><dt>Location</dt><dd>{me.location ?? '—'}</dd></div>
        </dl>
      </section>

      <form className="panel" onSubmit={save}>
        <h2>Edit</h2>
        <label className="shell-field">
          <span className="shell-field-label">English level</span>
          <select className="shell-input" value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="">Not set</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>{titleCase(l)}</option>
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
