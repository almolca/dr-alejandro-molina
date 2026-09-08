# Brand & Authority Asset Requirements

Current state after R4.3 — 2026-09-07. This replaces obsolete R2/R3 verification and placement notes.

## Published owner-confirmed authority

- **Top Doctors Spain 2020** and **Doctoralia Awards Spain 2022** use exactly these titles in `doctor.awards`, with `ownerConfirmed: true` and `publishReady: true`. No category, ranking or further verification gate is required.
- **Contributor to Men's Health Spain** is public through `editorialContributions`. No additional outlet, article, date, partner status or adviser role is asserted.
- FEBU, 15+ years in Urology, 500+ Penile Girth Enhancement procedures, experience since 2018, Medical Trainer, AndroMax Training, and training of urologists and aesthetic physicians remain public.
- Home has compact authority and recognition; About has a prominent three-part Professional Recognition, Editorial / Media and Medical Education section.

## Approved branding

`public/brand/logo-full-transparent.png` is the primary header/footer identity through `BrandLogo`. It derives from the approved `logo-full.png`: only near-white background alpha was removed; all original RGB channels and the 1536×1024 canvas are preserved. No CSS blending or filters are used. The symbol is reserved for favicon contexts. The full logo is not repeated in body sections.

Official Top Doctors, Doctoralia and Men's Health logo assets have not been supplied. Their confirmed names render as typography. Existing media entries support a logo asset for later replacement; no logos have been fabricated.

## Photography — awaiting owner-approved assets

`src/config/photography.ts` defines nine positions: Home hero/clinical; About portrait/consultation/training; Girth clinical/consultation; Male Aesthetics clinical; Men's Health consultation. `PhotoFrame` uses responsive neutral surfaces with no visible placeholder text. Each slot remains `src: null`, `approved: false`; adding an approved local `/images/` asset activates its image with configured alt text.

The unapproved AI doctor images and marketing mockups in `public/brand/` remain unused, as instructed by the owner. No stock or synthetic physician photography was introduced. See also `MEDIA_REQUIREMENTS.md` for asset guidance.

## Optional data still absent

| Item | Current state |
|---|---|
| Dated media articles/interviews | Empty; require real title, outlet, year, type and URL |
| Official recognition/outlet logos | Not supplied; clean typography already public |
| Patient review profile | Unset; no invented URL, rating or review count |
| AndroMax Training URL | Unset; program name and training role already public |

These optional assets do not block publication of the owner-confirmed recognitions or contribution.
