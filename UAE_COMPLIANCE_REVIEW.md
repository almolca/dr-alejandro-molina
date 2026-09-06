# UAE Health Advertising / Regulatory Compliance Review

**Purpose:** a working audit against spec §28's compliance checklist
and general UAE/Abu Dhabi health-advertising caution, organized by the
specific topics this phase named. **This is not a legal or regulatory
opinion.** No qualified DoH/legal compliance review has been performed
— this document exists to hand a reviewer a structured starting point,
and to flag where this build made a deliberately cautious choice
because a fact wasn't confirmed, rather than assuming the more
permissive interpretation. Per this phase's explicit instruction: this
review does not attempt to find or exploit regulatory ambiguity.

**Spec §28 checklist, status:**

- [ ] credentials verified — not done (no compliance/HR process exists to verify against; `doctor.ts` credentials are sourced from spec text + explicit owner-supplied additions, see `IMPLEMENTATION_REPORT.md` Phase 4)
- [ ] facility affiliation verified — not done (NMC URLs confirmed by owner in Phase 4, but the affiliation *relationship* itself — employment vs. visiting privileges vs. other arrangement — has not been independently verified)
- [ ] treatment availability verified — not done, and this is the single biggest open item (see "Treatment availability" section below)
- [ ] treatment claims reviewed — this document is the starting point, not the completion, of that review
- [ ] before/after policy reviewed — no before/after imagery exists on the site (see below)
- [ ] testimonials policy reviewed — no testimonials exist on the site (see below)
- [ ] aesthetic imagery reviewed — no real imagery exists yet; all placeholders (see `MEDIA_REQUIREMENTS.md`)
- [x] PRP advertising reviewed — reviewed and kept disabled, see below
- [ ] HA / penile enhancement wording reviewed — drafted restrained per spec §13/§14, not yet reviewed by compliance
- [ ] booking links approved — the *URLs* are confirmed (Phase 4), but whether the booking flow itself meets any DoH requirements for online health-service booking has not been assessed
- [ ] legal disclaimer reviewed — `/medical-disclaimer` exists as a draft (Phase 4), not legally reviewed

---

## Topic-by-topic audit

### Penile implant surgery
Framed as a surgical option for "severe or refractory" ED, only after
other treatments haven't worked — matches spec §8's positioning
exactly. No outcome guarantees, no satisfaction claims, no "permanent
cure" language (checked against the actual copy in
`CLINICAL_CONTENT_REVIEW.md`). **Risk:** standard surgical procedure
advertising for a hospital-affiliated physician; lower regulatory risk
than the aesthetic-adjacent pages below, but device-specific claims
(inflatable vs. malleable mechanism descriptions) should be confirmed
against whichever manufacturer/device this practice actually uses.

### Erectile dysfunction
General diagnosis-and-treatment-ladder framing. Lower risk — this is
mainstream urological content, not close to any enhancement/aesthetic
regulatory boundary. **Watch item:** the treatment ladder names
specific modalities (PDE5 inhibitors, ICI, shockwave) that each carry
their own separate regulatory/prescribing considerations; each is
already covered on its own page or flagged below.

### Testosterone
Explicitly and repeatedly distances itself from bodybuilding/
performance-enhancement framing (spec §9's specific requirement) —
checked against the actual copy, present in 2 places (hero-adjacent
copy and an explicit FAQ). This is the single clearest anti-misuse
safeguard on the site and should stay exactly this explicit through any
future edits. Lower regulatory risk otherwise — standard hormonal
health messaging.

### Shockwave therapy
**Highest evidence-sensitivity item on the site.** Li-SWT sits in a
regulatory grey zone in many jurisdictions specifically because
device-based ED therapies have historically been over-promised
("regenerative," "cures ED without medication") by some providers.
This build's copy explicitly states evidence is "still evolving,"
response "is not guaranteed," and it is "not offered as a stand-alone
cure" — the forbidden-phrase list in spec §11 (regenerative cure,
permanent cure, guaranteed response, cure without medication,
stem-cell-like language, universal treatment claims) was checked
against the actual page and none of those phrases appear. **This page
specifically should be one of the first a compliance reviewer reads in
full**, given how commonly this treatment category attracts regulatory
attention elsewhere.

### Male genital aesthetics / penile girth enhancement / hyaluronic acid / scrotal lift
**Highest compliance-attention cluster on the site**, per spec §13/§14
themselves. Findings:
- No sensational language found (checked against spec's specific
  forbidden list: "bigger penis," "instant enlargement," "guaranteed
  increase," "best penile filler" — none appear).
- No exact size-gain figures are published anywhere; the Girth
  Enhancement page has a dedicated section explaining *why* not,
  rather than silently omitting numbers.
- **Owner-confirmed 2026-09-04, previously an open question:** the two
  current priority Male Genital Aesthetics services are penile girth
  enhancement (hyaluronic acid) and scrotal lift (scrotal aesthetic
  surgery). `/male-aesthetics` and
  `/male-aesthetics/penile-girth-enhancement` were updated to present
  these as confirmed featured services rather than generically hedged
  options, and a new page, `/male-aesthetics/scrotal-lift`, was built
  to the same restraint standard as the rest of the site (no crude or
  sexualized terminology, no outcome guarantees, explicit scarring/
  recovery/limitations discussion). This resolves the open item from
  the previous review — a compliance reviewer's task here is now to
  confirm the *wording* is acceptable, not to first establish whether
  the services exist.
- Any surgical aesthetic option *beyond* these two confirmed services
  still uses the original "considered only where appropriate and
  approved" hedge, since availability of anything further remains
  unconfirmed.

### Before/after imagery
**None exists on this site.** No before/after images have been added,
generated, or even placeholder-slotted for on any page. If before/
after imagery is wanted later, it needs its own compliance policy
decision first — UAE health-advertising rules on before/after
photography (especially for aesthetic procedures) are a common
enforcement area, and this is flagged here specifically so it isn't
added later without that step.

### Testimonials
**None exist on this site**, and none were built into the design
system — no testimonial section, card pattern, or schema exists
anywhere in the codebase. Spec §25 explicitly prohibits fabricating
`aggregateRating`/reviews, and this build went further by not building
a testimonials *feature* at all, real or placeholder, since testimonial
policy for medical/aesthetic advertising in the UAE needs its own
compliance decision before any such feature is designed.

### Treatment outcomes
No specific outcome percentages, success rates, satisfaction rates, or
case volumes appear anywhere on the site — confirmed by the
`CLINICAL_CONTENT_REVIEW.md` audit above. Every outcome-adjacent
statement uses hedged language ("may," "can," "in selected patients,"
"individual results vary") per spec §29.

### Promotional wording
Spec §36's "GOOD"/"BAD" copy examples and the sitewide forbidden-word
list (guaranteed, permanent cure, risk-free, best, leading,
revolutionary, "restore masculinity," instant results) were checked
against the full text of all 10 clinical pages and 5 articles during
writing and again during this review. None of the forbidden terms
appear. CTA wording is limited to "Book a Consultation" / page-specific
variants ("Book an ED Assessment," "Book a Male Fertility
Consultation," "Book a Specialist Assessment") — no "Buy Now," "Reserve
Treatment," or similar commerce-style language anywhere (spec §26).

### PRP / P-Shot
**Confirmed disabled and untouched this phase.** `features.prpPage` is
`false` in `src/config/features.ts`. Verified directly, not assumed —
every reference to it in the codebase, in full:

```
$ grep -rn "prpPage\|/prp" src/
src/config/features.ts:17:  prpPage: false,
src/config/navigation.ts:53:  ...(features.prpPage
src/config/navigation.ts:54:    ? [{ label: "PRP", href: "/erectile-dysfunction/prp" }]
src/lib/seo/routes.ts:78:  ...(features.prpPage
src/lib/seo/routes.ts:79:    ? [{ path: "/erectile-dysfunction/prp", status: "planned" as const, priority: 0.5 }]
```
(Re-verified 2026-09-04, after this round's Male Genital Aesthetics
route changes shifted `routes.ts` line numbers — output unchanged in
substance, PRP remains fully disabled.)

Both the nav entry and the sitemap/routes entry are gated behind the
same `false` flag — with it off, neither the conditional nav array nor
the conditional routes array entry is ever constructed. No route
exists at `/erectile-dysfunction/prp` (confirmed against the actual
`next build` route list). No metadata, no promotional copy anywhere.
The current public NMC profile
reportedly lists PRP among Dr. Molina's interests (spec §39) — per
spec §12's explicit instruction, that institutional reference does not
by itself authorize an independent personal-website PRP page, and this
build has not treated it as doing so.

---

## Items that should not go live without explicit compliance approval

Collected in one place for a reviewer:

1. **Male Genital Aesthetics / Penile Girth Enhancement / Scrotal Lift
   content** — availability is now owner-confirmed (2026-09-04); a
   reviewer's task is to sign off on wording, risk disclosure and scar/
   recovery framing for the new Scrotal Lift page specifically, since
   it hasn't had a compliance pass yet.
2. **Male Fertility's surgical sperm retrieval and fertility-clinic
   collaboration language** — owner-confirmed 2026-09-04: not offered
   directly, no clinic named or implied. `/male-fertility` was rewritten
   accordingly (same item resolved in `CLINICAL_CONTENT_REVIEW.md`); a
   reviewer's task is to confirm the educational-only framing of
   surgical sperm retrieval doesn't read as an offered service.
3. **Shockwave therapy page** — evidence-framing language specifically,
   given this modality's regulatory sensitivity elsewhere.
4. **Facility affiliation representation** — confirm the JSON-LD
   `hospitalAffiliation`/`worksFor` modeling (Person/Physician schema
   representing Dr. Molina as *affiliated with* NMC, not owning it) is
   the legally correct way to represent the actual relationship.
5. **The legal pages themselves** (`/privacy`, `/terms`,
   `/medical-disclaimer`) — drafted, not reviewed; see
   `IMPLEMENTATION_REPORT.md` Phase 4 for what they currently say.

**No item in this document was rewritten to make it more permissive
during this phase.** Where the source material didn't confirm a fact
(e.g., whether a specific procedure is actually offered), the copy was
already hedged in Phases 2–4 and stays hedged here — this review's job
was to surface and organize those gaps for a human reviewer, not to
resolve them by guessing in the more convenient direction.
