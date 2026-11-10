import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  acceptFriend,
  listFriends,
  listPending,
  sendFriendRequest,
  type Friend,
} from '../lib/friends'
import { AppShell } from '../components/AppShell'

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
    <AppShell>
      <h1 className="shell-h1">Friends</h1>

      <section className="panel">
        <h2>Add a Friend</h2>
        <div className="call-actions">
          <input
            className="shell-input"
            type="number"
            inputMode="numeric"
            placeholder="User ID…"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            aria-label="User ID to add"
          />
          <button className="shell-btn" type="button" disabled={!targetId} onClick={send}>
            Send Request
          </button>
        </div>
        {note && <span className="stat-label">{note}</span>}
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
          <p>No friends yet. Send a request above to get started.</p>
        ) : (
          friends.map((f) => (
            <div key={f.friendshipId} className="shell-row">
              <FriendIdentity friend={f} />
              <button
                className="shell-btn-ghost"
                type="button"
                onClick={() => navigate(`/chat/${f.userId}`)}
              >
                Chat
              </button>
            </div>
          ))
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
