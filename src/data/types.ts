import type { Mood } from '@/lib/color'

export type ID = string

export type NodeKind = 'person' | 'community'

export interface Aura {
  mood: Mood
  /** free-text ambient status, optional */
  note?: string
  updatedAt: number
}

interface BaseNode {
  id: ID
  kind: NodeKind
  name: string
  /** signature hue 0-360 */
  hue: number
  aura: Aura
  /** private, mutual connection strength 0..100 (never public) */
  resonance: number
  /** spatial angle in radians if manually arranged */
  angle?: number
  /** currently present in their universe */
  activeNow: boolean
  constellationIds: ID[]
}

export interface Person extends BaseNode {
  kind: 'person'
  handle: string
  bio: string
  location?: string
  /** shared context with you, shown on the presence panel */
  sharedContext: string
}

export interface Community extends BaseNode {
  kind: 'community'
  descriptor: string
  members: number
  /** rituals / cadence that define the community */
  cadence: string
}

export type OrbitNode = Person | Community

export type SignalType = 'thought' | 'moment' | 'question' | 'ping'

export type SignalScope = 'inner' | 'near' | 'outer' | 'constellation'

export interface Signal {
  id: ID
  authorId: ID // 'you' | person/community id
  type: SignalType
  text: string
  createdAt: number
  lifespanMs: number
  scope: SignalScope
  constellationId?: ID
  hue: number
  /** you resonated with this signal (private, quiet acknowledgement) */
  resonated: boolean
  /** count of people who quietly resonated — shown only as soft glow, no number race */
  resonanceCount: number
}

export interface Constellation {
  id: ID
  name: string
  memberIds: ID[]
  hue: number
  note: string
}

export interface ThreadMessage {
  id: ID
  from: 'you' | 'them'
  text: string
  at: number
}

export interface Thread {
  personId: ID
  messages: ThreadMessage[]
}

/** A serendipitous discovery surfaced while drifting. */
export interface DriftCandidate {
  node: OrbitNode
  /** the genuine connection path that surfaced them (never an algorithm) */
  via: string
  /** which existing node bridged to them */
  bridgeId: ID
  reason: string
}

export interface You {
  id: 'you'
  name: string
  handle: string
  hue: number
  aura: Aura
}
