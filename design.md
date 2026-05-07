# Enma Labs — Design System v2.0

> **Design Philosophy**: Dark luxury meets enterprise utility. Every pixel should feel intentional, every interaction should feel alive, and every data point should be instantly scannable. Think Bloomberg Terminal meets Apple's design language.

---

## 1. Color Palette

### Primary Surface Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-root` | `#000000` | Page background |
| `--bg-surface` | `rgba(255,255,255,0.02)` | Card backgrounds |
| `--bg-surface-elevated` | `rgba(255,255,255,0.05)` | Hover states, elevated cards |
| `--bg-surface-interactive` | `rgba(255,255,255,0.08)` | Active/selected states |
| `--bg-overlay` | `rgba(0,0,0,0.60)` | Modal backdrop |

### Accent Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--accent` | `#FF4E00` | Primary brand accent, CTAs |
| `--accent-hover` | `#F27D26` | Hover state for accent |
| `--accent-glow` | `rgba(255,78,0,0.15)` | Glow effects, subtle backgrounds |
| `--accent-soft` | `rgba(255,78,0,0.08)` | Light accent tints |

### Status Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--status-success` | `#34D399` (emerald-400) | Extracted, active, online |
| `--status-success-bg` | `rgba(52,211,153,0.10)` | Success badge background |
| `--status-warning` | `#FBBF24` (amber-400) | Pending, processing |
| `--status-warning-bg` | `rgba(251,191,36,0.10)` | Warning badge background |
| `--status-error` | `#F87171` (red-400) | Failed, offline, error |
| `--status-error-bg` | `rgba(248,113,113,0.10)` | Error badge background |
| `--status-info` | `#60A5FA` (blue-400) | Informational, received |
| `--status-info-bg` | `rgba(96,165,250,0.10)` | Info badge background |

### Text Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--text-primary` | `#FFFFFF` | Headings, primary text |
| `--text-secondary` | `rgba(255,255,255,0.60)` | Body text, descriptions |
| `--text-tertiary` | `rgba(255,255,255,0.40)` | Labels, meta information |
| `--text-muted` | `rgba(255,255,255,0.20)` | Placeholders, disabled |

### Border Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--border-subtle` | `rgba(255,255,255,0.05)` | Dividers, section borders |
| `--border-default` | `rgba(255,255,255,0.10)` | Card borders |
| `--border-hover` | `rgba(255,255,255,0.20)` | Hover state borders |
| `--border-active` | `rgba(255,255,255,0.30)` | Focus/active borders |

---

## 2. Typography

### Font Families
- **Sans**: `Inter` — Used for all body text, labels, buttons, data
- **Serif**: `Cormorant Garamond` — Used for page titles, section headings, large numbers
- **Mono**: `JetBrains Mono` or system monospace — Used for IDs, codes, technical data

### Scale
| Name | Size | Weight | Line Height | Font | Usage |
|------|------|--------|-------------|------|-------|
| `display-1` | 48px (3rem) | 500 | 1.1 | Serif | Dashboard page title |
| `heading-1` | 32px (2rem) | 500 | 1.2 | Serif | Section titles |
| `heading-2` | 24px (1.5rem) | 500 | 1.3 | Serif | Card titles |
| `heading-3` | 20px (1.25rem) | 600 | 1.4 | Sans | Sub-section titles |
| `stat-number` | 36px (2.25rem) | 500 | 1.0 | Serif | Stat card numbers |
| `body-lg` | 16px (1rem) | 400 | 1.6 | Sans | Primary body text |
| `body` | 14px (0.875rem) | 400 | 1.5 | Sans | Default body text |
| `body-sm` | 13px (0.8125rem) | 400 | 1.5 | Sans | Table cells, secondary info |
| `caption` | 12px (0.75rem) | 500 | 1.4 | Sans | Timestamps, metadata |
| `label` | 11px (0.6875rem) | 700 | 1.3 | Sans (uppercase, tracking-[0.15em]) | Section labels, badges |
| `micro` | 10px (0.625rem) | 700 | 1.2 | Sans (uppercase, tracking-[0.2em]) | Tiny labels, status text |

---

## 3. Spacing & Layout

### Spacing Scale
`4px` → `8px` → `12px` → `16px` → `20px` → `24px` → `32px` → `40px` → `48px` → `64px`

### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | `8px` | Small buttons, badges |
| `radius-md` | `12px` | Form inputs, dropdowns |
| `radius-lg` | `16px` | Compact cards |
| `radius-xl` | `24px` | Standard cards |
| `radius-2xl` | `32px` | Large feature cards |
| `radius-full` | `9999px` | Pills, avatars, circular buttons |

### Dashboard Layout
```
┌──────────────────────────────────────────────────┐
│ ┌──────┐ ┌─────────────────────────────────────┐ │
│ │      │ │ Header (h-16)                       │ │
│ │      │ ├─────────────────────────────────────┤ │
│ │Sidebar│ │                                     │ │
│ │(w-64) │ │  Content Area                       │ │
│ │      │ │  (p-8, max-w-7xl mx-auto)           │ │
│ │      │ │                                     │ │
│ │      │ │                                     │ │
│ │      │ │                                     │ │
│ └──────┘ └─────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

- **Sidebar**: Fixed `w-64`, border-right `--border-subtle`
- **Header**: Fixed `h-16`, border-bottom `--border-subtle`
- **Content**: Scrollable, `p-8`, `max-w-7xl` centered
- **Content grid**: Use `grid-cols-4` for stats, `grid-cols-3` for cards

---

## 4. Glass Card System

### Standard Glass Card
```css
.glass-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.10);
  backdrop-filter: blur(48px);
  border-radius: 24px;
}
```

### Elevated Glass Card (hover state)
```css
.glass-card:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}
```

### Interactive Glass Card (clickable)
```css
.glass-card-interactive {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.glass-card-interactive:active {
  transform: scale(0.98);
}
```

### Accent Glass Card (highlighted)
```css
.glass-card-accent {
  background: rgba(255, 78, 0, 0.05);
  border-color: rgba(255, 78, 0, 0.20);
  box-shadow: 0 0 40px rgba(255, 78, 0, 0.05);
}
```

---

## 5. Micro-Animation Library

### Entrance Animations
| Name | Effect | Duration | Easing | Trigger |
|------|--------|----------|--------|---------|
| `fadeUp` | opacity 0→1, y 20→0 | 500ms | easeOut | On mount / in view |
| `fadeIn` | opacity 0→1 | 300ms | easeOut | On mount |
| `slideRight` | x -20→0, opacity 0→1 | 400ms | easeOut | Sidebar items |
| `scaleIn` | scale 0.95→1, opacity 0→1 | 300ms | spring(0.5) | Modals, dropdowns |
| `stagger` | Children appear with 60ms delay | — | — | List items, grid items |

### Interactive Animations
| Name | Effect | Duration | Trigger |
|------|--------|----------|---------|
| `hoverLift` | y 0→-4, shadow increase | 200ms | Mouse enter |
| `hoverGlow` | Box-shadow accent glow | 300ms | Mouse enter |
| `pressScale` | scale 1→0.97 | 100ms | Mouse down |
| `buttonShimmer` | Gradient sweep left→right | 600ms | Mouse enter |

### Data Animations
| Name | Effect | Duration | Usage |
|------|--------|----------|-------|
| `countUp` | Number 0→target | 1200ms | Stat cards on mount |
| `progressFill` | width 0→target% | 800ms | Progress bars |
| `skeletonPulse` | Opacity 0.1↔0.3 | 1500ms infinite | Loading skeletons |
| `dotPulse` | Scale 1↔1.2, opacity 0.5↔1 | 2000ms infinite | Status indicators |

### Transition Curves
- **Standard**: `cubic-bezier(0.4, 0, 0.2, 1)` — Most transitions
- **Decelerate**: `cubic-bezier(0, 0, 0.2, 1)` — Entering elements
- **Accelerate**: `cubic-bezier(0.4, 0, 1, 1)` — Exiting elements
- **Spring**: `type: "spring", stiffness: 300, damping: 20` — Bouncy elements

---

## 6. Component Patterns

### Stat Card
- Icon in rounded-2xl container (12×12) with soft background
- Label above in `--text-tertiary`, `label` size
- Large number in `stat-number` font
- Trend badge (green ↑ / red ↓) with percentage
- Subtle glow orb in top-right corner on hover

### Data Table
- Glass card container with `radius-2xl`
- Header row: `--text-tertiary`, `label` size, uppercase
- Body rows: Hover `bg-white/[0.02]`, `body-sm` text
- Dividers: `--border-subtle`
- Sortable columns: Arrow indicator, active column highlighted
- Status column: Colored StatusBadge
- Actions column: Ghost icon buttons

### Filter Bar
- Horizontal bar above table
- Search input: Glass morphism, `radius-full`, search icon prefix
- Filter dropdowns: Glass card dropdown, checkmark selected items
- Active filter pills: Accent tinted, × to remove
- Results count: `caption` text on right side

### Empty State
- Centered in content area
- Large subtle icon (64×64) in `--text-muted`
- Heading in `heading-2`, `--text-primary`
- Description in `body`, `--text-secondary`
- CTA button (GlassButton accent variant)
- Subtle radial gradient behind icon

### Status Badge
- Pill shape (`radius-full`)
- Tiny dot indicator + text
- Color-coded per status:
  - Extracted: emerald dot + emerald text
  - Failed: red dot + red text
  - Received: blue dot + blue text
  - Processing: amber dot + amber text + pulse animation

### Modal / Slide-Over
- Backdrop: `--bg-overlay` with blur(4px)
- Panel: Glass card with `radius-2xl`, slide from right
- Header: Title + close button, border-bottom
- Content: Scrollable, `p-8`
- Footer: Action buttons, border-top
- Enter: `scaleIn` animation
- Exit: Reverse with `accelerate` curve

### Skeleton Loader
- Matches exact layout of target component
- Rounded rectangles with `skeletonPulse` animation
- Same dimensions as final content
- Glass card wrapper matching actual card

---

## 7. Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| `mobile` | <768px | Sidebar hidden (hamburger), single column, simplified stats |
| `tablet` | 768–1024px | Sidebar collapsed (icons only), 2-col grid |
| `desktop` | 1024–1440px | Full sidebar, 3-4 col grid |
| `wide` | >1440px | Full sidebar, max-width content, extra breathing room |

---

## 8. Accessibility

- All interactive elements: `focus-visible` ring in accent color
- Minimum contrast ratio: 4.5:1 for body text, 3:1 for large text
- All icons accompanied by text labels or `aria-label`
- Keyboard navigation: Tab through all interactive elements
- Status colors: Never rely on color alone — always include text/icon
- Motion: Respect `prefers-reduced-motion` media query

---

## 9. Design Principles

1. **Data density with clarity** — Show maximum information without clutter. Use hierarchy, spacing, and subtle backgrounds to organize.
2. **Progressive disclosure** — Show summaries first, details on interaction (hover, click, expand).
3. **Consistent rhythm** — Same spacing, same border radius, same animation curves throughout.
4. **Quiet luxury** — No bright backgrounds, no heavy borders. Let content breathe against deep black. Accent color used sparingly for emphasis.
5. **Alive but not distracting** — Subtle animations that reward interaction without demanding attention. Pulse on status indicators, lift on hover, smooth transitions between states.
