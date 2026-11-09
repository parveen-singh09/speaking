import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchMe, type Me } from '../lib/auth'
import { useAuth } from '../store/auth'
import { connectWs, disconnectWs } from '../lib/ws'
import { CallPanel } from '../components/CallPanel'

export function Home() {
  const navigate = useNavigate()
  const clear = useAuth((s) => s.clear)
  const [me, setMe] = useState<Me | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMe()
      .then(setMe)
      .catch(() => setError('We couldn’t load your profile. Try signing in again.'))
  }, [])

  useEffect(() => {
    connectWs()
    return () => disconnectWs()
  }, [])

  const logout = () => {
    clear()
    navigate('/')
  }

  if (error) {
    return (
      <main className="center-state" role="alert">
        <div>
          <p>{error}</p>
          <button className="btn-ghost" onClick={logout} type="button">
            Back to Sign In
          </button>
        </div>
      </main>
    )
  }

  if (!me) {
    return (
      <main className="center-state" aria-busy="true">
        Loading your space…
      </main>
    )
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <span className="wordmark">
          Peer<span>Up</span>
        </span>
        <div className="topbar-user">
          {me.avatarUrl && <img className="avatar" src={me.avatarUrl} alt="" width={36} height={36} />}
          <button className="btn-ghost" onClick={logout} type="button">
            Log Out
          </button>
        </div>
      </header>

      <main className="home-main">
        <div>
          <span className="online-tag">
            <span className="online-dot" aria-hidden="true" /> You&rsquo;re online
          </span>
          <h1 className="home-greeting">Hi, {me.name ?? me.email.split('@')[0]}</h1>
        </div>

        <CallPanel myId={me.id} />
      </main>
    </div>
  )
}
