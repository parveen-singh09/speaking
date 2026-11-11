import { api } from './api'

export interface Friend {
  friendshipId: number
  userId: number
  name: string | null
  avatarUrl: string | null
  englishLevel: string | null
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

export async function searchUsers(q: string): Promise<UserSearchResult[]> {
  const res = await api.get<UserSearchResult[]>('/friends/search', { params: { q } })
  return res.data
}

export async function sendFriendRequest(addresseeId: number): Promise<void> {
  await api.post('/friends/requests', { addresseeId })
}

export async function acceptFriend(friendshipId: number): Promise<void> {
  await api.post(`/friends/${friendshipId}/accept`)
}
