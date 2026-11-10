import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchHistory, sendMessage, type ChatMessage } from '../lib/chat'
import { connectWs, onWs, type Envelope } from '../lib/ws'

export function Chat() {
  const navigate = useNavigate()
  const { friendId } = useParams<{ friendId: string }>()
  const peerId = Number(friendId)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    connectWs()
    fetchHistory(peerId).then(setMessages).catch(() => {})
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

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="wordmark" type="button" onClick={() => navigate('/friends')}>
          Peer<span>Up</span>
        </button>
      </header>

      <main className="chat-main">
        <div className="chat-thread">
          {messages.length === 0 ? (
            <p className="note">No messages yet. Say hello.</p>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={m.senderId === peerId ? 'bubble bubble-in' : 'bubble bubble-out'}
              >
                {m.body}
              </div>
            ))
          )}
          <div ref={endRef} />
        </div>

        <form className="chat-compose" onSubmit={send}>
          <input
            className="call-input chat-field"
            value={draft}
            maxLength={2000}
            placeholder="Type a message…"
            onChange={(e) => setDraft(e.target.value)}
            aria-label="Message"
          />
          <button className="btn-primary" type="submit" disabled={!draft.trim()}>
            Send
          </button>
        </form>
      </main>
    </div>
  )
}
