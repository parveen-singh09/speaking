import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { useCall } from '../hooks/useCall'
import { Icon } from './icons'

type Call = ReturnType<typeof useCall>

interface CallScreenProps {
  call: Call
}

function mmss(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')} : ${String(s).padStart(2, '0')}`
}

function titleCase(s: string | null): string {
  return s ? s[0].toUpperCase() + s.slice(1) : ''
}

const SEARCH_LIMIT_SEC = 240

export function CallScreen({ call }: CallScreenProps) {
  const [searchSec, setSearchSec] = useState(0)
  const [confirmEnd, setConfirmEnd] = useState(false)

  const isSearching = call.status === 'searching'
  const partner = call.partner
  const name = partner?.name ?? 'Speaking partner'
  const level = titleCase(partner?.englishLevel ?? null)

  useEffect(() => {
    if (!isSearching) {
      setSearchSec(0)
      return
    }
    const id = setInterval(() => {
      setSearchSec((s) => Math.min(s + 1, SEARCH_LIMIT_SEC))
    }, 1000)
    return () => clearInterval(id)
  }, [isSearching])

  const cancelFindRef = useRef(call.cancelFind)
  cancelFindRef.current = call.cancelFind
  useEffect(() => {
    if (isSearching && searchSec >= SEARCH_LIMIT_SEC) {
      cancelFindRef.current()
    }
  }, [isSearching, searchSec])

  useEffect(() => {
    window.history.pushState({ peerupCall: true }, '')
    const onPop = () => {
      window.history.pushState({ peerupCall: true }, '')
      setConfirmEnd(true)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const endCall = () => {
    if (isSearching) {
      call.cancelFind()
    } else {
      call.hangup()
    }
  }

  let content: ReactNode
  if (isSearching) {
    content = (
      <div className="callscreen" role="dialog" aria-label="Finding a partner">
        <div className="cs-center">
          <div className="cs-ring">
            <svg viewBox="0 0 100 100" aria-hidden="true">
              <defs>
                <linearGradient id="cs-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--violet-400)" />
                  <stop offset="100%" stopColor="var(--violet-600)" />
                </linearGradient>
              </defs>
              <circle className="cs-ring-track" cx="50" cy="50" r="44" />
              <circle className="cs-ring-arc" cx="50" cy="50" r="44" />
            </svg>
            <span className="cs-ring-inner">
              <span className="cs-timer-big">{mmss(searchSec)}</span>
              <span className="cs-timer-cap">Waiting time</span>
              <span className="cs-timer-cap">up to 4 minutes</span>
            </span>
          </div>
          <h1 className="cs-headline">Finding Perfect Partner</h1>
        </div>
        <button
          type="button"
          className="cs-cancel"
          aria-label="Cancel search"
          onClick={call.cancelFind}
        >
          <Icon name="close" size={24} />
        </button>
      </div>
    )
  } else if (call.status === 'ringing') {
    content = (
      <div className="callscreen" role="dialog" aria-label="Incoming call">
        <div className="cs-top">
          <span className="cs-avatar-ring cs-avatar-ring-pulse">
            {partner?.avatarUrl ? (
              <img src={partner.avatarUrl} alt="" referrerPolicy="no-referrer" />
            ) : (
              <span className="cs-avatar-blank" aria-hidden="true" />
            )}
          </span>
          <span className="cs-name">{name}</span>
          <span className="cs-incoming-label">Incoming call…</span>
        </div>
        <div className="cs-incoming-actions">
          <button
            type="button"
            className="cs-answer decline"
            aria-label="Decline"
            onClick={call.hangup}
          >
            <Icon name="phone" size={26} />
          </button>
          <button
            type="button"
            className="cs-answer accept"
            aria-label="Accept"
            onClick={call.acceptCall}
          >
            <Icon name="phone" size={26} />
          </button>
        </div>
      </div>
    )
  } else if (call.mode === 'direct' && call.status !== 'connected') {
    content = (
      <div className="callscreen" role="dialog" aria-label="Calling">
        <div className="cs-top">
          <span className="cs-avatar-ring cs-avatar-ring-pulse">
            {partner?.avatarUrl ? (
              <img src={partner.avatarUrl} alt="" referrerPolicy="no-referrer" />
            ) : (
              <span className="cs-avatar-blank" aria-hidden="true" />
            )}
          </span>
          <span className="cs-name">{name}</span>
          <span className="cs-establishing">
            <span className="dots">
              <span />
              <span />
              <span />
            </span>
            Calling…
          </span>
        </div>
        <div className="cs-foot">
          <button
            type="button"
            className="cs-answer decline"
            aria-label="Cancel call"
            onClick={call.hangup}
          >
            <Icon name="phone" size={26} />
          </button>
        </div>
      </div>
    )
  } else if (call.status === 'matched' || call.status === 'calling') {
    content = (
      <div className="callscreen" role="dialog" aria-label="Partner found">
        <div className="cs-top">
          <HighFive />
          <h1 className="cs-headline">Perfect Partner Found</h1>
        </div>
        <div className="cs-foot">
          <span className="cs-establishing">
            <span className="dots">
              <span />
              <span />
              <span />
            </span>
            Establishing connection…
          </span>
          <button
            type="button"
            className="cs-cancel"
            aria-label="Cancel"
            onClick={call.hangup}
          >
            <Icon name="close" size={24} />
          </button>
        </div>
      </div>
    )
  } else {
    content = (
      <div className="callscreen" role="dialog" aria-label="On a call">
        <div className="cs-body">
        <div className="cs-identity">
          <span className="cs-avatar-ring cs-avatar-glow">
            {partner?.avatarUrl ? (
              <img src={partner.avatarUrl} alt="" referrerPolicy="no-referrer" />
            ) : (
              <span className="cs-avatar-blank" aria-hidden="true" />
            )}
          </span>
          <span className="cs-name">{name}</span>
          {level && <span className="cs-occ">{level} speaker</span>}
          {partner?.location && (
            <span className="cs-loc">
              <Icon name="pin" size={16} />
              {partner.location}
            </span>
          )}
        </div>

        {partner?.bio && (
          <section className="cs-about">
            <div className="cs-about-head">
              <h2>About {partner.name ?? 'your partner'}</h2>
            </div>
            <p className="cs-about-body">{partner.bio}</p>
          </section>
        )}
      </div>

      <div className="cs-foot">
        <span className="cs-elapsed">
          {mmss(call.connectedSec)} <span>/ Unlimited</span>
        </span>
        <div className="cs-controls">
          <button
            type="button"
            className={call.micMuted ? 'cs-ctrl active' : 'cs-ctrl'}
            aria-label={call.micMuted ? 'Unmute microphone' : 'Mute microphone'}
            aria-pressed={call.micMuted}
            onClick={call.toggleMic}
          >
            <Icon name={call.micMuted ? 'micOff' : 'mic'} size={22} />
          </button>
          <button
            type="button"
            className="cs-hangup"
            aria-label="Hang up"
            onClick={() => setConfirmEnd(true)}
          >
            <Icon name="phone" size={26} />
          </button>
          <button
            type="button"
            className={call.speakerMuted ? 'cs-ctrl active' : 'cs-ctrl'}
            aria-label={call.speakerMuted ? 'Unmute speaker' : 'Mute speaker'}
            aria-pressed={call.speakerMuted}
            onClick={call.toggleSpeaker}
          >
            <Icon name={call.speakerMuted ? 'speakerOff' : 'speaker'} size={22} />
          </button>
        </div>
      </div>
      </div>
    )
  }

  return (
    <>
      {content}
      {confirmEnd && (
        <div className="cs-confirm" role="dialog" aria-modal="true" aria-label="End call">
          <div className="cs-confirm-card">
            {isSearching ? (
              <>
                <h2>Stop searching?</h2>
                <p>Are you sure you want to stop finding a partner?</p>
              </>
            ) : (
              <>
                <h2>End this call?</h2>
                <p>Are you sure you want to end the call with {name}?</p>
              </>
            )}
            <div className="cs-confirm-actions">
              <button
                type="button"
                className="btn btn-soft"
                onClick={() => setConfirmEnd(false)}
              >
                {isSearching ? 'Keep searching' : 'Keep talking'}
              </button>
              <button type="button" className="btn btn-danger" onClick={endCall}>
                {isSearching ? 'Stop' : 'End call'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function HighFive() {
  return (
    <svg
      className="cs-highfive"
      viewBox="0 0 220 170"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        d="M30 162C30 110 44 98 60 98C76 98 90 110 90 162Z"
        fill="var(--violet-400)"
        stroke="var(--violet-600)"
        strokeWidth="5"
      />
      <circle cx="60" cy="66" r="23" fill="var(--violet-400)" stroke="var(--violet-600)" strokeWidth="5" />
      <path d="M74 104L103 54" stroke="var(--violet-500)" strokeWidth="16" />
      <circle cx="104" cy="50" r="12" fill="var(--violet-400)" stroke="var(--violet-600)" strokeWidth="5" />

      <path
        d="M190 162C190 110 176 98 160 98C144 98 130 110 130 162Z"
        fill="var(--violet-400)"
        stroke="var(--violet-600)"
        strokeWidth="5"
      />
      <circle cx="160" cy="66" r="23" fill="var(--violet-400)" stroke="var(--violet-600)" strokeWidth="5" />
      <path d="M146 104L117 54" stroke="var(--violet-500)" strokeWidth="16" />
      <circle cx="116" cy="50" r="12" fill="var(--violet-400)" stroke="var(--violet-600)" strokeWidth="5" />

      <g fill="none" stroke="var(--violet-700)" strokeWidth="3">
        <path d="M51 64q4-4 8 0M61 64q4-4 8 0M54 74q6 5 12 0" />
        <path d="M151 64q4-4 8 0M161 64q4-4 8 0M154 74q6 5 12 0" />
      </g>

      <g stroke="var(--gold)" strokeWidth="3">
        <path d="M110 30v-9M110 70v2M98 44l-6-5M122 44l6-5" />
      </g>
    </svg>
  )
}
