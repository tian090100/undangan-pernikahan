document.addEventListener('DOMContentLoaded', () => {
  const cover = document.getElementById('lux-cover');
  const invitation = document.getElementById('lux-invitation');
  const guestName = new URLSearchParams(window.location.search).get('to');
  if (guestName) document.getElementById('lux-guest-name').textContent = guestName.slice(0, 60);

  document.getElementById('enter-invitation').addEventListener('click', () => {
    cover.classList.add('opened');
    document.body.classList.remove('is-locked');
    invitation.setAttribute('aria-hidden', 'false');
  });

  const eventTime = new Date('2026-12-12T09:00:00+07:00').getTime();
  const updateCountdown = () => {
    const remaining = Math.max(0, eventTime - Date.now());
    const values = {
      'lux-days': Math.floor(remaining / 86400000),
      'lux-hours': Math.floor((remaining / 3600000) % 24),
      'lux-minutes': Math.floor((remaining / 60000) % 60),
      'lux-seconds': Math.floor((remaining / 1000) % 60)
    };
    Object.entries(values).forEach(([id, value]) => {
      document.getElementById(id).textContent = String(value).padStart(2, '0');
    });
  };
  updateCountdown();
  setInterval(updateCountdown, 1000);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('visible'));
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

  const calendar = document.getElementById('calendar-link');
  const calendarParams = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'The Wedding of Saskia & Rizky',
    dates: '20261212T020000Z/20261212T140000Z',
    details: 'Merayakan hari bahagia Saskia dan Rizky.',
    location: 'Hutan Kota by Plataran, Jakarta'
  });
  calendar.href = `https://calendar.google.com/calendar/render?${calendarParams}`;
  calendar.target = '_blank';
  calendar.rel = 'noopener noreferrer';

  document.getElementById('share-invitation').addEventListener('click', async (event) => {
    const shareData = { title: document.title, text: 'Undangan pernikahan Saskia & Rizky', url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(window.location.href);
        event.currentTarget.firstChild.textContent = 'Tautan disalin ';
      }
    } catch (error) {
      if (error.name !== 'AbortError') event.currentTarget.firstChild.textContent = 'Salin gagal ';
    }
  });

  document.getElementById('lux-rsvp-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name')).trim();
    document.getElementById('lux-form-message').textContent = `Terima kasih, ${name}. Konfirmasi Anda sudah tercatat pada demo ini.`;
    event.currentTarget.reset();
  });

  document.getElementById('lux-copy').addEventListener('click', async (event) => {
    try {
      await navigator.clipboard.writeText('12345678901');
      event.currentTarget.textContent = 'Nomor berhasil disalin ✓';
    } catch {
      event.currentTarget.textContent = '12345678901';
    }
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = lightbox.querySelector('img');
  document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => {
      const image = item.querySelector('img');
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightbox.showModal();
    });
  });
  lightbox.querySelector('button').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
  });

  document.getElementById('sound-control').addEventListener('click', (event) => {
    event.currentTarget.classList.toggle('active');
    event.currentTarget.querySelector('small').textContent = event.currentTarget.classList.contains('active') ? 'On' : 'Sound';
    event.currentTarget.title = 'Kontrol siap dihubungkan dengan lagu pilihan pelanggan';
  });
});
