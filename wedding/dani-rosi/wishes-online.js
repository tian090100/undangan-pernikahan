(() => {
  const endpoint = 'https://ejdgpkgozhkteuofmwle.supabase.co/rest/v1/dani_rosi_wishes';
  // Publishable key: table grants and RLS allow public reading and new wishes only.
  const apiKey = 'sb_publishable_rw8BP21SoBjbWevbz6Be6Q_eFDGp2QL';
  const form = document.getElementById('wishes-form');
  const list = document.getElementById('wishes-list');
  const status = document.getElementById('wishes-status');
  const controls = document.getElementById('wishes-controls');
  const counter = document.getElementById('wish-counter');
  const previous = document.getElementById('wish-prev');
  const next = document.getElementById('wish-next');
  if (!form || !list || !status || !controls || !counter || !previous || !next) return;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let wishes = [];
  let current = 0;
  let timer;

  function show(index) {
    if (!wishes.length) return;
    current = (index + wishes.length) % wishes.length;
    [...list.children].forEach((card, position) => { card.hidden = position !== current; });
    counter.textContent = `${current + 1} / ${wishes.length}`;
  }

  function stopRotation() {
    clearInterval(timer);
    timer = undefined;
  }

  function startRotation() {
    stopRotation();
    if (wishes.length < 2 || reducedMotion.matches || document.hidden ||
        list.matches(':hover') || list.matches(':focus-within') ||
        controls.matches(':hover') || controls.matches(':focus-within')) return;
    timer = setInterval(() => show(current + 1), 5500);
  }

  function showMessage(message) {
    stopRotation();
    list.replaceChildren();
    const note = document.createElement('p');
    note.className = 'wishes-empty';
    note.textContent = message;
    list.append(note);
    controls.hidden = true;
  }

  function render() {
    stopRotation();
    if (!wishes.length) {
      showMessage('Belum ada ucapan. Jadilah yang pertama!');
      return;
    }
    list.replaceChildren();
    wishes.forEach(({ name, message, created_at }) => {
      const card = document.createElement('article');
      card.className = 'wish-card';
      const heading = document.createElement('div');
      heading.className = 'wish-card-heading';
      const author = document.createElement('strong');
      author.textContent = name;
      const time = document.createElement('time');
      time.textContent = new Intl.DateTimeFormat('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta'
      }).format(new Date(created_at));
      const body = document.createElement('p');
      body.textContent = message;
      heading.append(author, time);
      card.append(heading, body);
      list.append(card);
    });
    controls.hidden = wishes.length < 2;
    show(current);
    startRotation();
  }

  async function loadWishes() {
    try {
      const response = await fetch(endpoint + '?select=name,message,created_at&order=created_at.desc&limit=50', {
        headers: { apikey: apiKey }, cache: 'no-store'
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Invalid wishes response');
      wishes = data.filter(entry => entry && typeof entry.name === 'string' &&
        typeof entry.message === 'string' && !Number.isNaN(Date.parse(entry.created_at)));
      current = 0;
      render();
    } catch {
      if (!wishes.length) showMessage('Ucapan belum dapat dimuat. Silakan coba lagi nanti.');
    }
  }

  previous.addEventListener('click', () => { show(current - 1); startRotation(); });
  next.addEventListener('click', () => { show(current + 1); startRotation(); });
  for (const area of [list, controls]) {
    area.addEventListener('mouseenter', stopRotation);
    area.addEventListener('mouseleave', startRotation);
    area.addEventListener('focusin', stopRotation);
    area.addEventListener('focusout', startRotation);
  }
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) loadWishes();
    startRotation();
  });
  reducedMotion.addEventListener('change', startRotation);

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const name = form.elements.namedItem('name').value.trim();
    const message = form.elements.namedItem('message').value.trim();
    if (!name || name.length > 60 || !message || message.length > 500) {
      status.textContent = 'Mohon isi nama dan ucapan dengan benar.';
      return;
    }
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    status.textContent = 'Mengirim ucapan...';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { apikey: apiKey, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ name, message })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      form.reset();
      status.textContent = `Terima kasih, ${name}. Ucapan Anda sudah tampil untuk semua tamu.`;
      await loadWishes();
    } catch {
      status.textContent = 'Ucapan belum terkirim. Silakan coba lagi beberapa saat lagi.';
    } finally {
      button.disabled = false;
    }
  });

  showMessage('Memuat ucapan tamu...');
  loadWishes();
})();
