// Mobile-only routing and scroll timing. Desktop continues using its existing circuit.
export const MOBILE_SHOWCASE_QUERY = '(max-width: 900px)';

function roundedPath(points, radius = 18) {
  const commands = [`M ${points[0][0]} ${points[0][1]}`];
  for (let i = 1; i < points.length - 1; i++) {
    const a = points[i - 1], b = points[i], c = points[i + 1];
    const before = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const after = Math.hypot(c[0] - b[0], c[1] - b[1]);
    if (!before || !after) continue;
    const r = Math.min(radius, before / 2, after / 2);
    const entry = b.map((v, j) => v - (v - a[j]) / before * r);
    const exit = b.map((v, j) => v + (c[j] - v) / after * r);
    commands.push(`L ${entry[0]} ${entry[1]} Q ${b[0]} ${b[1]} ${exit[0]} ${exit[1]}`);
  }
  const last = points[points.length - 1];
  return `${commands.join(' ')} L ${last[0]} ${last[1]}`;
}

export function mobileShowcasePath(root) {
  const origin = root.getBoundingClientRect();
  const bounds = el => {
    const r = el.getBoundingClientRect();
    return { x: r.left - origin.left + r.width / 2, y: r.top - origin.top + r.height / 2, top: r.top - origin.top, bottom: r.bottom - origin.top };
  };
  const start = root.querySelector('[data-flow-start]');
  const discipline = root.querySelector('[data-discipline-pill]');
  const rows = [...root.querySelectorAll('[data-showcase-item]')];
  const finale = root.querySelector('.flow-quote-card');
  if (!start || !discipline || !rows.length || !finale) return '';
  const center = root.clientWidth / 2;
  const halfWidth = Math.min(320, center - 20);
  const left = center - halfWidth, right = center + halfWidth;
  const s = bounds(start), d = bounds(discipline);
  const points = [[center, s.y], [center, d.bottom]];
  let bottom = d.bottom;
  const snake = (bridge, nextY) => {
    const y = bounds(bridge).y;
    points.push(
      [center, bottom + 28], [left, bottom + 28],
      [left, y], [right, y],
      [right, nextY - 32], [center, nextY - 32], [center, nextY],
    );
  };
  rows.forEach((row, index) => {
    const bridge = root.querySelector(`[data-bridge-index="${index}"] .bridge-pill-tag`);
    const pill = row.querySelector('[data-item-pill]');
    const card = row.querySelector('.flow-wireframe-card');
    if (!bridge || !pill || !card) return;
    snake(bridge, bounds(pill).y);
    bottom = bounds(card).bottom;
    points.push([center, bottom]);
  });
  const quoteBridge = root.querySelector('[data-flow-bridge-quote] .bridge-pill-tag');
  if (quoteBridge) snake(quoteBridge, bounds(finale).top);
  return roundedPath(points);
}

export function animateMobileShowcase(root, path, length) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const count = Math.ceil(length / 4);
  const samples = Array.from({ length: count + 1 }, (_, i) => {
    const distance = length * i / count;
    const point = path.getPointAtLength(distance);
    return { x: point.x, y: point.y, distance };
  });
  const origin = root.getBoundingClientRect();
  const nodes = [...root.querySelectorAll('[data-flow-start], [data-discipline-pill], .bridge-pill-tag, [data-item-pill], .flow-order-now-btn')];
  const stations = nodes.map(el => {
    if (el.matches('.flow-order-now-btn')) return { el, distance: length };
    const r = el.getBoundingClientRect();
    const x = r.left - origin.left + r.width / 2;
    const y = r.top - origin.top + r.height / 2;
    let nearest = samples[0], error = Infinity;
    for (const sample of samples) {
      const delta = (x - sample.x) ** 2 + (y - sample.y) ** 2;
      if (delta < error) { error = delta; nearest = sample; }
    }
    return { el, distance: nearest.distance };
  });
  let frame = 0;
  const paint = () => {
    const y = -root.getBoundingClientRect().top + window.innerHeight * .55;
    const started = y >= samples[0].y;
    let low = 0, high = samples.length - 1;
    while (low < high) {
      const mid = Math.ceil((low + high) / 2);
      if (samples[mid].y <= y) low = mid; else high = mid - 1;
    }
    const drawn = reduced ? length : samples[low].distance;
    path.style.strokeDashoffset = String(length - drawn);
    stations.forEach(({ el, distance }) => el.classList.toggle('is-lit', reduced || (started && drawn >= distance - 2)));
    frame = 0;
  };
  const update = () => {
    if (!frame) frame = requestAnimationFrame(paint);
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('scroll', update);
    window.removeEventListener('resize', update);
  };
}
