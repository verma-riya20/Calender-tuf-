# 📅 Wall Calendar — Interactive Date Range Planner

A production-ready, portfolio-grade interactive wall calendar built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. Inspired by the classic physical wall calendar aesthetic with a full-bleed hero image, spiral binding, and a polished date-range selection experience.

---

## ✨ Features

### Core
- **Wall Calendar Aesthetic** — spiral binding, full-bleed hero photograph, diagonal accent shape (matching the reference design), month name overlay
- **Date Range Selection** — click start → click end; hover preview shows the range in real-time; clear visual states for start, end, in-range, and single-day selection
- **Integrated Notes** — per-day, per-range, or per-month notes with 5 color labels; persisted to `localStorage` (no backend)
- **Fully Responsive** — desktop: side-by-side hero/grid + right notes panel; mobile: stacked vertically, touch-friendly tap targets

### Extras & Creative Enhancements
- **Smooth flip animation** on month navigation (slide + perspective transform)
- **Per-month theming** — each month has a unique accent color, background tone, and hero photograph; the entire UI recolors on navigation
- **Quick month strip** — click any month abbreviation to jump there instantly
- **Holiday markers** — 18 Indian public & observance holidays shown as accent dots + named in the selection panel
- **Note dot indicators** — days with saved notes show a subtle white dot in the grid
- **Note color labels** — 5 colors (default, amber, rose, emerald, sky) for visual organization
- **All notes list** — scrollable panel showing all notes for the current month with inline delete
- **Keyboard support** — full keyboard navigation; ⌘S / Ctrl+S saves the current note
- **Season badge** — hero image shows the current season (Winter / Spring / Summer / Autumn)
- **Today ring** — today's date is always highlighted with a subtle ring

---

## ✅ Requirement Mapping (Challenge Rubric)

| Requirement from prompt | Implementation evidence |
|---|---|
| Wall calendar aesthetic with hero area + date section | `src/components/Layout/WallCalendar.tsx`, `src/components/Calendar/HeroImage.tsx`, `src/components/UI/CalendarBinding.tsx` |
| Day range selector with clear visual states | `src/hooks/useCalendar.ts`, `src/lib/dateUtils.ts`, `src/components/Calendar/DayCell.tsx` |
| Integrated notes section (month/day/range) | `src/components/Notes/NotesPanel.tsx`, `src/components/Notes/NoteEditor.tsx`, `src/hooks/useNotes.ts` |
| Fully responsive layout (desktop + mobile) | `src/components/Layout/WallCalendar.tsx`, `src/app/globals.css` |
| Strictly frontend; local persistence only | `src/hooks/useNotes.ts` (`localStorage`) |

Quality additions included:
- Accessibility live announcements for range selection and save errors
- Save-failure UI feedback when storage is unavailable/full
- Error boundary fallback to avoid full-page crashes
- Hero image visual fallback if remote image load fails

---

## 🗂 Project Structure

```
src/
├── app/
│   ├── globals.css          # Tailwind base + Google Fonts + scrollbar styles
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Entry page
├── components/
│   ├── Calendar/
│   │   ├── CalendarGrid.tsx # 7-column date grid with weekday headers
│   │   ├── DayCell.tsx      # Individual day cell (range states, holiday dot, note dot)
│   │   ├── HeroImage.tsx    # Full-bleed photo + diagonal accent + month badge
│   │   └── MonthStrip.tsx   # Quick month-jump pill row
│   ├── Layout/
│   │   └── WallCalendar.tsx # Root assembly component
│   ├── Notes/
│   │   ├── NoteEditor.tsx   # Textarea + color picker + save button
│   │   ├── NotesList.tsx    # Scrollable saved notes list
│   │   ├── NotesPanel.tsx   # Right-panel composition
│   │   └── RangeInfo.tsx    # Selected range summary card
│   └── UI/
│       ├── CalendarBinding.tsx # Spiral wire binding visual
│       └── NavButton.tsx       # Prev / next navigation buttons
├── hooks/
│   ├── useCalendar.ts       # Month navigation, range selection state
│   └── useNotes.ts          # localStorage CRUD for notes
├── lib/
│   ├── constants.ts         # Month themes, holiday map, color config, weekday labels
│   └── dateUtils.ts         # Grid builder, range state calculator, key formatter
└── types/
    └── index.ts             # All shared TypeScript types
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm / yarn / pnpm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/wall-calendar.git
cd wall-calendar

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel (recommended)

```bash
npx vercel --prod
```

---

## 🧠 Technical Decisions

| Decision | Rationale |
|---|---|
| **Next.js 14 App Router** | Modern React server components, excellent image optimization via `next/image` |
| **TypeScript** | Full type safety across all components, hooks, and utilities |
| **Tailwind CSS** | Utility-first rapid styling; `clsx` for conditional class composition |
| **date-fns** | Lightweight, tree-shakeable date library with no global state |
| **localStorage only** | Matches brief requirement — no backend, no API, pure client persistence |
| **Custom hooks** | `useCalendar` and `useNotes` cleanly separate concerns from UI components |
| **Memoization** | `useMemo` on grid build and note key set; `memo()` on `DayCell` to prevent re-renders |
| **CSS animations** | Tailwind keyframes for flip/slide transitions; CSS-only pulse ring on selected dates |
| **Cormorant Garamond** | Distinctive serif display font — editorial and refined without being generic |
| **Geist** | Clean, modern sans-serif for body text that reads well at small sizes |

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| `< 1024px` (mobile/tablet) | Stacked vertically: hero → grid → notes panel |
| `≥ 1024px` (desktop) | Two-column: left (hero + grid + strip) \| right (notes panel) |

---

## 🎨 Design Philosophy

The aesthetic is **editorial dark** — inspired by high-end photography magazines and luxury print calendars. The key choices:

- **Dark backgrounds per month** ensure the hero image bleeds naturally into the calendar grid
- **Single accent color per month** creates cohesion without visual noise
- **Cormorant Garamond** for the month name adds print-editorial gravitas
- **Diagonal accent shape** directly mirrors the reference wall calendar's blue chevron
- **Spiral binding** rendered in CSS reinforces the physical wall calendar metaphor

---

## 📦 Dependencies

```json
{
  "next": "14.2.4",
  "react": "18.3.1",
  "date-fns": "3.6.0",
  "clsx": "2.1.1",
  "tailwindcss": "3.4.4"
}
```

No UI component libraries. No animation libraries. No date pickers. Built from scratch.

---

## 📄 License

MIT
