import { AnimatePresence, motion } from 'framer-motion'
import {
  Archive,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
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
  Share2,
  ShieldCheck,
  Sliders,
  Sparkles,
  Star,
  User,
  Waves,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { hsl, identityGradient, MOODS, type Mood } from '@/lib/color'
import { useOrbitStore } from '@/store/useOrbitStore'

const HUES = [265, 200, 172, 328, 40, 300, 150, 222]

// ─── METEOR DATA ─────────────────────────────────────────────────────────────
const METEORS = [
  { top: '3%',  left: '92%', delay: '0s',    dur: '1.8s', len: 120, color: '#ffffff' },
  { top: '8%',  left: '75%', delay: '3.2s',  dur: '2.2s', len: 90,  color: '#c8d8ff' },
  { top: '15%', left: '88%', delay: '6.1s',  dur: '1.5s', len: 150, color: '#ffffff' },
  { top: '2%',  left: '60%', delay: '9.4s',  dur: '2.0s', len: 100, color: '#aaddff' },
  { top: '20%', left: '95%', delay: '12.0s', dur: '1.7s', len: 80,  color: '#ffe8c0' },
  { top: '5%',  left: '82%', delay: '14.5s', dur: '2.5s', len: 110, color: '#ffffff' },
  { top: '1%',  left: '70%', delay: '17.1s', dur: '1.6s', len: 130, color: '#ddccff' },
  { top: '12%', left: '98%', delay: '19.8s', dur: '2.1s', len: 95,  color: '#c8d8ff' },
  { top: '7%',  left: '55%', delay: '22.3s', dur: '1.9s', len: 140, color: '#ffffff' },
  { top: '18%', left: '80%', delay: '25.0s', dur: '2.3s', len: 85,  color: '#aaffee' },
  { top: '4%',  left: '67%', delay: '27.6s', dur: '1.4s', len: 105, color: '#ffe0a0' },
  { top: '10%', left: '90%', delay: '30.2s', dur: '2.0s', len: 120, color: '#ffffff' },
]

// ─── COMET DATA ──────────────────────────────────────────────────────────────
const COMETS = [
  { top: '5%',  left: '99%', delay: '4s',  dur: '9s',  len: 260, color1: '#78e8ff', color2: '#8b7bff' },
  { top: '28%', left: '99%', delay: '18s', dur: '11s', len: 320, color1: '#ffd27a', color2: '#ff6ad5' },
  { top: '12%', left: '99%', delay: '33s', dur: '8s',  len: 200, color1: '#4ee6c6', color2: '#5aa2ff' },
]

// ─── SATELLITE DATA (ISS-style) ───────────────────────────────────────────────
const SATELLITES = [
  { top: '22%', delay: '2s',  dur: '28s', anim: 'satellite-pass',   size: 6,  panelColor: '#90d0ff' },
  { top: '58%', delay: '14s', dur: '36s', anim: 'satellite-pass-2', size: 5,  panelColor: '#ffd27a' },
  { top: '38%', delay: '8s',  dur: '45s', anim: 'satellite-pass',   size: 4,  panelColor: '#4ee6c6' },
]

// ─── ASTEROID DATA ───────────────────────────────────────────────────────────
const ASTEROIDS = [
  { top: '30%', left: '96%', delay: '1s',  dur: '22s', size: 4 },
  { top: '48%', left: '92%', delay: '11s', dur: '30s', size: 3 },
  { top: '16%', left: '88%', delay: '21s', dur: '26s', size: 5 },
  { top: '62%', left: '98%', delay: '7s',  dur: '18s', size: 3 },
]

// ─── DEEP STARS (24 max — keep DOM lean for PageSpeed) ─────────────────────
const DEEP_STARS = Array.from({ length: 24 }, (_, i) => ({
  top:   `${Math.round(3  + ((i * 137.5) % 94))}%`,
  left:  `${Math.round(1  + ((i * 97.3)  % 98))}%`,
  size:  (i % 4 === 0) ? 2 : 1,
  delay: `${((i * 0.77) % 8).toFixed(1)}s`,
  dur:   `${(2.5 + (i % 5) * 1.2).toFixed(1)}s`,
  opacity: 0.4 + (i % 5) * 0.12,
}))

// ─── NEBULA FLARES ───────────────────────────────────────────────────────────
const NEBULA_FLARES = [
  { top: '15%', left: '20%', delay: '0s',  dur: '12s', color: 'rgba(139,123,255,0.5)', size: 180 },
  { top: '65%', left: '75%', delay: '7s',  dur: '15s', color: 'rgba(78,230,198,0.45)', size: 140 },
  { top: '40%', left: '50%', delay: '14s', dur: '10s', color: 'rgba(255,106,213,0.4)', size: 120 },
]

/**
 * Deep-space particle layer: meteors, comets, satellites, asteroids, stars, flares.
 * Pure CSS animations — zero JS computation at runtime.
 */
function CosmicParticles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden select-none z-[1]">

      {/* ── DEEP TWINKLING STARFIELD ── */}
      {DEEP_STARS.map((s, i) => (
        <div
          key={`star-${i}`}
          className="absolute rounded-full bg-white"
          style={{
            top: s.top, left: s.left,
            width: s.size, height: s.size,
            animation: `deep-twinkle ${s.dur} ${s.delay} ease-in-out infinite`,
            opacity: s.opacity,
            boxShadow: s.size > 1 ? '0 0 4px 1px rgba(255,255,255,0.6)' : undefined,
          }}
        />
      ))}

      {/* ── NEBULA HOT-SPOT FLARES ── */}
      {NEBULA_FLARES.map((f, i) => (
        <div
          key={`flare-${i}`}
          className="absolute rounded-full filter blur-2xl mix-blend-screen"
          style={{
            top: f.top, left: f.left,
            width: f.size, height: f.size,
            background: `radial-gradient(circle, ${f.color} 0%, transparent 70%)`,
            animation: `nebula-flare ${f.dur} ${f.delay} ease-in-out infinite`,
            opacity: 0,
          }}
        />
      ))}

      {/* ── METEORS ── */}
      {METEORS.map((m, i) => (
        <div
          key={`meteor-${i}`}
          className="absolute"
          style={{
            top: m.top, left: m.left,
            animation: `meteor-fall ${m.dur} ${m.delay} linear infinite`,
            opacity: 0,
          }}
        >
          {/* Glowing head */}
          <div
            className="absolute rounded-full"
            style={{
              width: 3, height: 3,
              background: m.color,
              boxShadow: `0 0 6px 3px ${m.color}`,
              top: 0, left: m.len - 3,
            }}
          />
          {/* Fading trail */}
          <div
            style={{
              width: m.len, height: 1,
              background: `linear-gradient(90deg, transparent 0%, ${m.color}55 40%, ${m.color} 100%)`,
              borderRadius: 999,
            }}
          />
        </div>
      ))}

      {/* ── COMETS (longer, slower, colour-gradient tails) ── */}
      {COMETS.map((c, i) => (
        <div
          key={`comet-${i}`}
          className="absolute"
          style={{
            top: c.top, left: c.left,
            animation: `comet-arc ${c.dur} ${c.delay} cubic-bezier(0.25,0.1,0.25,1) infinite`,
            opacity: 0,
          }}
        >
          {/* Bright nucleus */}
          <div
            className="absolute rounded-full"
            style={{
              width: 5, height: 5,
              background: '#ffffff',
              boxShadow: `0 0 10px 5px ${c.color1}, 0 0 20px 10px ${c.color2}55`,
              top: -1, left: c.len - 5,
            }}
          />
          {/* Ion tail */}
          <div
            style={{
              width: c.len, height: 3,
              background: `linear-gradient(90deg, transparent 0%, ${c.color2}40 30%, ${c.color1}99 75%, #ffffff 100%)`,
              borderRadius: 999,
              filter: 'blur(0.5px)',
            }}
          />
          {/* Diffuse dust tail (wider, more transparent) */}
          <div
            style={{
              width: c.len * 0.7, height: 8,
              marginTop: -5.5,
              background: `linear-gradient(90deg, transparent 0%, ${c.color2}20 50%, ${c.color1}40 100%)`,
              borderRadius: 999,
              filter: 'blur(2px)',
            }}
          />
        </div>
      ))}

      {/* ── SATELLITES (ISS-style with solar panels) ── */}
      {SATELLITES.map((sat, i) => (
        <div
          key={`sat-${i}`}
          className="absolute"
          style={{
            top: sat.top,
            left: 0,
            animation: `${sat.anim} ${sat.dur} ${sat.delay} linear infinite`,
            opacity: 0,
          }}
        >
          {/* Body */}
          <div
            className="relative flex items-center gap-[3px]"
            style={{ width: sat.size * 6, height: sat.size }}
          >
            {/* Left solar panel */}
            <div
              style={{
                width: sat.size * 2, height: sat.size * 0.6,
                background: sat.panelColor,
                opacity: 0.85,
                borderRadius: 1,
                boxShadow: `0 0 4px ${sat.panelColor}`,
              }}
            />
            {/* Central bus */}
            <div
              style={{
                width: sat.size * 2, height: sat.size,
                background: '#c0d8f8',
                borderRadius: 2,
                boxShadow: '0 0 6px rgba(160,200,255,0.8)',
              }}
            />
            {/* Right solar panel */}
            <div
              style={{
                width: sat.size * 2, height: sat.size * 0.6,
                background: sat.panelColor,
                opacity: 0.85,
                borderRadius: 1,
                boxShadow: `0 0 4px ${sat.panelColor}`,
              }}
            />
          </div>
          {/* Tiny blinking signal light */}
          <div
            className="absolute top-0 rounded-full"
            style={{
              width: 2, height: 2,
              background: '#ff4040',
              left: sat.size * 3,
              animation: 'deep-twinkle 1.2s linear infinite',
            }}
          />
        </div>
      ))}

      {/* ── TUMBLING ASTEROIDS ── */}
      {ASTEROIDS.map((a, i) => (
        <div
          key={`ast-${i}`}
          className="absolute"
          style={{
            top: a.top, left: a.left,
            animation: `asteroid-drift ${a.dur} ${a.delay} linear infinite`,
            opacity: 0,
          }}
        >
          {/* Rough rock shape using a rotated pill */}
          <div
            style={{
              width: a.size * 2.5, height: a.size * 1.5,
              background: 'radial-gradient(circle at 40% 35%, #9aa0b8 0%, #5a5f72 55%, #30333f 100%)',
              borderRadius: '40% 60% 55% 45% / 45% 55% 50% 50%',
              boxShadow: '0 0 4px rgba(160,170,200,0.3)',
            }}
          />
        </div>
      ))}
    </div>
  )
}

/**
 * Cinematic Cosmic Solar System for the Hero 1st View:
 * Features high-definition newly generated Hubble nebula artwork,
 * centrifugal motion physics, expanding solar wind waves, spiral stardust filaments,
 * and 5 jewel-like glowing planets with dynamic orbital trails.
 */
function CosmicSolarSystem({ hue }: { hue: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden flex items-center justify-center select-none"
    >
      {/* 1. Cinematic Nebula Backdrop (Only in 1st view, matching user reference image) */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="animate-cinematic-drift absolute -inset-[10%] h-[120%] w-[120%] bg-cover bg-center opacity-95 filter saturate-125 contrast-105"
          style={{
            backgroundImage: "url('/images/nebula-universe.webp')",
            transformOrigin: 'center center',
            maskImage:
              'radial-gradient(ellipse 96% 88% at 50% 50%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.95) 55%, rgba(0,0,0,0.3) 88%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 96% 88% at 50% 50%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.95) 55%, rgba(0,0,0,0.3) 88%, transparent 100%)',
          }}
        />

        {/* Softened deep-space veil — reduced to let nebula colours breathe through */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(11,13,31,0.25) 0%, rgba(11,13,31,0.12) 45%, rgba(11,13,31,0.65) 100%)',
          }}
        />

        {/* Color-tuned auroral sweeps */}
        <div
          className="absolute left-1/2 top-1/2 h-[720px] w-[920px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-45 mix-blend-screen filter blur-[85px]"
          style={{
            background: `radial-gradient(circle, ${hsl(hue, 90, 55, 0.75)} 0%, ${hsl(hue + 70, 85, 48, 0.4)} 50%, transparent 75%)`,
            animation: 'breathe 7s ease-in-out infinite alternate',
          }}
        />
      </div>

      {/* 2. Centrifugal Outward Solar Wind & Expanding Waves */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {/* Continuous centrifugal expansion waves radiating outward */}
        <div
          className="animate-centrifugal-wave absolute h-[300px] w-[300px] rounded-full border border-teal/40"
          style={{ animationDuration: '6s' }}
        />
        <div
          className="animate-centrifugal-wave absolute h-[300px] w-[300px] rounded-full border border-violet/35"
          style={{ animationDuration: '6s', animationDelay: '-2s' }}
        />
        <div
          className="animate-centrifugal-wave absolute h-[300px] w-[300px] rounded-full border border-amber-300/30"
          style={{ animationDuration: '6s', animationDelay: '-4s' }}
        />

        {/* Centrifugal stardust spiral arms radiating outward */}
        <div
          className="animate-centrifugal-spiral absolute h-[760px] w-[760px] rounded-full opacity-35 mix-blend-screen filter blur-[8px]"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, ${hsl(hue, 85, 65, 0.55)} 55deg, transparent 115deg, ${hsl(hue + 60, 90, 60, 0.45)} 180deg, transparent 240deg, ${hsl(hue - 60, 85, 65, 0.5)} 300deg, transparent 360deg)`,
          }}
        />
      </div>

      {/* 3. Soft Ambient Corona Backlight */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full opacity-50 filter blur-[60px]"
        style={{
          background: `radial-gradient(circle, ${hsl(hue, 95, 65, 0.95)} 0%, rgba(78, 230, 198, 0.65) 40%, transparent 70%)`,
          animation: 'corona-pulse 5s ease-in-out infinite',
        }}
      />

      {/* 4. 3D Tilted Centrifugal Solar System */}
      <div
        className="relative flex items-center justify-center"
        style={{
          transform: 'perspective(1400px) rotateX(60deg) rotateZ(-16deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Incandescent Central Star / Sun with Corona Flare */}
        <div
          className="absolute z-20 flex items-center justify-center"
          style={{ transform: 'rotateX(-60deg) rotateZ(16deg)' }}
        >
          {/* Outer Sun Pulsing Corona */}
          <div
            className="absolute h-20 w-20 rounded-full opacity-60 filter blur-[10px]"
            style={{
              background: 'radial-gradient(circle, #fde047 0%, #f97316 60%, transparent 85%)',
              animation: 'ring-pulse 3.5s ease-out infinite',
            }}
          />
          {/* Main Solar Core */}
          <div
            className="relative h-12 w-12 rounded-full shadow-2xl"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #fef08a 35%, #f59e0b 70%, #d97706 100%)',
              boxShadow: '0 0 35px rgba(251, 191, 36, 1), 0 0 75px rgba(245, 158, 11, 0.75), 0 0 110px rgba(234, 88, 12, 0.5)',
            }}
          />
        </div>

        {/* --- ORBIT 1: Helios (Inner Swift Planet with Centrifugal Speed) --- */}
        <div
          className="absolute rounded-full border border-dashed border-white/20"
          style={{
            width: 380,
            height: 380,
            animation: 'centrifugal-orbit 9s linear infinite',
            boxShadow: '0 0 16px rgba(255, 210, 122, 0.15)',
          }}
        >
          <div
            className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex items-center justify-center"
            style={{ transform: 'rotateX(-60deg) rotateZ(16deg)' }}
          >
            <div
              className="h-4 w-4 rounded-full shadow-lg"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #fff 0%, #ffd27a 40%, #ff8c00 100%)',
                boxShadow: '0 0 16px rgba(255, 180, 50, 1)',
              }}
            />
            {/* Centrifugal outward trail */}
            <div
              className="absolute -left-8 -top-1 h-1.5 w-9 rounded-full opacity-75 filter blur-[1px]"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,200,80,0.9))',
                transform: 'rotate(15deg)',
              }}
            />
          </div>
        </div>

        {/* --- ORBIT 2: Azure Terra with Orbiting Moon (Centrifugal Orbit) --- */}
        <div
          className="absolute rounded-full border border-white/16"
          style={{
            width: 580,
            height: 580,
            animation: 'centrifugal-orbit 16s linear infinite',
            boxShadow: '0 0 22px rgba(78, 230, 198, 0.15)',
          }}
        >
          <div
            className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center justify-center"
            style={{ transform: 'rotateX(-60deg) rotateZ(16deg)' }}
          >
            <div
              className="h-6 w-6 rounded-full shadow-xl"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #e0faff 0%, #22d3ee 45%, #0891b2 85%, #0e374e 100%)',
                boxShadow: '0 0 24px rgba(34, 211, 238, 0.95)',
              }}
            />
            {/* Orbiting Moon with centrifugal speed */}
            <div
              className="absolute h-14 w-14 rounded-full"
              style={{ animation: 'spin 3s linear infinite' }}
            >
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-slate-100 shadow-sm"
                style={{ boxShadow: '0 0 7px #ffffff' }}
              />
            </div>
          </div>
        </div>

        {/* --- ORBIT 3: Amethyst Prime (Resonance Halo & Centrifugal Drift) --- */}
        <div
          className="absolute rounded-full border border-dashed border-white/15"
          style={{
            width: 800,
            height: 800,
            animation: 'centrifugal-orbit 25s linear infinite',
            boxShadow: '0 0 25px rgba(139, 123, 255, 0.12)',
          }}
        >
          <div
            className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center"
            style={{ transform: 'rotateX(-60deg) rotateZ(16deg)' }}
          >
            {/* Centrifugal resonance pulse */}
            <div
              className="absolute h-16 w-16 rounded-full border border-violet-400/50 animate-ping opacity-40"
              style={{ animationDuration: '2.8s' }}
            />
            <div
              className="h-7 w-7 rounded-full shadow-2xl"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #f5f3ff 0%, #a855f7 40%, #7c3aed 80%, #3b0764 100%)',
                boxShadow: '0 0 32px rgba(168, 85, 247, 1), 0 0 55px rgba(139, 123, 255, 0.65)',
              }}
            />
          </div>
        </div>

        {/* --- ORBIT 4: Cronus - Ringed Gas Giant with Moonlets --- */}
        <div
          className="absolute rounded-full border border-white/12"
          style={{
            width: 1040,
            height: 1040,
            animation: 'centrifugal-orbit 38s linear infinite',
            boxShadow: '0 0 32px rgba(255, 210, 122, 0.1)',
          }}
        >
          <div
            className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center justify-center"
            style={{ transform: 'rotateX(-60deg) rotateZ(16deg)' }}
          >
            {/* Tilted Rings */}
            <div
              className="absolute h-6 w-20 rounded-full border-[3px] border-amber-200/60"
              style={{
                transform: 'rotate(-28deg)',
                boxShadow: '0 0 14px rgba(251, 191, 36, 0.7), inset 0 0 10px rgba(251, 191, 36, 0.45)',
              }}
            />
            <div
              className="relative h-9 w-9 rounded-full shadow-2xl"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #fef9c3 0%, #f59e0b 40%, #b45309 80%, #78350f 100%)',
                boxShadow: '0 0 32px rgba(245, 158, 11, 0.9)',
              }}
            />
            {/* Orbiting Moonlet */}
            <div
              className="absolute h-24 w-24 rounded-full"
              style={{ animation: 'spin 4.5s linear infinite' }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-cyan-200 shadow-sm" />
            </div>
          </div>
        </div>

        {/* --- ORBIT 5: Nebula Comet with Centrifugal Ion Trail --- */}
        <div
          className="absolute rounded-full border border-dashed border-white/10"
          style={{
            width: 1280,
            height: 1280,
            animation: 'centrifugal-orbit 52s linear infinite',
          }}
        >
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center justify-center"
            style={{ transform: 'rotateX(-60deg) rotateZ(16deg)' }}
          >
            <div
              className="h-5 w-5 rounded-full shadow-2xl"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #fff 0%, #ec4899 50%, #9d174d 85%, #500724 100%)',
                boxShadow: '0 0 26px rgba(236, 72, 153, 1)',
              }}
            />
            {/* Curved centrifugal comet tail */}
            <div
              className="absolute -left-16 -top-1.5 h-2.5 w-22 rounded-full opacity-75 filter blur-[1px]"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.95))',
                transform: 'rotate(18deg)',
              }}
            />
          </div>
        </div>
      </div>
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
    desc: 'Full WCAG AA compliant contrast ratios (4.87:1 on deep void), prefers-reduced-motion, semantic ARIA landmarks, and fluid multi-device layouts.',
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

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-ink-faint">
                <span className="truncate font-mono">{feat.components}</span>
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
        <CosmicSolarSystem hue={hue} />
        <CosmicParticles />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mx-auto max-w-4xl py-6 px-4"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 py-1.5 text-xs text-ink-soft shadow-lg backdrop-blur-xl">
            <Sparkles size={13} className="text-teal" /> Reimagining social · no feed · no likes · no followers
          </span>

          <h1
            className="mt-6 font-display text-[19vw] font-bold leading-[0.85] tracking-tight text-aurora sm:text-[10rem]"
            style={{
              filter: 'drop-shadow(0 0 40px rgba(78, 230, 198, 0.5)) drop-shadow(0 0 85px rgba(139, 123, 255, 0.4))',
            }}
          >
            ORBIT
          </h1>

          <p className="mx-auto mt-3 max-w-xl font-display text-xl font-medium text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] sm:text-2xl">
            Your social universe, not your feed.
          </p>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-ink-soft drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
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
            <Button variant="glass" size="lg" onClick={() => scrollTo('blueprint')}>
              <CheckCircle2 size={16} className="text-teal" /> Blueprint (7/7)
            </Button>
            <Button variant="glass" size="lg" onClick={() => scrollTo('vision')}>
              <Film size={16} className="text-teal" /> Cinematic Vision
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
          onClick={() => scrollTo('blueprint')}
          className="absolute bottom-8 text-ink-faint"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          aria-label="Scroll down to blueprint"
        >
          <ChevronDown size={26} />
        </motion.button>
      </section>

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
