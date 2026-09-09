import { hoursAgo, LIFESPANS, minutesAgo } from '@/lib/time'
import type {
  Community,
  Constellation,
  DriftCandidate,
  OrbitNode,
  Person,
  Signal,
  Thread,
  You,
} from './types'

/* -------------------------------------------------------------------------- */
/*  You — the center of the universe (name/hue overridden during onboarding)  */
/* -------------------------------------------------------------------------- */
export const DEFAULT_YOU: You = {
  id: 'you',
  name: 'Nova',
  handle: 'you',
  hue: 265,
  aura: { mood: 'spark', note: 'building something quietly', updatedAt: minutesAgo(4) },
}

/* -------------------------------------------------------------------------- */
/*  People in your universe                                                   */
/* -------------------------------------------------------------------------- */
const PEOPLE_RAW: Omit<Person, 'constellationIds'>[] = [
  {
    id: 'p_aria', kind: 'person', name: 'Aria', handle: 'aria.rue', hue: 288,
    bio: 'poet after midnight · collects unfinished sentences',
    location: 'Lisbon', resonance: 94, activeNow: true,
    sharedContext: 'You two trade voice-notes at 2am and never explain them.',
    aura: { mood: 'dream', note: 'rewriting the same stanza', updatedAt: minutesAgo(6) },
  },
  {
    id: 'p_noor', kind: 'person', name: 'Noor', handle: 'noor.builds', hue: 172,
    bio: 'interface designer · believes in soft edges',
    location: 'Amman', resonance: 91, activeNow: true,
    sharedContext: 'Shared 3 constellations. You review each other’s work in silence.',
    aura: { mood: 'flow', note: 'in the zone on a redesign', updatedAt: minutesAgo(2) },
  },
  {
    id: 'p_kai', kind: 'person', name: 'Kai', handle: 'kai.wav', hue: 208,
    bio: 'makes music from field recordings',
    location: 'Osaka', resonance: 88, activeNow: false,
    sharedContext: 'He sends you loops before anyone else hears them.',
    aura: { mood: 'flow', note: 'chopping a rain sample', updatedAt: hoursAgo(1) },
  },
  {
    id: 'p_suki', kind: 'person', name: 'Suki', handle: 'suki.ink', hue: 328,
    bio: 'illustrator · draws strangers on trains',
    location: 'Seoul', resonance: 76, activeNow: true,
    sharedContext: 'You met drifting through The Green Room a year ago.',
    aura: { mood: 'spark', note: 'ideas won’t stop today', updatedAt: minutesAgo(12) },
  },
  {
    id: 'p_dev', kind: 'person', name: 'Dev', handle: 'dev.exe', hue: 44,
    bio: 'builds tiny tools nobody asked for',
    location: 'Bengaluru', resonance: 72, activeNow: false,
    sharedContext: 'Late-night debugging companion. You ship together.',
    aura: { mood: 'flow', note: 'one more commit', updatedAt: hoursAgo(2) },
  },
  {
    id: 'p_luca', kind: 'person', name: 'Luca', handle: 'luca.high', hue: 148,
    bio: 'climbs rocks · afraid of nothing but small talk',
    location: 'Turin', resonance: 64, activeNow: false,
    sharedContext: 'Drags you outside when you’ve been inside too long.',
    aura: { mood: 'calm', note: 'above the clouds', updatedAt: hoursAgo(5) },
  },
  {
    id: 'p_mira', kind: 'person', name: 'Mira', handle: 'mira.reel', hue: 304,
    bio: 'filmmaker · shoots on expired stock',
    location: 'Mexico City', resonance: 69, activeNow: true,
    sharedContext: 'You’re both in After Dark. She scores her films with Kai.',
    aura: { mood: 'spark', note: 'found the perfect light', updatedAt: minutesAgo(20) },
  },
  {
    id: 'p_zeph', kind: 'person', name: 'Zeph', handle: 'zeph.drone', hue: 190,
    bio: 'ambient musician · 40-minute songs',
    location: 'Reykjavík', resonance: 58, activeNow: false,
    sharedContext: 'His sets are the soundtrack to your focus hours.',
    aura: { mood: 'still', note: 'letting a chord ring out', updatedAt: hoursAgo(8) },
  },
  {
    id: 'p_ivy', kind: 'person', name: 'Ivy', handle: 'ivy.clay', hue: 118,
    bio: 'ceramics + botany · dirt under the nails',
    location: 'Portland', resonance: 61, activeNow: false,
    sharedContext: 'Trades you cuttings for playlists.',
    aura: { mood: 'calm', note: 'repotting the whole shelf', updatedAt: hoursAgo(3) },
  },
  {
    id: 'p_ren', kind: 'person', name: 'Ren', handle: 'ren.play', hue: 252,
    bio: 'game dev · worlds in a weekend',
    location: 'Berlin', resonance: 55, activeNow: true,
    sharedContext: 'Prototypes weird mechanics with Dev in Makers.',
    aura: { mood: 'buzz', note: 'playtesting, come break it', updatedAt: minutesAgo(9) },
  },
  {
    id: 'p_sol', kind: 'person', name: 'Sol', handle: 'sol.eats', hue: 26,
    bio: 'chef · cooks by feel, never measures',
    location: 'Marrakesh', resonance: 47, activeNow: false,
    sharedContext: 'Slow Mornings regular. Sends recipes as haiku.',
    aura: { mood: 'calm', note: 'proofing dough overnight', updatedAt: hoursAgo(11) },
  },
  {
    id: 'p_tavi', kind: 'person', name: 'Tavi', handle: 'tavi.move', hue: 350,
    bio: 'dancer · improvises in empty parking lots',
    location: 'São Paulo', resonance: 42, activeNow: false,
    sharedContext: 'You drifted into each other through Mira.',
    aura: { mood: 'dream', note: 'choreographing to silence', updatedAt: hoursAgo(6) },
  },
  {
    id: 'p_juno', kind: 'person', name: 'Juno', handle: 'juno.deep', hue: 222,
    bio: 'astronomer who writes love letters to galaxies',
    location: 'Atacama', resonance: 51, activeNow: false,
    sharedContext: 'Runs Deep Field. Tells you what to look up at.',
    aura: { mood: 'still', note: 'waiting for the sky to clear', updatedAt: hoursAgo(4) },
  },
]

/* -------------------------------------------------------------------------- */
/*  Communities                                                               */
/* -------------------------------------------------------------------------- */
const COMMUNITIES_RAW: Omit<Community, 'constellationIds'>[] = [
  {
    id: 'c_midnight', kind: 'community', name: 'Midnight Studio', hue: 268,
    descriptor: 'people who make things after dark', members: 1420,
    cadence: 'gathers nightly · shares works-in-progress, never finished pieces',
    resonance: 83, activeNow: true,
    aura: { mood: 'flow', note: '37 makers awake right now', updatedAt: minutesAgo(1) },
  },
  {
    id: 'c_slow', kind: 'community', name: 'Slow Mornings', hue: 32,
    descriptor: 'analog living, coffee, unhurried', members: 2860,
    cadence: 'one shared morning ritual each day · no notifications before 9am',
    resonance: 49, activeNow: false,
    aura: { mood: 'calm', note: 'the kettle is on somewhere', updatedAt: hoursAgo(2) },
  },
  {
    id: 'c_deep', kind: 'community', name: 'Deep Field', hue: 214,
    descriptor: 'stargazers & the space-struck', members: 940,
    cadence: 'meets whenever the sky is clear · trades what they saw',
    resonance: 66, activeNow: true,
    aura: { mood: 'dream', note: 'clear skies over three continents', updatedAt: minutesAgo(30) },
  },
  {
    id: 'c_green', kind: 'community', name: 'The Green Room', hue: 134,
    descriptor: 'plants, clay, and slow making', members: 1770,
    cadence: 'weekly grow-alongs · everyone tends one thing together',
    resonance: 54, activeNow: false,
    aura: { mood: 'calm', note: 'watering day', updatedAt: hoursAgo(7) },
  },
  {
    id: 'c_freq', kind: 'community', name: 'Frequencies', hue: 186,
    descriptor: 'ambient & electronic, headphones on', members: 2100,
    cadence: 'continuous listening room · a single track passed hand to hand',
    resonance: 71, activeNow: true,
    aura: { mood: 'flow', note: 'a 6-hour set unfolding', updatedAt: minutesAgo(3) },
  },
]

/* -------------------------------------------------------------------------- */
/*  Constellations — your named groupings, drawn across the universe          */
/* -------------------------------------------------------------------------- */
export const CONSTELLATIONS: Constellation[] = [
  {
    id: 'cons_kindred', name: 'Kindred', hue: 280,
    memberIds: ['p_aria', 'p_noor', 'p_kai'],
    note: 'the few who get the unfinished version of you',
  },
  {
    id: 'cons_makers', name: 'Makers', hue: 42,
    memberIds: ['p_dev', 'p_ren', 'p_ivy', 'c_green'],
    note: 'people who ship, grow, and break things with you',
  },
  {
    id: 'cons_afterdark', name: 'After Dark', hue: 300,
    memberIds: ['p_aria', 'p_mira', 'p_zeph', 'c_midnight'],
    note: 'the ones awake when the world is quiet',
  },
  {
    id: 'cons_stargazers', name: 'Stargazers', hue: 212,
    memberIds: ['p_juno', 'p_kai', 'c_deep'],
    note: 'for looking up together',
  },
]

/* attach constellation membership back onto each node (kept consistent) */
const withConstellations = <T extends { id: string }>(
  node: T,
): T & { constellationIds: string[] } => ({
  ...node,
  constellationIds: CONSTELLATIONS.filter((c) => c.memberIds.includes(node.id)).map(
    (c) => c.id,
  ),
})

export const PEOPLE: Person[] = PEOPLE_RAW.map(withConstellations)
export const COMMUNITIES: Community[] = COMMUNITIES_RAW.map(withConstellations)
export const NODES: OrbitNode[] = [...PEOPLE, ...COMMUNITIES]

/* -------------------------------------------------------------------------- */
/*  Signals — ephemeral emissions into the universe                           */
/* -------------------------------------------------------------------------- */
export const SIGNALS: Signal[] = [
  {
    id: 's1', authorId: 'p_aria', type: 'thought',
    text: 'the moon is doing that thing again. you know the one.',
    createdAt: minutesAgo(6), lifespanMs: LIFESPANS['24h'], scope: 'inner',
    hue: 288, resonated: true, resonanceCount: 4,
  },
  {
    id: 's2', authorId: 'p_noor', type: 'moment',
    text: 'redrew this button 41 times. #41 finally breathes.',
    createdAt: minutesAgo(24), lifespanMs: LIFESPANS['24h'], scope: 'near',
    hue: 172, resonated: false, resonanceCount: 9,
  },
  {
    id: 's3', authorId: 'p_ren', type: 'question',
    text: 'if a level has no enemies, is it a garden or a prison?',
    createdAt: minutesAgo(38), lifespanMs: LIFESPANS['3d'], scope: 'outer',
    constellationId: 'cons_makers', hue: 252, resonated: false, resonanceCount: 6,
  },
  {
    id: 's4', authorId: 'c_freq', type: 'ping',
    text: 'the set just moved into something warmer. slip in.',
    createdAt: minutesAgo(3), lifespanMs: LIFESPANS['6h'], scope: 'near',
    hue: 186, resonated: false, resonanceCount: 12,
  },
  {
    id: 's5', authorId: 'p_kai', type: 'moment',
    text: 'recorded rain on a tin roof for 20 min. it’s a whole song.',
    createdAt: hoursAgo(1), lifespanMs: LIFESPANS['24h'], scope: 'inner',
    hue: 208, resonated: true, resonanceCount: 5,
  },
  {
    id: 's6', authorId: 'p_mira', type: 'thought',
    text: 'expired film gives you the colors of a memory, not a photo.',
    createdAt: minutesAgo(20), lifespanMs: LIFESPANS['3d'], scope: 'near',
    constellationId: 'cons_afterdark', hue: 304, resonated: false, resonanceCount: 7,
  },
  {
    id: 's7', authorId: 'p_dev', type: 'question',
    text: 'what’s a tool you wish existed but are too lazy to build?',
    createdAt: hoursAgo(2), lifespanMs: LIFESPANS['3d'], scope: 'outer',
    hue: 44, resonated: false, resonanceCount: 3,
  },
  {
    id: 's8', authorId: 'c_deep', type: 'ping',
    text: 'Atacama skies are glass tonight. Juno is pointing the way.',
    createdAt: minutesAgo(30), lifespanMs: LIFESPANS['6h'], scope: 'near',
    constellationId: 'cons_stargazers', hue: 214, resonated: true, resonanceCount: 8,
  },
  {
    id: 's9', authorId: 'p_ivy', type: 'moment',
    text: 'the fiddle-leaf finally forgave me. new leaf unfurling.',
    createdAt: hoursAgo(3), lifespanMs: LIFESPANS['24h'], scope: 'outer',
    hue: 118, resonated: false, resonanceCount: 2,
  },
  {
    id: 's10', authorId: 'p_suki', type: 'thought',
    text: 'drew the man asleep on the 7:14. hope he dreams well.',
    createdAt: minutesAgo(12), lifespanMs: LIFESPANS['24h'], scope: 'near',
    hue: 328, resonated: false, resonanceCount: 6,
  },
  {
    id: 's11', authorId: 'p_juno', type: 'thought',
    text: 'the light you’re seeing left that star before you were born.',
    createdAt: hoursAgo(4), lifespanMs: LIFESPANS['7d'], scope: 'outer',
    constellationId: 'cons_stargazers', hue: 222, resonated: true, resonanceCount: 11,
  },
  {
    id: 's12', authorId: 'c_midnight', type: 'ping',
    text: '37 makers awake. the studio is humming. bring the unfinished.',
    createdAt: minutesAgo(1), lifespanMs: LIFESPANS['6h'], scope: 'near',
    constellationId: 'cons_afterdark', hue: 268, resonated: false, resonanceCount: 10,
  },
]

/* -------------------------------------------------------------------------- */
/*  Threads — ongoing shared light with specific people (not chat logs)       */
/* -------------------------------------------------------------------------- */
export const THREADS: Thread[] = [
  {
    personId: 'p_aria',
    messages: [
      { id: 't1', from: 'them', text: 'you up?', at: minutesAgo(48) },
      { id: 't2', from: 'you', text: 'always, at the wrong hours', at: minutesAgo(46) },
      { id: 't3', from: 'them', text: 'wrote three lines. they’re yours before they’re anyone’s.', at: minutesAgo(40) },
      { id: 't4', from: 'you', text: 'send them into the dark, I’ll catch them', at: minutesAgo(38) },
    ],
  },
  {
    personId: 'p_kai',
    messages: [
      { id: 't5', from: 'them', text: 'new loop. tell me what color it is', at: hoursAgo(2) },
      { id: 't6', from: 'you', text: 'deep teal, slightly wet', at: hoursAgo(2) },
      { id: 't7', from: 'them', text: 'exactly. you always hear it right', at: hoursAgo(1) },
    ],
  },
]

/* -------------------------------------------------------------------------- */
/*  Drift — serendipitous discovery through genuine connection paths          */
/* -------------------------------------------------------------------------- */
export const DRIFT_CANDIDATES: DriftCandidate[] = [
  {
    node: withConstellations({
      id: 'd_orla', kind: 'person', name: 'Orla', handle: 'orla.tide', hue: 196,
      bio: 'sound-walks the coastline · maps places by their noise',
      location: 'Galway', resonance: 12, activeNow: true,
      sharedContext: 'Not in your orbit yet.',
      aura: { mood: 'flow', note: 'recording the harbor at dawn', updatedAt: minutesAgo(15) },
    } as Person),
    via: 'After Dark',
    bridgeId: 'p_aria',
    reason: 'Aria has traded three signals with Orla this week.',
  },
  {
    node: withConstellations({
      id: 'd_bo', kind: 'person', name: 'Bo', handle: 'bo.synth', hue: 176,
      bio: 'modular synths · patches that never repeat',
      location: 'Copenhagen', resonance: 9, activeNow: false,
      sharedContext: 'Not in your orbit yet.',
      aura: { mood: 'still', note: 'a patch left running overnight', updatedAt: hoursAgo(9) },
    } as Person),
    via: 'Frequencies',
    bridgeId: 'p_kai',
    reason: 'Kai keeps resonating with Bo’s late-night sets.',
  },
  {
    node: withConstellations({
      id: 'd_wren', kind: 'person', name: 'Wren', handle: 'wren.frames', hue: 316,
      bio: 'stop-motion animator · a second takes a day',
      location: 'Bristol', resonance: 7, activeNow: true,
      sharedContext: 'Not in your orbit yet.',
      aura: { mood: 'spark', note: 'building a tiny paper city', updatedAt: minutesAgo(40) },
    } as Person),
    via: 'Mira',
    bridgeId: 'p_mira',
    reason: 'You and Wren both orbit Mira, but have never met.',
  },
  {
    node: withConstellations({
      id: 'd_tidepool', kind: 'community', name: 'Tide Pool', hue: 192,
      descriptor: 'field recorders & deep listeners', members: 610,
      cadence: 'a shared map of the world’s quietest places',
      resonance: 5, activeNow: true,
      aura: { mood: 'calm', note: 'new recording pinned near Galway', updatedAt: minutesAgo(22) },
    } as Community),
    via: 'Orla → Aria',
    bridgeId: 'p_aria',
    reason: 'Two of your kindred already listen here.',
  },
  {
    node: withConstellations({
      id: 'd_atlas', kind: 'person', name: 'Atlas', handle: 'atlas.maps', hue: 58,
      bio: 'draws imaginary countries with real weather',
      location: 'Nairobi', resonance: 6, activeNow: false,
      sharedContext: 'Not in your orbit yet.',
      aura: { mood: 'dream', note: 'inventing a coastline', updatedAt: hoursAgo(3) },
    } as Person),
    via: 'Makers',
    bridgeId: 'p_ren',
    reason: 'Ren and Atlas built a game jam entry together.',
  },
  {
    node: withConstellations({
      id: 'd_lune', kind: 'community', name: 'Lune', hue: 246,
      descriptor: 'insomniacs writing to each other', members: 880,
      cadence: 'letters that only unlock after midnight, local time',
      resonance: 8, activeNow: true,
      aura: { mood: 'dream', note: 'unsent letters glowing', updatedAt: minutesAgo(8) },
    } as Community),
    via: 'Midnight Studio',
    bridgeId: 'c_midnight',
    reason: 'The people you make with after dark gather here too.',
  },
]

/** Lookups */
export const nodeById = (id: string): OrbitNode | undefined =>
  NODES.find((n) => n.id === id)
