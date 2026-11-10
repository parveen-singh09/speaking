import type { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/auth'
import { disconnectWs } from '../lib/ws'

interface AppShellProps {
  children: ReactNode
}

const NAV = [
  { path: '/home', label: 'Home', glyph: 'M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5' },
  { path: '/friends', label: 'Friends', glyph: 'M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8m13 10v-2a4 4 0 0 0-3-3.9M16 2.1a4 4 0 0 1 0 7.8' },
  { path: '/profile', label: 'Profile', glyph: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8' },
]

export function AppShell({ children }: AppShellProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const clear = useAuth((s) => s.clear)

  const logout = () => {
    disconnectWs()
    clear()
    navigate('/')
  }

  return (
    <div className="shell">
      <nav className="sidebar" aria-label="Main navigation">
        <span className="sidebar-logo">P</span>
        {NAV.map((item) => {
          const active = location.pathname === item.path
          return (
            <button
              key={item.path}
              className={active ? 'nav-btn active' : 'nav-btn'}
              type="button"
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              onClick={() => navigate(item.path)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.glyph} />
              </svg>
            </button>
          )
        })}
        <span className="nav-spacer" />
        <button className="nav-btn" type="button" aria-label="Log out" onClick={logout}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
        </button>
      </nav>
      <main className="shell-main">{children}</main>
    </div>
  )
}
