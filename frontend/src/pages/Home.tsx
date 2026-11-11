import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchMe, type Me } from '../lib/auth'
import { fetchStats, fetchRecentCalls, type Stats, type CallSummary } from '../lib/dashboard'
import { connectWs } from '../lib/ws'
import { useCall } from '../hooks/useCall'
import { AppShell } from '../components/AppShell'

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export function Home() {
  const navigate = useNavigate()
  const [me, setMe] = useState<Me | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [calls, setCalls] = useState<CallSummary[]>([])

  useEffect(() => {
    fetchMe()
      .then((m) => {
        if (!m.onboarded) {
          navigate('/onboarding', { replace: true })
          return
        }
        setMe(m)
        connectWs()
        fetchStats().then(setStats).catch(() => {})
        fetchRecentCalls().then(setCalls).catch(() => {})
      })
      .catch(() => {})
  }, [navigate])

  const call = useCall(me?.id ?? 0)

  if (!me) {
    return (
      <AppShell>
        <p className="feed-empty" aria-busy="true">Loading…</p>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <h1 className="shell-welcome">Welcome back, {me.name ?? me.email.split('@')[0]}</h1>

      <div className="dash-grid">
        <section className="hero-card">
          <h2>Ready to talk?</h2>

          {call.status === 'idle' && (
            <>
              <p>We&rsquo;ll pair you with someone at your level for a live English conversation.</p>
              <button className="shell-btn" type="button" onClick={call.findPartner}>
                Find a Partner
              </button>
            </>
          )}
          {call.status === 'searching' && (
            <>
              <p>Finding a partner for you…</p>
              <button className="shell-btn" type="button" onClick={call.cancelFind}>Cancel</button>
            </>
          )}
          {call.status === 'calling' && (
            <>
              <p>Connecting to your partner…</p>
              <button className="shell-btn" type="button" onClick={call.hangup}>Cancel</button>
            </>
          )}
          {call.status === 'ringing' && (
            <>
              <p>Incoming call from your partner.</p>
              <div className="call-actions">
                <button className="shell-btn" type="button" onClick={call.acceptCall}>Accept</button>
                <button className="nav-btn" type="button" onClick={call.hangup} aria-label="Decline">✕</button>
              </div>
            </>
          )}
          {call.status === 'connected' && (
            <>
              <p>You&rsquo;re on a live call. Speak freely.</p>
              <button className="shell-btn" type="button" onClick={call.hangup}>Hang Up</button>
            </>
          )}

          <div className="hero-pulse" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => <span key={i} />)}
          </div>
          <audio ref={call.remoteAudioRef} autoPlay />
        </section>

        <aside className="stats-panel">
          <div className="stat-row">
            <span className="stat-num">{stats?.totalCalls ?? 0}</span>
            <span className="stat-label">total calls</span>
          </div>
          <div className="stat-row">
            <span className="stat-num">{formatDuration(stats?.totalCallSec ?? 0)}</span>
            <span className="stat-label">talk time</span>
          </div>
          <div className="stat-row">
            <span className="stat-num">{me.englishLevel ?? '—'}</span>
            <span className="stat-label">level</span>
          </div>
          <button className="shell-btn" type="button" onClick={() => navigate('/profile')}>
            Edit Profile
          </button>
        </aside>
      </div>

      <section className="feed">
        <p className="feed-title">Recent Calls</p>
        {calls.length === 0 ? (
          <p className="feed-empty">No calls yet. Find a partner to start your first conversation.</p>
        ) : (
          calls.map((c) => (
            <div className="feed-row" key={c.id}>
              <span className="feed-time">{formatTime(c.startedAt)}</span>
              <span className="feed-body">
                Call with {c.partnerName ?? `user ${c.partnerId}`}
                {c.durationSec != null && ` · ${formatDuration(c.durationSec)}`}
              </span>
            </div>
          ))
        )}
      </section>
    </AppShell>
  )
}
