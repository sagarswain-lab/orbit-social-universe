import { Send } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { IconButton } from '@/components/ui/IconButton'
import { cn } from '@/lib/cn'
import { hsl } from '@/lib/color'
import { relativeTime } from '@/lib/time'
import type { Person } from '@/data/types'
import { useOrbitStore } from '@/store/useOrbitStore'

export function ThreadPanel({ personId }: { personId: string }) {
  const nodes = useOrbitStore((s) => s.nodes)
  const drift = useOrbitStore((s) => s.drift)
  const node = useMemo(
    () => nodes.find((n) => n.id === personId) ?? drift.find((d) => d.node.id === personId)?.node,
    [nodes, drift, personId],
  )
  const threads = useOrbitStore((s) => s.threads)
  const thread = useMemo(() => threads.find((t) => t.personId === personId), [threads, personId])
  const send = useOrbitStore((s) => s.sendThreadMessage)
  const clock = useOrbitStore((s) => s.clock)
  const [text, setText] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread?.messages.length])

  if (!node || node.kind !== 'person') return null
  const person = node as Person

  const submit = () => {
    if (!text.trim()) return
    send(personId, text)
    setText('')
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-6 pb-4 pt-9">
        <Avatar name={person.name} hue={person.hue} size={44} active={person.activeNow} glow />
        <div>
          <h2 className="font-display text-lg font-bold text-ink">{person.name}</h2>
          <p className="text-xs text-ink-mute">a thread of shared light · fades only if you both go quiet</p>
        </div>
      </div>
      <div className="px-6"><div className="hair-divider" /></div>

      <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
        {thread?.messages.map((m) => {
          const mine = m.from === 'you'
          return (
            <div key={m.id} className={cn('flex flex-col', mine ? 'items-end' : 'items-start')}>
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[15px] leading-snug',
                  mine ? 'text-white' : 'border border-white/10 bg-white/[0.04] text-ink',
                )}
                style={
                  mine
                    ? { background: `linear-gradient(135deg, ${hsl(person.hue, 70, 52)}, ${hsl(person.hue + 30, 65, 46)})` }
                    : undefined
                }
              >
                {m.text}
              </div>
              <span className="mt-1 text-[10px] text-ink-faint">{relativeTime(m.at, clock)}</span>
            </div>
          )
        })}
        {!thread?.messages.length && (
          <p className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-ink-faint">
            Nothing shared yet. Send the first light.
          </p>
        )}
        <div ref={endRef} />
      </div>

      <div className="flex items-center gap-2 border-t border-white/10 bg-white/[0.02] px-4 py-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder={`send ${person.name} a little light…`}
          className="h-11 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 text-[15px] text-ink outline-none placeholder:text-ink-faint focus:border-white/25"
        />
        <IconButton label="Send" size={44} onClick={submit} active={!!text.trim()}>
          <Send size={17} />
        </IconButton>
      </div>
    </div>
  )
}
