import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { completeOnboarding } from '../lib/auth'
import { LEVELS, OCCUPATIONS, INDIAN_STATES, avatarsFor } from '../lib/onboarding-data'

export function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [gender, setGender] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [englishLevel, setEnglishLevel] = useState('')
  const [occupation, setOccupation] = useState('')
  const [location, setLocation] = useState('')

  const steps = [
    { title: 'I am a…', valid: !!gender },
    { title: 'Choose your avatar', valid: !!avatarUrl },
    { title: 'Your English level', valid: !!englishLevel },
    { title: 'What do you do?', valid: !!occupation },
    { title: 'Where are you based?', valid: !!location },
  ]
  const last = step === steps.length - 1

  const next = async () => {
    if (!steps[step].valid) {
      return
    }
    if (!last) {
      setStep(step + 1)
      return
    }
    setSaving(true)
    setError(null)
    try {
      await completeOnboarding({ englishLevel, avatarUrl, gender, occupation, location })
      navigate('/home')
    } catch {
      setError('Could not save. Please try again.')
      setSaving(false)
    }
  }

  return (
    <div className="onb">
      <div className="onb-card">
        <div className="onb-progress" aria-hidden="true">
          {steps.map((_, i) => (
            <span key={i} className={i <= step ? 'onb-dot active' : 'onb-dot'} />
          ))}
        </div>
        <h1 className="onb-title">{steps[step].title}</h1>

        {step === 0 && (
          <div className="onb-choices">
            {['male', 'female'].map((g) => (
              <button
                key={g}
                type="button"
                className={gender === g ? 'onb-choice selected' : 'onb-choice'}
                onClick={() => { setGender(g); setAvatarUrl('') }}
              >
                {g[0].toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="onb-avatars">
            {avatarsFor(gender).map((url) => (
              <button
                key={url}
                type="button"
                className={avatarUrl === url ? 'onb-avatar selected' : 'onb-avatar'}
                onClick={() => setAvatarUrl(url)}
              >
                <img src={url} alt="" width={72} height={72} />
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="onb-choices">
            {LEVELS.map((l) => (
              <button
                key={l.value}
                type="button"
                className={englishLevel === l.value ? 'onb-choice selected' : 'onb-choice'}
                onClick={() => setEnglishLevel(l.value)}
              >
                <span className="onb-choice-label">{l.label}</span>
                <span className="onb-choice-hint">{l.hint}</span>
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="onb-cards">
            {OCCUPATIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                className={occupation === o.value ? 'onb-occ selected' : 'onb-occ'}
                onClick={() => setOccupation(o.value)}
              >
                <span className="onb-occ-icon" aria-hidden="true">{o.icon}</span>
                <span className="onb-occ-label">{o.label}</span>
                <span className="onb-occ-desc">{o.desc}</span>
              </button>
            ))}
          </div>
        )}

        {step === 4 && (
          <select className="onb-select" value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="">Select your state…</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}

        {error && <p className="onb-error" role="alert">{error}</p>}

        <div className="onb-actions">
          {step > 0 && (
            <button className="onb-back" type="button" onClick={() => setStep(step - 1)}>
              Back
            </button>
          )}
          <button className="onb-next" type="button" disabled={!steps[step].valid || saving} onClick={next}>
            {last ? (saving ? 'Setting up…' : 'Finish') : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}
