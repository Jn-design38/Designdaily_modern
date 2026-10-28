import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { packages, makeInquiry, studioEmail } from '../src/data/packages.js';

const projects = JSON.parse(fs.readFileSync(new URL('../src/data/projects.json', import.meta.url), 'utf8'));
const publicRoot = path.resolve('public');

test('installable metadata provides a standalone iPhone Home Screen experience', () => {
  const html = fs.readFileSync(path.resolve('index.html'), 'utf8');
  const manifest = JSON.parse(fs.readFileSync(path.resolve(publicRoot, 'site.webmanifest'), 'utf8'));
  assert.match(html, /viewport-fit=cover/);
  assert.match(html, /apple-mobile-web-app-capable[^>]+content="yes"/);
  assert.match(html, /rel="manifest" href="\/site\.webmanifest"/);
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.start_url, '/');
  for (const icon of manifest.icons) {
    assert.ok(fs.existsSync(path.resolve(publicRoot, icon.src.slice(1))), `Missing ${icon.src}`);
  }
});

test('every project route is unique and all artwork references resolve inside public', () => {
  assert.equal(new Set(projects.map(project => project.id)).size, projects.length);
  for (const project of projects) {
    assert.match(project.id, /^[a-z0-9-]+$/);
    assert.ok(project.images.some(image => image.src === project.cover), `${project.id}: cover is missing`);
    for (const image of project.images) {
      const resolved = path.resolve(publicRoot, image.src.slice(1));
      assert.ok(resolved.startsWith(publicRoot + path.sep));
      assert.ok(fs.existsSync(resolved), `Missing ${image.src}`);
      assert.ok(image.width > 0 && image.height > 0 && image.alt.trim().length > 5);
    }
  }
});

test('package inquiry selections retain the reference prices and meaningful feature text', () => {
  assert.deepEqual(packages.map(pack => [pack.id, pack.original, pack.price]), [['starter','7,000','3,500'],['growth','18,000','8,999'],['scale','30,000','14,999']]);
  assert.equal(new Set(packages.map(pack => pack.name)).size, packages.length);
  assert.ok(packages.every(pack => pack.features.every(feature => typeof feature.text === 'string' && feature.text.length > 4)));
});

test('email handoff encodes customer data without changing the recipient or adding headers', () => {
  const input = {name:'A & B',contact:'name@example.com',business:'https://example.com/?a=1&b=2',service:'Scale Package',brief:'Hello #design\nবাংলা & stationery?subject=unexpected'};
  const url = new URL(makeInquiry(input));
  assert.equal(url.pathname, studioEmail);
  assert.equal(url.searchParams.size, 2);
  assert.equal(url.searchParams.get('subject'), 'Design Daily enquiry — Scale Package');
  assert.ok(url.searchParams.get('body').includes(input.brief));
  assert.ok(url.searchParams.get('body').includes(input.business));
});
