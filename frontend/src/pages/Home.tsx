import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchMe, type Me } from '../lib/auth'
import { fetchRecentCalls, fetchOnlineCount, type CallSummary } from '../lib/dashboard'
import { connectWs } from '../lib/ws'
import { useCall } from '../hooks/useCall'
import { AppShell } from '../components/AppShell'
import { CallScreen } from '../components/CallScreen'
import { Icon } from '../components/icons'

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

type FieldPeer = {
  src: string
  round?: boolean
  style: Record<string, string>
}

const FIELD_PEERS: FieldPeer[] = [
  { src: '/avatars/woman3_adult.svg', style: { top: '14%', left: '10%', '--sz': '48px', '--delay': '0s', '--bob': '6s' } },
  { src: '/avatars/man5_adult.svg', style: { top: '22%', right: '10%', '--sz': '40px', '--delay': '0.9s', '--bob': '7s' }, round: true },
  { src: '/avatars/woman8_adult.svg', style: { top: '30%', left: '26%', '--sz': '56px', '--delay': '1.3s', '--bob': '6.5s' } },
  { src: '/avatars/man2_adult.svg', style: { top: '24%', right: '26%', '--sz': '44px', '--delay': '0.5s', '--bob': '7.5s' }, round: true },
  { src: '/avatars/woman11_adult.svg', style: { top: '44%', right: '12%', '--sz': '50px', '--delay': '1.6s', '--bob': '6s' } },
  { src: '/avatars/man9_adult.svg', style: { top: '40%', left: '13%', '--sz': '38px', '--delay': '0.3s', '--bob': '8s' }, round: true },
  { src: '/avatars/woman1_adult.svg', style: { top: '54%', left: '40%', '--sz': '46px', '--delay': '1.1s', '--bob': '6.8s' } },
] as const

const FIELD_BLOBS = [
  { style: { top: '20%', left: '46%', width: '16px', height: '16px', background: '#c7b6ff', '--delay': '0.4s', '--bob': '7s' } },
  { style: { top: '48%', right: '30%', width: '22px', height: '22px', background: '#8363ff', '--delay': '1.2s', '--bob': '6s' } },
  { style: { top: '12%', left: '36%', width: '12px', height: '12px', background: '#ede9fe', '--delay': '0.7s', '--bob': '8s' } },
] as const

export function Home() {
  const navigate = useNavigate()
  const [me, setMe] = useState<Me | null>(null)
  const [calls, setCalls] = useState<CallSummary[]>([])
  const [onlineCount, setOnlineCount] = useState<number | null>(null)
  const [showCount, setShowCount] = useState(false)

  useEffect(() => {
    fetchMe()
      .then((m) => {
        if (!m.onboarded) {
          navigate('/onboarding', { replace: true })
          return
        }
        setMe(m)
        connectWs()
        fetchRecentCalls().then(setCalls).catch(() => {})
      })
      .catch(() => {})
  }, [navigate])

  // Poll the real online count (Redis presence) every 15s.
  useEffect(() => {
    if (!me) {
      return
    }
    const load = () => fetchOnlineCount().then(setOnlineCount).catch(() => {})
    load()
    const id = setInterval(load, 15000)
    return () => clearInterval(id)
  }, [me])

  // Alternate the badge between "Live matching" and the online count every 3s.
  useEffect(() => {
    if (onlineCount == null) {
      return
    }
    const id = setInterval(() => setShowCount((v) => !v), 3000)
    return () => clearInterval(id)
  }, [onlineCount])

  const call = useCall(me?.id ?? 0)

  // When a call ends (status returns to idle after being active), refresh the
  // recent-calls list so the just-finished call appears without a page reload.
  const prevStatus = useRef(call.status)
  useEffect(() => {
    if (prevStatus.current !== 'idle' && call.status === 'idle') {
      // Small delay so the backend has committed the call record first.
      const t = setTimeout(() => {
        fetchRecentCalls().then(setCalls).catch(() => {})
      }, 600)
      prevStatus.current = call.status
      return () => clearTimeout(t)
    }
    prevStatus.current = call.status
  }, [call.status])

  if (!me) {
    return (
      <AppShell>
        <div className="shell-loading" aria-busy="true" aria-label="Loading">
          <span className="loader-dot" />
        </div>
      </AppShell>
    )
  }

  const onlineLabel =
    showCount && onlineCount != null ? `${onlineCount.toLocaleString()} online` : 'Live matching'

  return (
    <AppShell>
      <section className="peer-hero" aria-labelledby="peer-hero-title">
          <div className="peer-field" aria-hidden="true">
            {FIELD_BLOBS.map((blob, i) => (
              <span key={i} className="peer-blob" style={blob.style as React.CSSProperties} />
            ))}
            {FIELD_PEERS.map((peer) => (
              <span
                key={peer.src}
                className={peer.round ? 'peer-chip round' : 'peer-chip'}
                style={peer.style as React.CSSProperties}
              >
                <img src={peer.src} alt="" />
              </span>
            ))}
          </div>

          <div className="peer-hero-top">
            <p className="kicker" id="peer-hero-title">
              Practice with people
            </p>
            {call.status === 'searching' ? (
              <span className="peer-online">
                <span className="dot" />
                Matching…
              </span>
            ) : (
              <span className="peer-online" aria-live="polite">
                <span className="dot" />
                <span key={onlineLabel} className="peer-online-text">
                  {onlineLabel}
                </span>
              </span>
            )}
          </div>

          <div className="peer-hero-action">
            <p className="peer-hero-status">
              We&rsquo;ll pair you with someone at your level.
            </p>
            <button className="btn call-start btn-lg" type="button" onClick={call.findPartner}>
              <Icon name="phone" size={20} />
              Find Partner
            </button>
          </div>
        </section>

      <section className="feed">
        <p className="feed-title">Recent Calls</p>
        {calls.length === 0 ? (
          <div className="card empty">
            No calls yet. Start a call to begin your first conversation.
          </div>
        ) : (
          calls.map((c) => (
            <div className="feed-row" key={c.id}>
              <span className="feed-ico">
                <Icon name="phone" size={16} />
              </span>
              <span className="feed-main">
                <span className="feed-name">{c.partnerName ?? `User ${c.partnerId}`}</span>
                <span className="feed-time">{formatTime(c.startedAt)}</span>
              </span>
              {c.durationSec != null && (
                <span className="feed-dur">{formatDuration(c.durationSec)}</span>
              )}
            </div>
          ))
        )}
      </section>

      {call.status !== 'idle' && <CallScreen call={call} />}
      <audio ref={call.remoteAudioRef} autoPlay />
    </AppShell>
  )
}
