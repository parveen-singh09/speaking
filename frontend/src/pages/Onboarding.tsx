import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { completeOnboarding, fetchMe } from '../lib/auth'
import { LEVELS, OCCUPATIONS, COUNTRIES, avatarsFor } from '../lib/onboarding-data'
import { Select } from '../components/Select'

export function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [gender, setGender] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [googlePhoto, setGooglePhoto] = useState<string | null>(null)

  // A Google photo is saved to avatarUrl at login (an http URL, not a local
  // /avatars SVG). Offer it as a choice before onboarding overwrites it.
  useEffect(() => {
    fetchMe()
      .then((m) => {
        if (m.avatarUrl && /^https?:\/\//.test(m.avatarUrl)) {
          setGooglePhoto(m.avatarUrl)
        }
      })
      .catch(() => {})
  }, [])
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
        <span className="onb-step-label">
          Step {step + 1} of {steps.length}
        </span>
        <h1 className="onb-title">{steps[step].title}</h1>

        {step === 0 && (
          <div className="onb-choices">
            {['male', 'female'].map((g) => (
              <button
                key={g}
                type="button"
                className={gender === g ? 'onb-choice selected' : 'onb-choice'}
                onClick={() => {
                  setGender(g)
                  setAvatarUrl('')
                }}
              >
                <span className="onb-choice-label">{g[0].toUpperCase() + g.slice(1)}</span>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="onb-avatars">
            {googlePhoto && (
              <button
                type="button"
                className={avatarUrl === googlePhoto ? 'onb-avatar google selected' : 'onb-avatar google'}
                onClick={() => setAvatarUrl(googlePhoto)}
                title="Your Google photo"
              >
                <img src={googlePhoto} alt="Your Google photo" width={72} height={72} referrerPolicy="no-referrer" />
              </button>
            )}
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
                <span className="onb-occ-icon" aria-hidden="true">
                  {o.icon}
                </span>
                <span className="onb-occ-label">{o.label}</span>
                <span className="onb-occ-desc">{o.desc}</span>
              </button>
            ))}
          </div>
        )}

        {step === 4 && (
          <Select
            value={location}
            options={COUNTRIES}
            placeholder="Select your country…"
            searchable
            onChange={setLocation}
          />
        )}

        {error && (
          <p className="onb-error" role="alert">
            {error}
          </p>
        )}

        <div className="onb-actions">
          {step > 0 && (
            <button className="btn btn-soft" type="button" onClick={() => setStep(step - 1)}>
              Back
            </button>
          )}
          <button
            className="btn btn-primary"
            type="button"
            disabled={!steps[step].valid || saving}
            onClick={next}
          >
            {last ? (saving ? 'Setting up…' : 'Finish') : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}
