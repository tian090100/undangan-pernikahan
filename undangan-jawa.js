document.addEventListener('DOMContentLoaded', () => {
  const cover = document.getElementById('cover');
  const invitation = document.getElementById('invitation');
  const music = document.getElementById('background-music');
  const musicButton = document.getElementById('music-button');
  const guest = new URLSearchParams(location.search).get('to');
  if (guest) document.getElementById('guest-name').textContent = guest.slice(0, 60);

  const updateMusic = (playing) => {
    musicButton.classList.toggle('playing', playing);
    musicButton.textContent = playing ? '♫' : '♪';
    musicButton.title = playing ? 'Jeda musik' : 'Putar musik';
    musicButton.setAttribute('aria-label', musicButton.title);
  };
  music.addEventListener('play', () => updateMusic(true));
  music.addEventListener('pause', () => updateMusic(false));
  musicButton.addEventListener('click', () => music.paused ? music.play().catch(() => updateMusic(false)) : music.pause());

  document.getElementById('open-button').addEventListener('click', () => {
    cover.classList.add('opened');
    document.body.classList.remove('locked');
    invitation.setAttribute('aria-hidden', 'false');
    music.play().catch(() => updateMusic(false));
  });

  const weddingDate = new Date('2027-07-18T08:00:00+07:00').getTime();
  const updateCountdown = () => {
    const gap = Math.max(0, weddingDate - Date.now());
    const values = { days: Math.floor(gap / 86400000), hours: Math.floor((gap / 3600000) % 24), minutes: Math.floor((gap / 60000) % 60), seconds: Math.floor((gap / 1000) % 60) };
    Object.entries(values).forEach(([id, value]) => document.getElementById(id).textContent = String(value).padStart(2, '0'));
  };
  updateCountdown();
  setInterval(updateCountdown, 1000);

  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('visible')), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

  const calendar = new URLSearchParams({ action: 'TEMPLATE', text: 'Pernikahan Raka & Sekar', dates: '20270718T010000Z/20270718T060000Z', location: 'Royal Ambarrukmo, Yogyakarta' });
  const calendarLink = document.getElementById('calendar-link');
  calendarLink.href = `https://calendar.google.com/calendar/render?${calendar}`;
  calendarLink.target = '_blank';
  calendarLink.rel = 'noopener noreferrer';

  document.getElementById('rsvp-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    document.getElementById('form-status').textContent = `Matur nuwun, ${String(data.get('name')).trim()}. Konfirmasi Anda tercatat pada demo ini.`;
    event.currentTarget.reset();
  });

  document.getElementById('copy-account').addEventListener('click', async (event) => {
    try { await navigator.clipboard.writeText('12345678901'); event.currentTarget.textContent = 'Berhasil Disalin ✓'; }
    catch { event.currentTarget.textContent = '12345678901'; }
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = lightbox.querySelector('img');
  document.querySelectorAll('.gallery-item').forEach((item) => item.addEventListener('click', () => {
    const image = item.querySelector('img');
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.showModal();
  }));
  lightbox.querySelector('button').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', (event) => event.target === lightbox && lightbox.close());
});
