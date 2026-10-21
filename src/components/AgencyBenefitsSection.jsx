import React from 'react';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import MagicBento from './MagicBento';
import SpecularButton from './SpecularButton';
import { SparklesIcon, Tick02Icon, Key01Icon, GitBranchIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import './AgencyBenefitsSection.css';

// -----------------------------------------------------------------------------
// Card 1: Velocity & Direct Access
// -----------------------------------------------------------------------------
const BENTO_ITEMS_VELOCITY = [
  {
    id: 'velocity-automation',
    label: 'CREATIVE VELOCITY',
    title: '48–72h Delivery Engine',
    description: 'Submit briefs directly via WhatsApp or Figma. Receive production-ready vector logos, social ads, or packaging layouts in 48 to 72 hours.',
    visual: 'automation',
    colSpan: 2,
    rowSpan: 2
  },
  {
    id: 'velocity-collab',
    label: 'FOUNDER-LED CRAFT',
    title: 'Direct With Julkarnine Arabi',
    description: 'Work directly with the studio director. No account manager telephone games, no junior delegates, and rapid iteration via real-time Figma comments.',
    visual: 'collaboration',
    colSpan: 2,
    rowSpan: 2
  },
  {
    id: 'velocity-unlimited',
    label: 'UNLIMITED ITERATIONS',
    title: 'Refined Until 100% Perfect',
    description: 'We iterate until your vision is completely realized. Zero nickel-and-diming or revision friction.',
    icon: <HugeiconsIcon icon={SparklesIcon} size={16} strokeWidth={1.8} />,
    colSpan: 2,
    rowSpan: 1
  },
  {
    id: 'velocity-dedicated',
    label: 'CAPPED STUDIO ROSTER',
    title: 'Dedicated Focus & Bandwidth',
    description: 'We strictly cap active client retainers to 4–5 companies per month to guarantee obsessive craft.',
    icon: <HugeiconsIcon icon={Tick02Icon} size={16} strokeWidth={2.2} />,
    colSpan: 2,
    rowSpan: 1
  }
];

// -----------------------------------------------------------------------------
// Card 2: Predictable Economics & Full IP Ownership
// -----------------------------------------------------------------------------
const BENTO_ITEMS_ECONOMICS = [
  {
    id: 'econ-retainer',
    label: 'PREDICTABLE RETAINERS',
    title: 'Flat Monthly Fee in BDT',
    description: 'Zero hidden scoping fees, surprise hourly invoices, or agency markups. Fixed monthly retainers with pause or cancel flexibility.',
    visual: 'dashboard',
    colSpan: 2,
    rowSpan: 2
  },
  {
    id: 'econ-security',
    label: 'FULL ASSET OWNERSHIP',
    title: '100% Vector IP & Factory Dielines',
    description: 'You own every vector point and dieline. Organized Drive folders with .AI, .EPS, .SVG, and font licensing guidelines.',
    visual: 'security',
    colSpan: 2,
    rowSpan: 2
  },
  {
    id: 'econ-analytics',
    label: 'HIGH CREATIVE OUTPUT',
    title: '24–36 Monthly Social Creatives & Ads',
    description: 'Consistent, high-converting social feeds with static creatives, carousels, and motion graphics delivered on a reliable calendar.',
    visual: 'analytics',
    colSpan: 4,
    rowSpan: 1
  }
];

// -----------------------------------------------------------------------------
// Card 3: Unified Visual Continuity (Brand → Print → Social)
// -----------------------------------------------------------------------------
const BENTO_ITEMS_CONTINUITY = [
  {
    id: 'cont-integration',
    label: 'UNIFIED ECOSYSTEM',
    title: 'Seamless Across All Channels',
    description: 'We connect your Figma brand systems, Shopify storefronts, factory print shops, and social advertising channels into one cohesive identity.',
    visual: 'integration',
    colSpan: 2,
    rowSpan: 2
  },
  {
    id: 'cont-packaging',
    label: 'PHYSICAL MERCH & PACKAGING',
    title: 'Print-Ready Factory Dielines',
    description: 'Industrial-grade packaging layouts with bleed, CMYK color profiles, and printer specifications ready for immediate production.',
    visual: 'collaboration',
    colSpan: 2,
    rowSpan: 2
  },
  {
    id: 'cont-brand',
    label: 'BRAND RECOGNITION',
    title: 'One Recognisable Brand',
    description: 'Your logo, packaging, stationery, and daily social creatives look like they came from the same master design director.',
    icon: <HugeiconsIcon icon={GitBranchIcon} size={16} strokeWidth={1.8} />,
    colSpan: 2,
    rowSpan: 1
  },
  {
    id: 'cont-turnkey',
    label: 'COMMERCIAL CERTAINTY',
    title: 'Zero Disconnected Silos',
    description: 'No more hiring 3 different freelancers who produce mismatched styles. Everything stays strictly on-brand.',
    icon: <HugeiconsIcon icon={Key01Icon} size={16} strokeWidth={1.8} />,
    colSpan: 2,
    rowSpan: 1
  }
];

export default function AgencyBenefitsSection() {
  return (
    <section id="approach" className="benefits-section" aria-label="Benefits of Design Daily over Traditional Agencies">
      <div className="benefits-container">
        {/* Section Header */}
        <header className="benefits-header">
          <div className="benefits-pill-badge">
            <span className="benefits-pill-dot" aria-hidden="true" />
            <span className="benefits-pill-text">DESIGN DAILY VS TRADITIONAL AGENCY</span>
          </div>

          <h2 className="benefits-title">
            Direct craft. High velocity. <br />
            <span className="benefits-title-accent">Zero agency red tape.</span>
          </h2>

          <p className="benefits-subtitle">
            Traditional agencies charge exorbitant hourly fees, delegate your brand to junior interns, and take weeks to deliver.
            Design Daily gives you direct founder access, flat BDT retainers, and 48–72h turnarounds.
          </p>

          {/* Quick Comparison Bar */}
          <div className="benefits-comparison-strip" aria-hidden="true">
            <div className="comparison-metric">
              <span className="metric-agency">Traditional Agency: 3–4 Weeks</span>
              <span className="metric-arrow">➔</span>
              <span className="metric-dd">Design Daily: 48–72h Velocity</span>
            </div>
            <div className="comparison-divider" />
            <div className="comparison-metric">
              <span className="metric-agency">Traditional Agency: Account Managers</span>
              <span className="metric-arrow">➔</span>
              <span className="metric-dd">Design Daily: Direct With Founder</span>
            </div>
            <div className="comparison-divider" />
            <div className="comparison-metric">
              <span className="metric-agency">Traditional Agency: Hourly Billing</span>
              <span className="metric-arrow">➔</span>
              <span className="metric-dd">Design Daily: Flat BDT Retainers</span>
            </div>
          </div>
        </header>

        {/* ScrollStack Component pinning cards as user scrolls */}
        <div className="benefits-scrollstack-wrapper">
          <ScrollStack
            useWindowScroll={true}
            smoothScroll={false}
            stackPosition="12%"
            itemDistance={130}
            itemStackDistance={28}
            itemScale={0.035}
            baseScale={0.88}
            dimAmount={0.22}
            tiltAmount={1.5}
            holdDistance={260}
            className="benefits-scroll-stack"
          >
            {/* Stack Card 1: Velocity & Direct Access */}
            <ScrollStackItem itemClassName="benefits-stack-card card-velocity">
              <div className="stack-card-header">
                <div className="stack-card-meta">
                  <span className="stack-card-index">01</span>
                  <span className="stack-card-tag">VELOCITY & DIRECT ACCESS</span>
                </div>
                <div className="stack-card-versus">
                  <span className="versus-pill versus-pill--agency">
                    Traditional: Account managers & 2-week delays
                  </span>
                  <span className="versus-divider">vs</span>
                  <span className="versus-pill versus-pill--dd">
                    Design Daily: Direct founder craft in 48–72h
                  </span>
                </div>
              </div>

              <div className="stack-card-headline">
                <h3>Work Directly With the Senior Design Director. Assets in 48–72h.</h3>
                <p>
                  No telephone games with junior account handlers. Direct WhatsApp & Figma collaboration with founder Julkarnine Arabi.
                </p>
              </div>

              <div className="stack-card-bento">
                <MagicBento
                  items={BENTO_ITEMS_VELOCITY}
                  columns={4}
                  rowHeight={160}
                  gap={12}
                  radius={16}
                  theme="dark"
                  glowColor="#ff4c42"
                  enableBorderGlow={true}
                  enableSpotlight={true}
                  spotlightRadius={260}
                  clickEffect={true}
                  intro={false}
                />
              </div>
            </ScrollStackItem>

            {/* Stack Card 2: Predictable Economics & Full IP Ownership */}
            <ScrollStackItem itemClassName="benefits-stack-card card-economics">
              <div className="stack-card-header">
                <div className="stack-card-meta">
                  <span className="stack-card-index">02</span>
                  <span className="stack-card-tag">PREDICTABLE ECONOMICS</span>
                </div>
                <div className="stack-card-versus">
                  <span className="versus-pill versus-pill--agency">
                    Traditional: Surprise hourly invoices & scoping fees
                  </span>
                  <span className="versus-divider">vs</span>
                  <span className="versus-pill versus-pill--dd">
                    Design Daily: Flat BDT retainers with pause anytime
                  </span>
                </div>
              </div>

              <div className="stack-card-headline">
                <h3>Transparent Fixed Retainers in BDT. 100% Vector IP Ownership.</h3>
                <p>
                  Predictable monthly subscriptions with zero hidden surprises. Every vector source file, font license, and packaging dieline belongs to you.
                </p>
              </div>

              <div className="stack-card-bento">
                <MagicBento
                  items={BENTO_ITEMS_ECONOMICS}
                  columns={4}
                  rowHeight={160}
                  gap={12}
                  radius={16}
                  theme="dark"
                  glowColor="#f4c64e"
                  enableBorderGlow={true}
                  enableSpotlight={true}
                  spotlightRadius={260}
                  clickEffect={true}
                  intro={false}
                />
              </div>
            </ScrollStackItem>

            {/* Stack Card 3: Unified Visual Continuity */}
            <ScrollStackItem itemClassName="benefits-stack-card card-continuity">
              <div className="stack-card-header">
                <div className="stack-card-meta">
                  <span className="stack-card-index">03</span>
                  <span className="stack-card-tag">VISUAL CONTINUITY</span>
                </div>
                <div className="stack-card-versus">
                  <span className="versus-pill versus-pill--agency">
                    Traditional: Disconnected logo, print, and ad silos
                  </span>
                  <span className="versus-divider">vs</span>
                  <span className="versus-pill versus-pill--dd">
                    Design Daily: One cohesive brand everywhere you show up
                  </span>
                </div>
              </div>

              <div className="stack-card-headline">
                <h3>One Recognisable Brand. From Identity to Packaging to Daily Ads.</h3>
                <p>
                  Complete end-to-end visual harmony. Your logo, retail shelf boxes, and social media feed look like they were born from the same design DNA.
                </p>
              </div>

              <div className="stack-card-bento">
                <MagicBento
                  items={BENTO_ITEMS_CONTINUITY}
                  columns={4}
                  rowHeight={160}
                  gap={12}
                  radius={16}
                  theme="dark"
                  glowColor="#38bdf8"
                  enableBorderGlow={true}
                  enableSpotlight={true}
                  spotlightRadius={260}
                  clickEffect={true}
                  intro={false}
                />
              </div>
            </ScrollStackItem>
          </ScrollStack>
        </div>
      </div>
    </section>
  );
}
