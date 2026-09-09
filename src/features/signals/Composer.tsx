import { Aperture, Feather, HelpCircle, Radio } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { Modal } from '@/components/ui/Modal'
import { SignalCard } from '@/components/ui/SignalCard'
import { cn } from '@/lib/cn'
import { hsl } from '@/lib/color'
import { LIFESPANS, type LifespanKey } from '@/lib/time'
import type { Signal, SignalScope, SignalType } from '@/data/types'
import { useOrbitStore } from '@/store/useOrbitStore'

const TYPES: { key: SignalType; label: string; icon: typeof Feather; hint: string }[] = [
  { key: 'thought', label: 'Thought', icon: Feather, hint: 'a fragment, a feeling, unfinished' },
  { key: 'moment', label: 'Moment', icon: Aperture, hint: 'something you noticed just now' },
  { key: 'question', label: 'Question', icon: HelpCircle, hint: 'open a door, invite an answer' },
  { key: 'ping', label: 'Ping', icon: Radio, hint: 'a light signal — “I’m here”' },
]

const SCOPES: { key: SignalScope; label: string; desc: string }[] = [
  { key: 'inner', label: 'Inner orbit', desc: 'your closest few' },
  { key: 'near', label: 'Near orbit', desc: 'people you resonate with' },
  { key: 'outer', label: 'Whole orbit', desc: 'everyone around you' },
  { key: 'constellation', label: 'A constellation', desc: 'one group only' },
]

const LIFES: LifespanKey[] = ['6h', '24h', '3d', '7d']

export function Composer() {
  const open = useOrbitStore((s) => s.composerOpen)
  const close = useOrbitStore((s) => s.closeComposer)
  const send = useOrbitStore((s) => s.sendSignal)
  const you = useOrbitStore((s) => s.you)
  const constellations = useOrbitStore((s) => s.constellations)

  const [type, setType] = useState<SignalType>('thought')
  const [text, setText] = useState('')
  const [scope, setScope] = useState<SignalScope>('near')
  const [lifespan, setLifespan] = useState<LifespanKey>('24h')
  const [constellationId, setConstellationId] = useState<string | undefined>(constellations[0]?.id)

  const preview = useMemo<Signal>(
    () => ({
      id: 'preview',
      authorId: 'you',
      type,
      text: text.trim() || 'your signal will glow here…',
      createdAt: Date.now(),
      lifespanMs: LIFESPANS[lifespan],
      scope,
      constellationId: scope === 'constellation' ? constellationId : undefined,
      hue: you.hue,
      resonated: false,
      resonanceCount: 0,
    }),
    [type, text, lifespan, scope, constellationId, you.hue],
  )

  const submit = () => {
    if (!text.trim()) return
    send({ type, text, scope, lifespan, constellationId: scope === 'constellation' ? constellationId : undefined })
    setText('')
  }

  const activeType = TYPES.find((t) => t.key === type)!

  return (
    <Modal open={open} onClose={close} hue={you.hue} title="Emit a signal" maxWidth={560}>
      <form
        role="form"
        aria-label="Content Creation — Emit Signal"
        data-feature="content-creation"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
        className="max-h-[86svh] overflow-y-auto px-6 pb-6 pt-8"
      >
        <h2 className="font-display text-xl font-bold text-ink">Emit a signal</h2>
        <p className="mt-1 text-sm text-ink-mute">
          It glows for a while, then fades. Nothing here is permanent — no backlog, no archive.
        </p>

        {/* type selector */}
        <div className="mt-5 grid grid-cols-4 gap-2">
          {TYPES.map((t) => {
            const Icon = t.icon
            const on = t.key === type
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setType(t.key)}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-xs font-medium transition-all',
                  on ? 'border-white/25 text-ink' : 'border-white/10 text-ink-mute hover:border-white/20',
                )}
                style={on ? { background: hsl(you.hue, 80, 60, 0.14), boxShadow: `0 0 20px ${hsl(you.hue, 85, 60, 0.35)}` } : undefined}
              >
                <Icon size={18} style={on ? { color: hsl(you.hue, 90, 78) } : undefined} />
                {t.label}
              </button>
            )
          })}
        </div>
        <p className="mt-2 text-center text-xs text-ink-faint">{activeType.hint}</p>

        {/* text */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 240))}
          rows={3}
          placeholder="say the unfinished thing…"
          className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-[15px] leading-relaxed text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-white/25"
        />
        <div className="mt-1 text-right text-xs text-ink-faint">{text.length}/240</div>

        {/* scope */}
        <p className="mt-3 mb-2 text-xs uppercase tracking-wide text-ink-faint">who feels it</p>
        <div className="flex flex-wrap gap-2">
          {SCOPES.map((s) => (
            <Chip key={s.key} active={scope === s.key} hue={scope === s.key ? you.hue : undefined} onClick={() => setScope(s.key)} title={s.desc}>
              {s.label}
            </Chip>
          ))}
        </div>
        {scope === 'constellation' && (
          <div className="mt-2 flex flex-wrap gap-2">
            {constellations.map((c) => (
              <Chip key={c.id} active={constellationId === c.id} hue={c.hue} onClick={() => setConstellationId(c.id)}>
                {c.name}
              </Chip>
            ))}
          </div>
        )}

        {/* lifespan */}
        <p className="mt-4 mb-2 text-xs uppercase tracking-wide text-ink-faint">how long it lives</p>
        <div className="flex flex-wrap gap-2">
          {LIFES.map((l) => (
            <Chip key={l} active={lifespan === l} hue={lifespan === l ? you.hue : undefined} onClick={() => setLifespan(l)}>
              {l}
            </Chip>
          ))}
        </div>

        {/* preview */}
        <p className="mt-5 mb-2 text-xs uppercase tracking-wide text-ink-faint">preview</p>
        <SignalCard signal={preview} showAuthor />

        <div className="mt-5 flex items-center justify-end gap-2.5">
          <Button variant="ghost" onClick={close}>Cancel</Button>
          <Button variant="primary" glowHue={you.hue} onClick={submit} disabled={!text.trim()}>
            Emit signal
          </Button>
        </div>
      </form>
    </Modal>
  )
}
