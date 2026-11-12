import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchHistory, sendMessage, type ChatMessage } from '../lib/chat'
import { listFriends, type Friend } from '../lib/friends'
import { connectWs, onWs, type Envelope } from '../lib/ws'
import { AppShell } from '../components/AppShell'
import { useCallContext } from '../components/CallProvider'
import { Icon } from '../components/icons'

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

function formatDay(iso: string): string {
  const d = new Date(iso)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function Chat() {
  const navigate = useNavigate()
  const { friendId } = useParams<{ friendId: string }>()
  const peerId = Number(friendId)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [peer, setPeer] = useState<Friend | null>(null)
  const [draft, setDraft] = useState('')
  const endRef = useRef<HTMLDivElement | null>(null)
  const call = useCallContext()

  const startCall = () => {
    call.callPeer(String(peerId), {
      name: peer?.name ?? null,
      avatarUrl: peer?.avatarUrl ?? null,
      bio: peer?.bio ?? null,
      englishLevel: peer?.englishLevel ?? null,
      location: peer?.location ?? null,
    })
  }

  useEffect(() => {
    connectWs()
    fetchHistory(peerId).then(setMessages).catch(() => {})
    listFriends()
      .then((list) => setPeer(list.find((f) => f.userId === peerId) ?? null))
      .catch(() => {})
  }, [peerId])

  useEffect(() => {
    return onWs((env: Envelope) => {
      if (env.type === 'chat.receive') {
        const m = env.payload as ChatMessage
        if (m.senderId === peerId || m.recipientId === peerId) {
          setMessages((prev) => [...prev, m])
        }
      }
    })
  }, [peerId])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = (e: React.FormEvent) => {
    e.preventDefault()
    const body = draft.trim()
    if (!body) {
      return
    }
    sendMessage(peerId, body)
    setDraft('')
  }

  const peerName = peer?.name ?? `User ${peerId}`

  return (
    <AppShell>
      <div className="chat-page">
        <header className="chat-head">
          <button
            type="button"
            className="chat-back"
            aria-label="Back to friends"
            onClick={() => navigate('/friends')}
          >
            <Icon name="back" size={20} />
          </button>
          <span className="chat-head-avatar-wrap">
            <img
              className="chat-head-avatar"
              src={peer?.avatarUrl ?? '/avatars/man1_adult.svg'}
              alt=""
              width={40}
              height={40}
            />
          </span>
          <span className="chat-head-text">
            <span className="chat-peer-name">{peerName}</span>
            {peer && (
              <span className="chat-peer-status">{peer.online ? 'Online' : 'Offline'}</span>
            )}
          </span>
          <button
            type="button"
            className="chat-call-btn"
            aria-label={`Call ${peerName}`}
            onClick={startCall}
          >
            <Icon name="phone" size={20} />
          </button>
        </header>

        <div className="chat-scroll">
          {messages.length === 0 ? (
            <div className="chat-empty">
              <span className="chat-empty-ico">
                <Icon name="chat" size={26} />
              </span>
              <p>No messages yet</p>
              <span>Say hello to {peerName} to start the conversation.</span>
            </div>
          ) : (
            messages.map((m, i) => {
              const mine = m.senderId !== peerId
              const prev = messages[i - 1]
              const showDay = !prev || formatDay(prev.createdAt) !== formatDay(m.createdAt)
              return (
                <div key={m.id} className="chat-msg-group">
                  {showDay && (
                    <div className="chat-day">
                      <span>{formatDay(m.createdAt)}</span>
                    </div>
                  )}
                  <div className={mine ? 'bubble-row out' : 'bubble-row in'}>
                    <div className={mine ? 'bubble bubble-out' : 'bubble bubble-in'}>
                      <span className="bubble-body">{m.body}</span>
                      <span className="bubble-time">{formatTime(m.createdAt)}</span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
          <div ref={endRef} />
        </div>

        <form className="chat-send" onSubmit={send}>
          <input
            className="input chat-field"
            value={draft}
            maxLength={2000}
            placeholder="Type a message…"
            onChange={(e) => setDraft(e.target.value)}
            aria-label="Message"
          />
          <button
            className="btn chat-send-btn"
            type="submit"
            disabled={!draft.trim()}
            aria-label="Send"
          >
            <Icon name="send" size={20} />
          </button>
        </form>
      </div>
    </AppShell>
  )
}
