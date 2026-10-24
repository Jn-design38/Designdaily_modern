import { makeInquiry, studioEmail } from './packages.js';

// Repair isolated UTF-16 surrogates before the shared helper calls encodeURIComponent.
const clean = value => String(value ?? '')
  .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDFFF]/g, part => part.length === 2 ? part : '\uFFFD')
  .replace(/\r\n?/g, '\n')
  .trim();

const singleLine = value => clean(value).replace(/\n/g, ' ');

/** Build one source of truth for the mailto link, readable preview and clipboard. */
export function createInquiryDraft({ name, email, business, service, brief, quantity, deadline }) {
  const details = [
    clean(brief),
    quantity && `Quantity: ${singleLine(quantity)}`,
    deadline && `Deadline: ${singleLine(deadline)}`,
  ].filter(Boolean).join('\n\n');

  const href = makeInquiry({
    name: singleLine(name),
    contact: singleLine(email),
    business: singleLine(business),
    service: singleLine(service) || 'Custom batch',
    brief: details,
  });
  const params = new URL(href).searchParams;
  const subject = params.get('subject');
  const body = params.get('body');

  return {
    href,
    subject,
    body,
    text: `To: ${studioEmail}\nSubject: ${subject}\n\n${body}`,
  };
}
