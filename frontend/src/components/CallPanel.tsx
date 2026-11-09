import { useCall } from '../hooks/useCall'

interface CallPanelProps {
  myId: number
}

export function CallPanel({ myId }: CallPanelProps) {
  const { status, peerId, remoteAudioRef, findPartner, cancelFind, acceptCall, hangup } =
    useCall(myId)

  return (
    <section className="action-card">
      <h2>Ready to Talk?</h2>

      {status === 'idle' && (
        <>
          <p>
            We&rsquo;ll pair you with someone for a live English conversation. Calls last as long as
            you both want.
          </p>
          <button className="btn-primary" type="button" onClick={findPartner}>
            Find a Partner
          </button>
        </>
      )}

      {status === 'searching' && (
        <>
          <span className="online-tag">Finding a partner…</span>
          <button className="btn-ghost" type="button" onClick={cancelFind}>
            Cancel
          </button>
        </>
      )}

      {status === 'calling' && (
        <>
          <span className="note">Connecting to user {peerId}…</span>
          <button className="btn-ghost" type="button" onClick={hangup}>
            Cancel
          </button>
        </>
      )}

      {status === 'ringing' && (
        <>
          <span className="online-tag">Incoming call from user {peerId}</span>
          <div className="call-actions">
            <button className="btn-primary" type="button" onClick={acceptCall}>
              Accept
            </button>
            <button className="btn-ghost" type="button" onClick={hangup}>
              Decline
            </button>
          </div>
        </>
      )}

      {status === 'connected' && (
        <>
          <span className="online-tag">
            <span className="online-dot" aria-hidden="true" /> On a call with user {peerId}
          </span>
          <button className="btn-ghost" type="button" onClick={hangup}>
            Hang Up
          </button>
        </>
      )}

      <audio ref={remoteAudioRef} autoPlay />
    </section>
  )
}
