# Design Guidelines

A reference for keeping the look and feel of this site consistent as it grows. When in doubt, prefer the existing token / pattern over inventing a new one. If a new token is needed, add it to `:root` in `styles.css` and document it here.

---

## 1. Foundations

### 1.1 Color tokens

All colors live as CSS custom properties in `styles.css → :root`. Always reference via `var(--token)`, never hard-coded hex.

| Token | Value | Use |
|---|---|---|
| `--c-light-white` | `#ffffff` | Pure white — text on dark bg, brand surfaces |
| `--c-light-gray` | `#f0f0f0` | Light surface (placeholder, light card) |
| `--c-light-gray-muted` | `#9b9b9b` | Muted text on dark (subtitles, captions) |
| `--c-light-midgray` | `#d6d6d6` | Mid-light divider / hover states |
| `--c-dark-black` | `#0b1215` | Page background (dark mode) |
| `--c-dark-gray` | `#333333` | Card surface (dark mode) |
| `--c-chroma-red` | `#ff452c` | Reserved accent — use sparingly |
| `--c-chroma-green` | `#48ea2d` | Reserved accent — use sparingly |
| `--module-bg-color` | `#222` | Placeholder module background |

Semantic surface tokens (preferred — they auto-flip with theme):

| Token | Dark | Light |
|---|---|---|
| `--c-background` | `#0b1215` | `#ffffff` |
| `--c-text` | `#ffffff` | `#000000` |
| `--c-text-muted` | `#9b9b9b` | `#555555` |
| `--c-card-background` | `#333333` | `#f0f0f0` |
| `--c-card-foreground` | `#ffffff` | `#000000` |

**Rule**: when adding new text or background, reference a semantic token (`--c-text`, `--c-background`) so it flips correctly in light theme.

### 1.2 Spacing scale

Multiples of `0.25rem` (4px). Use these tokens for padding, margins, and gaps. **Do not use raw px values for layout spacing.**

| Token | Value (rem) | Pixels | Use |
|---|---|---|---|
| `--s-025` | 0.25 | 4px | Hairline gap |
| `--s-050` | 0.5 | 8px | Tight gap (icon ↔ label) |
| `--s-100` | 1.0 | 16px | Default gap, base unit |
| `--s-150` | 1.5 | 24px | Component padding |
| `--s-200` | 2.0 | 32px | Section padding |
| `--s-300` | 3.0 | 48px | Large vertical spacing |
| `--s-400` | 4.0 | 64px | Hero spacing |
| `--s-500` | 5.0 | 80px | Outermost section breaks |

`--main-inline-s` (1rem) and `--project-spacing` (1rem) wrap horizontal page padding and inter-card gap respectively.

### 1.3 Border radius

| Token | Value | Use |
|---|---|---|
| `--site-border-radius` | `0.625rem` (10px) | All cards, project blocks, image containers |
| `999px` | — | Pills (dock, "Case Study" tag, back button) |

Only two radii in the system: rounded rectangles use `--site-border-radius`; capsules use `999px`. Never invent intermediate values.

### 1.4 Shadows & glows

Used sparingly, on floating surfaces only.

```css
/* Dock & floating pill surfaces */
box-shadow:
  0 1px 0 rgba(255, 255, 255, 0.04) inset,  /* subtle inner highlight */
  0 8px 24px rgba(0, 0, 0, 0.35);            /* soft drop */
```

Avoid shadows on cards in the grid — they read as too "card UI" and break the editorial feel.

### 1.5 Backdrop blur

Applied on translucent floating surfaces (dock, back pill):

```css
background: rgba(18, 20, 22, 0.72);
backdrop-filter: blur(18px) saturate(140%);
-webkit-backdrop-filter: blur(18px) saturate(140%);
border: 1px solid rgba(255, 255, 255, 0.07);
```

---

## 2. Typography

### 2.1 Font stack

```css
font-family: "UT FutterGrotesk", "Inter", "Helvetica Neue", system-ui, sans-serif;
```

- **UT Futter Grotesk** — primary (commercial; not currently licensed). Listed first so it'll render automatically once the font files are added.
- **Inter** — current rendered face. Loaded as a variable font (100–900 axis) via Google Fonts. Use any weight value within that range.
- Helvetica Neue / system-ui — fallbacks.

`font-feature-settings: "ss09", "cv11"` is set globally:
- `ss09` is UT FG's stylistic set (silently ignored by Inter)
- `cv11` switches Inter's `a` to single-story for a closer grotesk feel

### 2.2 Type scale

The system has **two display scales** and **one body size**. Don't introduce new sizes without strong reason.

| Role | Size | Weight | Letter-spacing | Line-height | Notes |
|---|---|---|---|---|---|
| **Wordmark / display** (`.wordmark`, `.project__title`) | `clamp(1.08rem, 3.24vw, 1.35rem)` (~17–22px) | 550 | 0.06em | 1.15 | Uppercase, scaleY(1.05). Bolder than body. |
| **Tagline / body display** (`.tagline`, `.project__meta`) | `clamp(1.08rem, 3.24vw, 1.35rem)` | 350 | 0.02em | 1.15 | Sentence case. Light, atmospheric. |
| **Body / UI** (default `body`, dock, card titles) | 13px | 400 | 0.02rem | 1rem | Used for everything else. |
| **Card subtitle / meta** | 13px | 400 | 0.02em | 1rem | Color: `--c-text-muted`. |

**Rules**:
- **Inherit color** rather than setting `color: var(--c-text)` on text elements — this lets the theme transition (`background-color`, `color` on body) cascade smoothly. Setting explicit color skips the transition.
- **`text-shadow: 0 0 0.4px currentColor`** is added to `.wordmark` and `.tagline` for perceived brightness on dark backgrounds — it thickens thin glyphs by a sub-pixel amount.
- **Uppercase labels** (`.wordmark`, `.project__title`) get extra letter-spacing (0.06em) for legibility; sentence-case text uses tighter 0.02em.

### 2.3 Weight conventions

- **350** — body, descriptions (light, calm)
- **400** — UI, dock labels, default
- **500** — emphasis (subhead inside paragraph)
- **550** — display labels (wordmark, page title) — heavier than body but not bold
- **700+** — never used in this system

The 200-unit weight delta between body (350) and display (550) creates visible hierarchy without anything feeling "bold."

---

## 3. Layout

### 3.1 Page shell

```html
<main class="page">          <!-- horizontal padding + max-width 1800px -->
  <header class="intro">      <!-- 52vh band, vertically centred -->
    <h1 class="wordmark">…</h1>
    <p class="tagline">…</p>
  </header>
  <section class="grid">      <!-- 2-column card grid -->
    <article class="card">…</article>
  </section>
</main>
<nav class="dock">…</nav>     <!-- floating bottom -->
```

### 3.2 Vertical proportions

- **Intro band**: `min-height: 52vh` (`.intro`). Above the fold the intro takes ~52% and the project grid takes ~48%, with cards extending past the fold by design.
- **Project page header**: same 52vh band (`.project__header`) for visual continuity across pages.
- **Mobile** (`max-width: 600px`): the 52vh band is dropped (`min-height: auto`) so phones don't have a giant empty top.

### 3.3 Grid

- 2 columns at desktop (`grid-template-columns: repeat(2, 1fr)`), 1 column at ≤600px.
- No gap on the grid itself; spacing comes from each card's inline `padding: 0 calc(var(--project-spacing) / 2)` (mirrors the UPSET pattern).

### 3.4 Card aspect ratios

Each card sets `--ratio` (width ÷ height). Image height is computed via `padding-bottom: calc(100% / var(--ratio))`. **Match the card to its content**; don't force content into a fixed ratio.

| Variant / use | `--ratio` | Notes |
|---|---|---|
| `.card` (default) | 1.4 | Mild landscape |
| `.card--tall` | 1.78 | 16:9 — used for hero card with motion |
| `.card--small` | 1.4 | Same as default |
| `.card--accent` | 1.75 | Wide landscape — historically the "feature" card |
| Inline override | per content | Use `style="--ratio: X"` for one-off (e.g. video card uses 1.78, vertical image uses 0.94) |

**Rules**:
- Cards in the same grid row should share `--ratio` so heights align. If you need vertical variety, place those cards in different rows.
- For a **portrait card**: use `--ratio < 1` (e.g. `0.75`, `0.94`). The card grows taller than the row's other cards — accept the asymmetry intentionally.

---

## 4. Components

### 4.1 Cards

```html
<article class="card [card--variant]" data-tag="Case Study" [style="--ratio: X"]>
  <a class="card__link" href="…">
    <div class="card__media">
      <!-- Choose ONE: -->
      <img src="…" alt="…">
      <video class="card__motion" autoplay muted loop playsinline …></video>
      <iframe class="card__motion" src="…"></iframe>
      <div class="card__placeholder">…</div>
    </div>
    <footer class="card__meta">
      <h2 class="card__title">…</h2>
      <p class="card__subtitle">…</p>
    </footer>
  </a>
</article>
```

- **`data-tag`** sets the small "Case Study" pill via `::before`. Always use a 2-word tag.
- **Title** (`.card__title`) and **subtitle** (`.card__subtitle`) — keep both lines short. Subtitle is a comma-separated list of disciplines.
- **Hover** scales the media slightly (`transform: scale(1.015)`) — keep this; it's the only "interactive" affordance on cards.
- **Optical alignment**: `.card__meta { padding: 0 0 0 4px; }` shifts text 4px right to compensate for glyph LSB so the title aligns visually with the rounded image edge.

### 4.2 Card motion embeds

For videos / iframes: use class `.card__motion`. The base CSS handles:
- `border: 0; background: #000;` — clean dark surface during load
- `pointer-events: none;` — clicks pass through to the parent `<a>`
- `object-fit: cover;` — fills the box

For self-hosted videos use the loop helper:
```html
<video class="card__motion" autoplay muted loop playsinline
       data-loop-segments='[[start,end],[start,end],…]' preload="auto">
  <source src="…" type="video/mp4">
</video>
```

The handler in `script.js` plays segments back-to-back and loops to the first.

### 4.3 Floating dock

The dock is **two pills**: a nav group (`.dock__group`) + a circular action button (`.dock__action`).

```html
<nav class="dock">
  <div class="dock__group">
    <a class="dock__link is-active" href="#">Work</a>
    <a class="dock__link" href="writing.html">Writing</a>
    <a class="dock__link" href="#">About</a>
  </div>
  <button class="dock__action" data-theme-toggle>…</button>
</nav>
```

- **Same labels across pages** for navigational consistency: `Work / Writing / About`.
- **`is-active`** marks the current page link (white pill on dark bg).
- The action button currently is the **theme toggle** (sun/moon SVG swap, persisted to `localStorage.theme`).

### 4.4 Dock — Calibration & Back behaviour (project pages)

Every project page dock has three links: **Back**, **Calibration**, and a third link (e.g. "Site") specific to the project.

#### Back button
Always navigates to `index.html`. Do **not** use `data-back` (which triggers `history.back()` and returns the user to wherever they came from). Just use a plain `href`:

```html
<a class="dock__link" href="index.html">Back</a>
```

#### Calibration button
Detects which section the user is currently viewing and, on click, smoothly scrolls to bring that section's top into view.

**How it works:**
1. Each numbered section (including the page header as `s-00`) gets `id="s-XX"` and `data-section`.
2. An `IntersectionObserver` tracks how much of each section is visible and stores a ratio per section.
3. On click, the section with the highest intersection ratio is selected. If that section is a continuation of a parent section (e.g. "08 continued"), a `data-target="s-XX"` attribute redirects calibration to the parent.

**Markup rules:**
- Page header (the intro title/meta block) → `id="s-00" data-section`. Calibration scrolls to `window.scrollTo({ top: 0 })`.
- Numbered sections 01–09 → `id="s-01"` … `id="s-09"` and `data-section`.
- Continuation sections (same numbered section, no new number) → `data-section data-target="s-XX"` (pointing to the parent section's ID). No `id` needed.
- Non-section grid items (image cards, 3D viewers) do not get `data-section` — the observer naturally falls back to the nearest tracked section.

```html
<!-- Page header: portion 00 -->
<header class="project__header" id="s-00" data-section>…</header>

<!-- Numbered section -->
<section class="project-text project-text--chapter" id="s-03" data-section>…</section>

<!-- Continuation of section 08 (no new number) -->
<section class="project-text" data-section data-target="s-08">…</section>

<!-- Dock -->
<a class="dock__link" href="index.html">Back</a>
<a class="dock__link" href="#" data-calibrate>Calibration</a>
```

**Inline script** (add before `</body>` on every project page):

```javascript
(function () {
  var sections = Array.from(document.querySelectorAll('[data-section]'));
  var calibBtn = document.querySelector('[data-calibrate]');
  if (!calibBtn || !sections.length) return;

  var ratios = {};
  sections.forEach(function (s) { ratios[s.id] = 0; });

  var thresholds = Array.from({ length: 11 }, function (_, i) { return i * 0.1; });
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { ratios[e.target.id] = e.intersectionRatio; });
  }, { threshold: thresholds });
  sections.forEach(function (s) { observer.observe(s); });

  calibBtn.addEventListener('click', function (e) {
    e.preventDefault();
    var best = sections.reduce(function (a, b) {
      return (ratios[b.id] || 0) > (ratios[a.id] || 0) ? b : a;
    });
    var targetId = best.dataset.target;
    if (best.id === 's-00') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (targetId) {
      var target = document.getElementById(targetId);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      best.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
})();
```

### 4.5 Project page header

Used on `project*.html`. Same 52vh centred layout as the index intro:

```html
<header class="project__header">
  <h1 class="project__title">Project Name</h1>
</header>
```

Keep the title alone — no subtitle/meta line on the project header (the meta moves into the project content blocks).

### 4.5 Project content grid

5-block layout: full → full → half + half → full.

```html
<section class="project-grid">
  <div class="project-block project-block--full project-block--hero">…</div>
  <div class="project-block project-block--full">…</div>
  <div class="project-block project-block--half">…</div>
  <div class="project-block project-block--half">…</div>
  <div class="project-block project-block--full">…</div>
</section>
```

Default ratios: hero `16:8`, full `16:9`, half `4:3`. Mobile collapses everything to one column at `4:3`.

### 4.6 Project text section (editorial spread)

A standalone "breath" between two media rows on a project page. Two-column, all left-aligned, 50/50 split, edge-to-edge with the surrounding images. The hero pitch lives in the left column, the structured argument in the right.

```html
<section class="project-text">
  <div class="project-text__left">
    <h2 class="project-text__lead">…big editorial statement…</h2>
    <p class="project-text__subhead">…one-line supporting hook…</p>
  </div>

  <div class="project-text__right">
    <h3 class="project-text__section-title">
      <span class="project-text__num">01</span>
      <span class="project-text__label">Overview</span>
    </h3>

    <div class="project-text__body">
      <p>…first body paragraph…</p>
      <p>…continuation…</p>
      <p>…final beat…</p>
    </div>

    <p class="project-text__tagline">
      Closing kicker. Italic.<br>
      Manifesto cadence.
    </p>
  </div>
</section>
```

#### Layout

- **`grid-column: 1 / -1`** — spans the full project-grid width. Never set its own `max-width`; the page's images sit edge-to-edge and so must this section.
- **`grid-template-columns: 1fr 1fr`** — strict 50/50. Don't drift to 5/6 etc; the symmetry is part of the editorial pattern.
- **Vertical padding**: `calc(var(--s-500) * 2)` top, `calc(var(--s-500) + var(--s-400))` bottom (~10rem / 9rem). The generous breathing room is what makes it "standalone" rather than "inserted between two cards." Don't reduce.
- **Column gap**: `calc(var(--s-500) + var(--s-100))` (~6rem).
- **`align-items: start`** — both columns hang from the top edge.

#### Type tiers (component-local override of the global scale)

This is the **one place** on the site that introduces display sizes larger than the page wordmark. Treat it as a deliberate "editorial moment"; don't reuse these sizes elsewhere.

| Tier | Element | Size (clamp) | Weight | Color | Notes |
|---|---|---|---|---|---|
| **Lead** | `.project-text__lead` | `clamp(2.025rem, 4.86vw, 3.285rem)` ~32–52px | 400 | `--c-text` | Negative letter-spacing `-0.025em`, line-height 1.05 for tight display rhythm. |
| **Subhead** | `.project-text__subhead` | `clamp(1.05rem, 1.42vw, 1.26rem)` ~17–20px | 350 | `--c-text-muted` | Light weight, sits under the lead. |
| **Section title** | `.project-text__section-title` | `clamp(1.42rem, 2.23vw, 1.86rem)` ~23–30px | 400 | mixed | Flex+baseline: `__num` (muted) + `__label` (full, weight 500). Tabular numerals. |
| **Body** | `.project-text__body p` | `clamp(1.1rem, 1.3vw, 1.26rem)` ~18–20px | 400 | `--c-text-muted` | Paragraph spacing `var(--s-050)` (8px) so multiple paragraphs read as one block. |
| **Tagline** | `.project-text__tagline` | `clamp(1.17rem, 1.62vw, 1.42rem)` ~19–23px | 400 italic | `--c-text` | Thin top hairline (`color-mix(--c-text 14%, transparent)`) + italic = "kicker." |

#### Rules

- **Hierarchy by size + color, not weight chaos.** Only three weights (350, 400, 500) across five tiers.
- **No centering.** Everything in this section is left-aligned by design. The visual symmetry comes from the 50/50 grid, not from centered text.
- **Body paragraphs sit tight** (`var(--s-050)` between them). Three short paragraphs should feel like one continuous thought.
- **Tagline always italic** with a thin hairline above it. That's the "closing kicker" convention.
- **Mobile (`max-width: 800px`)**: collapses to single column with reduced (but still standalone-feeling) padding `calc(var(--s-500) + var(--s-300))` top / `calc(var(--s-500) + var(--s-100))` bottom.

---

## 5. Theme system

- **Default**: dark mode (no class on `<html>`).
- **Toggle**: clicking the dock action button toggles `theme-light` on `<html>` and writes the choice to `localStorage.theme`.
- **Persistence across pages**: each HTML file has an inline script in `<head>` that reads `localStorage.theme === 'light'` *before* the stylesheet loads, applying the class with no flash.

When adding new pages: **copy the inline `<head>` script** from any existing page so theme persistence works.

### Adding new themed colors

If a color needs to flip between modes, add the override under `:root.theme-light`:

```css
:root.theme-light {
  --c-background: #ffffff;
  --c-text: #000000;
  /* …add new override… */
}
```

Most existing components reference semantic tokens (`--c-text`, `--c-background`, `--c-text-muted`), so they flip automatically.

---

## 6. Motion

### 6.1 Principles

- **Easings**: prefer `cubic-bezier(0.7, 0, 0.4, 1)` (slow-start, fast-end) for entrances and `cubic-bezier(0.4, 0, 0.2, 1)` (smooth ease-in-out) for transitions. Avoid linear.
- **Theme transition**: `transition: background-color 0.3s ease, color 0.3s ease` on `body` — keep at 300ms; faster feels jarring, slower feels laggy.
- **Card hover**: `transform: scale(1.015)` on `.card__media > *`, 0.6s. Subtle; the only "interactive" motion in the static UI.
- **Reduced motion**: any heavy animation must respect `@media (prefers-reduced-motion: reduce)`.

### 6.2 The CompassStu intro (reference example)

`compass-intro.html` is a self-contained motion sequence broken into 10 named phases (see file header). Pattern conventions:

- **Each phase has a clear name + start time** in the leading comment block — replicate this structure for any new motion piece so timing edits stay legible.
- **Loop via reload**: at the end of the script, `setTimeout(() => location.reload(), 11000)` — full clean restart of every CSS animation + canvas state. Simpler than reset logic.
- **Color**: stays in the platform's purple system (`--accent2: #b285ff`) except for the **Impact** phase, which uses warm/electric multi-color (yellow → orange → magenta → cyan) as a deliberate punch.

### 6.3 Embedding motion in cards

Always use an `<iframe>` for self-contained motion HTML (own CSS / scripts). Avoid inlining — keeps styles isolated, and CSS variables don't leak between the parent page and the embedded animation.

---

## 7. File structure & conventions

```
Personal Website/
├── index.html              # home (intro + project grid)
├── compasstu.html          # CompassStu detail
├── sats.html               # SATS Cargo Loading Simulation
├── project-3.html          # Atelier
├── project-4.html          # (placeholder)
├── writing.html            # Writing index
├── compass-intro.html      # iframe-embedded motion (intro card)
├── compass-motion.html     # iframe-embedded motion (project page hero)
├── styles.css              # all styles (single file by design)
├── script.js               # all scripts (single file by design)
├── design-guidelines.md    # this file
├── Images/
│   ├── Atelier.png
│   ├── Atelierfull.png
│   ├── CompassStu1.png     # hero screenshot
│   ├── CompassStu2.png     # detail A
│   └── CompassStu3.png     # detail B
├── Video/
│   ├── CompassStulearn1.mp4  # full-width row 2 video
│   └── SatsApron1.mp4         # project-2 card loop
├── compassstulogo.png
└── CompassStufavicon (1).png
```

### Conventions

- **One stylesheet, one script** — keep both flat. If `styles.css` grows past ~1000 lines, consider splitting by component, but prefer keeping it monolithic for now.
- **Project page naming**: `project-N.html` (sequential). Card `N` on the index links to `project-N.html`.
- **Image paths**: store in `/Images/` (capitalized). Use percent-encoded URLs in `src` if the filename has spaces.
- **Video paths**: store in `/Video/`. Prefer renaming uploaded files to short, lowercased, hyphen-separated names (e.g. `cargo-loop.mp4`) instead of leaving the YouTube-export filename.
- **Comments**: in CSS, leading block comments explain *why* (the design intent, the constraint, what the trade-off is). Reserve them for non-obvious decisions; don't comment self-explanatory rules.

---

## 8. Quick checklist for new work

When adding a new card / page / component, verify:

- [ ] Uses existing color tokens (no raw hex)
- [ ] Uses spacing scale tokens (no raw px for margins/padding > 4px)
- [ ] Aspect ratio set via `--ratio` (not hardcoded `aspect-ratio`)
- [ ] Text inherits color (no `color: var(--c-text)` unless necessary)
- [ ] Theme persistence script in `<head>` (for new pages)
- [ ] Dock matches the standard pattern (`Work / Writing / About` + theme toggle)
- [ ] Mobile reflows correctly (≤600px breakpoint tested)
- [ ] Motion respects `prefers-reduced-motion`
