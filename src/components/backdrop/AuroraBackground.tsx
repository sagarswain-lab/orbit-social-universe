import { hsl } from '@/lib/color'

/**
 * Layered aurora: several oversized, blurred radial blobs that drift slowly.
 * Purely decorative (aria-hidden, no pointer events). `hue` tints the field
 * toward the viewer's signature color.
 */
export function AuroraBackground({ hue = 265 }: { hue?: number }) {
  const blobs = [
    { c: hsl(hue, 85, 55, 0.5), top: '-14%', left: '-6%', size: '52vw', dur: '22s', delay: '0s' },
    { c: hsl(hue + 70, 80, 55, 0.42), top: '30%', left: '58%', size: '46vw', dur: '27s', delay: '-6s' },
    { c: hsl(hue - 60, 82, 55, 0.4), top: '52%', left: '4%', size: '44vw', dur: '31s', delay: '-12s' },
    { c: hsl(hue + 140, 78, 58, 0.3), top: '-8%', left: '62%', size: '38vw', dur: '25s', delay: '-3s' },
  ]

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      {blobs.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle at 50% 50%, ${b.c}, transparent 62%)`,
            filter: 'blur(60px)',
            animation: `aurora-drift ${b.dur} ease-in-out ${b.delay} infinite`,
            willChange: 'transform',
          }}
        />
      ))}
      {/* deep vignette + base wash to keep contrast high for glass UI */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 0%, rgba(5,6,11,0) 40%, rgba(5,6,11,0.7) 100%), radial-gradient(80% 80% at 50% 120%, rgba(5,6,11,0) 30%, rgba(3,4,10,0.9) 100%)',
        }}
      />
      {/* faint film grain via SVG noise */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  )
}
