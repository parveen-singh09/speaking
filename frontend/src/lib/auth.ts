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
  gender: string | null
  occupation: string | null
  location: string | null
  onboarded: boolean
}

export async function loginWithGoogleCode(code: string): Promise<void> {
  const res = await api.post<TokenResponse>('/auth/google', { code })
  useAuth.getState().setTokens(res.data.accessToken, res.data.refreshToken)
}

export async function signup(email: string, password: string, name: string): Promise<void> {
  const res = await api.post<TokenResponse>('/auth/signup', { email, password, name })
  useAuth.getState().setTokens(res.data.accessToken, res.data.refreshToken)
}

export async function loginWithPassword(email: string, password: string): Promise<void> {
  const res = await api.post<TokenResponse>('/auth/login', { email, password })
  useAuth.getState().setTokens(res.data.accessToken, res.data.refreshToken)
}

export async function fetchMe(): Promise<Me> {
  const res = await api.get<Me>('/me')
  return res.data
}

export interface UpdateProfile {
  bio?: string
  englishLevel?: string
}

export async function updateProfile(update: UpdateProfile): Promise<Me> {
  const res = await api.patch<Me>('/me', update)
  return res.data
}

export interface OnboardingData {
  englishLevel: string
  avatarUrl: string
  gender: string
  occupation: string
  location: string
}

export async function completeOnboarding(data: OnboardingData): Promise<Me> {
  const res = await api.post<Me>('/me/onboarding', data)
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
