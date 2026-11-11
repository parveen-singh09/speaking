import { refreshAccessToken } from './auth'

export interface Envelope {
  type: string
  to?: string
  payload?: unknown
}

type Handler = (envelope: Envelope) => void

const WS_URL = (import.meta.env.VITE_API_URL as string).replace(/^http/, 'ws') + '/ws'
const RECONNECT_MS = 2000

let socket: WebSocket | null = null
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let wantOpen = false
const handlers = new Set<Handler>()

async function open() {
  const token = await refreshAccessToken()
  if (!token || !wantOpen) {
    return
  }
  socket = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`)

  socket.onmessage = (event) => {
    try {
      const envelope = JSON.parse(event.data) as Envelope
      handlers.forEach((h) => h(envelope))
    } catch {
    }
  }

  socket.onclose = () => {
    socket = null
    if (wantOpen) {
      reconnectTimer = setTimeout(open, RECONNECT_MS)
    }
  }
}

export function connectWs() {
  wantOpen = true
  if (!socket) {
    open()
  }
}

export function disconnectWs() {
  wantOpen = false
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  socket?.close()
  socket = null
}

export function sendWs(envelope: Envelope) {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(envelope))
  }
}

export function onWs(handler: Handler): () => void {
  handlers.add(handler)
  return () => handlers.delete(handler)
}
