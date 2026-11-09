import { api } from './api'
import { useAuth } from '../store/auth'

interface TokenResponse {
  accessToken: string
  refreshToken: string
}

export interface Me {
  id: number
  email: string
  name: string | null
  avatarUrl: string | null
  bio: string | null
  englishLevel: string | null
}

export async function loginWithGoogleCode(code: string): Promise<void> {
  const res = await api.post<TokenResponse>('/auth/google', { code })
  useAuth.getState().setTokens(res.data.accessToken, res.data.refreshToken)
}

export async function fetchMe(): Promise<Me> {
  const res = await api.get<Me>('/me')
  return res.data
}

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = useAuth.getState().refreshToken
  if (!refreshToken) {
    return null
  }
  try {
    const res = await api.post<TokenResponse>('/auth/refresh', { refreshToken })
    useAuth.getState().setTokens(res.data.accessToken, res.data.refreshToken)
    return res.data.accessToken
  } catch {
    useAuth.getState().clear()
    return null
  }
}
