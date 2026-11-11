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
      <h1 className="shell-h1">Friends</h1>

      <section className="panel">
        <h2>Find People</h2>
        <input
          className="shell-input"
          type="text"
          placeholder="Search by name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search people by name"
        />
        {query.trim().length >= 2 && (
          <div className="search-results">
            {searching && <p className="stat-label">Searching…</p>}
            {!searching && results.length === 0 && (
              <p className="stat-label">No one found by that name.</p>
            )}
            {results.map((u) => (
              <div key={u.userId} className="shell-row">
                <span className="shell-identity">
                  {u.avatarUrl && <img className="avatar" src={u.avatarUrl} alt="" width={32} height={32} />}
                  <span>
                    {u.name ?? `User ${u.userId}`}
                    {u.englishLevel && <span className="stat-label"> · {u.englishLevel}</span>}
                    {u.location && <span className="stat-label"> · {u.location}</span>}
                  </span>
                </span>
                <button
                  className="shell-btn"
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
        <section className="panel">
          <h2>Requests</h2>
          {pending.map((p) => (
            <div key={p.friendshipId} className="shell-row">
              <FriendIdentity friend={p} />
              <button className="shell-btn" type="button" onClick={() => accept(p.friendshipId)}>
                Accept
              </button>
            </div>
          ))}
        </section>
      )}

      <section className="panel">
        <h2>Your Friends</h2>
        {friends.length === 0 ? (
          <p>No friends yet. Search above to find people.</p>
        ) : (
          <div className="friend-cards">
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
                  width={56}
                  height={56}
                />
                <span className="friend-card-name">{f.name ?? `User ${f.userId}`}</span>
                {f.englishLevel && (
                  <span className="friend-card-level">{f.englishLevel}</span>
                )}
                <span className="friend-card-cta">Message →</span>
              </button>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  )
}

function FriendIdentity({ friend }: { friend: Friend }) {
  return (
    <span className="shell-identity">
      {friend.avatarUrl && (
        <img className="avatar" src={friend.avatarUrl} alt="" width={32} height={32} />
      )}
      <span>
        {friend.name ?? `User ${friend.userId}`}
        {friend.englishLevel && <span className="stat-label"> · {friend.englishLevel}</span>}
      </span>
    </span>
  )
}
