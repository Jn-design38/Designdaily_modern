export function Arrow({ diagonal = false, ...props }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}><path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h16m-7-7 7 7-7 7'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
export function Star({ className = '', ...props }) {
  return <svg className={className} viewBox="0 0 100 100" fill="currentColor" aria-hidden="true" {...props}><path d="m50 0 8 30 23-22-12 30 31 4-28 14 20 25-30-10-8 29-12-29-29 16 16-28L0 50l30-8L9 18l30 12Z" /></svg>;
}
