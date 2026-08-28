document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const cover = document.getElementById('cover');
  const invitation = document.getElementById('invitation');
  const music = document.getElementById('background-music');
  const musicButton = document.getElementById('music-button');
  const guest = new URLSearchParams(window.location.search).get('to');
  if (guest) document.getElementById('guest-name').textContent = guest.slice(0, 60);

  document.getElementById('open-invitation').addEventListener('click', () => {
    cover.classList.add('opened');
    body.classList.remove('locked');
    invitation.setAttribute('aria-hidden', 'false');
    music.play().catch(() => updateMusicButton(false));
    setTimeout(() => document.getElementById('home').scrollIntoView(), 500);
  });

  const weddingDate = new Date('2026-11-22T08:00:00+07:00').getTime();
  const updateCountdown = () => {
    const distance = Math.max(0, weddingDate - Date.now());
    const values = {
      days: Math.floor(distance / 86400000),
      hours: Math.floor((distance / 3600000) % 24),
      minutes: Math.floor((distance / 60000) % 60),
      seconds: Math.floor((distance / 1000) % 60)
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

  const defaultWishes = [
    { name: 'Rina & Dika', attendance: 'Hadir', message: 'Selamat menempuh hidup baru. Semoga selalu dipenuhi cinta dan kebahagiaan.' },
    { name: 'Keluarga Bapak Hendra', attendance: 'Hadir', message: 'Semoga menjadi keluarga yang sakinah, mawaddah, dan warahmah.' },
    { name: 'Nadia Putri', attendance: 'Maaf, belum bisa hadir', message: 'Turut berbahagia untuk Mira dan Arka. Semoga acaranya berjalan lancar!' }
  ];
  const wishesTrack = document.getElementById('wishes-track');
  let savedWishes = [];

  try {
    savedWishes = JSON.parse(localStorage.getItem('mira-arka-wishes')) || [];
  } catch {
    savedWishes = [];
  }

  const renderWishes = () => {
    const wishes = [...savedWishes, ...defaultWishes];
    wishesTrack.replaceChildren();
    [...wishes, ...wishes].forEach((wish, index) => {
      const item = document.createElement('article');
      item.className = 'wish-item';
      if (index >= wishes.length) item.setAttribute('aria-hidden', 'true');
      const heading = document.createElement('div');
      const name = document.createElement('strong');
      const attendance = document.createElement('span');
      const message = document.createElement('p');
      name.textContent = wish.name;
      attendance.textContent = wish.attendance;
      message.textContent = wish.message;
      heading.append(name, attendance);
      item.append(heading, message);
      wishesTrack.append(item);
    });
    wishesTrack.style.setProperty('--wish-count', wishes.length);
  };
  renderWishes();

  document.getElementById('rsvp-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name')).trim();
    const newWish = {
      name,
      attendance: String(formData.get('attendance')),
      message: String(formData.get('message')).trim()
    };
    savedWishes.unshift(newWish);
    savedWishes = savedWishes.slice(0, 20);
    try {
      localStorage.setItem('mira-arka-wishes', JSON.stringify(savedWishes));
    } catch {
      // Ucapan tetap ditampilkan meskipun penyimpanan browser tidak tersedia.
    }
    renderWishes();
    document.getElementById('form-status').textContent = `Terima kasih, ${name}. Konfirmasi Anda berhasil dicatat pada demo ini.`;
    event.currentTarget.reset();
  });

  document.getElementById('copy-account').addEventListener('click', async (event) => {
    try {
      await navigator.clipboard.writeText('12345678901');
      event.currentTarget.textContent = 'Berhasil Disalin ✓';
    } catch {
      event.currentTarget.textContent = 'Nomor: 12345678901';
    }
  });

  const updateMusicButton = (isPlaying) => {
    musicButton.classList.toggle('playing', isPlaying);
    musicButton.textContent = isPlaying ? '♫' : '♪';
    musicButton.title = isPlaying ? 'Jeda musik' : 'Putar musik';
    musicButton.setAttribute('aria-label', musicButton.title);
  };
  music.addEventListener('play', () => updateMusicButton(true));
  music.addEventListener('pause', () => updateMusicButton(false));
  musicButton.addEventListener('click', () => {
    if (music.paused) music.play().catch(() => updateMusicButton(false));
    else music.pause();
  });
});
