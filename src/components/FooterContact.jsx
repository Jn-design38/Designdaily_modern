import React, { useState } from 'react';
import Magnet from './Magnet';
import GradualBlur from './GradualBlur';

export default function FooterContact({ theme }) {
  const isDark = theme === 'studio';
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard?.writeText('julkarnine.arabi@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <>
      <footer className="site-footer" id="contact">
        <div className="footer-inner">
          <div className="footer-brand-col">
            <span className="dock-monogram">DD</span>
            <div className="footer-quote">
              "Good design. Every day.<br />From your first impression to your next post."
            </div>
            <p className="footer-copy">
              © {new Date().getFullYear()} Design Daily Studio. Founded & Directed by Julkarnine Arabi.
            </p>
          </div>

          <div className="footer-contact-col">
            <div className="telemetry-coord">
              <span>[DIRECT TELEMETRY ACCESS]</span>
            </div>

            <Magnet padding={50} magnetStrength={2.5}>
              <button
                type="button"
                onClick={copyEmail}
                className="footer-email"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                title="Click to copy email address"
              >
                julkarnine.arabi@gmail.com {copied ? '✓ (Copied)' : '📋'}
              </button>
            </Magnet>

            <div style={{ display: 'flex', gap: '14px', marginTop: '10px' }}>
              <Magnet padding={40} magnetStrength={3}>
                <a
                  href="https://wa.me/8801700000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary-magnetic"
                >
                  <span>WhatsApp Inquiry</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </Magnet>

              <Magnet padding={40} magnetStrength={2}>
                <a
                  href="mailto:julkarnine.arabi@gmail.com?subject=Design%20Daily%20Project%20Inquiry"
                  className="btn-primary-magnetic"
                >
                  <span>Send Project Brief</span>
                  <span aria-hidden="true">→</span>
                </a>
              </Magnet>
            </div>
          </div>
        </div>
      </footer>
      <GradualBlur
        position="bottom"
        target="page"
        height="4rem"
        layers={8}
        strength={1.5}
        tint={isDark ? 'rgba(9, 10, 11, 0.7)' : 'rgba(250, 248, 245, 0.7)'}
        zIndex={999}
      />
    </>
  );
}

