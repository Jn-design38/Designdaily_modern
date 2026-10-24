export function Arrow({ diagonal = false, ...props }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}><path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h16m-7-7 7 7-7 7'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
export function Star({ className = '', ...props }) {
  return <svg className={className} viewBox="0 0 100 100" fill="currentColor" aria-hidden="true" {...props}><path d="m50 0 8 30 23-22-12 30 31 4-28 14 20 25-30-10-8 29-12-29-29 16 16-28L0 50l30-8L9 18l30 12Z" /></svg>;
}

export function Chevron({ direction = 'down', ...props }) {
  const rotation = { down: 0, left: 90, up: 180, right: -90 }[direction] ?? 0;
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ transform: `rotate(${rotation}deg)` }} {...props}><path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function Plus({ minus = false, ...props }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}><path d="M5 12h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />{!minus && <path d="M12 5v14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />}</svg>;
}

export function Check(props) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}><path d="m5 12 4.5 4.5L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
