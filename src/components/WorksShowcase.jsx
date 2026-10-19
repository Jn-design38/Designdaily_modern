import React from 'react';
import FlexCarousel from './FlexCarousel';

export default function WorksShowcase() {
  const caseStudies = [
    {
      src: './assets/tripty-cover.png',
      alt: 'Tripty Luxury Packaging Box with Geometric Ethnic Motifs',
      title: 'Tripty',
      subtitle: 'Cultural Geometry & Packaging Architecture'
    },
    {
      src: './assets/all-organics-cover.png',
      alt: 'All Organics Amber Glass Bottling & Minimalist Botanical Identity',
      title: 'All Organics',
      subtitle: 'Apothecary Identity & Packaging'
    },
    {
      src: './assets/atuendo-cover.png',
      alt: 'Atuendo Luxury Apparel Stationery and Embossed Collateral',
      title: 'Atuendo',
      subtitle: 'Haute Couture Brand System'
    },
    {
      src: './assets/goodybro-cover.png',
      alt: 'GoodyBro High-Impact Vector Streetwear Campaign',
      title: 'GoodyBro',
      subtitle: 'Streetwear & Vector Illustration'
    },
    {
      src: './assets/finn-packaging.png',
      alt: 'Finn Geometric Cardboard Folding Packaging System',
      title: 'Finn Packaging',
      subtitle: 'Structural Dielines & Sustainable Print'
    },
    {
      src: './assets/packaging-showcase.png',
      alt: 'Design Daily Master Packaging Suite and Custom Rigid Boxes',
      title: 'Atelier Packaging',
      subtitle: 'Physical Prototyping & Foil Stamping'
    },
    {
      src: './assets/norea-cover.png',
      alt: 'Norea Architectural Identity and Physical Signage',
      title: 'Norea',
      subtitle: 'Architectural Spatial Identity'
    }
  ];

  return (
    <section className="works-section" id="works" aria-labelledby="works-heading">
      <div className="section-header-row">
        <div className="section-label-group">
          <span className="section-eyebrow">Flagship 16:9 Uncropped</span>
          <h2 className="section-main-heading" id="works-heading">Curated Case Studies</h2>
        </div>
        <div className="telemetry-coord">
          <span>[WEBGL LIQUID LENS SHADER ENGINE]</span>
        </div>
      </div>

      {/* WebGL2 FlexCarousel Stage */}
      <div className="flex-carousel-stage">
        <FlexCarousel
          items={caseStudies}
          preset="liquid"
          intro="rise"
          cardHeight={0.62}
          gap={18}
          radius={8}
          squeeze={0.22}
          focusOnClick={true}
          captions={true}
          autoplay={false}
          style={{ height: '100%', width: '100%' }}
        />
      </div>
    </section>
  );
}

