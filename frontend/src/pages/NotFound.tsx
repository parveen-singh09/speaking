import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store/auth'

export function NotFound() {
  const navigate = useNavigate()
  const loggedIn = useAuth((s) => !!s.accessToken)

  return (
    <main className="notfound">
      <div className="notfound-inner">
        <span className="notfound-code">404</span>
        <h1>This page doesn&rsquo;t exist</h1>
        <p>The page you&rsquo;re looking for may have moved, or never existed.</p>
        <button className="shell-btn" type="button" onClick={() => navigate(loggedIn ? '/home' : '/')}>
          {loggedIn ? 'Back to Home' : 'Log In to Continue'}
        </button>
      </div>
    </main>
  )
}
