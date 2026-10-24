import SpecularButton from './SpecularButton';
import './BulkStudio.css';

const content = {
  scope: {
    title: 'A clear scope. A better start.',
    intro: 'Before production, we agree on what is being made, when you will review it, and what the handover includes.',
    sections: [
      ['Your design batch', 'Your quote lists original designs, adaptations, carousel slides, and any motion items. Quantities from different formats are not interchangeable unless agreed. Brand, print, and one-off campaign projects can be quoted separately.'],
      ['Timing and feedback', 'Delivery dates depend on the agreed brief, complexity, supplied assets, and review schedule. Revisions refine the agreed direction; a new brief or extra deliverable requires a scope check.'],
      ['Final files', 'The quote identifies export formats, any editable source files, and any third-party font or image licenses. Physical printing, posting, account management, and media buying are not included in the listed design packages.'],
      ['Payment and renewal', 'Accepted payment methods, payment timing, renewal pricing, pause requests, and unused-work arrangements are confirmed in writing before an order is accepted.'],
      ['Your content', 'You provide or approve the business information, text, and images for your campaign. Copywriting, Bangla artwork, translation, and proofreading are scoped explicitly.']
    ]
  },
  privacy: {
    title: 'Your brief stays yours.',
    intro: 'Here is how the inquiry tool on this website works.',
    sections: [
      ['While you write', 'The form builds a draft in the current browser page. It does not submit your brief to a website database. Reloading the page clears the draft.'],
      ['When you send', 'Opening the email link passes the draft to your email application. You review and send it there. Copy draft places the text on your clipboard only when you choose that action. Your email provider handles the message when you send it.'],
      ['Website requests', 'Your browser requests website files from the hosting service and may request the scrolling library from unpkg.com. These services receive the network information needed to serve those files. The portfolio may retain your scroll position in session storage so you can return to your place.'],
      ['Contact', 'For questions about information you send to Design Daily, email julkarnine.arabi@gmail.com. Avoid including sensitive personal information in a first project brief.']
    ]
  }
};

export default function StudioInfo({ type }) {
  const page = content[type];
  return <div className="studio-info-page"><section className="bulk-section studio-info" aria-labelledby="info-title"><a href="/" className="info-back">← Back to Design Daily</a><span className="bulk-kicker">{type === 'scope' ? 'Working together' : 'Inquiry privacy'}</span><h1 id="info-title">{page.title}</h1><p className="info-intro">{page.intro}</p><div className="info-details">{page.sections.map(([title, text], i) => <details key={title} open={i === 0}><summary>{title}<span aria-hidden="true">+</span></summary><p>{text}</p></details>)}</div><SpecularButton radius={999} size="md" lineColor="#ff4c42" onClick={() => { window.location.href = '/#contact'; }}>Discuss your project ↗</SpecularButton></section></div>;
}
