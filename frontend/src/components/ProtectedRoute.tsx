import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../store/auth'
import { refreshAccessToken } from '../lib/auth'

interface ProtectedRouteProps {
  children: ReactNode
}

type Status = 'checking' | 'authed' | 'unauthed'

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const accessToken = useAuth((s) => s.accessToken)
  const refreshToken = useAuth((s) => s.refreshToken)
  const [status, setStatus] = useState<Status>(() =>
    accessToken ? 'authed' : refreshToken ? 'checking' : 'unauthed',
  )
  const tried = useRef(false)

  useEffect(() => {
    if (status !== 'checking' || tried.current) {
      return
    }
    tried.current = true
    refreshAccessToken().then((token) => {
      setStatus(token ? 'authed' : 'unauthed')
    })
  }, [status])

  if (status === 'checking') {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '100svh' }}>
        Checking session…
      </div>
    )
  }
  if (status === 'unauthed') {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}
