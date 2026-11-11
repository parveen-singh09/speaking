import { useEffect, useState } from 'react'
import { fetchMe, updateProfile, type Me } from '../lib/auth'
import { fetchStats, type Stats } from '../lib/dashboard'
import { listFriends } from '../lib/friends'
import { OCCUPATIONS, COUNTRIES } from '../lib/onboarding-data'
import { AppShell } from '../components/AppShell'
import { Select } from '../components/Select'
import { Icon } from '../components/icons'

const LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'fluent', label: 'Fluent' },
]

const OCCUPATION_OPTIONS = OCCUPATIONS.map((o) => ({ value: o.value, label: o.label }))

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

export function Profile() {
  const [me, setMe] = useState<Me | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [friendCount, setFriendCount] = useState<number | null>(null)
  const [bio, setBio] = useState('')
  const [level, setLevel] = useState('')
  const [occupation, setOccupation] = useState('')
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => {
    fetchMe()
      .then((m) => {
        setMe(m)
        setBio(m.bio ?? '')
        setLevel(m.englishLevel ?? '')
        setOccupation(m.occupation ?? '')
        setLocation(m.location ?? '')
      })
      .catch(() => setStatus('error'))
    fetchStats().then(setStats).catch(() => {})
    listFriends().then((f) => setFriendCount(f.length)).catch(() => {})
  }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('saving')
    try {
      const updated = await updateProfile({
        bio,
        englishLevel: level || undefined,
        occupation: occupation || undefined,
        location: location || undefined,
      })
      setMe(updated)
      setStatus('saved')
    } catch {
      setStatus('error')
    }
  }

  if (!me) {
    return (
      <AppShell>
        <div className="shell-loading" aria-busy="true" aria-label="Loading">
          <span className="loader-dot" />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <section className="profile-hero">
        <div className="profile-avatar-wrap">
          <img
            className="profile-avatar"
            src={me.avatarUrl ?? '/avatars/man1_adult.svg'}
            alt=""
            width={104}
            height={104}
          />
        </div>
        <div>
          <div className="profile-name">{me.name ?? me.email.split('@')[0]}</div>
          <div className="profile-email">{me.email}</div>
        </div>
      </section>

      <div className="stat-row profile-stats">
        <div className="card stat-card">
          <span className="stat-ico">
            <Icon name="phone" size={18} />
          </span>
          <span className="stat-num">{stats?.totalCalls ?? 0}</span>
          <span className="stat-label">Calls</span>
        </div>
        <div className="card stat-card">
          <span className="stat-ico">
            <Icon name="clock" size={18} />
          </span>
          <span className="stat-num">{formatDuration(stats?.totalCallSec ?? 0)}</span>
          <span className="stat-label">Talk time</span>
        </div>
        <div className="card stat-card">
          <span className="stat-ico">
            <Icon name="friends" size={18} />
          </span>
          <span className="stat-num">{friendCount ?? 0}</span>
          <span className="stat-label">Friends</span>
        </div>
      </div>

      <form className="card card-pad edit-form" onSubmit={save}>
        <label className="field">
          <span className="field-label">About you</span>
          <textarea
            className="textarea"
            value={bio}
            maxLength={500}
            rows={4}
            placeholder="A sentence or two about you and what you want to practise…"
            onChange={(e) => setBio(e.target.value)}
          />
        </label>

        <div className="field">
          <span className="field-label">English level</span>
          <Select
            value={level}
            options={LEVELS}
            placeholder="Select your level…"
            onChange={setLevel}
          />
        </div>

        <div className="field">
          <span className="field-label">Profession</span>
          <Select
            value={occupation}
            options={OCCUPATION_OPTIONS}
            placeholder="Select your profession…"
            searchable
            onChange={setOccupation}
          />
        </div>

        <div className="field">
          <span className="field-label">Location</span>
          <Select
            value={location}
            options={COUNTRIES}
            placeholder="Select your country…"
            searchable
            onChange={setLocation}
          />
        </div>

        <div className="edit-foot">
          <button className="btn btn-primary" type="submit" disabled={status === 'saving'}>
            {status === 'saving' ? 'Saving…' : 'Save Profile'}
          </button>
          {status === 'error' && (
            <span className="feedback-err" role="alert">
              Could not save. Try again.
            </span>
          )}
        </div>
      </form>
    </AppShell>
  )
}
