import { useEffect, useId, useRef, useState } from 'react';
import { packages, studioEmail } from '../data/packages.js';
import { createInquiryDraft } from '../data/inquiry.js';
import SpecularButton from './SpecularButton';
import TiltedCard from './TiltedCard';
import './InquiryStudio.css';

const CUSTOM_BATCH = 'Custom batch';
const EMPTY_FIELDS = { name: '', email: '', business: '', brief: '', quantity: '', deadline: '' };

function ArrowIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Field({ id, label, optional = false, error, multiline = false, ...props }) {
  const Control = multiline ? 'textarea' : 'input';
  return (
    <div className={`inquiry-studio__field${multiline ? ' inquiry-studio__field--brief' : ''}`}>
      <label htmlFor={id}>{label}{optional && <span>Optional</span>}</label>
      <Control id={id} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined} {...props} />
      {error && <span className="inquiry-studio__error" id={`${id}-error`}>{error}</span>}
    </div>
  );
}

/** Controlled service accepts a package name/id or any custom service string. */
export default function InquiryStudio({ service, setService }) {
  const uid = useId();
  const selectedService = packages.find(item => item.id === service || item.name === service)?.name || service || CUSTOM_BATCH;
  const options = [...packages.map(item => ({ value: item.name, label: item.name.replace(/ Package$/i, '') })), { value: CUSTOM_BATCH, label: CUSTOM_BATCH }];
  if (!options.some(option => option.value === selectedService)) {
    options.push({ value: selectedService, label: selectedService });
  }

  const [fields, setFields] = useState(EMPTY_FIELDS);
  const [errors, setErrors] = useState({});
  const [draft, setDraft] = useState(null);
  const [status, setStatus] = useState('');
  const [copying, setCopying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [formFocused, setFormFocused] = useState(false);
  const previewRef = useRef(null);
  const previewTitleRef = useRef(null);
  const formRef = useRef(null);
  const draftRef = useRef(null);
  const activeDraft = draft?.service === selectedService ? draft : null;
  draftRef.current = activeDraft;
  const hasBrief = Object.values(fields).some(value => value.trim());
  const envelopeState = activeDraft ? 'draft' : hasBrief || formFocused ? 'writing' : 'idle';

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    setDraft(null);
    setStatus('');
  }, [selectedService]);

  useEffect(() => {
    if (activeDraft) previewTitleRef.current?.focus({ preventScroll: true });
  }, [activeDraft]);

  function updateField(event) {
    const input = event.target;
    input.setCustomValidity(input.required && input.value && !input.value.trim() ? 'Please add more than spaces.' : '');
    setFields(previous => ({ ...previous, [input.name]: input.value }));
    setErrors(previous => ({ ...previous, [input.name]: previous[input.name] ? input.validationMessage : '' }));
    setStatus('');
  }

  function prepareDraft(event) {
    event.preventDefault();
    const next = { ...createInquiryDraft({ ...fields, service: selectedService }), service: selectedService };
    setDraft(next);
    setStatus('Draft ready. Review it, then send from your email app.');
  }

  async function copyDraft() {
    const current = activeDraft;
    if (!current || copying) return;
    setCopying(true);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(current.text);
      if (draftRef.current === current) setStatus('Draft copied. Paste it into your email app to send.');
    } catch {
      if (draftRef.current === current) {
        previewRef.current?.focus();
        previewRef.current?.select();
        setStatus('Clipboard unavailable. The draft is selected; use your device’s Copy command.');
      }
    } finally {
      setCopying(false);
    }
  }

  function editBrief() {
    setDraft(null);
    setStatus('');
    requestAnimationFrame(() => formRef.current?.elements.namedItem('brief')?.focus());
  }

  const fieldProps = name => ({
    id: `${uid}-${name}`,
    name,
    value: fields[name],
    error: errors[name],
    onChange: updateField,
  });

  return (
    <section id="contact" className="inquiry-studio" aria-labelledby={`${uid}-heading`} data-envelope={envelopeState}>
      <div className="inquiry-studio__inner">
        <div className="inquiry-studio__intro">
          <p className="inquiry-studio__location"><span aria-hidden="true" />Design Daily · Dhaka, Bangladesh</p>
          <h2 id={`${uid}-heading`}>Your next batch<br />starts here.</h2>

          <div className="inquiry-studio__visual" aria-hidden="true">
            <TiltedCard
              className="inquiry-studio__tilt"
              containerHeight="100%"
              containerWidth="100%"
              imageHeight="100%"
              imageWidth="100%"
              rotateAmplitude={reducedMotion ? 0 : 9}
              scaleOnHover={1}
              perspective={1100}
              showTooltip={false}
              flipOnClick={false}
              gyroscope={false}
              intro={false}
              floating={false}
              glare={0}
              shadow={0}
            >
              <div className="inquiry-studio__envelope">
                <div className="inquiry-studio__envelope-back" />
                <div className="inquiry-studio__flap" />
                <div className="inquiry-studio__letter">
                  <span className="inquiry-studio__letter-brand">Design Daily<span>↗</span></span>
                  <span className="inquiry-studio__letter-title">{activeDraft ? 'Ready when you are.' : 'A little brief.\nA big beginning.'}</span>
                  <span className="inquiry-studio__letter-service">{selectedService}</span>
                  <span className="inquiry-studio__letter-lines"><i /><i /><i /></span>
                </div>
                <div className="inquiry-studio__envelope-front" />
                <div className="inquiry-studio__envelope-fold" />
                <span className="inquiry-studio__seal">dd<span>↗</span></span>
                <span className="inquiry-studio__envelope-note">Your next batch.</span>
              </div>
            </TiltedCard>
          </div>

          <div className="inquiry-studio__contact">
            <span>Prefer a simple hello?</span>
            <a href={`mailto:${studioEmail}`}>{studioEmail}<ArrowIcon /></a>
          </div>
        </div>

        <div className="inquiry-studio__workspace">
          {!activeDraft ? (
            <form
              ref={formRef}
              className="inquiry-studio__form"
              aria-label="Start a design inquiry"
              onSubmit={prepareDraft}
              onFocus={() => setFormFocused(true)}
              onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFormFocused(false); }}
              onInvalid={event => {
                setErrors(previous => ({ ...previous, [event.target.name]: event.target.validationMessage }));
                setStatus('Check the highlighted fields.');
              }}
            >
              <fieldset className="inquiry-studio__packages">
                <legend>What are we making?</legend>
                <div className="inquiry-studio__package-options">
                  {options.map(option => (
                    <label className="inquiry-studio__package" key={option.value}>
                      <input type="radio" name="service" value={option.value} checked={selectedService === option.value} onChange={() => setService(option.value)} />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <Field {...fieldProps('business')} label="Business link" optional type="url" autoComplete="url" placeholder="https://yourbrand.com" maxLength={300} />
              <div className="inquiry-studio__row">
                <Field {...fieldProps('name')} label="Your name" autoComplete="name" placeholder="Your name" maxLength={100} required />
                <Field {...fieldProps('email')} label="Email" type="email" autoComplete="email" placeholder="you@yourbrand.com" maxLength={254} required />
              </div>
              <Field {...fieldProps('brief')} label="The brief" multiline rows={3} placeholder="What do you need designed?" maxLength={1600} required />
              <div className="inquiry-studio__row">
                <Field {...fieldProps('quantity')} label="Quantity" optional type="number" min="1" step="1" placeholder="e.g. 24 designs" />
                <Field {...fieldProps('deadline')} label="Deadline" optional type="text" placeholder="A date or a timeframe" maxLength={100} />
              </div>
              <SpecularButton
                className="inquiry-studio__submit"
                type="submit"
                radius={12}
                tint="#ff4c42"
                tintOpacity={1}
                textColor="#111214"
                lineColor="#ffd4cd"
                baseColor="#ff4c42"
                followMouse={!reducedMotion}
                autoAnimate={false}
              >Preview email<ArrowIcon /></SpecularButton>
              <p className="inquiry-studio__hint">Preview first. Send from your email app.</p>
            </form>
          ) : (
            <div className="inquiry-studio__preview">
              <div className="inquiry-studio__preview-heading">
                <h3 ref={previewTitleRef} tabIndex={-1}>Your draft.</h3>
                <button type="button" className="inquiry-studio__edit" onClick={editBrief}>Edit brief</button>
              </div>
              <p className="inquiry-studio__preview-intro">One last look before hello.</p>
              <label className="inquiry-studio__draft-label" htmlFor={`${uid}-draft`}>Email preview</label>
              <textarea ref={previewRef} id={`${uid}-draft`} className="inquiry-studio__draft-text" value={activeDraft.text} readOnly spellCheck={false} aria-describedby={`${uid}-send-note`} />
              <div className="inquiry-studio__draft-actions">
                <a className="inquiry-studio__open" href={activeDraft.href} onClick={() => setStatus('Email app requested. Send the draft there, or copy it here if nothing opens.')}>
                  Open email app<ArrowIcon />
                </a>
                <SpecularButton className="inquiry-studio__copy" size="sm" radius={12} onClick={copyDraft} disabled={copying} followMouse={!reducedMotion} autoAnimate={false}>
                  {copying ? 'Copying…' : 'Copy draft'}
                </SpecularButton>
              </div>
              <p className="inquiry-studio__hint" id={`${uid}-send-note`}>Nothing has been sent. No email app? Copy the draft.</p>
            </div>
          )}
          <p className="inquiry-studio__status" role="status" aria-live="polite" aria-atomic="true">{status}</p>
        </div>
      </div>
    </section>
  );
}
