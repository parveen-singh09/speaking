import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchHistory, sendMessage, type ChatMessage } from '../lib/chat'
import { connectWs, onWs, type Envelope } from '../lib/ws'
import { AppShell } from '../components/AppShell'

export function Chat() {
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
      <h1 className="shell-h1">Chat</h1>
      <div className="chat-wrap">
        <div className="chat-scroll">
          {messages.length === 0 ? (
            <p className="feed-empty">No messages yet. Say hello.</p>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={m.senderId === peerId ? 'dbubble dbubble-in' : 'dbubble dbubble-out'}
              >
                {m.body}
              </div>
            ))
          )}
          <div ref={endRef} />
        </div>

        <form className="chat-send" onSubmit={send}>
          <input
            className="shell-input chat-field"
            value={draft}
            maxLength={2000}
            placeholder="Type a message…"
            onChange={(e) => setDraft(e.target.value)}
            aria-label="Message"
          />
          <button className="shell-btn" type="submit" disabled={!draft.trim()}>
            Send
          </button>
        </form>
      </div>
    </AppShell>
  )
}
