import { useEffect, useMemo, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { Radio, Users } from 'lucide-react'
import { auraGradient, glowShadow, hsl, identityGradient } from '@/lib/color'
import { lerp, TAU } from '@/lib/math'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import {
  guideRings,
  nodeSize,
  orbitPeriod,
  radiusToResonance,
  resonanceToRadius,
} from '@/lib/orbitLayout'
import type { OrbitNode } from '@/data/types'
import { useOrbitStore } from '@/store/useOrbitStore'

interface RT {
  angle: number
  r: number
  scale: number
  opacity: number
  frozen: boolean
  init: boolean
}

const GOLDEN = 2.399963229728653
const EASE = 0.08

export interface OrbitFieldProps {
  onCenterClick?: () => void
}

/**
 * The living orbital map — ORBIT's anti-feed home. A single rAF loop drives
 * calm orbital motion, resonance→radius placement, lens emphasis, constellation
 * links (canvas), and drag-to-deepen. Node transforms are written straight to
 * the DOM so React never re-renders during animation.
 */
export function OrbitField({ onCenterClick }: OrbitFieldProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const elRefs = useRef(new Map<string, HTMLDivElement>())
  const runtime = useRef(new Map<string, RT>())
  const sizeRef = useRef({ w: 0, h: 0 })
  const pointer = useRef<{ id: string; sx: number; sy: number; moved: boolean } | null>(null)

  const nodes = useOrbitStore((s) => s.nodes)
  const you = useOrbitStore((s) => s.you)
  const lens = useOrbitStore((s) => s.lens)
  const selectedId = useOrbitStore((s) => s.selectedId)
  const building = useOrbitStore((s) => s.building)
  const builderIds = useOrbitStore((s) => s.builderIds)
  const activeConstellationId = useOrbitStore((s) => s.activeConstellationId)
  const constellations = useOrbitStore((s) => s.constellations)

  // ORBIT's home screen is defined by continuous ambient rotation — exactly
  // the kind of full-screen, unrequested motion that can trigger vestibular
  // discomfort. Reduced-motion users still get live resonance-driven
  // repositioning (drag, pull closer, resonate), just no perpetual idle spin.
  const reducedMotion = usePrefersReducedMotion()
  const reducedMotionRef = useRef(reducedMotion)
  reducedMotionRef.current = reducedMotion

  const selectNode = useOrbitStore((s) => s.selectNode)
  const setResonance = useOrbitStore((s) => s.setResonance)
  const setNodePosition = useOrbitStore((s) => s.setNodePosition)
  const toggleBuilderMember = useOrbitStore((s) => s.toggleBuilderMember)
  const pushToast = useOrbitStore((s) => s.pushToast)
  const openComposer = useOrbitStore((s) => s.openComposer)
  const signals = useOrbitStore((s) => s.signals)
  const lastResonanceEvent = useOrbitStore((s) => s.lastResonanceEvent)

  const activeRipples = useRef<
    Array<{
      nodeId: string
      startTime: number
      duration: number
      hue: number
      delta: number
    }>
  >([])

  const authorsWithSignals = useMemo(() => new Set(signals.map((s) => s.authorId)), [signals])

  useEffect(() => {
    if (!lastResonanceEvent) return
    const { nodeId, hue, delta } = lastResonanceEvent
    activeRipples.current.push({
      nodeId,
      startTime: performance.now(),
      duration: 2200,
      hue,
      delta,
    })
    const rt = runtime.current.get(nodeId)
    if (rt) {
      rt.scale = delta > 0 ? 1.85 : 0.82
    }
  }, [lastResonanceEvent])

  // latest values for the stable rAF loop to read without restarting
  const latest = useRef({
    nodes,
    lens,
    selectedId,
    building,
    builderIds,
    activeConstellationId,
    constellations,
  })
  latest.current = {
    nodes,
    lens,
    selectedId,
    building,
    builderIds,
    activeConstellationId,
    constellations,
  }

  const geom = () => {
    const { w, h } = sizeRef.current
    const pad = w < 520 ? 52 : 84
    // Below md (768px) the Hud + mobile lens toggle occupy the top ~118px and
    // BottomNav occupies the bottom ~96px. Keep the orbit centered in the
    // remaining safe area so outer-ring stars never render under that fixed
    // chrome — most visible on landscape/short mobile viewports.
    const hasMobileChrome = w < 768
    const topSafe = hasMobileChrome ? 118 : 0
    const bottomSafe = hasMobileChrome ? 96 : 0
    const availH = Math.max(h - topSafe - bottomSafe, 0)
    const cy = topSafe + availH / 2
    const maxR = Math.max(60, Math.min(w, availH) / 2 - pad)
    return { w, h, cx: w / 2, cy, maxR }
  }

  const posOf = (id: string, cx: number, cy: number) => {
    const rt = runtime.current.get(id)
    if (!rt) return null
    return { x: cx + Math.cos(rt.angle) * rt.r, y: cy + Math.sin(rt.angle) * rt.r }
  }

  // measure
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      sizeRef.current = { w: el.clientWidth, h: el.clientHeight }
    })
    ro.observe(el)
    sizeRef.current = { w: el.clientWidth, h: el.clientHeight }
    return () => ro.disconnect()
  }, [])

  // pointer drag (window-level so it survives leaving the node)
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const p = pointer.current
      if (!p) return
      const cont = containerRef.current
      if (!cont) return
      const rect = cont.getBoundingClientRect()
      const { maxR } = geom()
      const dx = e.clientX - rect.left - rect.width / 2
      const dy = e.clientY - rect.top - rect.height / 2
      const rt = runtime.current.get(p.id)
      if (!rt) return
      rt.r = Math.max(maxR * 0.16, Math.min(maxR, Math.hypot(dx, dy)))
      rt.angle = Math.atan2(dy, dx)
      if (Math.hypot(e.clientX - p.sx, e.clientY - p.sy) > 6) p.moved = true
    }
    const onUp = () => {
      const p = pointer.current
      if (!p) return
      const rt = runtime.current.get(p.id)
      const node = latest.current.nodes.find((n) => n.id === p.id)
      if (rt) rt.frozen = false
      if (p.moved && rt && node) {
        const { maxR } = geom()
        const next = radiusToResonance(rt.r, maxR)
        const before = node.resonance
        setNodePosition(p.id, next, rt.angle)
        if (next > before + 3) pushToast(`You pulled ${node.name} closer`, node.hue)
        else if (next < before - 3) pushToast(`You let ${node.name} drift out`, node.hue)
      } else if (!p.moved) {
        selectNode(p.id)
      }
      pointer.current = null
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [selectNode, setResonance, setNodePosition, pushToast])

  // the animation loop
  useEffect(() => {
    let raf = 0
    let prev = performance.now()

    const frame = (t: number) => {
      const dt = Math.min(0.05, (t - prev) / 1000)
      prev = t
      const { w, h, cx, cy, maxR } = geom()
      const L = latest.current

      if (w > 0 && h > 0) {
        L.nodes.forEach((node, i) => {
          let rt = runtime.current.get(node.id)
          if (!rt) {
            rt = {
              angle: node.angle ?? (i * GOLDEN),
              r: resonanceToRadius(node.resonance, maxR),
              scale: 0.4,
              opacity: 0,
              frozen: false,
              init: true,
            }
            runtime.current.set(node.id, rt)
          }
          const targetR = resonanceToRadius(node.resonance, maxR)
          if (!rt.frozen) {
            const period = orbitPeriod(targetR, maxR)
            if (!reducedMotionRef.current) rt.angle += (TAU / period) * dt
            rt.r = lerp(rt.r, targetR, EASE)
          }

          const isSel = L.selectedId === node.id
          const inBuilder = L.builderIds.includes(node.id)

          // opacity target by lens
          let op = 1
          if (L.lens === 'active') op = node.activeNow ? 1 : 0.26
          else if (L.lens === 'constellation') {
            op = L.activeConstellationId
              ? node.constellationIds.includes(L.activeConstellationId)
                ? 1
                : 0.2
              : 0.9
          } else op = 0.62 + (node.resonance / 100) * 0.38
          if (L.building) op = inBuilder ? 1 : 0.35
          if (isSel) op = 1

          const targetScale = isSel ? 1.22 : inBuilder ? 1.14 : 1
          rt.scale = lerp(rt.scale, targetScale, 0.12)
          rt.opacity = lerp(rt.opacity, op, 0.1)

          const el = elRefs.current.get(node.id)
          if (el) {
            const x = cx + Math.cos(rt.angle) * rt.r
            const y = cy + Math.sin(rt.angle) * rt.r
            el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${rt.scale})`
            el.style.opacity = String(rt.opacity)
            el.style.zIndex = isSel ? '2000' : String(1200 - Math.round(rt.r))
          }
        })
      }

      drawCanvas(cx, cy, maxR)
      raf = requestAnimationFrame(frame)
    }

    const drawCanvas = (cx: number, cy: number, maxR: number) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const { w, h } = sizeRef.current
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr)
        canvas.height = Math.floor(h * dpr)
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      if (w === 0) return
      const L = latest.current

      // guide rings
      ctx.lineWidth = 1
      for (const ring of guideRings(maxR)) {
        ctx.beginPath()
        ctx.arc(cx, cy, ring.r, 0, TAU)
        ctx.strokeStyle = 'rgba(160,170,220,0.08)'
        ctx.stroke()
        ctx.font = '10px "Space Grotesk Variable", sans-serif'
        ctx.fillStyle = 'rgba(150,160,210,0.32)'
        ctx.textAlign = 'center'
        ctx.fillText(ring.label, cx, cy - ring.r - 6)
      }

      // constellation links
      const drawConstellation = (memberIds: string[], hue: number, alpha: number) => {
        const pts = memberIds
          .map((id) => posOf(id, cx, cy))
          .filter((p): p is { x: number; y: number } => !!p)
        if (pts.length < 2) return
        const ordered = [...pts].sort(
          (a, b) => Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx),
        )
        ctx.beginPath()
        ordered.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)))
        ctx.closePath()
        ctx.strokeStyle = hsl(hue, 80, 68, alpha)
        ctx.lineWidth = 1.4
        ctx.shadowColor = hsl(hue, 85, 62, alpha)
        ctx.shadowBlur = 10
        ctx.stroke()
        ctx.shadowBlur = 0
        // faint spokes to center
        ctx.strokeStyle = hsl(hue, 80, 68, alpha * 0.4)
        ctx.lineWidth = 0.8
        for (const p of pts) {
          ctx.beginPath()
          ctx.moveTo(cx, cy)
          ctx.lineTo(p.x, p.y)
          ctx.stroke()
        }
      }

      if (L.building && L.builderIds.length >= 2) {
        drawConstellation(L.builderIds, 265, 0.85)
      } else if (L.lens === 'constellation') {
        if (L.activeConstellationId) {
          const c = L.constellations.find((x) => x.id === L.activeConstellationId)
          if (c) drawConstellation(c.memberIds, c.hue, 0.9)
        } else {
          for (const c of L.constellations) drawConstellation(c.memberIds, c.hue, 0.28)
        }
      }

      // link from center to selected
      if (L.selectedId) {
        const p = posOf(L.selectedId, cx, cy)
        const node = L.nodes.find((n) => n.id === L.selectedId)
        if (p && node) {
          ctx.beginPath()
          ctx.moveTo(cx, cy)
          ctx.lineTo(p.x, p.y)
          ctx.strokeStyle = hsl(node.hue, 85, 66, 0.5)
          ctx.lineWidth = 1.2
          ctx.setLineDash([2, 5])
          ctx.stroke()
          ctx.setLineDash([])
        }
      }

      // active resonance ripples & gravitational beams
      const now = performance.now()
      activeRipples.current = activeRipples.current.filter((r) => now - r.startTime < r.duration)

      for (const rip of activeRipples.current) {
        const progress = (now - rip.startTime) / rip.duration
        const p = posOf(rip.nodeId, cx, cy)
        const alpha = Math.sin(progress * Math.PI)

        // 1. Expanding gravitational shockwave ring centered on your sun
        const waveR = progress * maxR * 1.05
        ctx.beginPath()
        ctx.arc(cx, cy, waveR, 0, TAU)
        ctx.strokeStyle = hsl(rip.hue, 95, 75, alpha * 0.75)
        ctx.lineWidth = 3.5 * (1 - progress) + 0.6
        ctx.shadowColor = hsl(rip.hue, 95, 65, 0.9)
        ctx.shadowBlur = 18
        ctx.stroke()
        ctx.shadowBlur = 0

        // 2. Resonant energy tether beam from your sun to the star
        if (p) {
          ctx.beginPath()
          ctx.moveTo(cx, cy)
          ctx.lineTo(p.x, p.y)
          ctx.strokeStyle = hsl(rip.hue, 90, 75, alpha * 0.9)
          ctx.lineWidth = 2.5 * alpha + 0.8
          ctx.shadowColor = hsl(rip.hue, 95, 70, 0.9)
          ctx.shadowBlur = 14
          ctx.stroke()
          ctx.shadowBlur = 0

          // 3. Shockwave rings radiating at the resonated star
          const starWaveR = 14 + progress * 48
          ctx.beginPath()
          ctx.arc(p.x, p.y, starWaveR, 0, TAU)
          ctx.strokeStyle = hsl(rip.hue, 95, 80, (1 - progress) * 0.85)
          ctx.lineWidth = 2.5 * (1 - progress)
          ctx.stroke()

          // 4. Luminous floating particle along the beam
          const particleX = cx + (p.x - cx) * progress
          const particleY = cy + (p.y - cy) * progress
          ctx.beginPath()
          ctx.arc(particleX, particleY, 4.5, 0, TAU)
          ctx.fillStyle = hsl(rip.hue, 100, 85, alpha)
          ctx.shadowColor = '#ffffff'
          ctx.shadowBlur = 12
          ctx.fill()
          ctx.shadowBlur = 0

          // 5. Floating text tag: +Resonance
          if (rip.delta > 0) {
            ctx.font = 'bold 11px "Space Grotesk Variable", sans-serif'
            ctx.fillStyle = hsl(rip.hue, 95, 85, alpha * 0.95)
            ctx.textAlign = 'center'
            ctx.fillText('+Resonance', p.x, p.y - 28 - progress * 16)
          }
        }
      }
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [])

  const onNodeDown = (e: ReactPointerEvent, node: OrbitNode) => {
    if (latest.current.building) {
      toggleBuilderMember(node.id)
      return
    }
    const rt = runtime.current.get(node.id)
    if (rt) rt.frozen = true
    pointer.current = { id: node.id, sx: e.clientX, sy: e.clientY, moved: false }
  }

  return (
    <div ref={containerRef} className="relative h-full w-full touch-none select-none">
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" style={{ width: '100%', height: '100%' }} />

      {/* central sun — you */}
      <button
        type="button"
        onClick={onCenterClick ?? openComposer}
        className="group absolute left-1/2 top-1/2 z-[1500] grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
        aria-label={`You, ${you.name} — tap for profile or emit signal`}
      >
        <span
          aria-hidden
          className="absolute rounded-full"
          style={{ width: 150, height: 150, background: auraGradient(you.hue, 0.9), filter: 'blur(8px)' }}
        />
        {[0, 1].map((i) => (
          <span
            key={i}
            aria-hidden
            className="absolute rounded-full border"
            style={{
              width: 84,
              height: 84,
              borderColor: hsl(you.hue, 85, 70, 0.5),
              animation: `ring-pulse ${4 + i * 1.4}s ease-out ${i * 1.2}s infinite`,
            }}
          />
        ))}
        <span
          className="relative grid place-items-center rounded-full font-display text-lg font-bold text-white transition-transform duration-300 group-hover:scale-105"
          style={{
            width: 72,
            height: 72,
            background: identityGradient(you.hue),
            boxShadow: glowShadow(you.hue, 46, 0.8),
            border: '1px solid rgba(255,255,255,0.4)',
          }}
        >
          {you.name.charAt(0).toUpperCase()}
        </span>
        <span className="absolute top-[calc(50%+52px)] whitespace-nowrap text-center text-xs font-medium text-ink-soft opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          tap for profile · emit signal
        </span>
      </button>

      {/* orbiting nodes */}
      {nodes.map((node) => {
        const size = nodeSize(node.resonance)
        const inBuilder = builderIds.includes(node.id)
        const selected = selectedId === node.id
        return (
          <div
            key={node.id}
            ref={(el) => {
              if (el) {
                elRefs.current.set(node.id, el)
                if (!runtime.current.get(node.id)?.init) el.style.opacity = '0'
              } else elRefs.current.delete(node.id)
            }}
            role="button"
            tabIndex={0}
            aria-label={`${node.name}${node.kind === 'community' ? ', community' : ''} — ${node.aura.mood}`}
            onPointerDown={(e) => onNodeDown(e, node)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                building ? toggleBuilderMember(node.id) : selectNode(node.id)
              }
            }}
            className="group absolute left-0 top-0 cursor-pointer will-change-transform"
            style={{ zIndex: 100 }}
          >
            <div className="relative grid place-items-center" style={{ width: size, height: size }}>
              {/* aura glow */}
              <span
                aria-hidden
                className="absolute rounded-full transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  inset: -size * 0.28,
                  background: auraGradient(node.hue, node.activeNow ? 0.85 : 0.55),
                  filter: 'blur(5px)',
                  opacity: node.activeNow ? 0.62 : 0.34,
                }}
              />
              {/* resonance surge ping */}
              {lastResonanceEvent?.nodeId === node.id && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-4 rounded-full border-2 animate-ping"
                  style={{
                    borderColor: hsl(node.hue, 95, 75, 0.85),
                    boxShadow: `0 0 20px ${hsl(node.hue, 95, 65, 0.9)}`,
                  }}
                />
              )}
              {node.kind === 'person' ? (
                <span
                  className="relative grid h-full w-full place-items-center rounded-full font-display font-semibold text-white/95"
                  style={{
                    background: identityGradient(node.hue),
                    fontSize: size * 0.4,
                    border: selected
                      ? '2px solid rgba(255,255,255,0.9)'
                      : inBuilder
                        ? `2px solid ${hsl(265, 85, 75)}`
                        : '1px solid rgba(255,255,255,0.28)',
                    boxShadow: glowShadow(node.hue, size * 0.5, node.activeNow ? 0.6 : 0.35),
                  }}
                >
                  {node.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <span
                  className="relative grid h-full w-full place-items-center rounded-[30%] text-white/95"
                  style={{
                    background: `linear-gradient(135deg, ${hsl(node.hue, 45, 22)}, ${hsl(node.hue, 50, 12)})`,
                    border: selected
                      ? '2px solid rgba(255,255,255,0.9)'
                      : inBuilder
                        ? `2px solid ${hsl(265, 85, 75)}`
                        : `1px solid ${hsl(node.hue, 70, 60, 0.6)}`,
                    boxShadow: glowShadow(node.hue, size * 0.45, node.activeNow ? 0.5 : 0.28),
                  }}
                >
                  <Users size={size * 0.36} style={{ color: hsl(node.hue, 85, 78) }} />
                </span>
              )}
              {node.activeNow && (
                <span
                  className="absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-[#05060b]"
                  style={{ background: 'linear-gradient(135deg,#4ee6c6,#5aa2ff)', boxShadow: '0 0 8px rgba(78,230,198,0.9)' }}
                />
              )}
              {authorsWithSignals.has(node.id) && (
                <span
                  title="Has active signals in orbit"
                  className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#05060b]"
                  style={{
                    background: `linear-gradient(135deg, ${hsl(node.hue, 90, 65)}, ${hsl(node.hue + 40, 95, 60)})`,
                    boxShadow: `0 0 10px ${hsl(node.hue, 90, 60, 0.8)}`,
                  }}
                >
                  <Radio size={8} className="text-white animate-pulse" />
                </span>
              )}
            </div>
            {/* label */}
            <span
              className="pointer-events-none absolute left-1/2 top-[calc(100%+6px)] -translate-x-1/2 whitespace-nowrap text-center text-[12px] font-medium leading-tight text-ink-soft opacity-70 transition-all duration-200 group-hover:opacity-100"
            >
              {node.name}
              <span className="block text-[10px] text-ink-faint opacity-0 transition-opacity group-hover:opacity-100">
                {node.kind === 'community' ? 'community' : `@${(node as { handle?: string }).handle ?? ''}`}
              </span>
            </span>
          </div>
        )
      })}
    </div>
  )
}
