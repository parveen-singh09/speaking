import { useCallback, useEffect, useRef, useState } from 'react'
import { onWs, sendWs, type Envelope } from '../lib/ws'

const ICE_SERVERS: RTCIceServer[] = [{ urls: 'stun:stun.l.google.com:19302' }]

export type CallStatus = 'idle' | 'searching' | 'calling' | 'ringing' | 'connected'

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
}

export function useCall(myId: number) {
  const [status, setStatus] = useState<CallStatus>('idle')
  const [peerId, setPeerId] = useState<string | null>(null)

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
    setStatus('idle')
  }, [])

  const createPc = useCallback(
    (targetId: string) => {
      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS })
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

  const addMic = useCallback(async (pc: RTCPeerConnection) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    localRef.current = stream
    stream.getTracks().forEach((t) => pc.addTrack(t, stream))
  }, [])

  const startCall = useCallback(
    async (targetId: string) => {
      setPeerId(targetId)
      setStatus('calling')
      const pc = createPc(targetId)
      await addMic(pc)
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      sendWs({ type: 'call.offer', to: targetId, payload: { from: String(myId), sdp: offer } })
    },
    [createPc, addMic, myId],
  )

  const answerOffer = useCallback(
    async (from: string, sdp: RTCSessionDescriptionInit) => {
      const pc = createPc(from)
      await addMic(pc)
      await pc.setRemoteDescription(sdp)
      for (const c of pendingIce.current) {
        await pc.addIceCandidate(c)
      }
      pendingIce.current = []
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)
      sendWs({ type: 'call.answer', to: from, payload: { from: String(myId), sdp: answer } })
    },
    [createPc, addMic, myId],
  )

  const acceptCall = useCallback(() => {
    if (peerId && incomingOffer.current) {
      answerOffer(peerId, incomingOffer.current)
    }
  }, [peerId, answerOffer])

  const findPartner = useCallback(() => {
    setStatus('searching')
    sendWs({ type: 'match.find' })
  }, [])

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

  useEffect(() => {
    return onWs(async (env: Envelope) => {
      if (env.type === 'match.found') {
        const p = env.payload as MatchPayload
        setPeerId(p.peerId)
        if (p.initiator) {
          await startCall(p.peerId)
        } else {
          autoAccept.current = true
          setStatus('calling')
        }
      } else if (env.type === 'call.offer') {
        const p = env.payload as OfferPayload
        incomingOffer.current = p.sdp
        setPeerId(p.from)
        if (autoAccept.current) {
          autoAccept.current = false
          await answerOffer(p.from, p.sdp)
        } else {
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

  return { status, peerId, remoteAudioRef, findPartner, cancelFind, acceptCall, hangup }
}
