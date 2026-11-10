import { api } from './api'
import { sendWs } from './ws'

export interface ChatMessage {
  id: number
  senderId: number
  recipientId: number
  body: string
  createdAt: string
}

export async function fetchHistory(friendId: number): Promise<ChatMessage[]> {
  const res = await api.get<ChatMessage[]>(`/messages/${friendId}`)
  return res.data
}

export function sendMessage(recipientId: number, body: string): void {
  sendWs({ type: 'chat.send', to: String(recipientId), payload: { body } })
}
