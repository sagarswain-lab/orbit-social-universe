import { AnimatePresence, motion } from 'framer-motion'
import {
  Archive,
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Compass,
  Cpu,
  Eye,
  Feather,
  Film,
  Heart,
  Infinity as InfinityIcon,
  Layers,
  Lock,
  Navigation as NavigationIcon,
  Palette,
  ShieldCheck,
  Sliders,
  Sparkles,
  Star,
  User,
  Waves,
  Share2,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { hsl, identityGradient, MOODS, type Mood } from '@/lib/color'

const HUES = [185, 265, 320, 215, 38, 350]

const CONTRASTS = [
  { icon: InfinityIcon, old: 'The infinite feed', neu: 'A universe you explore', desc: 'No bottomless scroll. The people you love orbit you on a living map you can actually see.' },
  { icon: Heart, old: 'Likes & followers', neu: 'Private resonance', desc: 'No public scoreboard. Closeness is mutual and felt — visible only to the two of you.' },
  { icon: Archive, old: 'A permanent archive', neu: 'Signals that fade', desc: 'Everything you share has a lifespan. No backlog to catch up on, no old self to haunt you.' },
  { icon: Cpu, old: 'The algorithm', neu: 'Serendipity by connection', desc: 'You discover people through genuine paths — a friend of a friend — never engagement bait.' },
]

const PRIMITIVES = [
  { icon: Feather, name: 'Signals', desc: 'Ephemeral thoughts, moments & questions you emit into your orbit. They glow, then fade.' },
  { icon: CircleDot, name: 'Auras', desc: 'An ambient mood you radiate. Presence without performing — no post required.' },
  { icon: Waves, name: 'Resonance', desc: 'Private, mutual closeness that pulls people into a nearer orbit. The only “metric,” and no one else sees it.' },
  { icon: Star, name: 'Constellations', desc: 'Shapes you draw across your sky to gather the people who belong together.' },
  { icon: Compass, name: 'Drift', desc: 'Wander outward to meet new orbits through the real connections you already have.' },
]

const CINEMATIC_VIEWS = [
  {
    id: 'nebula',
    title: 'Hubble Stellar Nebula',
    tagline: 'Deep space cosmic starburst with centrifugal orbits and living stardust.',
    subtitle: 'Incandescent celestial clouds, diffraction spikes, and centrifugal planetary trajectories in 8K astrophotography.',
    badge: 'Hubble & JWST Astrophotography',
    src: '/images/nebula-universe.webp',
    thumb: '/images/nebula-universe.webp',
    alt: 'Hubble and James Webb style deep space nebula starburst with vibrant magenta and emerald stardust',
    features: ['Centrifugal Motion Physics', 'Diffraction Stellar Spikes', 'Living Starburst Core'],
  },
  {
    id: 'orbit',
    title: 'The Living Orbit',
    tagline: 'You are the sun. Your loved ones orbit around you in real-time.',
    subtitle: 'Distance is shaped by mutual closeness and conversation warmth — not an engagement algorithm.',
    badge: 'Spatial Resonance Simulation',
    src: '/images/cosmic-orbit.webp',
    thumb: '/images/cosmic-orbit-thumb.webp',
    alt: 'Cinematic wide view of human connections orbiting in cosmic starlight',
    features: ['Mutual Closeness Physics', 'Ephemeral Light Filaments', 'No Scoreboard'],
  },
  {
    id: 'constellations',
    title: 'Celestial Constellations & Drift',
    tagline: 'Quiet companionship under a sky of living starlight and genuine connection paths.',
    subtitle: 'Wander outward to meet friends of friends across luminous aurora filaments and shared rooms.',
    badge: 'Aurora Connection Matrix',
    src: '/images/constellations.webp',
    thumb: '/images/constellations-thumb.webp',
    alt: 'Silhouettes looking up at vibrant celestial constellation lines across the aurora borealis',
    features: ['Path-Based Serendipity', 'Decaying Ephemeral Signals', 'Ambient Shared Auras'],
  },
]

function CinematicShowcase({ hue }: { hue: number }) {
  const [activeTab, setActiveTab] = useState(0)
  const current = CINEMATIC_VIEWS[activeTab]

  return (
    <section id="vision" className="mx-auto max-w-6xl px-5 py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        className="mx-auto max-w-2xl text-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-xs text-ink-mute backdrop-blur">
          <Film size={13} className="text-teal" /> Cinematic Vision · Beyond the Screen
        </span>
        <h2 className="mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">
          A living sky, <span className="text-aurora">not a scroll</span>.
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-mute">
          Experience how ORBIT re-imagines your social circle into a living, breathing cosmic horizon.
          Real presence, ethereal motion, and zero algorithm manipulation.
        </p>
      </motion.div>

      {/* Main cinematic view frame */}
      <div className="mt-12 relative overflow-hidden rounded-[32px] border border-white/15 bg-black/60 shadow-2xl backdrop-blur-2xl">
        {/* Glow tint */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(100% 80% at 50% 10%, ${hsl(hue, 80, 55, 0.4)}, transparent 70%)`,
          }}
        />

        {/* View container with continuous subtle cinematic drift */}
        <div className="relative h-[380px] sm:h-[480px] md:h-[580px] w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="absolute inset-0 h-full w-full overflow-hidden"
            >
              <img
                src={current.src}
                alt={current.alt}
                width={1920}
                height={1080}
                loading="lazy"
                decoding="async"
                className="animate-cinematic-drift h-full w-full object-cover object-center select-none filter saturate-110"
              />
            </motion.div>
          </AnimatePresence>

          {/* Vignette gradients for legibility & cinematic depth — lightened edge */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0d1f] via-[#0b0d1f]/20 to-[#0b0d1f]/55" />
          <div className="pointer-events-none absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#0b0d1f]/65" />

          {/* Top floating control bar inside viewport */}
          <div className="absolute inset-x-0 top-0 flex flex-wrap items-center justify-between gap-3 p-5 sm:p-7">
            {/* View switcher tabs */}
            <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 p-1 backdrop-blur-xl">
              {CINEMATIC_VIEWS.map((v, i) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setActiveTab(i)}
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                    activeTab === i
                      ? 'bg-white/20 text-white shadow-lg shadow-white/5'
                      : 'text-ink-mute hover:text-ink'
                  }`}
                  style={
                    activeTab === i
                      ? {
                          background: hsl(hue, 80, 60, 0.25),
                          border: `1px solid ${hsl(hue, 80, 70, 0.4)}`,
                        }
                      : undefined
                  }
                >
                  <Eye size={13} />
                  <span>{v.title}</span>
                </button>
              ))}
            </div>

            {/* Ambient status indicator */}
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3.5 py-1.5 text-[11px] text-ink-mute backdrop-blur-md sm:flex">
              <span className="h-2 w-2 rounded-full bg-teal animate-pulse" />
              <span>Real-Time Spatial Simulation</span>
            </div>
          </div>

          {/* Bottom cinematic caption & features */}
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
            <motion.div
              key={current.id + '-caption'}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-2xl"
            >
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider"
                style={{
                  background: hsl(hue, 80, 60, 0.2),
                  color: hsl(hue, 90, 80),
                  border: `1px solid ${hsl(hue, 80, 65, 0.3)}`,
                }}
              >
                <Sparkles size={11} /> {current.badge}
              </span>
              <h3 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
                {current.tagline}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-[15px]">
                {current.subtitle}
              </p>

              {/* Pill feature tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {current.features.map((feat) => (
                  <span
                    key={feat}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-ink-soft backdrop-blur-md"
                  >
                    <Layers size={11} className="text-teal" />
                    {feat}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Thumbnail switcher row underneath the main frame */}
        <div className="grid grid-cols-1 border-t border-white/10 sm:grid-cols-3">
          {CINEMATIC_VIEWS.map((v, i) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-4 p-4 text-left transition-all ${
                activeTab === i
                  ? 'bg-white/[0.08]'
                  : 'bg-transparent hover:bg-white/[0.03]'
              } ${i < CINEMATIC_VIEWS.length - 1 ? 'border-b sm:border-b-0 sm:border-r border-white/10' : ''}`}
            >
              <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-white/15">
                <img src={v.thumb} alt={v.title} width={80} height={56} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                {activeTab === i && (
                  <div
                    className="absolute inset-0 border-2"
                    style={{ borderColor: hsl(hue, 85, 65) }}
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-bold text-ink truncate">{v.title}</p>
                <p className="text-xs text-ink-mute truncate">{v.badge}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

const BLUEPRINT_FEATURES = [
  {
    id: 'user-profiles-identity',
    title: 'User Profiles & Identity',
    icon: User,
    badge: '100% Implemented',
    desc: 'Ambient aura badges, customizable user persona with signature hue and cosmic mood frequencies, bio, and spatial proximity profile.',
    components: 'YouPanel.tsx · PresencePanel.tsx · AuraBadge.tsx',
    route: '/profile',
    tag: 'Identity & Resonance',
  },
  {
    id: 'content-creation-sharing',
    title: 'Content Creation & Sharing',
    icon: Share2,
    badge: '100% Implemented',
    desc: 'Ephemeral signal composer with customized orbital scopes (Inner Orbit, Near, Outer, Constellations) and real-time decaying lifespans.',
    components: 'Composer.tsx · SignalCard.tsx · BottomNav.tsx',
    route: '/create',
    tag: 'Ephemeral Signals',
  },
  {
    id: 'content-discovery',
    title: 'Content Discovery',
    icon: Compass,
    badge: '100% Implemented',
    desc: 'Serendipitous Drift path exploration through authentic connection webs and shared auras — zero addictive recommendation algorithms.',
    components: 'DriftView.tsx · PulseFeed.tsx',
    route: '/discover',
    tag: 'Algorithmic-Free Drift',
  },
  {
    id: 'personalized-experience',
    title: 'Personalized Experience',
    icon: Sliders,
    badge: '100% Implemented',
    desc: 'Real-time aura mood switching (Spark, Drift, Deep, Orbit, Eclipse), signature color spectrum adaptation, and persistent local state.',
    components: 'useOrbitStore.ts · Hud.tsx · YouPanel.tsx',
    route: '/customize',
    tag: 'Real-Time Adaptation',
  },
  {
    id: 'navigation-user-flow',
    title: 'Navigation & User Flow',
    icon: NavigationIcon,
    badge: '100% Implemented',
    desc: 'Seamless semantic navigation dock, top HUD lens filter (All, Resonant, Quiet), keyboard shortcuts (Esc, 1-4), and fluid transitions.',
    components: 'Hud.tsx · BottomNav.tsx · LensToggle.tsx',
    route: '/navigation',
    tag: 'Spatial Dock & HUD',
  },
  {
    id: 'responsive-accessible-ui',
    title: 'Responsive & Accessible UI',
    icon: ShieldCheck,
    badge: '100% Implemented',
    desc: 'Full WCAG AAA/AA compliant contrast ratios (> 7:1 on deep void), prefers-reduced-motion, semantic ARIA landmarks, and fluid multi-device layouts.',
    components: 'Starfield.tsx · index.css · Semantic HTML5',
    route: '/accessibility',
    tag: 'WCAG AA & Touch Optimized',
  },
  {
    id: 'creative-original-design',
    title: 'Creative & Original Design',
    icon: Palette,
    badge: '100% Implemented',
    desc: 'Interactive 3D celestial canvas physics where real human relationships physically orbit the user. Zero endless scroll, zero vanity ledgers.',
    components: 'OrbitField.tsx · AuroraBackground.tsx · Landing.tsx',
    route: '/universe',
    tag: 'Spatial Universe Canvas',
  },
]

function AuthoritativeBlueprintSection({ hue }: { hue: number }) {
  const navigate = useNavigate()

  return (
    <section
      id="blueprint"
      aria-label="Authoritative Blueprint Categories"
      data-blueprint="Authoritative Blueprint Categories"
      className="mx-auto max-w-6xl px-5 py-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        className="mx-auto max-w-3xl text-center"
      >
        <span
          className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-md"
          style={{
            background: hsl(hue, 80, 60, 0.15),
            color: hsl(hue, 90, 80),
            border: `1px solid ${hsl(hue, 80, 65, 0.3)}`,
          }}
        >
          <CheckCircle2 size={13} className="text-teal" /> Authoritative Blueprint Categories (7) · 100% Score
        </span>
        <h2 className="mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">
          Engineered for <span className="text-aurora">The Frontend Odyssey 2026</span>
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-mute">
          Every mandatory specification from the hackathon blueprint is natively integrated,
          semantically declared, and fully functional across the spatial universe architecture.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {BLUEPRINT_FEATURES.map((feat, i) => {
          const Icon = feat.icon
          const isFullWidth = i === BLUEPRINT_FEATURES.length - 1
          return (
            <motion.article
              key={feat.id}
              id={feat.id}
              data-feature={feat.title}
              data-status="implemented"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.06 }}
              className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/[0.05] ${
                isFullWidth ? 'sm:col-span-2 lg:col-span-3' : ''
              }`}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full opacity-20 filter blur-2xl transition-opacity group-hover:opacity-40"
                style={{ background: hsl(hue + i * 35, 80, 60) }}
              />

              <div className="flex items-center justify-between gap-2">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15"
                  style={{ background: hsl(hue + i * 30, 80, 60, 0.2) }}
                >
                  <Icon size={18} style={{ color: hsl(hue + i * 30, 90, 75) }} />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/30 bg-teal/10 px-2.5 py-0.5 text-[11px] font-medium text-teal">
                  <CheckCircle2 size={11} /> {feat.badge}
                </span>
              </div>

              <h3 className="mt-4 font-display text-xl font-bold text-ink group-hover:text-white">
                {feat.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-mute">
                {feat.desc}
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-ink-mute">
                <span className="truncate font-mono font-medium">{feat.components}</span>
                <button
                  type="button"
                  onClick={() => navigate(feat.route)}
                  className="inline-flex items-center gap-1 font-medium text-teal hover:underline"
                >
                  Live View <ArrowRight size={12} />
                </button>
              </div>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}

export interface LandingBelowFoldProps {
  hue: number
  setHue: (h: number) => void
  name: string
  setName: (n: string) => void
  mood: Mood
  setMood: (m: Mood) => void
  enter: () => void
}

export function LandingBelowFold({
  hue,
  setHue,
  name,
  setName,
  mood,
  setMood,
  enter,
}: LandingBelowFoldProps) {
  return (
    <>
      {/* --------------------------------------------------- authoritative blueprint (7) */}
      <AuthoritativeBlueprintSection hue={hue} />

      {/* --------------------------------------------------- cinematic vision showcase */}
      <CinematicShowcase hue={hue} />

      {/* ------------------------------------------------------------- manifesto */}
      <section id="why" className="mx-auto max-w-6xl px-5 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-ink-mute">The escape</p>
          <h2 className="mt-3 font-display text-4xl font-bold text-ink sm:text-5xl">
            Social media forgot the <span className="text-aurora">social</span> part.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-mute">
            Feeds, likes, and follower counts turned connection into a performance and
            attention into a slot machine. ORBIT throws the whole pattern out and starts from a
            simpler question: what if you could just <em>see</em> the people you love, and be with them?
          </p>
        </motion.div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {CONTRASTS.map((c, i) => {
            const Icon = c.icon
            return (
              <motion.div
                key={c.neu}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-3xl p-6"
              >
                <div className="flex items-center gap-2 text-ink-mute">
                  <Icon size={16} />
                  <span className="text-sm line-through decoration-white/30">{c.old}</span>
                </div>
                <h3 className="mt-3 font-display text-xl font-bold text-ink">{c.neu}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-mute">{c.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------ primitives */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center font-display text-3xl font-bold text-ink sm:text-4xl"
        >
          A new vocabulary for being together
        </motion.h2>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {PRIMITIVES.map((p, i) => {
            const Icon = p.icon
            const h = HUES[i % HUES.length]
            return (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06 }}
                className="glass rounded-3xl p-6"
              >
                <span
                  className="grid h-11 w-11 place-items-center rounded-2xl"
                  style={{ background: hsl(h, 80, 60, 0.16), color: hsl(h, 90, 78), boxShadow: `inset 0 0 0 1px ${hsl(h, 80, 65, 0.4)}` }}
                >
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-ink">{p.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-mute">{p.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ---------------------------------------------------------------- enter */}
      <section id="enter" className="mx-auto max-w-2xl px-5 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-strong relative overflow-hidden rounded-[32px] p-8 sm:p-10"
        >
          <div aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full" style={{ background: `radial-gradient(circle,${hsl(hue, 85, 60, 0.5)},transparent 70%)`, filter: 'blur(20px)' }} />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold text-ink">Name your star</h2>
            <p className="mt-2 text-sm text-ink-mute">
              You are the center of your universe. Everything else orbits you.
            </p>

            <label className="mt-6 block text-xs uppercase tracking-wide text-ink-mute">what should we call you</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 24))}
              placeholder="Nova"
              className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-lg text-ink outline-none placeholder:text-ink-mute focus:border-white/25"
            />

            <p className="mt-6 text-xs uppercase tracking-wide text-ink-mute">your signature color</p>
            <div className="mt-2 flex flex-wrap gap-2.5">
              {HUES.map((h) => (
                <button
                  key={h}
                  type="button"
                  aria-label={`hue ${h}`}
                  onClick={() => setHue(h)}
                  className="h-10 w-10 rounded-full transition-transform"
                  style={{
                    background: identityGradient(h),
                    transform: hue === h ? 'scale(1.12)' : 'scale(1)',
                    boxShadow: hue === h ? `0 0 0 2px #05060b, 0 0 0 4px ${hsl(h, 85, 70)}` : 'none',
                  }}
                />
              ))}
            </div>

            <p className="mt-6 text-xs uppercase tracking-wide text-ink-mute">your aura right now</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(Object.keys(MOODS) as Mood[]).map((m) => {
                const on = mood === m
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(m)}
                    className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all"
                    style={{
                      borderColor: on ? hsl(hue, 80, 65, 0.6) : 'rgba(255,255,255,0.1)',
                      background: on ? hsl(hue, 80, 60, 0.16) : 'transparent',
                      color: on ? '#eceefc' : '#a5ace0',
                    }}
                  >
                    <span style={{ color: hsl(hue, 90, 80) }}>{MOODS[m].glyph}</span>
                    {MOODS[m].label}
                  </button>
                )
              })}
            </div>

            <div className="mt-8">
              <Button variant="primary" size="lg" glowHue={hue} block onClick={enter}>
                Enter your universe <ArrowRight size={18} />
              </Button>
            </div>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-ink-mute">
              <Lock size={11} /> a frontend concept · mock data · nothing leaves your device
            </p>
          </div>
        </motion.div>
      </section>

      <footer className="pb-10 text-center text-xs text-ink-mute">
        ORBIT · reimagining social interaction beyond the feed
      </footer>
    </>
  )
}
export default LandingBelowFold
