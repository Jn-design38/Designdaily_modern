# Design Daily — Continuous Studio Website

## Bulk-design experience branch

`codex/bulk-design-experience` extends the existing hero and portfolio with an interactive scope selector, four-stage Approach, dimensional campaign preview, package guide, supplied 3D studio logo, categorized FAQs, and a reviewable email-inquiry desk. New supporting routes: `/scope` and `/privacy`. Content remains in English and existing package amounts remain unchanged.

```sh
npm ci
npm run build
npm test
npm run preview:bulk
```

The isolated production preview uses **http://localhost:4197/**, so the original port 4195 can remain running. Start at `/#approach` to see the new process section. The inquiry prepares an email draft, not a server submission. No message is sent until the visitor sends it from their email app.

See [design direction](DESIGN-DIRECTION.md), [React Bits components and sources](REACT-BITS-COMPONENTS.md), and [verification notes](BULK-EXPERIENCE-VERIFICATION.md). The logo derivative is lazy-loaded, approximately 3 MB, and regenerable with `npm run optimize:logo`; its original source stays intact.

The earlier architecture notes below describe the base site's evolution. The branch notes above and the current source are authoritative for the new sections.

> The official digital home of **Design Daily Studio** — an independent, founder-led graphic design studio in Dhaka run by **Julkarnine Arabi**, delivering visual continuity across brand identities, physical merchandise, stationery, print campaigns, and daily social creatives.
>
> **Core Proposition**: *"One recognisable brand. Everywhere you show up."*

---

## ✦ Core Design Architecture & Narrative Flow

The platform is built as an uninterrupted single-page studio exhibition that flows naturally from a dark tactile opening into an expansive white paper canvas:

```text
[#home] Preserved Dark Hero (Poppins + WebGL2 ASCII Horizon + Split PillNav + Static Marquee Ticker)
   ↓
[.hero-to-paper] Smooth Gradient Transition from #0B0C11 into White #FFFFFF Canvas
   ↓
[#works] "One recognisable brand. Everywhere you show up." (Tripty, Noréa, All Organics)
   ↓
[.physical-section] "On the things people see, hold, and wear." (Goodybro & Zaro Merchandise + BounceCards)
   ↓
[.social-section] "Show up with something worth seeing." (Aves, Seor, Tripty Social Creatives)
   ↓
[#capabilities] "Everything your brand needs to show up." (5 Interactive Service Selectors)
   ↓
[#studio] "You bring the business. We bring the design." (4-Step Process: Understand → Design → Refine → Deliver)
   ↓
[#packages] "Our Packages" (Faithful Recreation: Starter 3,500 BDT | Growth 8,999 BDT | Scale 14,999 BDT)
   ↓
[.scale-benefit] "Good design. A clearer direction." (Free Online Business Assessment + Content Calendar)
   ↓
[.faq-section] "A few things you might ask." (Interactive FAQ Accordion)
   ↓
[#contact] "Let’s make your next impression count." (Interactive Scope Builder + Mailto to julkarnine.arabi@gmail.com)
   ↓
[/work] Complete Archive (React Bits Masonry + 8 Discipline Filters + 15 Dedicated Project Case Pages)
```

---

## ✦ Tech Stack & Component Engineering

- **Framework**: [React 19](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- **Typography**: Exclusively **Poppins** (Weights: 400, 500, 600, 700, 800), 100% self-hosted locally under `public/fonts/` with zero Google Fonts CDN requests.
- **Interactive Component Suite**:
  - `GradientASCII`: WebGL2 interactive ASCII matrix horizon with mouse trail and click ripples.
  - `SplitText`: Word-by-word headline entrance animation.
  - `Masonry`: Dynamic masonry layout on the `/work` archive with image aspect ratio calculation and search filtering.
  - `BounceCards`: Physics-based spring fanning card deck for apparel and merchandise.
  - `Magnet`: Micro-interaction cursor attractor on primary call-to-action buttons.
  - `PillNav`: Split glassmorphic navigation pill with scroll spy, dynamic light/dark theming, and responsive mobile drawer.
  - `Lightbox`: Modal image zoom viewer supporting full resolution viewing, keyboard controls (Escape, Arrow keys), and focus restoration.

---

## ✦ Asset Library & Verified Data Model

The studio showcase features 15 real client projects curated from the founder's authentic design archives:

| Project | Discipline | Assets |
|---|---|---:|
| **Tripty** | Brand Identity, Restaurant Interior & Merchandise | 9 WebP |
| **Noréa** | Brand Identity, Stationery & Packaging | 8 WebP |
| **All Organics** | Brand Identity & Packaging Flatlay | 8 WebP |
| **Atuendo** | Brand Identity & Fashion Stationery | 6 WebP |
| **Sandbox Lounge** | Brand Identity, Hospitality Stationery & Signage | 7 WebP |
| **Goodybro** | Apparel Graphics & Merchandise | 7 WebP |
| **Zaro** | Graphic T-Shirts & Streetwear | 6 WebP |
| **AVES Real Estate** | Bilingual Social Campaign Creatives | 4 WebP |
| **Seor Leathercraft** | Axis Bag Campaign | 6 WebP |
| **Tripty Kitchen** | Social Campaign & Promotional Graphics | 5 WebP |
| **Apple Gears** | Advertising & Product Banners | 7 WebP |
| **Finn** | Packaging Archive & Monogram System | 6 WebP |
| **Seor Clutch** | Editorial Leather Goods Campaign | 6 WebP |
| **Seor Baby** | Product Campaign & Feeding Set Graphics | 6 WebP |
| **Sleep Mask** | Minimalist Brand Identity & Social Creatives | 6 WebP |

*Total Image Footprint: 97 WebP images totaling 11.88 MiB. No cover image exceeds 600 KB.*

---

## ✦ Service Packages Specification

Pricing is structured into 3 transparent, static-only packages matching the reference specification:

1. **Starter Package ("Lets, Launch")**:
   - `01 Custom Logo Design`
   - `10–15 Pages Brand Guideline PDF`
   - `04 Social Media Creatives`
   - `01 Social Media Cover Design`
   - Price: **3,500 BDT** *(Standard 7,000 BDT)*
2. **Growth Package ("PRO")**:
   - `24 Social Media Creatives`
   - `04 Carousel Posts (20 designs total)`
   - `Ad Creative Optimization`
   - `Competitor Content Analysis`
   - `Unlimited Revisions`
   - Price: **8,999 BDT** *(Standard 18,000 BDT)*
3. **Scale Package ("Premium")**:
   - `36 Social Media Creatives`
   - `06 Carousel Posts (30 designs total)`
   - `Campaign Creative Concepts`
   - `Advanced Competitor Content Analysis`
   - `Unlimited Revisions`
   - `Dedicated Account Manager`
   - Price: **14,999 BDT** *(Standard 30,000 BDT)*
   - **Exclusive Benefit**: Includes a free online business assessment and a tailored 30-day content calendar.

---

## ✦ Getting Started & Local Development

### Prerequisites
- Node.js >= 18.x

### Installation
```bash
# Install dependencies
npm install
```

### Development Server
```bash
# Starts Vite HMR dev server
npm run dev
```

### Production Build & Preview
```bash
# Compile optimized bundle to dist/
npm run build

# Preview production build locally on port 4195
npm run preview
```

### Automated Verification Tests
```bash
# Runs site integrity tests (route uniqueness, asset existence, package validation)
npm test
```

---

## ✦ Accessibility & Performance Standard

- **100% Keyboard Navigable**: Full Tab, Shift+Tab, and Escape key handling for modal dialogs and dropdown menus.
- **Motion Accessibility**: Honors `prefers-reduced-motion: reduce` by disabling canvas flickers, ticker loops, spring card fanning, and transition durations.
- **Zero CLS (Cumulative Layout Shift)**: Reserved image aspect ratios and dimensions prevent layout jumps during image loading.

---

© 2026 Design Daily Studio • Julkarnine Arabi. All rights reserved.
