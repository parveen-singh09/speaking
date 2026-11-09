import { useGoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { loginWithGoogleCode } from '../lib/auth'

export function Landing() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const login = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (response) => {
      setBusy(true)
      setError(null)
      try {
        await loginWithGoogleCode(response.code)
        navigate('/home')
      } catch {
        setError('Sign-in failed. Please try again.')
        setBusy(false)
      }
    },
    onError: () => setError('Google sign-in was cancelled.'),
  })

  return (
    <div className="landing">
      <section className="landing-pane">
        <span className="wordmark">
          Peer<span>Up</span>
        </span>
        <span className="landing-eyebrow">Speak, don&rsquo;t just study</span>
        <h1>
          Learn English by <em>talking</em> to real people.
        </h1>
        <p className="landing-sub">
          Get matched with a partner and jump into a live voice call. No scripts, no pressure &mdash;
          just conversation.
        </p>
        <button className="btn-google" onClick={() => login()} disabled={busy} type="button">
          <GoogleGlyph />
          {busy ? 'Signing You In…' : 'Sign In with Google'}
        </button>
        {error && (
          <p className="landing-error" role="alert" aria-live="polite">
            {error}
          </p>
        )}
      </section>
      <aside className="landing-aside" aria-hidden="true">
        <div className="pulse">
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={i} />
          ))}
        </div>
      </aside>
    </div>
  )
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.1 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v9.1h12.4c-.5 2.9-2.1 5.3-4.6 7l7.1 5.5c4.2-3.9 6.6-9.6 6.6-16.3z" />
      <path fill="#FBBC05" d="M10.5 28.3c-.5-1.4-.8-2.9-.8-4.3s.3-3 .8-4.3l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.6 10.4l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.3 0 11.6-2.1 15.5-5.7l-7.1-5.5c-2 1.3-4.6 2.1-8.4 2.1-6.3 0-11.6-3.6-13.5-8.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  )
}
