import { useEffect, useRef, useState } from 'react';
export default function Lightbox({ images, initialIndex = 0, onClose }) {
  const [index, setIndex] = useState(initialIndex);
  const dialog = useRef(null);
  const image = images[index];
  useEffect(() => {
    const focusBefore = document.activeElement;
    dialog.current.showModal();
    const overflowBefore = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflowBefore; focusBefore?.focus?.(); };
  }, []);
  const move = delta => setIndex(current => (current + delta + images.length) % images.length);
  return <dialog ref={dialog} className="lightbox" aria-label="Artwork viewer" onCancel={onClose} onClick={event => { if (event.target === dialog.current) onClose(); }} onKeyDown={event => { if (event.key === 'ArrowRight') move(1); if (event.key === 'ArrowLeft') move(-1); }}>
    <button className="lightbox-close round-button" aria-label="Close artwork viewer" onClick={onClose}>×</button>
    <div className="lightbox-inner">
      <img src={image.src} alt={image.alt} width={image.width} height={image.height} />
      <div className="lightbox-caption"><p>{image.alt}</p><span aria-live="polite">{index + 1} / {images.length}</span></div>
      {images.length > 1 && <div className="lightbox-controls"><button className="round-button" aria-label="Previous artwork" onClick={() => move(-1)}>←</button><button className="round-button" aria-label="Next artwork" onClick={() => move(1)}>→</button></div>}
    </div>
  </dialog>;
}
