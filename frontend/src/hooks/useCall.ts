import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../lib/api'
import { onWs, sendWs, type Envelope } from '../lib/ws'

const FALLBACK_ICE: RTCIceServer[] = [{ urls: 'stun:stun.l.google.com:19302' }]

async function fetchIceServers(): Promise<RTCIceServer[]> {
  try {
    const res = await api.get<RTCIceServer[]>('/turn')
    return res.data.length > 0 ? res.data : FALLBACK_ICE
  } catch {
    return FALLBACK_ICE
  }
}

export type CallStatus = 'idle' | 'searching' | 'matched' | 'calling' | 'ringing' | 'connected'

interface OfferPayload {
  from: string
  sdp: RTCSessionDescriptionInit
}
interface IcePayload {
  from: string
  candidate: RTCIceCandidateInit
}
interface MatchPayload {
  peerId: string
  initiator: boolean
  name?: string | null
  avatarUrl?: string | null
  bio?: string | null
  englishLevel?: string | null
  location?: string | null
}

export interface PartnerInfo {
  name: string | null
  avatarUrl: string | null
  bio: string | null
  englishLevel: string | null
  location: string | null
}

export function useCall(myId: number) {
  const [status, setStatus] = useState<CallStatus>('idle')
  const [mode, setMode] = useState<'match' | 'direct'>('match')
  const [peerId, setPeerId] = useState<string | null>(null)
  const [partner, setPartner] = useState<PartnerInfo | null>(null)
  const [connectedSec, setConnectedSec] = useState(0)
  const [micMuted, setMicMuted] = useState(false)
  const [speakerMuted, setSpeakerMuted] = useState(false)

  const pcRef = useRef<RTCPeerConnection | null>(null)
  const localRef = useRef<MediaStream | null>(null)
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null)
  const pendingIce = useRef<RTCIceCandidateInit[]>([])
  const incomingOffer = useRef<RTCSessionDescriptionInit | null>(null)
  const autoAccept = useRef(false)

  const cleanup = useCallback(() => {
    pcRef.current?.close()
    pcRef.current = null
    localRef.current?.getTracks().forEach((t) => t.stop())
    localRef.current = null
    pendingIce.current = []
    incomingOffer.current = null
    autoAccept.current = false
    setPeerId(null)
    setPartner(null)
    setConnectedSec(0)
    setMicMuted(false)
    setSpeakerMuted(false)
    setStatus('idle')
  }, [])

  const createPc = useCallback(
    async (targetId: string) => {
      const iceServers = await fetchIceServers()
      const pc = new RTCPeerConnection({ iceServers })
      pc.onicecandidate = (e) => {
        if (e.candidate) {
          sendWs({
            type: 'call.ice',
            to: targetId,
            payload: { from: String(myId), candidate: e.candidate.toJSON() },
          })
        }
      }
      pc.ontrack = (e) => {
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = e.streams[0]
        }
      }
      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'connected') {
          setStatus('connected')
        } else if (['disconnected', 'failed', 'closed'].includes(pc.connectionState)) {
          cleanup()
        }
      }
      pcRef.current = pc
      return pc
    },
    [myId, cleanup],
  )

  const getMic = useCallback(async (): Promise<MediaStream | null> => {
    try {
      return await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      return null
    }
  }, [])

  const startCall = useCallback(
    async (targetId: string) => {
      setPeerId(targetId)
      setStatus('calling')
      const stream = await getMic()
      if (!stream) {
        cleanup()
        return
      }
      const pc = await createPc(targetId)
      localRef.current = stream
      stream.getTracks().forEach((t) => pc.addTrack(t, stream))
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      sendWs({ type: 'call.offer', to: targetId, payload: { from: String(myId), sdp: offer } })
    },
    [createPc, getMic, cleanup, myId],
  )

  const answerOffer = useCallback(
    async (from: string, sdp: RTCSessionDescriptionInit) => {
      const stream = await getMic()
      if (!stream) {
        hangupRef.current()
        return
      }
      const pc = await createPc(from)
      localRef.current = stream
      stream.getTracks().forEach((t) => pc.addTrack(t, stream))
      await pc.setRemoteDescription(sdp)
      for (const c of pendingIce.current) {
        await pc.addIceCandidate(c)
      }
      pendingIce.current = []
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)
      sendWs({ type: 'call.answer', to: from, payload: { from: String(myId), sdp: answer } })
    },
    [createPc, getMic, myId],
  )

  const acceptCall = useCallback(() => {
    if (peerId && incomingOffer.current) {
      answerOffer(peerId, incomingOffer.current)
    }
  }, [peerId, answerOffer])

  const findPartner = useCallback(() => {
    setMode('match')
    setStatus('searching')
    sendWs({ type: 'match.find' })
  }, [])

  const callPeer = useCallback(
    (targetId: string, info: PartnerInfo) => {
      setMode('direct')
      setPeerId(targetId)
      setPartner(info)
      startCall(targetId)
    },
    [startCall],
  )

  const cancelFind = useCallback(() => {
    sendWs({ type: 'match.cancel' })
    setStatus('idle')
  }, [])

  const hangup = useCallback(() => {
    if (peerId) {
      sendWs({ type: 'call.hangup', to: peerId, payload: { from: String(myId) } })
    }
    cleanup()
  }, [peerId, myId, cleanup])

  const toggleMic = useCallback(() => {
    const tracks = localRef.current?.getAudioTracks() ?? []
    if (tracks.length === 0) {
      return
    }
    const nextMuted = tracks[0].enabled
    tracks.forEach((t) => {
      t.enabled = !nextMuted
    })
    setMicMuted(nextMuted)
  }, [])

  const toggleSpeaker = useCallback(() => {
    const el = remoteAudioRef.current
    if (!el) {
      return
    }
    el.muted = !el.muted
    setSpeakerMuted(el.muted)
  }, [])

  useEffect(() => {
    if (status !== 'connected') {
      return
    }
    const id = setInterval(() => setConnectedSec((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [status])

  const hangupRef = useRef(hangup)
  useEffect(() => {
    hangupRef.current = hangup
  }, [hangup])

  useEffect(() => {
    return () => hangupRef.current()
  }, [])

  useEffect(() => {
    if (!peerId) {
      return
    }
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    const onPageHide = () => {
      sendWs({ type: 'call.hangup', to: peerId, payload: { from: String(myId) } })
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    window.addEventListener('pagehide', onPageHide)
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
      window.removeEventListener('pagehide', onPageHide)
    }
  }, [peerId, myId])

  useEffect(() => {
    return onWs(async (env: Envelope) => {
      if (env.type === 'match.found') {
        const p = env.payload as MatchPayload
        setPeerId(p.peerId)
        setPartner({
          name: p.name ?? null,
          avatarUrl: p.avatarUrl ?? null,
          bio: p.bio ?? null,
          englishLevel: p.englishLevel ?? null,
          location: p.location ?? null,
        })
        setStatus('matched')
        if (p.initiator) {
          await startCall(p.peerId)
        } else {
          autoAccept.current = true
        }
      } else if (env.type === 'call.offer') {
        const p = env.payload as OfferPayload
        incomingOffer.current = p.sdp
        setPeerId(p.from)
        if (autoAccept.current) {
          autoAccept.current = false
          await answerOffer(p.from, p.sdp)
        } else {
          setMode('direct')
          setStatus('ringing')
        }
      } else if (env.type === 'call.answer') {
        const p = env.payload as OfferPayload
        await pcRef.current?.setRemoteDescription(p.sdp)
        for (const c of pendingIce.current) {
          await pcRef.current?.addIceCandidate(c)
        }
        pendingIce.current = []
      } else if (env.type === 'call.ice') {
        const p = env.payload as IcePayload
        const pc = pcRef.current
        if (pc && pc.remoteDescription) {
          await pc.addIceCandidate(p.candidate)
        } else {
          pendingIce.current.push(p.candidate)
        }
      } else if (env.type === 'call.hangup') {
        cleanup()
      }
    })
  }, [cleanup, startCall, answerOffer])

  return {
    status,
    mode,
    peerId,
    partner,
    connectedSec,
    micMuted,
    speakerMuted,
    remoteAudioRef,
    findPartner,
    callPeer,
    cancelFind,
    acceptCall,
    hangup,
    toggleMic,
    toggleSpeaker,
    setPartner,
  }
}
