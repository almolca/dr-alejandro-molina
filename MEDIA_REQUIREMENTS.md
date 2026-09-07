# Media Requirements

No photographs of Dr. Molina have been generated, sourced, or invented
anywhere in this build — every image slot on the site is a styled,
clearly-labelled CSS placeholder (`components/ui/ImagePlaceholder.tsx`:
a diagonal hairline pattern and an index label), never a fake or stock
photo standing in as if real. This document is the manifest for
replacing those placeholders.

**As of Phase R1-R2**, the detailed per-slot descriptions in this
document are the **only** place this photography intent is written
down — `ImagePlaceholder` no longer renders any caption text on the
live site (it previously did, which real visitors could see; this was
fixed as a P0 launch blocker), only a short generic accessibility
label and the visual surface itself.

**Current wiring, verified by grep, not assumed:** exactly one config
value — `doctor.profileImage` (`src/config/doctor.ts`) — drives every
doctor-portrait placeholder on the site. It's reused in 3 places (Home
hero, Home About section, `/about` page), so **dropping one real
portrait file at the path below updates all three simultaneously** —
"config-driven" is already true for the portrait today, not just a
future promise. The clinical diagram (Penile Implant page) and the
editorial/material texture image (Male Aesthetics, used twice — home
teaser + full page) are currently separate, page-local placeholders
with no shared config value, since spec §18 doesn't call for them to be
the same image, and neither had a natural shared config to slot into
without inventing one for a still-hypothetical asset.

---

## Priority order (per this phase's brief)

### 1. Home hero portrait

| | |
|---|---|
| **Filename** | `public/images/doctor/portrait-hero.jpg` (referenced via `doctor.profileImage.src`) |
| **Used at** | `components/sections/HeroSection.tsx` — right column of the homepage hero |
| **Aspect ratio** | 4:5 on mobile/tablet, 3:4 on desktop (`lg:`) — the component already sets both breakpoints; a single image with roughly 3:4–4:5 headroom works for both crops |
| **Minimum dimensions** | 1200 × 1500px (comfortably covers 2x pixel density at the component's largest rendered size) |
| **Crop guidance** | Portrait orientation, subject positioned with room above the head for the aspect-ratio crop to breathe; avoid tight head-and-shoulders crops that would clip awkwardly when the ratio shifts from 4:5 to 3:4 at the `lg` breakpoint |
| **Alt text intent** | Something like "Dr. Alejandro Molina, Consultant Urologist & Andrologist" — currently `doctor.profileImage.alt` is a placeholder-pending string; update it alongside the file, not before |
| **Desktop/mobile behavior** | `MaskedReveal`-wrapped (the site's panel-wipe reveal-on-scroll), so it animates in once, respecting `prefers-reduced-motion` automatically via the site-wide `MotionConfig` |

### 2. About page portrait

Same file and config value as #1 (`doctor.profileImage`) — no separate
asset required unless a genuinely different, more editorial portrait is
wanted specifically for `/about` (spec §18 lists both a "hero portrait"
and an "optional arms-crossed / editorial portrait" as distinct
options). If a second image is provided, it needs a new config value
added to `doctor.ts` and a one-line change in `about/page.tsx` and
`AboutSection.tsx` to point at it — not a larger refactor.

### 3. Environmental consultation portrait

| | |
|---|---|
| **Filename (proposed)** | `public/images/doctor/portrait-environmental.jpg` |
| **Used at** | Not currently wired into any component — spec §18 item 2, not yet placed on a page. Natural candidates: `/about`'s narrative section (currently text-only, no image), or a future secondary image on `/book`. |
| **Aspect ratio** | 4:5 or 3:4, consistent with the rest of the portrait treatment |
| **Minimum dimensions** | 1200 × 1500px |
| **Crop guidance** | Wider environmental shot (consultation room / office context) rather than a tight portrait — should read as distinct from the hero portrait, not a near-duplicate crop |
| **Alt text intent** | Descriptive of the setting, e.g. "Dr. Alejandro Molina in consultation at NMC Royal Hospital Khalifa City" — only if the setting shown is actually NMC's facility; don't caption it as a specific location that isn't verified |
| **Desktop/mobile behavior** | Not yet designed — a future implementer should reuse the existing `MaskedReveal` + `ImagePlaceholder` pattern rather than inventing a new image-reveal treatment |

### 4. Secondary professional portrait / close-up

| | |
|---|---|
| **Filename (proposed)** | `public/images/doctor/portrait-closeup.jpg` |
| **Used at** | Not currently wired — spec §18 item 4 |
| **Aspect ratio** | 1:1 or 4:5 |
| **Minimum dimensions** | 1200 × 1200px |
| **Crop guidance** | Tighter, more direct professional close-up — distinct in framing from the hero's environmental/editorial feel, useful for smaller contexts (e.g. a future author byline on Insights articles, which currently have none) |
| **Alt text intent** | "Dr. Alejandro Molina" (simple, since context around it should already establish who/why) |
| **Desktop/mobile behavior** | Not yet designed |

### 5. Optional hospital-context image

| | |
|---|---|
| **Filename (proposed)** | `public/images/doctor/hospital-context.jpg` |
| **Used at** | Not currently wired — spec §18 item 5, explicitly marked optional there |
| **Aspect ratio** | 16:9 or 3:2 (wider, environmental) |
| **Minimum dimensions** | 1600 × 900px |
| **Crop guidance** | Must accurately depict NMC Royal Hospital Khalifa City if used — do not use a generic/stock hospital image captioned as if it were this facility (spec §18 explicitly warns against "fake surgery scenes, stock doctors") |
| **Alt text intent** | "NMC Royal Hospital Khalifa City, Abu Dhabi" — only if verified accurate |
| **Desktop/mobile behavior** | Not yet designed |

### 6. Medical / anatomical illustration needs

Two distinct needs, already placeholder-slotted in code today:

| | |
|---|---|
| **Penile Implant device diagram** | `components/sections` via `app/(marketing)/penile-implant/page.tsx` — currently `<ImagePlaceholder index="§8" caption="Clean medical diagram — device placement, for illustration only. Photography/diagram pending." />`. Aspect ratio: square on mobile, 4:5 at `lg`. Should be a clean, clinically accurate line diagram (spec §8: "Use anatomical diagrams only if clinically tasteful and compliant") — commissioned illustration, not a stock medical stock-photo, and should go through the same compliance review as the page's text content (`UAE_COMPLIANCE_REVIEW.md`) before publishing, since an inaccurate or tasteless diagram carries the same risk as inaccurate text. |
| **Male Genital Aesthetics texture/material imagery** | `components/sections/MaleAestheticsSection.tsx` (home) and `app/(marketing)/male-aesthetics/page.tsx` (full page) — currently placeholder-captioned "Editorial / material texture imagery — anatomy-led, not a clinical photograph. No genital close-ups." Aspect ratio 4:5. Per spec §7 Section 6: "No genital close-ups in MVP. Use abstract anatomy, tasteful medical imagery, materials/textures, or portrait/environmental photography." This is intentionally abstract, not a specific clinical photograph — a texture/material or abstract-anatomy image, sourced or commissioned with that brief in mind. |

---

## Favicon / social preview assets

Covered separately — see `IMPLEMENTATION_REPORT.md` Phase 5 "Favicon
and brand assets" for what was actually generated this phase
(`src/app/icon.tsx`, `apple-icon.tsx`, `opengraph-image.tsx`), which are
code-generated typographic marks from the existing design tokens, not
photography, and are explicitly marked temporary.

---

## Brand identity / logo — confirmed final direction (2026-09-04)

The owner has confirmed the direction for the **final** brand identity
that will eventually replace the temporary typographic favicon above.
This is a documented target for a future logo design pass — nothing in
`icon.tsx` / `apple-icon.tsx` / `opengraph-image.tsx` was rebuilt to
this spec this round, consistent with the standing instruction not to
build an elaborate logo system as part of a temporary placeholder.

**Independence requirement:** the identity must work independently of
Dr. Molina's current employer and remain valid if he changes hospital,
emirate or country. It must **not** include NMC, Abu Dhabi, UAE, any
hospital name, or any other geographic reference. (The current
temporary favicon already satisfies this — it is a plain "AM" mark
with no location or institution reference. Note this is distinct from
the site's general content, JSON-LD, and Open Graph location line,
which correctly do reference Abu Dhabi/NMC as factual practice
information — that requirement applies to the *logo mark* specifically,
not to the site's content.)

**Confirmed lockup:**
1. AM monogram
2. "Dr. Alejandro Molina"
3. "CONSULTANT UROLOGIST & ANDROLOGIST" (specialty line)

**Confirmed visual direction:**
- Simplify the AM monogram.
- Exactly one restrained bronze/gold graphical gesture — not more.
- Remove any duplicated decorative curves.
- No literal anatomical symbols.
- No obvious male/fertility iconography.
- Sophisticated enough to read correctly in surgical and institutional
  contexts, not just marketing contexts.
- "Dr. Alejandro Molina" may use a restrained handwritten/signature
  treatment, but only if it stays highly legible and elegant — it must
  read as professional, not like a coach, influencer or beauty-brand
  signature.
- The specialty line stays a clean uppercase sans-serif, unstyled
  beyond that.

**What this means for the current build:** no code change was made
here. When a real logo is designed to this brief, it replaces the
`icon.tsx` / `apple-icon.tsx` / `opengraph-image.tsx` generation logic
(or is supplied as static image files at those routes) — the slots
these files fill are already correct and don't need re-plumbing, only
the mark itself needs to change.

---

## Summary table

| # | Asset | Status | Config-driven today? |
|---|---|---|---|
| 1 | Home hero portrait | Placeholder | Yes — `doctor.profileImage` |
| 2 | About page portrait | Placeholder (same file as #1) | Yes — shares `doctor.profileImage` |
| 3 | Environmental consultation portrait | Not placed on any page yet | No — needs a new config value + a page to place it on |
| 4 | Secondary/close-up portrait | Not placed on any page yet | No |
| 5 | Hospital-context image (optional) | Not placed on any page yet | No |
| 6a | Penile Implant device diagram | Placeholder, page-local | No (page-local placeholder, not shared config — appropriate, since it's the only use) |
| 6b | Male Aesthetics texture image | Placeholder, used in 2 places | Partially — same static caption/index reused, but not a shared config value; could be promoted to one if a 3rd usage appears |
