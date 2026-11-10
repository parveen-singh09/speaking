import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  acceptFriend,
  listFriends,
  listPending,
  sendFriendRequest,
  type Friend,
} from '../lib/friends'

export function Friends() {
  const navigate = useNavigate()
  const [friends, setFriends] = useState<Friend[]>([])
  const [pending, setPending] = useState<Friend[]>([])
  const [targetId, setTargetId] = useState('')
  const [note, setNote] = useState<string | null>(null)

  const load = () => {
    listFriends().then(setFriends).catch(() => {})
    listPending().then(setPending).catch(() => {})
  }

  useEffect(load, [])

  const send = async () => {
    const id = Number(targetId)
    if (!id) {
      return
    }
    try {
      await sendFriendRequest(id)
      setNote(`Request sent to user ${id}.`)
      setTargetId('')
    } catch {
      setNote('Could not send request.')
    }
  }

  const accept = async (friendshipId: number) => {
    await acceptFriend(friendshipId)
    load()
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="wordmark" type="button" onClick={() => navigate('/home')}>
          Peer<span>Up</span>
        </button>
      </header>

      <main className="home-main">
        <h1 className="home-greeting">Friends</h1>

        <section className="action-card">
          <h2>Add a Friend</h2>
          <div className="call-actions">
            <input
              className="call-input"
              type="number"
              inputMode="numeric"
              placeholder="User ID…"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              aria-label="User ID to add"
            />
            <button className="btn-primary" type="button" disabled={!targetId} onClick={send}>
              Send Request
            </button>
          </div>
          {note && <span className="note">{note}</span>}
        </section>

        {pending.length > 0 && (
          <section className="action-card">
            <h2>Requests</h2>
            <ul className="friend-list">
              {pending.map((p) => (
                <li key={p.friendshipId} className="friend-row">
                  <FriendIdentity friend={p} />
                  <button className="btn-primary" type="button" onClick={() => accept(p.friendshipId)}>
                    Accept
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="action-card">
          <h2>Your Friends</h2>
          {friends.length === 0 ? (
            <p className="note">No friends yet. Send a request above to get started.</p>
          ) : (
            <ul className="friend-list">
              {friends.map((f) => (
                <li key={f.friendshipId} className="friend-row">
                  <FriendIdentity friend={f} />
                  <button
                    className="btn-ghost"
                    type="button"
                    onClick={() => navigate(`/chat/${f.userId}`)}
                  >
                    Chat
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}

function FriendIdentity({ friend }: { friend: Friend }) {
  return (
    <span className="friend-identity">
      {friend.avatarUrl && (
        <img className="avatar" src={friend.avatarUrl} alt="" width={32} height={32} />
      )}
      <span>
        {friend.name ?? `User ${friend.userId}`}
        {friend.englishLevel && <span className="friend-level"> · {friend.englishLevel}</span>}
      </span>
    </span>
  )
}
