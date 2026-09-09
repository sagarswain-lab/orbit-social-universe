import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MOOD_KEYS, type Mood } from '@/lib/color'
import { clamp } from '@/lib/math'
import { LIFESPANS, signalLife, type LifespanKey } from '@/lib/time'
import {
  CONSTELLATIONS,
  DEFAULT_YOU,
  DRIFT_CANDIDATES,
  NODES,
  SIGNALS,
  THREADS,
} from '@/data/mock'
import type {
  Constellation,
  DriftCandidate,
  OrbitNode,
  Signal,
  SignalScope,
  SignalType,
  Thread,
  You,
} from '@/data/types'

export type Lens = 'resonance' | 'active' | 'constellation'
export type Mode = 'universe' | 'drift'

export interface Toast {
  id: string
  text: string
  hue?: number
}

interface ComposeInput {
  type: SignalType
  text: string
  scope: SignalScope
  lifespan: LifespanKey
  constellationId?: string
}

export interface ResonanceEvent {
  nodeId: string
  timestamp: number
  hue: number
  delta: number
}

interface OrbitState {
  you: You
  onboarded: boolean
  nodes: OrbitNode[]
  signals: Signal[]
  constellations: Constellation[]
  threads: Thread[]
  drift: DriftCandidate[]

  // ui
  mode: Mode
  lens: Lens
  selectedId: string | null
  activeConstellationId: string | null
  composerOpen: boolean
  threadPersonId: string | null
  building: boolean
  builderIds: string[]
  toasts: Toast[]
  clock: number
  tunedInId: string | null
  lastResonanceEvent: ResonanceEvent | null

  // derived helpers
  getNode: (id: string) => OrbitNode | undefined
  signalsFor: (id: string) => Signal[]
  threadFor: (id: string) => Thread | undefined

  // actions
  completeOnboarding: (p: { name: string; hue: number; mood: Mood }) => void
  setYourMood: (mood: Mood) => void
  selectNode: (id: string | null) => void
  setLens: (lens: Lens) => void
  setMode: (mode: Mode) => void
  setActiveConstellation: (id: string | null) => void

  pullCloser: (id: string) => void
  setResonance: (id: string, value: number) => void
  setNodePosition: (id: string, resonance: number, angle?: number) => void
  resetUniverse: () => void
  tuneIn: (id: string) => void
  resonateSignal: (id: string) => void
  sendSignal: (input: ComposeInput) => void
  openComposer: () => void
  closeComposer: () => void

  openThread: (personId: string) => void
  closeThread: () => void
  sendThreadMessage: (personId: string, text: string) => void

  startConstellation: () => void
  toggleBuilderMember: (id: string) => void
  cancelConstellation: () => void
  commitConstellation: (name: string) => void

  joinFromDrift: (candidateId: string) => void

  pushToast: (text: string, hue?: number) => void
  dismissToast: (id: string) => void
  tick: () => void
}

const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)

/* Canned emissions for the ambient "incoming signal" simulation. */
const INCOMING: { text: string; type: SignalType }[] = [
  { text: 'a thought just landed and left as fast', type: 'thought' },
  { text: 'the light in here changed. thought of you.', type: 'moment' },
  { text: 'anyone else awake in this exact quiet?', type: 'question' },
  { text: 'slipping into the listening room, come find me', type: 'ping' },
  { text: 'made a small thing today. it’s enough.', type: 'moment' },
  { text: 'what are you circling lately?', type: 'question' },
]

export const useOrbitStore = create<OrbitState>()(
  persist(
    (set, get) => ({
      you: DEFAULT_YOU,
  onboarded: false,
  nodes: NODES,
  signals: SIGNALS,
  constellations: CONSTELLATIONS,
  threads: THREADS,
  drift: DRIFT_CANDIDATES,

  mode: 'universe',
  lens: 'resonance',
  selectedId: null,
  activeConstellationId: null,
  composerOpen: false,
  threadPersonId: null,
  building: false,
  builderIds: [],
  toasts: [],
  clock: Date.now(),
  tunedInId: null,
  lastResonanceEvent: null,

  getNode: (id) =>
    id === 'you'
      ? undefined
      : get().nodes.find((n) => n.id === id) ??
        get().drift.find((d) => d.node.id === id)?.node,

  signalsFor: (id) =>
    get()
      .signals.filter((s) => s.authorId === id)
      .sort((a, b) => b.createdAt - a.createdAt),

  threadFor: (id) => get().threads.find((t) => t.personId === id),

  completeOnboarding: ({ name, hue, mood }) =>
    set((s) => ({
      onboarded: true,
      you: {
        ...s.you,
        name: name.trim() || s.you.name,
        hue,
        aura: { ...s.you.aura, mood, updatedAt: Date.now() },
      },
    })),

  selectNode: (id) => set({ selectedId: id }),
  setYourMood: (mood) =>
    set((s) => ({ you: { ...s.you, aura: { ...s.you.aura, mood, updatedAt: Date.now() } } })),
  setLens: (lens) => set({ lens }),
  setMode: (mode) => set({ mode, selectedId: null }),
  setActiveConstellation: (id) => set({ activeConstellationId: id, lens: 'constellation' }),

  pullCloser: (id) => {
    const node = get().getNode(id)
    if (!node) return
    const nextRes = clamp(node.resonance + 10, 0, 98)
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, resonance: nextRes } : n,
      ),
      lastResonanceEvent: {
        nodeId: id,
        timestamp: Date.now(),
        hue: node.hue,
        delta: 10,
      },
    }))
    get().pushToast(`✨ Pulled ${node.name} closer into your orbit (${nextRes}% resonance)`, node.hue)
  },

  setResonance: (id, value) => {
    const v = clamp(Math.round(value), 6, 100)
    set((s) => ({
      nodes: s.nodes.map((n) => (n.id === id ? { ...n, resonance: v } : n)),
    }))
  },

  setNodePosition: (id, resonance, angle) => {
    const v = clamp(Math.round(resonance), 6, 100)
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id
          ? { ...n, resonance: v, ...(angle !== undefined ? { angle } : {}) }
          : n,
      ),
    }))
  },

  resetUniverse: () => {
    set({
      nodes: NODES,
      signals: SIGNALS,
      constellations: CONSTELLATIONS,
      threads: THREADS,
      drift: DRIFT_CANDIDATES,
      you: DEFAULT_YOU,
    })
    get().pushToast('Universe reset to initial constellation', DEFAULT_YOU.hue)
  },

  tuneIn: (id) => {
    const node = get().getNode(id)
    if (!node) return
    set((s) => ({
      tunedInId: id,
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, resonance: clamp(n.resonance + 2, 0, 100) } : n,
      ),
    }))
    get().pushToast(`Tuned into ${node.name}'s aura · ${node.aura.mood}`, node.hue)
  },

  resonateSignal: (id) => {
    const s = get()
    const sig = s.signals.find((x) => x.id === id)
    if (!sig) return

    const willBeResonated = !sig.resonated
    const authorId = sig.authorId
    const targetNode = s.nodes.find((n) => n.id === authorId)
    const delta = willBeResonated ? 14 : -14

    set((state) => ({
      signals: state.signals.map((item) =>
        item.id === id
          ? {
              ...item,
              resonated: willBeResonated,
              resonanceCount: item.resonanceCount + (willBeResonated ? 1 : -1),
            }
          : item,
      ),
      nodes: targetNode
        ? state.nodes.map((n) =>
            n.id === authorId
              ? { ...n, resonance: clamp(n.resonance + delta, 8, 96) }
              : n,
          )
        : state.nodes,
      lastResonanceEvent: targetNode
        ? {
            nodeId: authorId,
            timestamp: Date.now(),
            hue: targetNode.hue,
            delta,
          }
        : state.lastResonanceEvent,
    }))

    if (targetNode) {
      if (willBeResonated) {
        const updatedRes = clamp(targetNode.resonance + delta, 8, 96)
        get().pushToast(
          `✨ Resonated with ${targetNode.name} · star pulled closer into your orbit (${updatedRes}%)`,
          targetNode.hue,
        )
      } else {
        get().pushToast(
          `Resonance released · ${targetNode.name} drifted outward`,
          targetNode.hue,
        )
      }
    } else {
      get().pushToast(
        willBeResonated ? '✨ Resonated with signal' : 'Resonance released',
        sig.hue,
      )
    }
  },

  sendSignal: ({ type, text, scope, lifespan, constellationId }) => {
    const you = get().you
    const signal: Signal = {
      id: uid(),
      authorId: 'you',
      type,
      text: text.trim(),
      createdAt: Date.now(),
      lifespanMs: LIFESPANS[lifespan],
      scope,
      constellationId,
      hue: you.hue,
      resonated: false,
      resonanceCount: 0,
    }
    set((s) => ({ signals: [signal, ...s.signals], composerOpen: false }))
    get().pushToast('Signal emitted into your orbit', you.hue)
  },

  openComposer: () => set({ composerOpen: true }),
  closeComposer: () => set({ composerOpen: false }),

  openThread: (personId) => set({ threadPersonId: personId }),
  closeThread: () => set({ threadPersonId: null }),
  sendThreadMessage: (personId, text) => {
    const trimmed = text.trim()
    if (!trimmed) return
    set((s) => {
      const existing = s.threads.find((t) => t.personId === personId)
      const msg = { id: uid(), from: 'you' as const, text: trimmed, at: Date.now() }
      if (existing) {
        return {
          threads: s.threads.map((t) =>
            t.personId === personId ? { ...t, messages: [...t.messages, msg] } : t,
          ),
        }
      }
      return { threads: [...s.threads, { personId, messages: [msg] }] }
    })
  },

  startConstellation: () => set({ building: true, builderIds: [], selectedId: null }),
  toggleBuilderMember: (id) =>
    set((s) => ({
      builderIds: s.builderIds.includes(id)
        ? s.builderIds.filter((x) => x !== id)
        : [...s.builderIds, id],
    })),
  cancelConstellation: () => set({ building: false, builderIds: [] }),
  commitConstellation: (name) => {
    const { builderIds } = get()
    if (builderIds.length < 2) {
      get().pushToast('Pick at least two to form a constellation')
      return
    }
    const hue = Math.round(Math.random() * 360)
    const cons: Constellation = {
      id: uid(),
      name: name.trim() || 'New constellation',
      memberIds: [...builderIds],
      hue,
      note: 'a shape you drew across your universe',
    }
    set((s) => ({
      constellations: [...s.constellations, cons],
      nodes: s.nodes.map((n) =>
        builderIds.includes(n.id)
          ? { ...n, constellationIds: [...n.constellationIds, cons.id] }
          : n,
      ),
      building: false,
      builderIds: [],
      activeConstellationId: cons.id,
      lens: 'constellation',
    }))
    get().pushToast(`Constellation "${cons.name}" drawn`, hue)
  },

  joinFromDrift: (candidateId) => {
    const cand = get().drift.find((d) => d.node.id === candidateId)
    if (!cand) return
    const joined: OrbitNode = { ...cand.node, resonance: clamp(cand.node.resonance + 18, 0, 100) }
    set((s) => ({
      nodes: [...s.nodes, joined],
      drift: s.drift.filter((d) => d.node.id !== candidateId),
    }))
    get().pushToast(`${cand.node.name} entered your orbit`, cand.node.hue)
  },

  pushToast: (text, hue) => {
    const id = uid()
    set((s) => ({ toasts: [...s.toasts, { id, text, hue }].slice(-4) }))
    setTimeout(() => get().dismissToast(id), 4200)
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  tick: () => {
    const now = Date.now()
    set((s) => {
      // decay: drop fully-faded signals
      const alive = s.signals.filter((sig) => signalLife(sig.createdAt, sig.lifespanMs, now) > 0)

      // gentle resonance random-walk on a couple of nodes
      const jitterTargets = new Set(
        [Math.floor(Math.random() * s.nodes.length), Math.floor(Math.random() * s.nodes.length)],
      )
      const nodes = s.nodes.map((n, i) => {
        if (!jitterTargets.has(i)) return n
        const delta = (Math.random() - 0.45) * 0.8
        let aura = n.aura
        // occasionally shift a node's aura + activity
        if (Math.random() < 0.18) {
          const mood = MOOD_KEYS[Math.floor(Math.random() * MOOD_KEYS.length)]
          aura = { ...n.aura, mood, updatedAt: now }
        }
        const activeNow = Math.random() < 0.2 ? !n.activeNow : n.activeNow
        return { ...n, resonance: clamp(n.resonance + delta, 6, 100), aura, activeNow }
      })

      return { signals: alive, nodes, clock: now }
    })

    // rare: an active node emits an incoming signal
    if (Math.random() < 0.14) {
      const s = get()
      const active = s.nodes.filter((n) => n.activeNow)
      const pool = active.length ? active : s.nodes
      const author = pool[Math.floor(Math.random() * pool.length)]
      const pick = INCOMING[Math.floor(Math.random() * INCOMING.length)]
      const signal: Signal = {
        id: uid(),
        authorId: author.id,
        type: pick.type,
        text: pick.text,
        createdAt: now,
        lifespanMs: LIFESPANS['6h'],
        scope: author.resonance > 80 ? 'inner' : 'near',
        hue: author.hue,
        resonated: false,
        resonanceCount: Math.floor(Math.random() * 4),
      }
      set((st) => ({ signals: [signal, ...st.signals] }))
      get().pushToast(`${author.name} sent a signal`, author.hue)
    }
  },
    }),
    {
      name: 'orbit_universe_v1',
      partialize: (state) => ({
        you: state.you,
        onboarded: state.onboarded,
        nodes: state.nodes,
        signals: state.signals,
        constellations: state.constellations,
        threads: state.threads,
        drift: state.drift,
      }),
    },
  ),
)
