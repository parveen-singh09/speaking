import { api } from './api'

export interface Friend {
  friendshipId: number
  userId: number
  name: string | null
  avatarUrl: string | null
  englishLevel: string | null
  bio?: string | null
  location?: string | null
  online?: boolean
  lastMessage?: string | null
  lastMessageFromMe?: boolean
  unread?: number
}

export async function listFriends(): Promise<Friend[]> {
  const res = await api.get<Friend[]>('/friends')
  return res.data
}

export async function listPending(): Promise<Friend[]> {
  const res = await api.get<Friend[]>('/friends/pending')
  return res.data
}

export interface UserSearchResult {
  userId: number
  name: string | null
  avatarUrl: string | null
  englishLevel: string | null
  location: string | null
}

export interface SearchFilters {
  q?: string
  location?: string
  level?: string
}

export async function searchUsers(filters: SearchFilters): Promise<UserSearchResult[]> {
  const params: Record<string, string> = {}
  if (filters.q) params.q = filters.q
  if (filters.location) params.location = filters.location
  if (filters.level) params.level = filters.level
  const res = await api.get<UserSearchResult[]>('/friends/search', { params })
  return res.data
}

export async function sendFriendRequest(addresseeId: number): Promise<void> {
  await api.post('/friends/requests', { addresseeId })
}

export async function acceptFriend(friendshipId: number): Promise<void> {
  await api.post(`/friends/${friendshipId}/accept`)
}
