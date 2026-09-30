// Carousel bergerak terus, dapat digeser dengan jari atau mouse.
document.querySelectorAll('.photo-reel').forEach(reel => {
  const track = reel.querySelector('.photo-reel-track');
  const original = [...track.children];
  if (original.length < 2) return;
  original.forEach(image => {
    const clone = image.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.alt = '';
    track.append(clone);
  });

  const duration = reel.classList.contains('accent-photo') ? 32 : 28;
  let distance = 0, dragging = false, baseX = 0, dragX = 0, startX = 0;
  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const position = () => {
    const transform = getComputedStyle(track).transform;
    return transform === 'none' ? 0 : new DOMMatrixReadOnly(transform).m41;
  };
  const wrap = value => {
    if (!distance) return 0;
    while (value > 0) value -= distance;
    while (value <= -distance) value += distance;
    return value;
  };
  const sync = () => {
    const width = reel.clientWidth;
    reel.style.setProperty('--reel-item-width', `${width}px`);
    distance = track.children[original.length].offsetLeft - track.children[0].offsetLeft;
    reel.style.setProperty('--reel-distance', `${distance}px`);
    reel.style.setProperty('--reel-duration', `${duration}s`);
  };
  const resume = () => {
    if (prefersReducedMotion.matches) return;
    const progress = distance ? Math.abs(wrap(dragX)) / distance : 0;
    track.style.transform = '';
    track.style.animation = 'none';
    void track.offsetWidth;
    track.style.animation = `photoReel ${duration}s linear infinite`;
    track.style.animationDelay = `-${progress * duration}s`;
  };
  reel.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    dragging = true;
    startX = event.clientX;
    baseX = position();
    dragX = baseX;
    track.style.animation = 'none';
    track.style.transform = `translate3d(${baseX}px,0,0)`;
    reel.classList.add('is-dragging');
    reel.setPointerCapture?.(event.pointerId);
  });
  reel.addEventListener('pointermove', event => {
    if (!dragging) return;
    dragX = wrap(baseX + event.clientX - startX);
    track.style.transform = `translate3d(${dragX}px,0,0)`;
  });
  const release = event => {
    if (!dragging) return;
    dragging = false;
    reel.classList.remove('is-dragging');
    if (reel.hasPointerCapture?.(event.pointerId)) reel.releasePointerCapture(event.pointerId);
    resume();
  };
  reel.addEventListener('pointerup', release);
  reel.addEventListener('pointercancel', release);
  reel.addEventListener('dragstart', event => event.preventDefault());
  sync();
  if ('ResizeObserver' in window) new ResizeObserver(sync).observe(reel);
});
