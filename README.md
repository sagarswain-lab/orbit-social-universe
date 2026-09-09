# Orbit — Your Social Universe, Not Your Feed

**Submission for The Frontend Odyssey 2026 — Main Challenge: Reimagine Social**

🔗 **Live demo:** [\[orbit-social-universe\]](https://orbit-social-universe.vercel.app/)

---

## The idea, in one line

Instead of scrolling through a feed to find people, you look up at a living sky where the people you're closest to orbit nearest to you — in real time, driven by mutual closeness instead of algorithms, likes, or follower counts.

## The problem we're rejecting

Most social apps run on the same four mechanics no matter what they're called: an infinite scroll, a like count to chase, a follow/follower ledger, and an algorithm deciding what you see next. The brief asked for something that isn't a reskinned version of that. Orbit removes all four:

| Instead of... | Orbit has... |
|---|---|
| An infinite feed | A spatial universe — no bottom to scroll to |
| Likes & public counters | Private **resonance** — a felt closeness only you can see, never a public scoreboard |
| Followers / following | **Orbit distance** — closeness is mutual and earned through interaction, not a one-way subscribe |
| Algorithmic recommendations | **Drift** — discovery only through real paths (friends-of-friends), never a black-box "For You" |

## Core mechanics

- **Universe (home screen):** People you know render as glowing nodes orbiting you. The stronger your mutual resonance, the closer their orbit. Pull someone closer, tune in to a signal, or start a thread — every action visibly reshapes your sky instead of just incrementing a counter.
- **Signals:** Ephemeral posts that decay and dissolve after their lifespan — nothing accumulates into a permanent broadcast archive.
- **Pulse:** A secondary view into signals, deliberately grouped by orbit distance (Inner → Near → Constellations → Passing through) rather than sorted by recency, so it stays an extension of the orbit metaphor instead of becoming a disguised chronological feed.
- **Constellations:** User-drawn groupings across your orbit — a spatial alternative to "create a group chat."
- **Drift:** Discovery through real connection paths only. No algorithmic "suggested for you."
- **Threads:** Direct messages — the one intentionally conventional surface, since chat isn't the pattern being reimagined here.

## Design principles we held ourselves to

- **No number is a scoreboard.** Engagement is shown as glow/warmth, never a raw count you'd chase.
- **Motion means something.** Nodes don't drift randomly — every position is derived from real resonance state.
- **Accessible by default.** Orbital motion freezes under `prefers-reduced-motion` (interactions still animate), toasts are announced via `aria-live`, and text meets WCAG AA contrast.
- **Frontend-only, honestly.** All data is local mock/in-memory state (Zustand + `localStorage` persistence) — no backend, per the challenge rules — but interactions are fully live, not static mockups.

## Tech stack

- React + TypeScript + Vite
- Zustand (state, with local persistence)
- Tailwind CSS v4 (custom "cosmic-aurora" design tokens — no default UI kit)
- Framer Motion (interaction motion)
- Canvas + `requestAnimationFrame` for the orbit field itself

## Running locally

```
npm install
npm run dev
```

Build for production:

```
npm run build
```

## Project structure

```
src/
  components/ui/      Bespoke design-system primitives (SignalCard, AuraBadge, ResonanceMeter, Sheet, Modal...)
  features/
    universe/          The orbit home screen (OrbitField, Hud, BottomNav, PresencePanel, ConstellationBar)
    pulse/             Grouped signal view
    drift/             Path-based discovery
    threads/           Direct messages
    you/               Your own orbit composition
    signals/           Composer for posting a signal
  store/               Zustand store — all app state and simulated "ambient pulse" ticking
  data/                Mock data + shared types
  lib/                 Orbit layout math, color system, time helpers
```

## Judging-criteria checklist

- ✅ **Originality:** Spatial orbit model, not a feed in different clothes
- ✅ **Meaningful Interaction:** Every action (pull closer, resonate, drift) visibly changes your universe
- ✅ **Visual Design:** Custom cosmic-aurora system, no generic component-kit look
- ✅ **Functionality:** Fully interactive mock-data app — live simulation, not static screens
- ✅ **Responsiveness:** Tested down to mobile/landscape viewports
- ✅ **Accessibility:** Reduced-motion support, `aria-live` feedback, AA-contrast text
- ✅ **Code Quality:** Typed end-to-end, zero `tsc` errors, feature-folder structure

---

Built for The Frontend Odyssey 2026 Hackathon.
