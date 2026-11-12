import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchPublicProfile, type PublicProfile } from '../lib/auth'
import { OCCUPATIONS } from '../lib/onboarding-data'
import { AppShell } from '../components/AppShell'
import { useCallContext } from '../components/CallProvider'
import { Icon } from '../components/icons'

function titleCase(s: string | null): string {
  return s ? s[0].toUpperCase() + s.slice(1) : ''
}

function occupationLabel(value: string | null): string {
  if (!value) return '—'
  return OCCUPATIONS.find((o) => o.value === value)?.label ?? titleCase(value.replace(/_/g, ' '))
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

export function FriendProfile() {
  const navigate = useNavigate()
  const { userId } = useParams<{ userId: string }>()
  const id = Number(userId)
  const call = useCallContext()

  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchPublicProfile(id)
      .then(setProfile)
      .catch(() => setError(true))
  }, [id])

  if (error) {
    return (
      <AppShell>
        <div className="card empty">This profile isn&rsquo;t available.</div>
      </AppShell>
    )
  }

  if (!profile) {
    return (
      <AppShell>
        <div className="shell-loading" aria-busy="true" aria-label="Loading">
          <span className="dots">
            <span />
            <span />
            <span />
          </span>
        </div>
      </AppShell>
    )
  }

  const name = profile.name ?? `User ${profile.userId}`
  const startCall = () => {
    call.callPeer(String(profile.userId), {
      name: profile.name,
      avatarUrl: profile.avatarUrl,
      bio: profile.bio,
      englishLevel: profile.englishLevel,
      location: profile.location,
    })
  }

  const info = [
    { icon: 'level' as const, key: 'English level', val: titleCase(profile.englishLevel) || '—' },
    { icon: 'work' as const, key: 'Profession', val: occupationLabel(profile.occupation) },
    { icon: 'pin' as const, key: 'Location', val: profile.location ?? '—' },
  ]

  return (
    <AppShell>
      <button type="button" className="fp-back" onClick={() => navigate(-1)}>
        <Icon name="back" size={18} />
        Back
      </button>

      <section className="profile-hero">
        <div className="profile-avatar-wrap">
          <img
            className={profile.online ? 'profile-avatar online-ring' : 'profile-avatar'}
            src={profile.avatarUrl ?? '/avatars/man1_adult.svg'}
            alt=""
            width={104}
            height={104}
            referrerPolicy="no-referrer"
          />
        </div>
        <div>
          <div className="profile-name">{name}</div>
          <div className="profile-email">{profile.online ? 'Online now' : 'Offline'}</div>
        </div>
      </section>

      <div className="fp-actions">
        <button className="btn btn-primary" type="button" onClick={startCall}>
          <Icon name="phone" size={18} />
          Call
        </button>
        <button
          className="btn btn-soft"
          type="button"
          onClick={() => navigate(`/chat/${profile.userId}`)}
        >
          <Icon name="chat" size={18} />
          Message
        </button>
      </div>

      <div className="stat-row profile-stats">
        <div className="card stat-card">
          <span className="stat-ico">
            <Icon name="phone" size={18} />
          </span>
          <span className="stat-num">{profile.totalCalls}</span>
          <span className="stat-label">Calls</span>
        </div>
        <div className="card stat-card">
          <span className="stat-ico">
            <Icon name="clock" size={18} />
          </span>
          <span className="stat-num">{formatDuration(profile.totalCallSec)}</span>
          <span className="stat-label">Talk time</span>
        </div>
        <div className="card stat-card">
          <span className="stat-ico">
            <Icon name="friends" size={18} />
          </span>
          <span className="stat-num">{profile.friends}</span>
          <span className="stat-label">Friends</span>
        </div>
      </div>

      {profile.bio && (
        <section className="card card-pad fp-bio">
          <h2>About {name}</h2>
          <p>{profile.bio}</p>
        </section>
      )}

      <section className="card card-pad">
        <div className="info-list">
          {info.map((row) => (
            <div className="info-row" key={row.key}>
              <span className="info-ico">
                <Icon name={row.icon} size={18} />
              </span>
              <span className="info-text">
                <span className="info-key">{row.key}</span>
                <span className="info-val">{row.val}</span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  )
}
