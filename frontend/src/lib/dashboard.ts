import { api } from './api'

export interface Stats {
  totalCallSec: number
  totalCalls: number
}

export interface CallSummary {
  id: number
  partnerId: number
  partnerName: string | null
  durationSec: number | null
  startedAt: string
}

export async function fetchStats(): Promise<Stats> {
  const res = await api.get<Stats>('/me/stats')
  return res.data
}

export async function fetchRecentCalls(): Promise<CallSummary[]> {
  const res = await api.get<CallSummary[]>('/me/calls')
  return res.data
}
