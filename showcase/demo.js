document.addEventListener('DOMContentLoaded', () => {
  const cover = document.getElementById('cover');
  const invitation = document.getElementById('invitation');
  const open = document.getElementById('open-invitation');
  const guest = document.getElementById('guest-name');
  if (guest) guest.textContent = 'Tamu Undangan';

  const reveal = () => {
    if (cover) {
      cover.classList.add('opened');
      window.setTimeout(() => { cover.hidden = true; }, 900);
    }
    document.body.classList.remove('locked');
    if (invitation) {
      invitation.inert = false;
      invitation.setAttribute('aria-hidden', 'false');
    }
    window.scrollTo(0, 0);
  };
  open?.addEventListener('click', reveal);
  if (new URLSearchParams(location.search).get('preview') === '1') reveal();

  const target = new Date(document.body.dataset.date || '2027-11-13T09:00:00+07:00').getTime();
  const tick = () => {
    let left = Math.max(0, target - Date.now());
    const values = {
      days: Math.floor(left / 86400000),
      hours: Math.floor(left / 3600000) % 24,
      minutes: Math.floor(left / 60000) % 60,
      seconds: Math.floor(left / 1000) % 60
    };
    for (const [id, value] of Object.entries(values)) {
      const element = document.getElementById(id);
      if (element) element.textContent = String(value).padStart(2, '0');
    }
  };
  tick();
  window.setInterval(tick, 1000);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  } else {
    document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
  }

  document.querySelectorAll('.auto-slider').forEach(slider => {
    const slides = [...slider.querySelectorAll(':scope > .slide')];
    if (slides.length < 2) return;
    let current = 0;
    window.setInterval(() => {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, Number(slider.dataset.interval) || 4300);
  });

  const dialog = document.getElementById('lightbox');
  if (dialog) {
    const image = dialog.querySelector('img');
    document.querySelectorAll('.gallery .photo, .gallery .photo-slot').forEach(item => {
      item.addEventListener('click', () => {
        const photo = item.querySelector('img');
        image.src = photo.src;
        image.alt = photo.alt;
        dialog.showModal();
      });
    });
    dialog.querySelector('button').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  }

  const giftToggle = document.getElementById('gift-toggle');
  const accounts = document.getElementById('accounts');
  giftToggle?.addEventListener('click', () => {
    const expanded = giftToggle.getAttribute('aria-expanded') === 'true';
    giftToggle.setAttribute('aria-expanded', String(!expanded));
    accounts.hidden = expanded;
  });

  document.querySelectorAll('.demo-form').forEach(form => form.addEventListener('submit', event => {
    event.preventDefault();
    const status = form.querySelector('[role="status"]');
    if (status) status.textContent = 'Ini pratinjau desain. RSVP aktif pada undangan pelanggan.';
  }));
});
