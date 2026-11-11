import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { fetchMe } from '../lib/auth'
import { listFriends } from '../lib/friends'
import { useAuth } from '../store/auth'
import { connectWs } from '../lib/ws'
import { startRingtone, stopRingtone } from '../lib/ringtone'
import { useCall } from '../hooks/useCall'
import { CallScreen } from './CallScreen'

type CallApi = ReturnType<typeof useCall>

const CallContext = createContext<CallApi | null>(null)

export function useCallContext(): CallApi {
  const ctx = useContext(CallContext)
  if (!ctx) {
    throw new Error('useCallContext must be used within CallProvider')
  }
  return ctx
}

export function CallProvider({ children }: { children: ReactNode }) {
  const accessToken = useAuth((s) => s.accessToken)
  const [myId, setMyId] = useState(0)

  useEffect(() => {
    if (!accessToken) {
      setMyId(0)
      return
    }
    fetchMe()
      .then((m) => {
        setMyId(m.id)
        connectWs()
      })
      .catch(() => {})
  }, [accessToken])

  const call = useCall(myId)

  useEffect(() => {
    if (call.status === 'ringing') {
      startRingtone()
    } else {
      stopRingtone()
    }
    return () => stopRingtone()
  }, [call.status])

  const resolvedFor = useRef<string | null>(null)
  useEffect(() => {
    if (call.status !== 'ringing' || !call.peerId) {
      resolvedFor.current = null
      return
    }
    if (call.partner?.name || resolvedFor.current === call.peerId) {
      return
    }
    resolvedFor.current = call.peerId
    listFriends()
      .then((list) => {
        const f = list.find((x) => String(x.userId) === call.peerId)
        if (f) {
          call.setPartner({
            name: f.name,
            avatarUrl: f.avatarUrl,
            bio: f.bio ?? null,
            englishLevel: f.englishLevel,
            location: f.location ?? null,
          })
        }
      })
      .catch(() => {})
  }, [call.status, call.peerId, call.partner, call])

  return (
    <CallContext.Provider value={call}>
      {children}
      {call.status !== 'idle' && <CallScreen call={call} />}
      <audio ref={call.remoteAudioRef} autoPlay />
    </CallContext.Provider>
  )
}
