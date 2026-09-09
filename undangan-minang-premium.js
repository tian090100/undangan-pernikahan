document.addEventListener('DOMContentLoaded', () => {
  const opening = document.getElementById('opening');
  const invitation = document.getElementById('invitation');
  const music = document.getElementById('background-music');
  const musicButton = document.getElementById('music-button');
  const guest = new URLSearchParams(location.search).get('to');
  if (guest) document.getElementById('guest-name').textContent = guest.slice(0, 60);

  const setMusicState = (playing) => {
    musicButton.classList.toggle('playing', playing);
    musicButton.textContent = playing ? '♫' : '♪';
    musicButton.title = playing ? 'Jeda musik' : 'Putar musik';
    musicButton.setAttribute('aria-label', musicButton.title);
  };
  music.addEventListener('play', () => setMusicState(true));
  music.addEventListener('pause', () => setMusicState(false));
  musicButton.addEventListener('click', async () => { try { if (music.paused) await music.play(); else music.pause(); } catch { setMusicState(false); } });
  document.getElementById('open-invitation').addEventListener('click', async () => {
    opening.classList.add('opened');
    document.body.classList.remove('locked');
    invitation.setAttribute('aria-hidden', 'false');
    try { await music.play(); } catch { setMusicState(false); }
  });

  const target = new Date('2027-12-12T08:00:00+07:00').getTime();
  const updateCountdown = () => {
    const remaining = Math.max(0, target - Date.now());
    const values = { days: Math.floor(remaining / 86400000), hours: Math.floor((remaining / 3600000) % 24), minutes: Math.floor((remaining / 60000) % 60), seconds: Math.floor((remaining / 1000) % 60) };
    Object.entries(values).forEach(([id, value]) => { document.getElementById(id).textContent = String(value).padStart(2, '0'); });
  };
  updateCountdown();
  setInterval(updateCountdown, 1000);

  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('visible'); }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

  const calendarParams = new URLSearchParams({ action: 'TEMPLATE', text: 'Pernikahan Rangga & Puti', dates: '20271212T010000Z/20271212T080000Z', location: 'Istano Basa Pagaruyung, Batusangkar, Sumatera Barat', details: 'Baralek Rangga Alfarizi dan Puti Maharani.' });
  const calendarLink = document.getElementById('calendar-link');
  calendarLink.href = `https://calendar.google.com/calendar/render?${calendarParams}`;
  calendarLink.target = '_blank';
  calendarLink.rel = 'noopener noreferrer';

  document.getElementById('share-button').addEventListener('click', async (event) => { try { if (navigator.share) await navigator.share({ title: document.title, url: location.href }); else { await navigator.clipboard.writeText(location.href); event.currentTarget.textContent = 'Tautan disalin ✓'; } } catch {} });

  let savedWishes = [];
  try { savedWishes = JSON.parse(localStorage.getItem('daprita-minang-premium-wishes')) || []; } catch {}
  const samples = [{ name: 'Keluarga Besar Rajo Alam', message: 'Barakallahu laka wa baraka alaika. Semoga menjadi keluarga sakinah, mawaddah, warahmah.' }, { name: 'Uni Rani & Uda Fikri', message: 'Selamat baralek! Semoga langgeng, bahagia, dan selalu dalam lindungan Allah SWT.' }];
  const renderWishes = () => {
    const list = document.getElementById('wish-list');
    list.replaceChildren();
    [...savedWishes, ...samples].slice(0, 6).forEach((wish) => { const article = document.createElement('article'); const name = document.createElement('strong'); const message = document.createElement('p'); name.textContent = wish.name; message.textContent = wish.message; article.append(name, message); list.append(article); });
  };
  renderWishes();
  document.getElementById('rsvp-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name')).trim();
    savedWishes.unshift({ name, message: String(data.get('message')).trim() });
    savedWishes = savedWishes.slice(0, 5);
    try { localStorage.setItem('daprita-minang-premium-wishes', JSON.stringify(savedWishes)); } catch {}
    renderWishes();
    document.getElementById('form-status').textContent = `Tarimo kasih, ${name}. Konfirmasi Anda tercatat pada demo ini.`;
    event.currentTarget.reset();
  });
  document.getElementById('copy-account').addEventListener('click', async (event) => { try { await navigator.clipboard.writeText('12345678901'); event.currentTarget.textContent = 'Berhasil Disalin ✓'; } catch { event.currentTarget.textContent = '12345678901'; } });

  const dialog = document.getElementById('lightbox');
  const dialogImage = dialog.querySelector('img');
  document.querySelectorAll('.photo').forEach((button) => button.addEventListener('click', () => { const image = button.querySelector('img'); dialogImage.src = image.src; dialogImage.alt = image.alt; dialog.showModal(); }));
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
});
