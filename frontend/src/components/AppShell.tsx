import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/auth'
import { disconnectWs } from '../lib/ws'
import { listPending, listFriends } from '../lib/friends'
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
  const [friendsBadge, setFriendsBadge] = useState(0)

  // Friends badge = pending friend requests + total unread messages.
  useEffect(() => {
    Promise.all([listPending().catch(() => []), listFriends().catch(() => [])])
      .then(([pending, friends]) => {
        const unread = friends.reduce((sum, f) => sum + (f.unread ?? 0), 0)
        setFriendsBadge(pending.length + unread)
      })
      .catch(() => {})
  }, [location.pathname])

  const handleLogout = () => {
    disconnectWs()
    clear()
    navigate('/')
  }

  const isActive = (path: string) => location.pathname === path
  const badgeFor = (path: string) => (path === '/friends' ? friendsBadge : 0)

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
            {badgeFor(item.path) > 0 && <span className="nav-badge">{badgeFor(item.path)}</span>}
          </button>
        ))}
        <span className="rail-spacer" />
        <button type="button" className="rail-link rail-logout" onClick={handleLogout}>
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
            <span className="tab-icon">
              <Icon name={item.icon} size={22} />
              {badgeFor(item.path) > 0 && (
                <span className="nav-badge nav-badge-dot">{badgeFor(item.path)}</span>
              )}
            </span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
