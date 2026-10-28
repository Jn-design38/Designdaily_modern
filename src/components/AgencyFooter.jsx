import { Arrow } from './Icons';
import { studioEmail } from '../data/packages';
import './AgencyFooter.css';

function OfficialWordmark() {
  return (
    <svg className="agency-footer__wordmark" viewBox="88 116 224 156" role="img" aria-label="Design Daily">
      <image href="/agency-wordmark.svg" width="400" height="400" />
    </svg>
  );
}

export default function AgencyFooter() {
  return (
    <footer className="agency-footer">
      <div className="agency-footer__inner">
        <div className="agency-footer__lead">
          <a href="/#home" className="agency-footer__brand" aria-label="Design Daily home"><OfficialWordmark /></a>
          <div className="agency-footer__invitation">
            <p>One recognisable brand.<br />Everywhere you show up.</p>
            <a href="/#contact">Start a project <Arrow diagonal /></a>
          </div>
        </div>
        <div className="agency-footer__directory">
          <div className="agency-footer__studio">
            <img src="/agency-icon.svg" alt="" width="42" height="42" />
            <p>Independent graphic design studio founded by <strong>Julkarnine Arabi</strong>.</p>
            <span>Dhaka, Bangladesh · Working worldwide</span>
          </div>
          <nav aria-label="Explore Design Daily"><span>Explore</span><a href="/work">All work</a><a href="/#packages">Packages</a><a href="/scope">Working together</a></nav>
          <nav aria-label="Contact and policies"><span>Contact</span><a href={`mailto:${studioEmail}`}>Email the studio</a><a href="/privacy">Inquiry privacy</a><a href="#top">Back to top <span aria-hidden="true">↑</span></a></nav>
          <div className="agency-footer__email"><span>Studio direct</span><a href={`mailto:${studioEmail}`}>{studioEmail}</a><p>Share the rough version. We will help shape the scope.</p></div>
        </div>
        <div className="agency-footer__base">
          <span>© {new Date().getFullYear()} Design Daily. All rights reserved.</span>
          <div className="agency-footer__credits" aria-label="Icon credits"><a href="https://thenounproject.com/icon/ai-6480915/" target="_blank" rel="noreferrer">AI icon · Palash Jain / Noun Project</a><a href="https://www.flaticon.com/free-icon/layers_5857869" target="_blank" rel="noreferrer">Layers icon · Hazicon / Flaticon</a></div>
          <span>Good design. Every day.</span>
        </div>
      </div>
    </footer>
  );
}
