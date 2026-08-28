document.addEventListener('DOMContentLoaded', () => {
  const guest = new URLSearchParams(window.location.search).get('to');
  if (guest) document.getElementById('guest-name').textContent = guest.slice(0, 60);

  document.getElementById('open-button').addEventListener('click', () => {
    document.getElementById('cover').classList.add('opened');
    document.body.classList.remove('locked');
    document.getElementById('invitation').setAttribute('aria-hidden', 'false');
  });

  const weddingDate = new Date('2027-02-20T09:00:00+07:00').getTime();
  const updateCountdown = () => {
    const gap = Math.max(0, weddingDate - Date.now());
    const values = { days: Math.floor(gap / 86400000), hours: Math.floor((gap / 3600000) % 24), minutes: Math.floor((gap / 60000) % 60), seconds: Math.floor((gap / 1000) % 60) };
    Object.entries(values).forEach(([id, value]) => document.getElementById(id).textContent = String(value).padStart(2, '0'));
  };
  updateCountdown();
  setInterval(updateCountdown, 1000);

  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('visible')), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));

  const calendar = new URLSearchParams({ action: 'TEMPLATE', text: 'Pernikahan Samuel & Tiurma', dates: '20270220T020000Z/20270220T100000Z', details: 'Pemberkatan dan resepsi pernikahan Samuel dan Tiurma.', location: 'Tarutung, Tapanuli Utara' });
  const calendarLink = document.getElementById('calendar-link');
  calendarLink.href = `https://calendar.google.com/calendar/render?${calendar}`;
  calendarLink.target = '_blank';
  calendarLink.rel = 'noopener noreferrer';

  document.getElementById('share-button').addEventListener('click', async (event) => {
    try {
      if (navigator.share) await navigator.share({ title: document.title, text: 'Undangan pernikahan Samuel & Tiurma', url: location.href });
      else { await navigator.clipboard.writeText(location.href); event.currentTarget.textContent = 'Tautan disalin ✓'; }
    } catch (error) { if (error.name !== 'AbortError') event.currentTarget.textContent = 'Gagal membagikan'; }
  });

  const sampleWishes = [
    { name: 'Keluarga Siregar', message: 'Selamat berbahagia. Tuhan memberkati keluarga baru kalian.' },
    { name: 'Ruben & Marta', message: 'Horas! Semoga selalu penuh kasih, sukacita, dan kebersamaan.' }
  ];
  let savedWishes = [];
  try { savedWishes = JSON.parse(localStorage.getItem('batak-wedding-wishes')) || []; } catch { savedWishes = []; }
  const renderWishes = () => {
    const list = document.getElementById('wishes-list');
    list.replaceChildren();
    [...savedWishes, ...sampleWishes].slice(0, 8).forEach((wish) => {
      const article = document.createElement('article');
      const name = document.createElement('strong');
      const message = document.createElement('p');
      name.textContent = wish.name;
      message.textContent = wish.message;
      article.append(name, message);
      list.append(article);
    });
  };
  renderWishes();

  document.getElementById('rsvp-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name')).trim();
    savedWishes.unshift({ name, message: String(data.get('message')).trim() });
    savedWishes = savedWishes.slice(0, 6);
    try { localStorage.setItem('batak-wedding-wishes', JSON.stringify(savedWishes)); } catch { /* Tetap tampil tanpa penyimpanan. */ }
    renderWishes();
    document.getElementById('form-status').textContent = `Mauliate, ${name}. Konfirmasi Anda tercatat pada demo ini.`;
    event.currentTarget.reset();
  });

  document.getElementById('copy-account').addEventListener('click', async (event) => {
    try { await navigator.clipboard.writeText('12345678901'); event.currentTarget.textContent = 'Berhasil Disalin ✓'; }
    catch { event.currentTarget.textContent = '12345678901'; }
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = lightbox.querySelector('img');
  document.querySelectorAll('.gallery-item').forEach((item) => item.addEventListener('click', () => {
    const image = item.querySelector('img'); lightboxImage.src = image.src; lightboxImage.alt = image.alt; lightbox.showModal();
  }));
  lightbox.querySelector('button').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', (event) => event.target === lightbox && lightbox.close());

  document.getElementById('music-control').addEventListener('click', (event) => {
    event.currentTarget.classList.toggle('active');
    event.currentTarget.title = 'Siap dihubungkan dengan musik pilihan pasangan';
  });
});
