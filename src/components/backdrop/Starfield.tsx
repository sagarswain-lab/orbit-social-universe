import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { seededRandom } from '@/lib/math'

interface Star {
  x: number
  y: number
  r: number
  base: number
  tw: number
  phase: number
  depth: number
}

/**
 * Canvas starfield with gentle twinkle + pointer parallax. DPR-aware and
 * paused under reduced-motion (renders a single static frame).
 */
export function Starfield({ density = 0.00016 }: { density?: number }) {
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
      const count = Math.min(420, Math.floor(w * h * density))
      const rnd = seededRandom('orbit-stars')
      stars = Array.from({ length: count }, () => {
        const depth = rnd()
        return {
          x: rnd() * w,
          y: rnd() * h,
          r: 0.4 + depth * 1.7,
          base: 0.25 + rnd() * 0.6,
          tw: 0.4 + rnd() * 1.6,
          phase: rnd() * Math.PI * 2,
          depth,
        }
      })
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      parallax.x += (parallax.tx - parallax.x) * 0.05
      parallax.y += (parallax.ty - parallax.y) * 0.05
      for (const s of stars) {
        const tw = reduced ? s.base : s.base * (0.6 + 0.4 * Math.sin(t * 0.001 * s.tw + s.phase))
        const px = s.x + parallax.x * (s.depth * 22)
        const py = s.y + parallax.y * (s.depth * 22)
        ctx.beginPath()
        ctx.arc(px, py, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${210 + s.depth * 40}, ${220}, 255, ${tw})`
        ctx.fill()
        if (s.r > 1.4) {
          ctx.beginPath()
          ctx.arc(px, py, s.r * 2.6, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(160, 180, 255, ${tw * 0.08})`
          ctx.fill()
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
