import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { exchangeGoogleCode, fetchMe } from '../lib/auth'

export function AuthCallback() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [failed, setFailed] = useState(false)
  const done = useRef(false)

  useEffect(() => {
    if (done.current) {
      return
    }
    done.current = true
    const code = params.get('code')
    if (!code) {
      setFailed(true)
      return
    }
    exchangeGoogleCode(code)
      .then(() => fetchMe())
      .then((me) => navigate(me.onboarded ? '/home' : '/onboarding', { replace: true }))
      .catch(() => setFailed(true))
  }, [params, navigate])

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100svh', textAlign: 'center' }}>
      {failed ? (
        <div>
          <p>Sign-in failed. Please try again.</p>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/login', { replace: true })}>
            Back to login
          </button>
        </div>
      ) : (
        <p>Signing you in…</p>
      )}
    </div>
  )
}
