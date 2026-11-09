import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchMe, type Me } from '../lib/auth'
import { useAuth } from '../store/auth'

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

        <section className="action-card">
          <h2>Ready to Talk?</h2>
          <p>
            We&rsquo;ll pair you with someone at your level for a live English conversation. Calls last
            as long as you both want.
          </p>
          <button className="btn-primary" type="button" disabled>
            Find a Partner
          </button>
          <span className="note">Matching arrives next &mdash; the call engine is being wired up.</span>
        </section>
      </main>
    </div>
  )
}
