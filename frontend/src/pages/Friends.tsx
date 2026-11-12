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
import { COUNTRIES } from '../lib/onboarding-data'
import { AppShell } from '../components/AppShell'
import { Select } from '../components/Select'
import { useCallContext } from '../components/CallProvider'
import { Icon } from '../components/icons'

const LEVEL_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'fluent', label: 'Fluent' },
]

export function Friends() {
  const navigate = useNavigate()
  const call = useCallContext()
  const [friends, setFriends] = useState<Friend[]>([])
  const [pending, setPending] = useState<Friend[]>([])
  const [query, setQuery] = useState('')
  const [filterLocation, setFilterLocation] = useState('')
  const [filterLevel, setFilterLevel] = useState('')
  const [results, setResults] = useState<UserSearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [sentTo, setSentTo] = useState<Set<number>>(new Set())
  const [loaded, setLoaded] = useState(false)

  const load = () => {
    listFriends()
      .then(setFriends)
      .catch(() => {})
      .finally(() => setLoaded(true))
    listPending().then(setPending).catch(() => {})
  }

  useEffect(load, [])

  useEffect(() => {
    const q = query.trim()
    const hasName = q.length >= 2
    const active = hasName || !!filterLocation || !!filterLevel
    if (!active) {
      setResults([])
      return
    }
    setSearching(true)
    const t = setTimeout(() => {
      searchUsers({
        q: hasName ? q : undefined,
        location: filterLocation || undefined,
        level: filterLevel || undefined,
      })
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setSearching(false))
    }, 300)
    return () => clearTimeout(t)
  }, [query, filterLocation, filterLevel])

  const send = async (userId: number) => {
    try {
      await sendFriendRequest(userId)
      setSentTo((prev) => new Set(prev).add(userId))
    } catch {
    }
  }

  const accept = async (friendshipId: number) => {
    await acceptFriend(friendshipId)
    load()
  }

  const friendIds = new Set(friends.map((f) => f.userId))

  return (
    <AppShell>
      <h1 className="page-title">Friends</h1>
      <p className="page-sub">Find people to practise with and keep the conversation going.</p>

      <section className="friends-search">
        <div className="friends-filters">
          <input
            className="input friends-filter-name"
            type="text"
            placeholder="Search by name…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search people by name"
          />
          <Select
            value={filterLevel}
            options={[{ value: '', label: 'Any level' }, ...LEVEL_OPTIONS]}
            placeholder="Any level"
            onChange={setFilterLevel}
          />
          <Select
            value={filterLocation}
            options={[{ value: '', label: 'Any country' }, ...COUNTRIES.map((c) => ({ value: c, label: c }))]}
            placeholder="Any country"
            searchable
            onChange={setFilterLocation}
          />
        </div>
        {(query.trim().length >= 2 || filterLocation || filterLevel) && (
          <div className="search-results">
            {searching && <p className="hint">Searching…</p>}
            {!searching && results.length === 0 && (
              <p className="hint">No one found with those filters.</p>
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
                {friendIds.has(u.userId) ? (
                  <button className="btn btn-soft btn-sm" type="button" disabled>
                    Added
                  </button>
                ) : (
                  <button
                    className="btn btn-ghost btn-sm"
                    type="button"
                    disabled={sentTo.has(u.userId)}
                    onClick={() => send(u.userId)}
                  >
                    {sentTo.has(u.userId) ? 'Sent' : 'Add'}
                  </button>
                )}
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
      {!loaded ? (
        <div className="shell-loading" aria-busy="true" aria-label="Loading">
          <span className="dots">
            <span />
            <span />
            <span />
          </span>
        </div>
      ) : friends.length === 0 ? (
        <div className="card empty">No friends yet. Search above to find people.</div>
      ) : (
        <div className="friend-list">
          {friends.map((f) => {
            const friendName = f.name ?? `User ${f.userId}`
            const hasUnread = (f.unread ?? 0) > 0
            return (
              <div key={f.friendshipId} className="friend-row">
                <button
                  type="button"
                  className="friend-row-avatar-btn"
                  aria-label={`View ${friendName}'s profile`}
                  onClick={() => navigate(`/user/${f.userId}`)}
                >
                  <span className="friend-row-avatar-wrap">
                    <img
                      className="friend-row-avatar"
                      src={f.avatarUrl ?? '/avatars/man1_adult.svg'}
                      alt=""
                      width={52}
                      height={52}
                    />
                  </span>
                </button>
                <button
                  type="button"
                  className="friend-row-open"
                  onClick={() => navigate(`/chat/${f.userId}`)}
                >
                  <span className="friend-row-main">
                    <span className="friend-row-name">{friendName}</span>
                    {hasUnread ? (
                      <span className="friend-row-preview unread">New message</span>
                    ) : (
                      <span className="friend-row-preview">
                        {f.lastMessage
                          ? `${f.lastMessageFromMe ? 'You: ' : ''}${f.lastMessage}`
                          : 'Tap to start messaging'}
                      </span>
                    )}
                  </span>
                  {hasUnread && <span className="friend-row-badge">{f.unread}</span>}
                </button>
                {f.online && <span className="online-text">online</span>}
                <button
                  type="button"
                  className="friend-row-call"
                  aria-label={`Call ${friendName}`}
                  onClick={() =>
                    call.callPeer(String(f.userId), {
                      name: f.name,
                      avatarUrl: f.avatarUrl,
                      bio: f.bio ?? null,
                      englishLevel: f.englishLevel,
                      location: f.location ?? null,
                    })
                  }
                >
                  <Icon name="phone" size={20} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </AppShell>
  )
}
