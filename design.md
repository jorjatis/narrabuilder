# Design — Narrabuilder

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

## Genre
modern-minimal

## Macrostructure family
- Marketing pages: Workbench entry (single clear create path + one template door)
- App pages: Workbench (canvas-first studio · left inspector · chrome bar)
- Content pages: n/a

## Theme
Custom tuned — **light by default**, dark optional · indigo accent (not purple-slop)

Default (`data-theme="light"`): warm paper · cool ink · indigo accent.

Dark (`data-theme="dark"`):
- `--color-paper`   oklch(15% 0.012 265)
- `--color-paper-2` oklch(18% 0.012 265)
- `--color-paper-3` oklch(22% 0.014 265)
- `--color-ink`     oklch(96% 0.006 95)
- `--color-accent`  oklch(72% 0.14 265)

Light (`data-theme="light"`):
- `--color-paper`   oklch(98.5% 0.004 95)
- `--color-ink`     oklch(22% 0.012 265)
- `--color-accent`  oklch(55% 0.17 265)

Toggle: chrome theme button · persists in `localStorage.nb-theme`.
Axes: light paper (default) · geometric-sans · cool accent

**Artboard rule:** theme applies only to product chrome (top bar, rail, home).
The scrolly preview canvas is always white (`#fff`) and never inherits `data-theme`.

## Typography
- Display: Geist Sans, weight 560–600, style normal, tracking −0.022em
- Body: Geist Sans, weight 400
- Mono: Geist Mono, weight 400 (numeric params only)
- Type scale anchor: `--text-display` = clamp(2.5rem, 4vw + 1rem, 3.75rem)

## Spacing
4-point named scale. Values live in `tokens.css`. Pages must use named
tokens (`var(--space-md)`), never raw values.

## Motion
- Easings: `--ease-out` cubic-bezier(0.16, 1, 0.3, 1); `--ease-in-out` cubic-bezier(0.45, 0, 0.55, 1)
- Reveal pattern: none on app chrome; opacity + subtle Y on step expand only
- Reduced-motion fallback: opacity-only, ≤ 150 ms
- Durations: micro 120ms · short 200ms · medium 280ms

## Microinteractions stance
- Silent success (export label flip, no toast)
- Hover delay on tooltips 800 ms · focus delay 0 ms
- Animate transform + opacity only
- Focus ring never animated

## CTA voice
- Primary CTA: solid ink fill, 8px radius, 13px / 550 weight — “Exportar”
- Secondary CTA: ghost / hairline — “Añadir step”, “Plegar”
- Danger: icon ghost → soft red tint on hover only

## Per-page allowances
- Marketing pages MAY use Tier-A CSS art (abstract template thumb).
- App pages MUST NOT use enrichment — function carries the page.
- Content pages: typography only.

## What pages MUST share
- The wordmark “Narrabuilder”
- Accent colour placement ≤ 5% per viewport
- Geist display + body
- CTA voice (radius, padding, weight)
- Hairline rules instead of nested card borders where possible

## What pages MAY differ on
- Macrostructure within family (home entry vs builder workbench)
- Whether chrome shows document meta + export actions

## Builder IA (locked)
1. Top chrome: logo · document label · primary Export
2. Left rail 288px: Steps (primary) · Ajustes (collapsed by default)
3. Canvas: full remaining viewport, no floating overlays
4. No “Config” vertical tab · no Export accordion in panel

## Exports

### tokens.css
See `/tokens.css` at project root (source of truth).

### Tailwind v4 `@theme`
```css
@theme {
  --color-paper: oklch(98.5% 0.004 95);
  --color-paper-2: oklch(97% 0.005 95);
  --color-paper-3: oklch(94.5% 0.006 95);
  --color-ink: oklch(22% 0.012 265);
  --color-ink-2: oklch(38% 0.01 265);
  --color-muted: oklch(55% 0.01 265);
  --color-rule: oklch(90% 0.006 95);
  --color-accent: oklch(55% 0.17 265);
  --color-accent-ink: oklch(99% 0.01 265);
  --color-focus: oklch(55% 0.19 265);
  --color-danger: oklch(55% 0.18 25);
  --font-display: "Geist Sans", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Geist Sans", ui-sans-serif, system-ui, sans-serif;
  --font-outlier: "Geist Mono", ui-monospace, monospace;
  --spacing-md: 1.5rem;
  --text-md: 1.125rem;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --radius-card: 10px;
}
```

### DTCG `tokens.json`
```json
{
  "color": {
    "paper": { "$value": "oklch(98.5% 0.004 95)", "$type": "color" },
    "ink": { "$value": "oklch(22% 0.012 265)", "$type": "color" },
    "accent": { "$value": "oklch(55% 0.17 265)", "$type": "color" }
  },
  "font": {
    "display": { "$value": "Geist Sans", "$type": "fontFamily" },
    "body": { "$value": "Geist Sans", "$type": "fontFamily" }
  },
  "space": {
    "md": { "$value": "1.5rem", "$type": "dimension" }
  }
}
```

### shadcn/ui CSS variables
```css
:root {
  --background: 98.5% 0.004 95;
  --foreground: 22% 0.012 265;
  --primary: 55% 0.17 265;
  --primary-foreground: 99% 0.01 265;
  --muted: 94.5% 0.006 95;
  --muted-foreground: 55% 0.01 265;
  --border: 90% 0.006 95;
  --input: 90% 0.006 95;
  --ring: 55% 0.19 265;
  --radius: 8px;
}
```
