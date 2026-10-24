import test from 'node:test';
import assert from 'node:assert/strict';
import { createInquiryDraft } from '../src/data/inquiry.js';
import { studioEmail } from '../src/data/packages.js';

test('inquiry preview and email link preserve the same brief and optional batch details', () => {
  const draft = createInquiryDraft({ name: 'A & B', email: 'buyer@example.com', service: 'Growth Package', business: 'https://example.com/?x=1&y=2', brief: '24 designs: café / ঈদ\nA new line & #hashtags', quantity: '24', deadline: 'Before launch' });
  const uri = new URL(draft.href);
  assert.equal(uri.pathname, studioEmail);
  assert.equal(uri.searchParams.size, 2);
  assert.equal(uri.searchParams.get('subject'), draft.subject);
  assert.equal(uri.searchParams.get('body'), draft.body);
  assert.ok(draft.text.endsWith(draft.body));
  assert.ok(draft.body.includes('Quantity: 24'));
  assert.ok(draft.body.includes('Deadline: Before launch'));
  assert.ok(draft.body.includes('ঈদ\nA new line & #hashtags'));
});

test('email subject cannot be split into additional headers and malformed Unicode remains usable', () => {
  const draft = createInquiryDraft({ name: 'Buyer', email: 'buyer@example.com', service: 'Custom batch\r\nBcc: injected@example.com', brief: 'Surrogate \uD800 end' });
  assert.doesNotMatch(draft.subject, /[\r\n]/);
  assert.equal(new URL(draft.href).searchParams.size, 2);
  assert.ok(draft.body.includes('\uFFFD'));
});

test('empty optional fields are omitted and a missing service defaults to Custom batch', () => {
  const draft = createInquiryDraft({ name: 'Buyer', email: 'buyer@example.com', brief: 'My campaign' });
  assert.ok(draft.subject.includes('Custom batch'));
  assert.doesNotMatch(draft.body, /Quantity:|Deadline:|undefined/);
});
