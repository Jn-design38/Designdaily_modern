import { useId, useState } from 'react';
import { Arrow, Plus } from './Icons';
import './BeforeWeBegin.css';

const questionGroups = {
  'Getting started': [
    ['Can I order a one-off batch?', 'Yes. Share your formats, approximate quantity, and deadline. We will scope a custom batch, or help you choose a monthly package.'],
    ['What should I send with my brief?', 'Your business or social page, brand files if you have them, product images, approved text, and your target date. Tell us if anything is missing so we can plan the work.'],
    ['Is Bangla artwork or copywriting included?', 'Tell us the language your artwork needs. Copywriting, translation, and proofreading are agreed in the scope; they are not automatically included.'],
  ],
  'The design work': [
    ['What counts as one design?', 'An original design, a resize, a variation, and a carousel slide are different tasks. We confirm the counting rule and full deliverables list before accepting your order.'],
    ['How do timing and revisions work?', 'We agree on the brief, review batches, and delivery schedule. Package revisions refine that agreed brief; a new direction or additional deliverable needs a scope check.'],
    ['What about motion, posting, ads, or printing?', 'The displayed packages include specific motion items. Tell us your needs so we can confirm their scope. Posting, account management, media buying, and physical printing are not included in the listed design packages.'],
  ],
  'Files & payment': [
    ['Will I receive editable files?', 'Your scope confirms the editable files and export formats included. Any third-party font, image, or other licensed asset is identified separately.'],
    ['How do payment and renewal work?', 'We confirm accepted payment methods, payment timing, renewal pricing, and unused-work or pause terms in your quote before you commit.'],
    ['What is the extra benefit with Scale?', 'Scale includes an assessment of your online business and a content calendar. The assessment scope and calendar period are agreed when we discuss your order.'],
  ],
};

const briefChecklist = [
  ['Your goal', 'What the design needs to help you achieve.'],
  ['Your materials', 'Brand files, copy and product images you already have.'],
  ['Your output', 'The formats, sizes and approximate quantity you need.'],
  ['Your timing', 'The target date and any review milestones.'],
];

export default function BeforeWeBegin() {
  const baseId = useId();
  const [group, setGroup] = useState('Getting started');
  const [open, setOpen] = useState(0);

  return (
    <section id="questions" className="before-begin" aria-labelledby="before-begin-title">
      <div className="before-begin__inner">
        <div className="before-begin__intro">
          <p className="before-begin__eyebrow"><span aria-hidden="true" /> Before we begin</p>
          <h2 id="before-begin-title">Clear answers make a better brief.</h2>
          <p className="before-begin__lede">The useful details, boundaries and next steps—before you spend time filling in the project form.</p>
          <div className="before-begin__brief-card" aria-labelledby={`${baseId}-checklist-title`}>
            <div className="before-begin__brief-head"><h3 id={`${baseId}-checklist-title`}>A useful first brief includes</h3><span>Four essentials</span></div>
            <ul>{briefChecklist.map(([title, text]) => <li key={title}><span aria-hidden="true" /><div><strong>{title}</strong><p>{text}</p></div></li>)}</ul>
            <a href="#contact">Start your brief <Arrow diagonal /></a>
          </div>
        </div>

        <div className="before-begin__questions">
          <div className="before-begin__tabs" role="tablist" aria-label="Question topics">
            {Object.keys(questionGroups).map(name => {
              const selected = name === group;
              return <button type="button" role="tab" aria-selected={selected} aria-controls={`${baseId}-panel`} tabIndex={selected ? 0 : -1} key={name} onClick={() => { setGroup(name); setOpen(0); }}>{name}</button>;
            })}
          </div>
          <div id={`${baseId}-panel`} className="before-begin__panel" role="tabpanel">
            {questionGroups[group].map(([question, answer], index) => {
              const expanded = open === index;
              const answerId = `${baseId}-answer-${index}`;
              return (
                <article className={`before-begin__item ${expanded ? 'is-open' : ''}`} key={question}>
                  <h3><button type="button" aria-expanded={expanded} aria-controls={answerId} onClick={() => setOpen(expanded ? -1 : index)}><span>{question}</span><Plus minus={expanded} /></button></h3>
                  <div id={answerId} hidden={!expanded}><p>{answer}</p></div>
                </article>
              );
            })}
          </div>
          <p className="before-begin__support">Still unsure? Send the rough version. We can help shape the scope before work begins.</p>
        </div>
      </div>
    </section>
  );
}
