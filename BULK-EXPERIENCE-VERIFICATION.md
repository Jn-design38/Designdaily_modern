# Bulk-design experience — verification

Reviewed on 24 October 2026, using the isolated branch based on `1beca43`.

## Build and automated checks

- `npm run build`: passed. The production build was served separately on port 4197.
- `npm test`: six tests passed. Coverage includes portfolio asset paths, unchanged package amounts, inquiry selection and optional fields, encoded email headers, and malformed Unicode.
- `git diff --check`: passed.

## Browser checks

Chromium desktop at 1440 × 1000 and responsive viewports of 390 × 844 and 320 × 844 were used. Screenshots were inspected, not just captured.

| Area | Verified behavior |
| --- | --- |
| Approach | Four stages, next/previous controls, content replacement, and keyboard-operated delivery folder |
| Scope | Category changes update artwork and copy; inquiry receives the selected service |
| Campaign batch | Format selection changes the arrangement and explanation |
| Campaign artwork | Every format now loads a dedicated three-image set, with no duplicate image inside any active state |
| Packages | Starter, Growth, and Scale each select the correct inquiry option |
| Inquiry | Required-field validation, draft preview, encoded recipient/subject/body, copy feedback or clipboard fallback, and editing without lost text |
| FAQs | Category switching and answer expansion |
| 3D signature | Optimized GLB loads; Original/Chalk/Graphite controls, rotation, spin/pause, and reset |
| Support pages | `/scope` and `/privacy` render; scope disclosures open; mobile privacy page fits |
| Responsive layout | No horizontal document overflow across the seven checked sections at 390px and 320px |
| Reduced motion | Desk scroll transforms and momentum scrolling are disabled; delivery folder remains usable |
| Failure modes | An intentionally failed GLB request and intentionally unavailable WebGL both show the static logo with unavailable controls disabled; contact remains accessible |

Normal production checks produced no uncaught browser exceptions or HTTP errors. Expected errors were observed only during intentional failure simulation. The normal model was restored afterward.

## 3D asset

The source is the user's `DEsigndaily-3D-Logo.glb`, matching the existing `public/agency-logo-3d.glb` by SHA-256. That original is unchanged.

- Source: 21,059,884 bytes.
- Web derivative: 2,993,072 bytes — **85.79% smaller**.
- Geometry: 143,992 triangles after optimization; conservative geometry error was prioritized over aggressive simplification.
- Meshopt decoder is bundled locally. The section does not request external environment maps or a Draco decoder.
- Viewer and model load near the section, rendering pauses offscreen, pixel density is capped, and continuous spin is opt-in.
- Regenerate with `npm run optimize:logo`; the script verifies source provenance and round-trips the output before writing the derivative.

## Known limitations and release decisions

- Vite reports large chunks: the main application is approximately 541 kB minified and the separately loaded model viewer approximately 1.12 MB. Lazy loading is in place; a real low-end Android/network performance test remains advisable before public release.
- The 3D dependency emits a non-blocking `THREE.Clock` deprecation warning. Supporting pages may emit unused font-preload warnings inherited from the shared document head.
- This is a front-end inquiry flow, not a backend submission service or checkout. Visitors review and send the email themselves. No actual email was sent during verification.
- WhatsApp, payment methods, delivery commitments, renewal rules, source-file entitlements, and customer testimonials were not invented. Commercial terms still require studio confirmation.
- Existing package prices and feature counts, including motion items, are preserved. The old blanket “static-only” claim and exact 50% discount label no longer contradict those packages.
- Hosting must provide the same single-page-app fallback required by the existing `/work/...` routes for `/scope` and `/privacy`.
- No merge into main or production deployment was performed. The original worktree and port 4195 remain separate.

Browser captures and temporary test orchestration live in ignored `.tmp/` and `.playwright-cli/` folders and are regenerable. Component provenance and license are retained in [REACT-BITS-COMPONENTS.md](REACT-BITS-COMPONENTS.md) and [REACT-BITS-LICENSE.md](REACT-BITS-LICENSE.md).

## Immersive Approach revision — 25 October 2026

- Replaced the boxed desk mockup with four original photorealistic cutouts: Brief, Direction, Create, and Deliver. Each committed WebP is 1536 × 1536 with an alpha channel; the source PNGs remain outside Git in `.tmp/approach-source`.
- Added a reproducible `execution/prepare-approach-assets.mjs` pipeline that verifies transparency and source resolution before producing the optimized assets.
- The Approach section now pins for a 3.4-viewport scroll journey on desktop and mobile. Normal scrolling advances all four stages before releasing the next section; stage buttons and previous/next controls navigate to the matching scroll segment.
- React Bits Animated Content handles the changing copy, while image transitions use transform and opacity only. Reduced-motion visitors receive the unpinned, manually controlled layout.
- Browser verification passed at 1440 × 1000, 1024 × 640, and 390 × 844. All four stages activated in order, reverse scrolling restored Brief, the following campaign section became reachable only after the sequence, and the mobile document-width audit returned exactly zero horizontal overflow.
- All images loaded at 1536px intrinsic width. Browser checks reported no page exceptions or failed HTTP responses. The existing font-preload warnings remain non-blocking.
