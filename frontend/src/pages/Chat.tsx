import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchHistory, sendMessage, type ChatMessage } from '../lib/chat'
import { connectWs, onWs, type Envelope } from '../lib/ws'
import { AppShell } from '../components/AppShell'
import { Icon } from '../components/icons'

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
    <AppShell>
      <div className="chat-page">
        <div className="chat-head">
          <button
            type="button"
            className="chat-back"
            aria-label="Back to friends"
            onClick={() => navigate('/friends')}
          >
            <Icon name="back" size={20} />
          </button>
          <span className="chat-peer-name">Conversation</span>
        </div>

        <div className="chat-scroll">
          {messages.length === 0 ? (
            <p className="empty">No messages yet. Say hello.</p>
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

        <form className="chat-send" onSubmit={send}>
          <input
            className="input chat-field"
            value={draft}
            maxLength={2000}
            placeholder="Type a message…"
            onChange={(e) => setDraft(e.target.value)}
            aria-label="Message"
          />
          <button className="btn chat-send-btn" type="submit" disabled={!draft.trim()} aria-label="Send">
            <Icon name="send" size={20} />
          </button>
        </form>
      </div>
    </AppShell>
  )
}
