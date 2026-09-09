import { motion } from 'framer-motion'
import {
  Archive,
  ArrowRight,
  ChevronDown,
  CircleDot,
  Compass,
  Cpu,
  Feather,
  Heart,
  Infinity as InfinityIcon,
  Lock,
  Sparkles,
  Star,
  Waves,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { hsl, identityGradient, MOODS, type Mood } from '@/lib/color'
import { useOrbitStore } from '@/store/useOrbitStore'

const HUES = [265, 200, 172, 328, 40, 300, 150, 222]

/* Decorative, non-interactive orbit for the hero. */
function HeroOrbit({ hue }: { hue: number }) {
  const rings = [
    { size: 180, dur: 26, dots: [{ a: 0.2, h: hue }] },
    { size: 300, dur: 40, dots: [{ a: 1.1, h: hue + 60 }, { a: 3.6, h: hue - 40 }] },
    { size: 440, dur: 60, dots: [{ a: 2.2, h: hue + 120 }, { a: 5.0, h: hue + 30 }] },
  ]
  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      {rings.map((r, i) => (
        <div
          key={i}
          className="absolute rounded-full border"
          style={{
            width: r.size,
            height: r.size,
            left: -r.size / 2,
            top: -r.size / 2,
            borderColor: hsl(hue, 70, 70, 0.12),
            animation: `spin ${r.dur}s linear infinite`,
          }}
        >
          {r.dots.map((d, j) => (
            <span
              key={j}
              className="absolute h-3 w-3 rounded-full"
              style={{
                left: `calc(50% + ${Math.cos(d.a) * (r.size / 2)}px - 6px)`,
                top: `calc(50% + ${Math.sin(d.a) * (r.size / 2)}px - 6px)`,
                background: hsl(d.h, 85, 66),
                boxShadow: `0 0 14px ${hsl(d.h, 85, 62, 0.9)}`,
              }}
            />
          ))}
        </div>
      ))}
      <div
        className="absolute h-10 w-10 rounded-full opacity-70"
        style={{
          left: -20,
          top: -20,
          background: hsl(hue, 85, 66, 0.5),
          filter: 'blur(6px)',
        }}
      />
    </div>
  )
}

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

export function Landing() {
  const navigate = useNavigate()
  const you = useOrbitStore((s) => s.you)
  const complete = useOrbitStore((s) => s.completeOnboarding)

  const [name, setName] = useState('')
  const [hue, setHue] = useState(you.hue)
  const [mood, setMood] = useState<Mood>('spark')

  const enter = () => {
    complete({ name: name || 'Nova', hue, mood })
    navigate('/universe')
  }

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="relative z-10">
      {/* ------------------------------------------------------------------ hero */}
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 text-center">
        <HeroOrbit hue={hue} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-xs text-ink-mute backdrop-blur">
            <Sparkles size={13} /> Reimagining social · no feed · no likes · no followers
          </span>

          <h1 className="mt-7 font-display text-[19vw] font-bold leading-[0.85] tracking-tight text-aurora sm:text-[10rem]">
            ORBIT
          </h1>

          <p className="mx-auto mt-2 max-w-xl font-display text-xl font-medium text-ink sm:text-2xl">
            Your social universe, not your feed.
          </p>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-ink-mute">
            The people you care about orbit you — pulled close by real connection, never by
            a follower count. Presence over performance.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              variant="primary"
              size="lg"
              glowHue={hue}
              onClick={() => {
                complete({ name: name || 'Nova', hue, mood })
                navigate('/universe')
              }}
            >
              Launch Orbit Live <ArrowRight size={18} />
            </Button>
            <Button variant="glass" size="lg" onClick={() => scrollTo('enter')}>
              Customize Star
            </Button>
            <Button variant="ghost" size="lg" onClick={() => scrollTo('why')}>
              Manifesto
            </Button>
          </div>
        </motion.div>

        <motion.button
          onClick={() => scrollTo('why')}
          className="absolute bottom-8 text-ink-faint"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          aria-label="Scroll down"
        >
          <ChevronDown size={26} />
        </motion.button>
      </section>

      {/* ------------------------------------------------------------- manifesto */}
      <section id="why" className="mx-auto max-w-6xl px-5 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-ink-faint">The escape</p>
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
                <div className="flex items-center gap-2 text-ink-faint">
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

            <label className="mt-6 block text-xs uppercase tracking-wide text-ink-faint">what should we call you</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 24))}
              placeholder="Nova"
              className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-lg text-ink outline-none placeholder:text-ink-faint focus:border-white/25"
            />

            <p className="mt-6 text-xs uppercase tracking-wide text-ink-faint">your signature color</p>
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

            <p className="mt-6 text-xs uppercase tracking-wide text-ink-faint">your aura right now</p>
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
                      color: on ? '#eceefc' : '#8b91bd',
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
            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-ink-faint">
              <Lock size={11} /> a frontend concept · mock data · nothing leaves your device
            </p>
          </div>
        </motion.div>
      </section>

      <footer className="pb-10 text-center text-xs text-ink-faint">
        ORBIT · reimagining social interaction beyond the feed
      </footer>
    </div>
  )
}
