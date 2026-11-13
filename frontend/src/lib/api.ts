import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuth } from '../store/auth'

const baseURL = import.meta.env.VITE_API_URL as string

export const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  if (config.url?.startsWith('/auth/')) {
    return config
  }
  const token = useAuth.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let refreshing: Promise<string> | null = null

async function refreshAccess(): Promise<string> {
  const refreshToken = useAuth.getState().refreshToken
  if (!refreshToken) {
    throw new Error('No refresh token')
  }
  const res = await axios.post<{ accessToken: string; refreshToken: string }>(
    `${baseURL}/auth/refresh`,
    { refreshToken },
  )
  useAuth.getState().setTokens(res.data.accessToken, res.data.refreshToken)
  return res.data.accessToken
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retried?: boolean }
    if (error.response?.status !== 401 || original._retried) {
      return Promise.reject(error)
    }
    original._retried = true
    try {
      if (!refreshing) {
        refreshing = refreshAccess().finally(() => {
          refreshing = null
        })
      }
      const token = await refreshing
      original.headers.Authorization = `Bearer ${token}`
      return api(original)
    } catch (e) {
      const refreshStatus = (e as AxiosError)?.response?.status
      // Only force logout if the refresh token was genuinely rejected.
      // A network failure (mobile losing connection) must not log the user out.
      if (refreshStatus === 401 || refreshStatus === 403) {
        useAuth.getState().clear()
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }
      return Promise.reject(e)
    }
  },
)
