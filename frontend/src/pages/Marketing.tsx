import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/auth'

export function Marketing() {
  const navigate = useNavigate()
  const token = useAuth((s) => s.accessToken)

  // Logged-in users reopening the app land here (start_url) — send them in.
  useEffect(() => {
    if (token) {
      navigate('/home', { replace: true })
    }
  }, [token, navigate])

  return (
    <div className="mk">
      <header className="mk-bar">
        <div className="mk-bar-inner">
          <Link className="wordmark" to="/">
            Dialog<span>Buddy</span>
          </Link>
          <nav className="mk-nav">
            <a href="#how">How it works</a>
            <a href="#features">Features</a>
            <a href="#faq">FAQ</a>
          </nav>
          <Link className="mk-login" to="/login">
            Log in
          </Link>
        </div>
      </header>

      <main>
        <section className="mk-hero" aria-labelledby="hero-h">
          <div>
            <span className="mk-eyebrow">Speak, don&rsquo;t just study</span>
            <h1 id="hero-h">
              Learn English by <em>talking</em> to real people
            </h1>
            <p className="mk-lead">
              DialogBuddy matches you with a partner for a live voice call, so you practice real
              conversation.
            </p>
            <div className="mk-cta">
              <Link className="mk-btn mk-btn-primary" to="/login">
                Start speaking free
              </Link>
              <a className="mk-btn mk-btn-ghost" href="#how">
                See how it works
              </a>
            </div>
            <div className="mk-trust">
              <span className="mk-avatars">
                <img src="/avatars/woman3_adult.svg" alt="" width={34} height={34} />
                <img src="/avatars/man5_adult.svg" alt="" width={34} height={34} />
                <img src="/avatars/woman8_adult.svg" alt="" width={34} height={34} />
                <img src="/avatars/man9_adult.svg" alt="" width={34} height={34} />
              </span>
              <span className="mk-trust-text">Learners practicing live, right now</span>
            </div>
          </div>

          <div className="mk-visual" aria-hidden="true">
            <span className="mk-float mk-float-1">
              <img src="/avatars/woman11_adult.svg" alt="" width={52} height={52} />
            </span>
            <span className="mk-float mk-float-2">
              <img src="/avatars/man2_adult.svg" alt="" width={44} height={44} />
            </span>
            <span className="mk-float mk-float-3">
              <img src="/avatars/woman1_adult.svg" alt="" width={40} height={40} />
            </span>
            <div className="mk-callcard">
              <span className="mk-call-live">
                <span className="mk-live-dot" /> Live call
              </span>
              <span className="mk-call-avatar">
                <img src="/avatars/man13_adult.svg" alt="" width={96} height={96} />
              </span>
              <span className="mk-call-name">Rishi</span>
              <span className="mk-call-meta">Intermediate · speaking now</span>
              <span className="mk-wave">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </span>
              <span className="mk-call-timer">02:14</span>
            </div>
          </div>
        </section>

        <section className="mk-section" id="how" aria-labelledby="how-h">
          <h2 id="how-h">How it works</h2>
          <p className="mk-sub">Three steps to your first real English conversation.</p>
          <div className="mk-grid">
            <div className="mk-card">
              <div className="mk-step">1</div>
              <h3>Create your profile</h3>
              <p>Sign up free and tell us your English level and interests so we can match you well.</p>
            </div>
            <div className="mk-card">
              <div className="mk-step">2</div>
              <h3>Get matched</h3>
              <p>We pair you with a partner at your level who&rsquo;s ready to talk, right now.</p>
            </div>
            <div className="mk-card">
              <div className="mk-step">3</div>
              <h3>Talk &amp; improve</h3>
              <p>Jump into a live voice call and practice speaking. Add friends and keep going.</p>
            </div>
          </div>
        </section>

        <section className="mk-section" id="features" aria-labelledby="feat-h">
          <h2 id="feat-h">Why DialogBuddy</h2>
          <p className="mk-sub">Built for learners who want to actually speak, not just memorise.</p>
          <div className="mk-grid">
            {FEATURES.map((f) => (
              <div className="mk-card" key={f.title}>
                <span className="mk-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={f.icon} />
                  </svg>
                </span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mk-section" id="who" aria-labelledby="who-h">
          <h2 id="who-h">Who it&rsquo;s for</h2>
          <p className="mk-sub">
            If you can read and write English but freeze when it&rsquo;s time to speak, DialogBuddy is
            built for you.
          </p>
          <div className="mk-grid">
            {AUDIENCES.map((a) => (
              <div className="mk-card" key={a.title}>
                <span className="mk-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={a.icon} />
                  </svg>
                </span>
                <h3>{a.title}</h3>
                <p>{a.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mk-section" id="levels" aria-labelledby="levels-h">
          <h2 id="levels-h">For every level</h2>
          <p className="mk-sub">We match you with partners who fit where you are — and grow with you.</p>
          <div className="mk-grid mk-grid-4">
            {LEVELS.map((l) => (
              <div className="mk-card" key={l.tag}>
                <span className="mk-level">{l.tag}</span>
                <p>{l.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mk-section" id="faq" aria-labelledby="faq-h">
          <h2 id="faq-h">Frequently asked questions</h2>
          <p className="mk-sub">Everything you need to know about practicing English speaking with DialogBuddy.</p>
          <div className="mk-faq">
            {FAQ.map((q, i) => (
              <details key={q.q} open={i === 0}>
                <summary>{q.q}</summary>
                <p>{q.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="mk-footer">
        <div className="mk-footer-inner">
          <span className="mk-muted">© DialogBuddy. Speak English with real people.</span>
          <nav>
            <a href="/about.html">About</a>
            <a href="#faq">FAQ</a>
            <a href="/contact.html">Contact</a>
            <a href="/privacy.html">Privacy</a>
            <a href="/terms.html">Terms</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}

const FEATURES = [
  {
    title: 'Real voice calls',
    body: 'Practice with live, natural conversation — the only way speaking truly improves.',
    icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z',
  },
  {
    title: 'Matched to your level',
    body: "From beginner to fluent, you're paired with partners who fit where you are.",
    icon: 'M3 17h4v4H3zM10 10h4v11h-4zM17 4h4v17h-4z',
  },
  {
    title: 'Friendly & low-pressure',
    body: 'No grades, no judgment. Build confidence in a space made for learners.',
    icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4',
  },
  {
    title: 'Make friends',
    body: 'Add people you enjoy talking to, chat between calls, and call them anytime.',
    icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8m13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  },
  {
    title: 'Free to start',
    body: 'Create an account and start your first conversation at no cost.',
    icon: 'M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
  },
  {
    title: 'Practice anywhere',
    body: 'Works right in your browser on phone or laptop — no install needed.',
    icon: 'M2 3h20v14H2zM8 21h8M12 17v4',
  },
]

const AUDIENCES = [
  {
    title: 'Students',
    body: 'Practice for exams, interviews, and classes with partners who get where you are.',
    icon: 'M22 10 12 5 2 10l10 5 10-5zM6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5',
  },
  {
    title: 'Working professionals',
    body: 'Build the confidence to speak up in meetings, calls, and presentations.',
    icon: 'M4 7h16v14H4zM8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
  },
  {
    title: 'Job seekers',
    body: 'Rehearse real conversations so interviews feel natural, not nerve-racking.',
    icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 13l2 2 4-4',
  },
  {
    title: 'Travellers & everyday learners',
    body: 'Get comfortable chatting about anything — work, hobbies, daily life.',
    icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z',
  },
]

const LEVELS = [
  { tag: 'Beginner', body: 'Start with simple, patient conversations. Short exchanges, zero judgment.' },
  { tag: 'Intermediate', body: 'Hold longer conversations on everyday topics and smooth out hesitation.' },
  { tag: 'Advanced', body: 'Debate, tell stories, and express nuance with fluent speaking partners.' },
  { tag: 'Fluent', body: 'Keep your edge sharp and help others while you polish the finer details.' },
]

const FAQ = [
  {
    q: 'How can I practice English speaking?',
    a: 'The most effective way to practice English speaking is to have real conversations as often as possible. DialogBuddy matches you with a partner at your level for live voice calls, so you can practice speaking naturally without scripts or pressure.',
  },
  {
    q: 'How do I learn to speak English fluently?',
    a: "Fluency comes from regular, active use of the language. Speak rather than only read or listen, practice with real people, learn vocabulary in context, and don't fear mistakes. Fifteen minutes of real conversation every day improves fluency steadily.",
  },
  {
    q: 'How can I improve my English speaking at home for free?',
    a: 'You can improve your spoken English at home for free by practicing with conversation partners online, thinking in English, reading aloud, and recording yourself. DialogBuddy is free to start and connects you with real partners for live voice practice from anywhere.',
  },
  {
    q: 'How do I overcome the fear of speaking English?',
    a: 'Fear fades with practice in a safe, judgment-free setting. Start with friendly partners who are also learning, keep conversations low-pressure, and remember mistakes are a normal part of learning.',
  },
  {
    q: 'How can I improve my English pronunciation?',
    a: 'Improve pronunciation by listening closely to fluent speakers, repeating what you hear, and getting feedback during real conversations. Speaking with partners on DialogBuddy lets you practice pronunciation in context.',
  },
  {
    q: 'What is DialogBuddy and how does it work?',
    a: 'DialogBuddy is a platform for practicing spoken English with real people. You create an account, set your English level and interests, and get matched with a partner for a live voice call. You can also add friends, chat, and call them directly.',
  },
  {
    q: 'Is DialogBuddy free to use?',
    a: 'Yes. You can create an account and start having English conversations on DialogBuddy for free, using your email or Google account.',
  },
  {
    q: 'How long does it take to become fluent in English?',
    a: 'The time to fluency depends on your starting level, how often you practice, and how much you speak. Daily speaking practice is the single biggest accelerator of fluency.',
  },
]
