import type { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/auth'
import { disconnectWs } from '../lib/ws'
import { Icon } from './icons'

interface AppShellProps {
  children: ReactNode
}

const NAV = [
  { path: '/home', label: 'Home', icon: 'home' as const },
  { path: '/friends', label: 'Friends', icon: 'friends' as const },
  { path: '/profile', label: 'Profile', icon: 'profile' as const },
]

export function AppShell({ children }: AppShellProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const clear = useAuth((s) => s.clear)

  const handleLogout = () => {
    disconnectWs()
    clear()
    navigate('/')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="shell">
      <nav className="rail" aria-label="Main navigation">
        <div className="rail-logo">
          <span className="wordmark">
            Peer<span>Up</span>
          </span>
        </div>
        {NAV.map((item) => (
          <button
            key={item.path}
            type="button"
            className={isActive(item.path) ? 'rail-link active' : 'rail-link'}
            aria-current={isActive(item.path) ? 'page' : undefined}
            onClick={() => navigate(item.path)}
          >
            <Icon name={item.icon} />
            {item.label}
          </button>
        ))}
        <span className="rail-spacer" />
        <button type="button" className="rail-link" onClick={handleLogout}>
          <Icon name="logout" />
          Log out
        </button>
      </nav>

      <main className="page">{children}</main>

      <nav className="tabbar" aria-label="Main navigation">
        {NAV.map((item) => (
          <button
            key={item.path}
            type="button"
            className={isActive(item.path) ? 'tab active' : 'tab'}
            aria-current={isActive(item.path) ? 'page' : undefined}
            onClick={() => navigate(item.path)}
          >
            <Icon name={item.icon} size={22} />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
