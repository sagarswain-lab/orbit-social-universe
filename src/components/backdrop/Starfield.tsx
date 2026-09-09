import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { seededRandom } from '@/lib/math'

interface Star {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  base: number
  tw: number
  phase: number
  depth: number
  color: string
  spike?: boolean
}

const STAR_COLORS = [
  'rgba(255, 255, 255,',
  'rgba(255, 235, 175,',
  'rgba(180, 230, 255,',
  'rgba(255, 180, 220,',
  'rgba(200, 185, 255,',
  'rgba(160, 255, 225,',
]

/**
 * Cinematic canvas starfield with hundreds of tiny moving stars, multi-color
 * stardust, gentle twinkle, cross-diffraction spikes, and interactive depth parallax.
 */
export function Starfield({ density = 0.00018 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let stars: Star[] = []
    let raf = 0
    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const parallax = { x: 0, y: 0, tx: 0, ty: 0 }

    const build = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(380, Math.max(160, Math.floor(w * h * density)))
      const rnd = seededRandom('orbit-deep-stars')
      stars = Array.from({ length: count }, (_, i) => {
        const depth = rnd()
        // Slow natural cosmic drift
        const angle = rnd() * Math.PI * 2
        const speed = (0.03 + depth * 0.09) * (reduced ? 0 : 1)
        const isBright = rnd() > 0.95
        return {
          x: rnd() * w,
          y: rnd() * h,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: isBright ? 1.2 + rnd() * 0.8 : 0.25 + depth * 0.8,
          base: 0.35 + rnd() * 0.55,
          tw: 0.4 + rnd() * 1.8,
          phase: rnd() * Math.PI * 2,
          depth,
          color: STAR_COLORS[Math.floor(rnd() * STAR_COLORS.length)],
          spike: isBright && i < 8,
        }
      })
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      parallax.x += (parallax.tx - parallax.x) * 0.04
      parallax.y += (parallax.ty - parallax.y) * 0.04

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]
        // Move stars continuously
        if (!reduced) {
          s.x += s.vx
          s.y += s.vy
          if (s.x < -10) s.x = w + 10
          else if (s.x > w + 10) s.x = -10
          if (s.y < -10) s.y = h + 10
          else if (s.y > h + 10) s.y = -10
        }

        const tw = reduced ? s.base : s.base * (0.55 + 0.45 * Math.sin(t * 0.0015 * s.tw + s.phase))
        const px = s.x + parallax.x * (s.depth * 28)
        const py = s.y + parallax.y * (s.depth * 28)

        // Draw star body
        ctx.beginPath()
        ctx.arc(px, py, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `${s.color} ${tw})`
        ctx.fill()

        // Glow halo for brighter stars
        if (s.r > 1.0) {
          ctx.beginPath()
          ctx.arc(px, py, s.r * 2.8, 0, Math.PI * 2)
          ctx.fillStyle = `${s.color} ${tw * 0.2})`
          ctx.fill()
        }

        // 4-point diffraction spike (cinematic Hubble telescope look)
        if (s.spike && tw > 0.6) {
          const spikeLen = s.r * 12 * tw
          ctx.strokeStyle = `${s.color} ${tw * 0.75})`
          ctx.lineWidth = 0.8
          ctx.beginPath()
          ctx.moveTo(px - spikeLen, py)
          ctx.lineTo(px + spikeLen, py)
          ctx.moveTo(px, py - spikeLen)
          ctx.lineTo(px, py + spikeLen)
          ctx.stroke()
        }
      }

      if (!reduced) raf = requestAnimationFrame(draw)
    }

    build()
    draw(0)

    const onResize = () => build()
    const onPointer = (e: PointerEvent) => {
      parallax.tx = (e.clientX / window.innerWidth - 0.5) * -1
      parallax.ty = (e.clientY / window.innerHeight - 0.5) * -1
    }
    window.addEventListener('resize', onResize)
    if (!reduced) window.addEventListener('pointermove', onPointer)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [density, reduced])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 h-full w-full"
      style={{ zIndex: 0 }}
    />
  )
}
