import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchRecentCalls, type CallSummary } from '../lib/dashboard'
import { AppShell } from '../components/AppShell'
import { Icon } from '../components/icons'

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function CallHistory() {
  const navigate = useNavigate()
  const [calls, setCalls] = useState<CallSummary[] | null>(null)

  useEffect(() => {
    fetchRecentCalls(200)
      .then(setCalls)
      .catch(() => setCalls([]))
  }, [])

  return (
    <AppShell>
      <button type="button" className="fp-back" onClick={() => navigate(-1)}>
        <Icon name="back" size={18} />
        Back
      </button>
      <h1 className="page-title">Call history</h1>
      <p className="page-sub">Every conversation you&rsquo;ve had.</p>

      {calls === null ? (
        <div className="shell-loading" aria-busy="true" aria-label="Loading">
          <span className="dots">
            <span />
            <span />
            <span />
          </span>
        </div>
      ) : calls.length === 0 ? (
        <div className="card empty">No calls yet. Find a partner to start your first conversation.</div>
      ) : (
        <div className="feed">
          {calls.map((c) => (
            <div className="feed-row" key={c.id}>
              <button
                type="button"
                className="feed-avatar-btn"
                aria-label={`View ${c.partnerName ?? 'user'}'s profile`}
                onClick={() => navigate(`/user/${c.partnerId}`)}
              >
                <img
                  className="feed-avatar"
                  src={c.partnerAvatarUrl ?? '/avatars/man1_adult.svg'}
                  alt=""
                  width={44}
                  height={44}
                />
              </button>
              <span className="feed-main">
                <span className="feed-name">{c.partnerName ?? `User ${c.partnerId}`}</span>
                <span className="feed-time">{formatTime(c.startedAt)}</span>
              </span>
              {c.durationSec != null && (
                <span className="feed-dur">{formatDuration(c.durationSec)}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </AppShell>
  )
}
