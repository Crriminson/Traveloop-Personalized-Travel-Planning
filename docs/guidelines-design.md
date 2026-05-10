# Traveloop — Design Guidelines

Visual reference: TripWise (warm amber/cream aesthetic, dark sidebar, card-based layouts). Match the quality — not the exact layout.

---

## Color Palette

```
Background:        #F5F0E8   (warm cream)
Sidebar:           #1A1A1A   (near-black)
Sidebar active:    #F5C142   (amber — primary accent)
Sidebar text:      #FFFFFF
Primary accent:    #F5C142
Accent hover:      #E0AE30
Text primary:      #1A1A1A
Text secondary:    #6B7280
Card background:   #FFFFFF
Border:            #E5E7EB
Danger:            #EF4444
Success:           #22C55E
Warning:           #F59E0B
Info:              #3B82F6
```

**Status badge colors:**
```
PLANNING:   bg #FEF3C7  text #92400E
ONGOING:    bg #DBEAFE  text #1E40AF
COMPLETED:  bg #D1FAE5  text #065F46
CANCELLED:  bg #F3F4F6  text #6B7280
```

**Activity category badge colors:**
```
SIGHTSEEING:   bg #EDE9FE  text #5B21B6
FOOD:          bg #FEF3C7  text #92400E
ADVENTURE:     bg #D1FAE5  text #065F46
CULTURAL:      bg #FEE2E2  text #991B1B
RELAXATION:    bg #E0F2FE  text #0C4A6E
SHOPPING:      bg #FCE7F3  text #9D174D
```

---

## Typography

- **Primary font:** `Inter` (Google Fonts)
- **Monospace** (costs, IDs, timestamps): system monospace or `JetBrains Mono`
- Scale: 24px page titles, 18px section titles, 14px body/cards, 12px labels/meta
- Line height: 1.6 for body, 1.2 for headings
- Font weight: 700 headings, 600 labels, 400 body

---

## Component Tokens

Use these as Tailwind class patterns. Keep them consistent across the entire app.

**Buttons:**
```
Primary:    bg-[#F5C142] text-black font-semibold rounded-lg px-4 py-2 hover:bg-[#E0AE30] transition-colors
Secondary:  border border-gray-300 bg-white text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-50
Danger:     bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600
Ghost:      text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg px-3 py-1.5
```

**Cards:**
```
Base:       bg-white rounded-xl border border-gray-100 shadow-sm p-4
Hover:      hover:shadow-md transition-shadow duration-200
Image card: overflow-hidden rounded-xl (image fills top, content below)
```

**Inputs:**
```
Base:       border border-gray-300 rounded-lg px-3 py-2 text-sm w-full
            focus:outline-none focus:ring-2 focus:ring-[#F5C142] focus:border-transparent
Error:      border-red-400 focus:ring-red-400
```

**Badges:**
```
Base:       text-xs font-semibold px-2 py-0.5 rounded-full
```

**Modals:**
```
Overlay:    fixed inset-0 backdrop-blur-sm bg-black/40 z-50 flex items-center justify-center
Box:        bg-white rounded-2xl shadow-xl p-6 w-full max-w-md
```

**Sidebar item (active):**
```
bg-[#F5C142] text-black font-semibold rounded-lg
```

**Sidebar item (inactive):**
```
text-gray-400 hover:text-white hover:bg-white/10 rounded-lg
```

---

## UX Patterns

**Loading states:** Skeleton loaders (gray animated pulse placeholders), not spinners, for page-level data fetches.

**Empty states:** Always show a helpful message + a clear CTA button. Never a blank page.

**Error feedback:** Field-level validation errors in red below the input. Async operation results as toast notifications (top-right corner, 3s auto-dismiss).

**Search inputs:** Always debounced at 300ms. Never fire on every keystroke.

**Destructive actions:** Always confirm before delete (modal or inline confirm pattern, not browser `alert()`).

**Image loading:** Always use `loading="lazy"`. Provide a fallback placeholder (gray bg with icon) for broken images.

---

## Iconography

Use `lucide-react` for all icons. Keep icon sizes consistent:
- Sidebar: 18px
- Buttons: 16px
- Cards/inline: 14px

---

## General UI Principles

- Consistent spacing — stick to Tailwind's 4px base scale
- Every interactive element must have a visible hover state
- No unstyled default browser UI (inputs, selects, checkboxes) — style everything
- Mobile-responsive layouts are a bonus; desktop-first is acceptable
- Smooth transitions on hover, modal open/close (`duration-200` or `duration-150`)
- The amber (`#F5C142`) accent should feel intentional — use it for primary actions, active states, and key highlights only. Don't overuse it.
