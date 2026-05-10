# Traveloop — Design Guidelines

> **Purpose:** This document is the single source of truth for all visual decisions.
> It reflects the *actual implemented style* — follow it exactly when building new components.
> The aesthetic is **editorial + flat-bold**: high-contrast dark borders, flat offset shadows,
> warm cream backgrounds, and amber as the singular accent color.

---

## 1. Core Aesthetic — "Editorial Flat-Bold"

The design is inspired by modern editorial UI: crisp dark outlines, offset flat drop-shadows
(no blur, no softness), bold black typography, and a warm cream canvas. Think a well-designed
travel magazine card — not a SaaS dashboard.

**The three defining rules:**
1. **2px solid `#1A1A1A` borders** on all interactive surface elements (cards, inputs, buttons, badges)
2. **Flat offset shadows** — `box-shadow: Xpx Xpx 0px #1A1A1A` — never blurred, never colored
3. **`font-black` (900 weight)** for all headings, icon badges, and primary CTAs

---

## 2. Color Palette

```
Background (canvas):   #F5F0E8   — warm cream, used as the page/app background
Surface (cards):       #FFFFFF   — white cards only; never gray cards
Primary accent:        #F5C142   — amber; used ONLY for primary actions, active states, icon badges
Accent hover:          #E0AE30   — darkened amber for hover states
Text primary:          #1A1A1A   — near-black for all headings, labels, borders
Text secondary:        #6B7280   — gray for subtitles, helper text, inactive states
Text placeholder:      #9CA3AF   — lighter gray for input placeholders
Border (interactive):  #1A1A1A   — dark border on buttons, cards, icon badges
Border (structural):   #E5E7EB   — light gray for inner dividers, input fields, form panels
Error:                 #EF4444   — red for errors and danger actions
Error background:      #FEF2F2   — light red tint for error banners
Success:               #22C55E
Warning:               #F59E0B
Info:                  #3B82F6
```

**Sidebar colors (AppLayout):**
```
Sidebar background:    #1A1A1A
Sidebar active item:   #F5C142 (amber)
Sidebar active text:   #1A1A1A (black on amber)
Sidebar inactive text: #9CA3AF
Sidebar hover bg:      rgba(255,255,255,0.08)
```

**Status badge colors (Trip status):**
```
PLANNING:   bg #FEF3C7  text #92400E
ONGOING:    bg #DBEAFE  text #1E40AF
COMPLETED:  bg #D1FAE5  text #065F46
CANCELLED:  bg #F3F4F6  text #6B7280
```

---

## 3. Typography

| Role | Size | Weight | Class |
|---|---|---|---|
| Wordmark | `2rem` | 900 (black) | `text-[2rem] font-black tracking-tight` |
| Page heading / Card heading | `1.5rem` | 900 | `text-[1.5rem] font-black` |
| Section title | `1.125rem` | 700 | `text-lg font-bold` |
| Body text | `0.875rem` | 400 | `text-sm` |
| Field labels | `0.75rem` | 700 | `text-xs font-bold uppercase tracking-widest` |
| Helper / subtitle text | `0.875rem` | 400 | `text-sm text-[#6B7280]` |
| Button text | `0.875rem` | 900 | `text-sm font-black` |

- **Font:** `Inter` (Google Fonts), imported in `index.css`
- **Monospace** (costs, IDs, timestamps): `font-mono`
- **Wordmark split:** `Travel` in `#1A1A1A`, `oop` in `#F5C142`, both `font-black`

---

## 4. Shadow System

The flat offset shadow is the **signature of this design**. It must be applied consistently.

```css
/* Large: page-level cards, main auth card */
box-shadow: 6px 6px 0px #1A1A1A;

/* Medium: buttons, icon badges, avatar circles */
box-shadow: 3px 3px 0px #1A1A1A;

/* Small: inline accent elements, small badges */
box-shadow: 2px 2px 0px #1A1A1A;
```

> ⚠️ **Never use blurred shadows (`shadow-sm`, `shadow-md`, etc.) on primary UI surfaces.**
> Blurred shadows are only acceptable for tooltips or floating menus.

---

## 5. Component Tokens

### Buttons

```jsx
{/* PRIMARY — amber fill, dark border, flat shadow, font-black */}
<button
  className="bg-[#F5C142] text-[#1A1A1A] font-black text-sm rounded-lg px-4 py-3
             border-2 border-[#1A1A1A] hover:bg-[#E0AE30] transition-colors duration-150"
  style={{ boxShadow: '3px 3px 0px #1A1A1A' }}
>
  Action →
</button>

{/* SECONDARY — white fill, dark border, no shadow */}
<button
  className="bg-white text-[#1A1A1A] font-bold text-sm rounded-lg px-4 py-2.5
             border-2 border-[#1A1A1A] hover:bg-[#F5F0E8] transition-colors duration-150"
>
  Secondary
</button>

{/* DANGER */}
<button
  className="bg-[#EF4444] text-white font-bold text-sm rounded-lg px-4 py-2.5
             border-2 border-[#1A1A1A] hover:bg-red-600 transition-colors duration-150"
>
  Delete
</button>

{/* GHOST — no background, no border, text only */}
<button className="text-[#6B7280] hover:text-[#1A1A1A] text-sm font-medium transition-colors">
  Cancel
</button>
```

---

### Cards

```jsx
{/* PAGE-LEVEL CARD — main content surface */}
<div
  className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-8"
  style={{ boxShadow: '6px 6px 0px #1A1A1A' }}
>
  {/* content */}
</div>

{/* CONTENT CARD — list items, trip cards, etc. */}
<div
  className="bg-white border-2 border-[#1A1A1A] rounded-xl p-4
             hover:translate-y-[-2px] transition-transform duration-150"
  style={{ boxShadow: '4px 4px 0px #1A1A1A' }}
>
  {/* content */}
</div>

{/* INNER PANEL — form grouping box inside a card (e.g. registration form panel) */}
<div className="border-2 border-[#E5E7EB] rounded-xl p-5">
  {/* fields */}
</div>
```

---

### Inputs & Form Fields

Labels must be `ALL CAPS`, `font-bold`, `tracking-widest`, `text-xs`. This is the editorial label style.

```jsx
{/* LABEL */}
<label className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest">
  Email Address
</label>

{/* INPUT — light border default, dark border on focus */}
<input
  className="border-2 rounded-lg px-3 py-2.5 text-sm w-full bg-white text-[#1A1A1A]
             placeholder-[#9CA3AF] border-[#E5E7EB] focus:border-[#1A1A1A]
             focus:outline-none transition-colors duration-150"
/>

{/* INPUT ERROR STATE */}
<input
  className="border-2 rounded-lg px-3 py-2.5 text-sm w-full bg-white text-[#1A1A1A]
             border-[#EF4444] focus:border-[#EF4444] focus:outline-none"
/>

{/* ERROR MESSAGE */}
<p className="text-xs text-[#EF4444] font-medium mt-1">{error}</p>

{/* TEXTAREA */}
<textarea
  className="border-2 rounded-lg px-3 py-2.5 text-sm w-full bg-white text-[#1A1A1A]
             placeholder-[#9CA3AF] resize-none border-[#E5E7EB]
             focus:border-[#1A1A1A] focus:outline-none transition-colors duration-150"
  rows={4}
/>
```

---

### Icon Badges

Used in card headings to visually identify sections. Always amber background, dark border, small offset shadow.

```jsx
{/* ICON BADGE — small square, used beside headings */}
<div
  className="w-9 h-9 rounded-lg flex items-center justify-center
             bg-[#F5C142] border-2 border-[#1A1A1A] flex-shrink-0"
  style={{ boxShadow: '2px 2px 0px #1A1A1A' }}
>
  <Icon size={18} strokeWidth={2.5} className="text-[#1A1A1A]" />
</div>
```

Paired with a heading like this:
```jsx
<div className="flex items-center gap-3 mb-1">
  {/* icon badge */}
  <h1 className="text-[1.5rem] font-black text-[#1A1A1A] leading-tight">
    Section Title
  </h1>
</div>
<p className="text-sm text-[#6B7280] mb-6 ml-12">Subtitle text here.</p>
```

---

### Avatar / Photo Circle

Used at the top of auth pages and profile screens. Shows initials when available, camera icon as placeholder.

```jsx
<div
  className="w-20 h-20 rounded-full border-2 border-[#1A1A1A] bg-[#F5F0E8]
             flex items-center justify-center relative"
  style={{ boxShadow: '3px 3px 0px #1A1A1A' }}
>
  {/* Initials or fallback icon */}
  <span className="text-2xl font-black text-[#1A1A1A]">AB</span>

  {/* Amber "+" badge — bottom-right corner */}
  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full
                  bg-[#F5C142] border-2 border-[#1A1A1A] flex items-center justify-center">
    <span className="text-xs font-black text-[#1A1A1A] leading-none">+</span>
  </div>
</div>
```

---

### Error / Alert Banners

```jsx
{/* API error inside a form */}
<div className="mb-5 rounded-lg border-2 border-[#EF4444] bg-red-50
                px-4 py-3 text-sm font-medium text-[#EF4444]">
  Error message here.
</div>
```

---

### Dividers with labels

```jsx
<div className="flex items-center gap-3 my-6">
  <div className="flex-1 h-px bg-[#E5E7EB]" />
  <span className="text-xs text-[#9CA3AF] font-medium">OR</span>
  <div className="flex-1 h-px bg-[#E5E7EB]" />
</div>
```

---

### Badges (status / category)

```jsx
<span className="text-xs font-semibold px-2.5 py-0.5 rounded-full
                 bg-[#FEF3C7] text-[#92400E]">
  PLANNING
</span>
```

---

## 6. Layout Patterns

### Auth Pages (`/login`, `/signup`)

```
[Full-screen cream canvas]
  └── [Centered container, max-w-[420px] for login, max-w-[640px] for registration]
        ├── Wordmark (centered, font-black, "Travel" dark + "oop" amber)
        ├── [White card — 2px border, 6px flat shadow, rounded-2xl, p-8]
        │     ├── Avatar circle (centered, w-20 h-20, dark border, 3px shadow)
        │     ├── Icon badge + Heading + Subtitle
        │     ├── [Inner form panel — border-2 border-[#E5E7EB], rounded-xl, p-5]
        │     │     └── 2-column grid for paired fields (grid-cols-2 gap-4)
        │     ├── Primary CTA button (centered for register, full-width for login)
        │     └── Footer link (Sign in / Create one)
        └── Footer tagline (text-xs, #6B7280)
```

### Registration Form Field Order
```
Row 1 (2-col): First Name | Last Name
Row 2 (2-col): Email Address | Phone Number
Row 3 (2-col): City | Country
Row 4 (full):  Password
Row 5 (full):  Additional Information [textarea, 4 rows]
[centered]     Register → button
```

---

## 7. Iconography

Use `lucide-react` exclusively. Do not mix icon libraries.

| Context | Size | strokeWidth |
|---|---|---|
| Icon badges (next to headings) | 18px | 2.5 |
| Sidebar icons | 18px | 2 |
| Button icons | 15–16px | 2 |
| Inline / card icons | 14px | 1.5–2 |

---

## 8. UX Patterns

**Loading states:**
- Inline button loading: replace button text with `<Loader2 className="animate-spin" />` + text
- Page-level loading: skeleton placeholders (gray animated pulse) — never a full-page spinner

**Empty states:**
Always show a descriptive message + an amber primary CTA. Never a blank page.

**Error feedback:**
- Field validation: red message `text-xs text-[#EF4444]` directly below the input
- API/async errors: red banner inside the form (see banner token above)
- Route-level errors: dedicated error page with navigation back

**Confirmation dialogs:**
Never use `window.alert()` or `window.confirm()`. Always use a styled modal with a Danger button.

**Search inputs:**
Debounced at 300ms minimum. Never fire on every keystroke.

**Links inside cards/forms:**
```jsx
<Link
  to="/signup"
  className="text-[#1A1A1A] font-bold underline underline-offset-2
             hover:text-[#F5C142] transition-colors"
>
  Create one
</Link>
```

---

## 9. Transitions & Motion

Keep all animations fast and purposeful:

```
Hover transitions:      duration-150
Modal open/close:       duration-200
Page transitions:       none (instant navigation)
Hover translate:        hover:translate-y-[-2px] for card lift effect
```

---

## 10. Spacing

Use Tailwind's 4px base scale. Core spacing tokens in use:

| Token | Usage |
|---|---|
| `p-8` | Card internal padding |
| `p-5` | Inner panel padding |
| `gap-4` | Column/field gap in 2-column grids |
| `gap-3` | Icon badge + heading gap |
| `mb-6` / `mb-7` | Below subtitle, before form |
| `mt-6` | Above submit button, above footer link |
| `my-6` | OR divider vertical margin |
| `ml-12` | Subtitle indent (to align with heading, past icon badge) |
