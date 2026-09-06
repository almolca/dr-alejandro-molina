# Dr. Alejandro Molina — UAE Website

Personal-brand website for Dr. Alejandro Molina, Consultant Urologist &
Andrologist, Abu Dhabi. Next.js 16 (App Router), TypeScript, Tailwind
CSS v4, Motion.

- **Product/UX/technical spec:**
  `DR_ALEJANDRO_MOLINA_UAE_WEBSITE_MASTER_SPEC.md` — authoritative for
  positioning, site map, copy rules, SEO, compliance and QA gates. Read
  this before making changes.
- **Implementation status:** `IMPLEMENTATION_REPORT.md` — what's built,
  verification results, and every unresolved placeholder / owner
  decision required before launch.

## Development

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm run lint
npm run build
```

## Before touching content or claims

Every credential, treatment-availability claim, and regulatory
statement on this site must come from verified source material or
explicit owner sign-off — see spec §41 and the compliance checklist in
spec §28. Do not add copy, images, or routes that aren't already
justified by the spec or an owner instruction.
