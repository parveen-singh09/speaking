import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  acceptFriend,
  listFriends,
  listPending,
  searchUsers,
  sendFriendRequest,
  type Friend,
  type UserSearchResult,
} from '../lib/friends'
import { AppShell } from '../components/AppShell'

export function Friends() {
  const navigate = useNavigate()
  const [friends, setFriends] = useState<Friend[]>([])
  const [pending, setPending] = useState<Friend[]>([])
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UserSearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [sentTo, setSentTo] = useState<Set<number>>(new Set())

  const load = () => {
    listFriends().then(setFriends).catch(() => {})
    listPending().then(setPending).catch(() => {})
  }

  useEffect(load, [])

  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      return
    }
    setSearching(true)
    const t = setTimeout(() => {
      searchUsers(q)
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setSearching(false))
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  const send = async (userId: number) => {
    try {
      await sendFriendRequest(userId)
      setSentTo((prev) => new Set(prev).add(userId))
    } catch {
      // ignore; button stays available to retry
    }
  }

  const accept = async (friendshipId: number) => {
    await acceptFriend(friendshipId)
    load()
  }

  return (
    <AppShell>
      <h1 className="page-title">Friends</h1>
      <p className="page-sub">Find people to practise with and keep the conversation going.</p>

      <section className="friends-search">
        <input
          className="input"
          type="text"
          placeholder="Search people by name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search people by name"
        />
        {query.trim().length >= 2 && (
          <div className="search-results">
            {searching && <p className="hint">Searching…</p>}
            {!searching && results.length === 0 && (
              <p className="hint">No one found by that name.</p>
            )}
            {results.map((u) => (
              <div key={u.userId} className="person-row">
                <span className="person-id">
                  <img
                    className="person-avatar"
                    src={u.avatarUrl ?? '/avatars/man1_adult.svg'}
                    alt=""
                    width={44}
                    height={44}
                  />
                  <span className="person-main">
                    <span className="person-name">{u.name ?? `User ${u.userId}`}</span>
                    <span className="person-meta">
                      {u.englishLevel && <span className="person-tag">{u.englishLevel}</span>}
                      {u.location && <span className="person-tag">· {u.location}</span>}
                    </span>
                  </span>
                </span>
                <button
                  className="btn btn-ghost btn-sm"
                  type="button"
                  disabled={sentTo.has(u.userId)}
                  onClick={() => send(u.userId)}
                >
                  {sentTo.has(u.userId) ? 'Sent' : 'Add'}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {pending.length > 0 && (
        <>
          <div className="section-head">
            <h2>Requests</h2>
            <span className="chip">{pending.length}</span>
          </div>
          <div className="search-results">
            {pending.map((p) => (
              <div key={p.friendshipId} className="person-row">
                <span className="person-id">
                  <img
                    className="person-avatar"
                    src={p.avatarUrl ?? '/avatars/man1_adult.svg'}
                    alt=""
                    width={44}
                    height={44}
                  />
                  <span className="person-main">
                    <span className="person-name">{p.name ?? `User ${p.userId}`}</span>
                    {p.englishLevel && (
                      <span className="person-meta">
                        <span className="person-tag">{p.englishLevel}</span>
                      </span>
                    )}
                  </span>
                </span>
                <button
                  className="btn btn-primary btn-sm"
                  type="button"
                  onClick={() => accept(p.friendshipId)}
                >
                  Accept
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="section-head">
        <h2>Your friends</h2>
      </div>
      {friends.length === 0 ? (
        <div className="card empty">No friends yet. Search above to find people.</div>
      ) : (
        <div className="friend-grid">
          {friends.map((f) => (
            <button
              key={f.friendshipId}
              type="button"
              className="friend-card"
              onClick={() => navigate(`/chat/${f.userId}`)}
            >
              <img
                className="friend-card-avatar"
                src={f.avatarUrl ?? '/avatars/man1_adult.svg'}
                alt=""
                width={64}
                height={64}
              />
              <span className="friend-card-name">{f.name ?? `User ${f.userId}`}</span>
              {f.englishLevel && <span className="chip chip-outline">{f.englishLevel}</span>}
              <span className="friend-card-cta">Message →</span>
            </button>
          ))}
        </div>
      )}
    </AppShell>
  )
}
