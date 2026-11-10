import { useGoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { loginWithGoogleCode, loginWithPassword, signup } from '../lib/auth'

type Mode = 'login' | 'signup'

export function Landing() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const googleLogin = useGoogleLogin({
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

  const validate = (): string | null => {
    const trimmedEmail = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return 'Enter a valid email address.'
    }
    if (mode === 'signup') {
      if (name.trim().length < 2) {
        return 'Name must be at least 2 characters.'
      }
      if (password.length < 8) {
        return 'Password must be at least 8 characters.'
      }
      if (!/[0-9]/.test(password)) {
        return 'Password must contain at least one number.'
      }
    } else if (!password) {
      return 'Enter your password.'
    }
    return null
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const problem = validate()
    if (problem) {
      setError(problem)
      return
    }
    setBusy(true)
    setError(null)
    try {
      if (mode === 'signup') {
        await signup(email.trim(), password, name.trim())
      } else {
        await loginWithPassword(email.trim(), password)
      }
      navigate('/home')
    } catch (err) {
      const res = (err as { response?: { status?: number; data?: { message?: string } } })?.response
      if (res?.status === 409) {
        setError('That email is already registered. Try logging in.')
      } else if (res?.status === 401) {
        setError('Invalid email or password.')
      } else if (res?.data?.message) {
        setError(res.data.message)
      } else {
        setError('Something went wrong. Please try again.')
      }
      setBusy(false)
    }
  }

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

        <form className="auth-form" onSubmit={submit}>
          {mode === 'signup' && (
            <input
              className="call-input auth-field"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          )}
          <input
            className="call-input auth-field"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <input
            className="call-input auth-field"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            minLength={8}
            required
          />
          <button className="btn-primary" type="submit" disabled={busy}>
            {busy ? 'Please wait…' : mode === 'signup' ? 'Create Account' : 'Log In'}
          </button>
        </form>

        <button
          className="auth-toggle"
          type="button"
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login')
            setError(null)
          }}
        >
          {mode === 'login' ? 'New here? Create an account' : 'Already have an account? Log in'}
        </button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button
          className="btn-google"
          onClick={() => googleLogin()}
          disabled={busy}
          type="button"
        >
          <GoogleGlyph />
          Sign In with Google
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
