import { api } from './api'

export interface Stats {
  totalCallSec: number
  totalCalls: number
}

export interface CallSummary {
  id: number
  partnerId: number
  partnerName: string | null
  partnerAvatarUrl: string | null
  durationSec: number | null
  startedAt: string
}

export async function fetchStats(): Promise<Stats> {
  const res = await api.get<Stats>('/me/stats')
  return res.data
}

export async function fetchRecentCalls(limit?: number): Promise<CallSummary[]> {
  const res = await api.get<CallSummary[]>('/me/calls', {
    params: limit ? { limit } : undefined,
  })
  return res.data
}

export async function fetchOnlineCount(): Promise<number> {
  const res = await api.get<{ count: number }>('/presence/online')
  return res.data.count
}
