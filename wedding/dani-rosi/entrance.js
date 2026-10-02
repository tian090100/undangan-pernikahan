(() => {
  const opening = document.querySelector('.opening');
  const cover = document.getElementById('cover');
  const openButton = document.getElementById('open-invitation');
  const revealItems = document.querySelectorAll('.scripture-frame, .events .section-heading, .event-card, .gift .section-heading, .gift-intro, .gift-toggle, .footer-flourish, .footer p, .footer h2, .footer small');

  document.documentElement.classList.add('motion-ready');
  revealItems.forEach((item) => item.classList.add('scroll-reveal'));

  const enter = () => requestAnimationFrame(() => opening.classList.add('entered'));
  openButton.addEventListener('click', enter, { once: true });
  if (cover.classList.contains('opened')) enter();

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -25px 0px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }
})();
