# Design Daily — Modern Agency Website

> The official digital home of **Design Daily Studio** — category-defining brand identities, modern websites, structural packaging, and digital experiences for high-growth tech founders, D2C creators, and modern enterprises.

---

## ✦ Core Design Architecture & Philosophy

The site follows the 8-section unified homepage brief designed to wow visitors with rich aesthetics, oversized typography, tactile studio artifacts, and deterministic frontend precision:

1. **Opening (Hero)**: High-impact condensed statement *"Good design. Every day."* with tactile agency stamp, live studio availability badge, and direct calls to action.
2. **Selected Work (Dark Gallery)**: Immersive architectural dark chapter (`#121316`) highlighting flagship case studies:
   - **Tripty** — Ethical luxury lifestyle identity, pattern architecture, and digital flagship.
   - **All Organics** — Modern apothecary packaging system, botanical patterns, and e-commerce storefront.
   - **Sandbox Lounge** — Upscale cocktail sanctuary identity, tactile gold-foil stationery, and spatial signage.
   - *Studio Repertoire Archive*: Featuring **Atuendo**, **Norea**, **Finn Unboxing**, and **Zaro Beverage**.
3. **Services (3D Spatial Stage)**: An immersive 3D scroll experience where the official **Design Daily 3D Logo** (`DEsigndaily-3D-Logo.glb`) sits at the center, rotating smoothly on scroll with studio lighting and mouse tilt, while interactive service cards with authentic project snapshots appear dynamically from both sides.
4. **Process**: Interactive 4-step synchronizer (*01 Brief & Audit*, *02 Design & Explore*, *03 Refine & Test*, *04 Deliver & Launch*) linking strategic timelines with real artifacts.
5. **Craft (The Detail Layer)**: Interactive Before/After slider demonstrating mathematical geometry and concentric arc construction on the **Norea** logo mark (`norea-construction.jpg` vs. `norea-logo.jpg`).
6. **Studio & Philosophy**: Human studio voice emphasizing senior-only talent, direct founder access, fixed milestones, and enduring design systems.
7. **Questions (FAQ)**: 5 accessible accordion items detailing project durations, master deliverables, web engineering capabilities, and payment terms.
8. **Contact & Footer**: Signature coral chapter (`#FF4C42`), elevated white glass inquiry card with client-side validation, service selection chips, and click-to-copy direct email (`julkarnine.arabi@gmail.com`).

---

## ✦ Design System Tokens

| Token | Production Value | Role |
|---|---|---|
| **Primary Brand Coral** | `#FF4C42` | Hero accents, primary buttons, status badges, contact chapter |
| **Deep Brand Charcoal** | `#343545` | Secondary text, borders, dark cards, tactile stamp line |
| **Dark Gallery Background** | `#121316` | Selected Work chapter background |
| **Light Canvas** | `#FAF9F6` | Warm ivory background for daytime sections |
| **Pure White** | `#FFFFFF` | Elevated cards, forms, and crisp surfaces |
| **Soft Blue Canvas** | `#F0F4FA` | Quiet chapter background for Process |
| **Display Font** | `Barlow Condensed` (600–900) | Oversized headlines, numbers, kickers, and buttons |
| **Body Font** | `Source Sans 3` (400–700) | Editorial copy, metadata, form fields, and labels |

---

## ✦ Performance, Motion & Accessibility

- **Lenis Smooth Scroll Engine**: Integrated lightweight Lenis v1.1.20 smooth scrolling engine for buttery 60fps inertial scrolling and synchronized anchor navigation.
- **Zero Heavy Framework Bloat**: Pure semantic HTML5 + Vanilla CSS3 + Modern ES6 JavaScript (< 85KB total footprint including Lenis).
- **Fast First Paint**: Instant static SVG logo rendering with zero 3D loading delays.
- **100% WCAG 2.2 AA Compliance**: High-contrast ratios, visible keyboard focus indicators, logical tab ordering, ARIA labels, and `prefers-reduced-motion` fallbacks (automatically disables Lenis on reduced motion preferences).
- **Fluid Responsiveness**: Calibrated for desktop (1440px+), laptop (1024px), tablet (768px), and mobile (390px).

---

## ✦ Asset Provenance

All imagery placed across this website originates from authentic staged assets in `assets/`:
- **Agency Identity**: `agency-logo.svg`, `agency-icon.svg`, `agency-sketch.png`.
- **Client Projects**: `tripty-cover.png`, `all-organics-cover.png`, `sandbox-cover.png`, `atuendo-cover.png`, `norea-cover.png`, `finn-packaging.png`, `zaro-bottle.png`.
- **Craft Verification**: `norea-construction.jpg` & `norea-logo.jpg`.

---

## ✦ Local Development & Preview

To preview the website locally with any static file server:

```bash
# Using Python
python -m http.server 8000

# Or using Node.js / npx
npx serve .
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

---

© 2026 Design Daily Studio. All rights reserved.
