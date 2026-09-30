const guest = new URLSearchParams(location.search).get('to');
if (guest && guest.trim()) document.getElementById('guest-name').textContent = guest.trim().slice(0, 100);

function openInvitation() {
  document.body.classList.remove('locked');
  document.getElementById('cover').hidden = true;
  document.getElementById('invitation').setAttribute('aria-hidden', 'false');
  window.scrollTo(0, 0);
}
document.getElementById('open-invitation').addEventListener('click', openInvitation);
if (new URLSearchParams(location.search).get('preview') === '1') openInvitation();

document.getElementById('share').addEventListener('click', async () => {
  if (navigator.share) {
    try { await navigator.share({ title: 'Pratinjau Tanjung & Yuli', url: location.href }); } catch (_) {}
  } else if (navigator.clipboard) {
    await navigator.clipboard.writeText(location.href);
    const button = document.getElementById('share');
    button.textContent = 'Tersalin ✓';
    setTimeout(() => { button.textContent = 'Bagikan ↗'; }, 2200);
  }
});

const target = new Date('2026-10-26T10:00:00+07:00').getTime();
function updateCountdown() {
  let left = Math.max(0, target - Date.now());
  const days = Math.floor(left / 86400000); left %= 86400000;
  const hours = Math.floor(left / 3600000); left %= 3600000;
  const minutes = Math.floor(left / 60000); left %= 60000;
  const seconds = Math.floor(left / 1000);
  for (const [id, value] of Object.entries({ days, hours, minutes, seconds })) {
    document.getElementById(id).textContent = String(value).padStart(2, '0');
  }
}
updateCountdown();
setInterval(updateCountdown, 1000);

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
}

document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      const label = button.textContent;
      button.textContent = 'Tersalin ✓';
      setTimeout(() => { button.textContent = label; }, 2200);
    } catch {
      button.textContent = button.dataset.copy;
    }
  });
});

// Isi dengan endpoint penyimpanan sebelum undangan dibagikan kepada tamu.
const rsvpEndpoint = '';
const rsvpStorageKey = 'daprita-tanjung-yuli-rsvp-preview';
const rsvpForm = document.getElementById('rsvp-form');
const rsvpSlides = document.getElementById('rsvp-slides');
const rsvpControls = document.getElementById('rsvp-controls');
const rsvpCounter = document.getElementById('rsvp-counter');
const rsvpStatus = document.getElementById('rsvp-status');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let rsvpEntries = [];
let currentRsvp = 0;
let rsvpTimer;

function isValidRsvp(entry) {
  return entry && typeof entry.name === 'string' &&
    (entry.attendance === 'Hadir' || entry.attendance === 'Tidak hadir') &&
    typeof entry.message === 'string';
}

function showRsvp(index) {
  if (!rsvpEntries.length) return;
  currentRsvp = (index + rsvpEntries.length) % rsvpEntries.length;
  [...rsvpSlides.children].forEach((card, position) => {
    card.hidden = position !== currentRsvp;
  });
  rsvpCounter.textContent = `${currentRsvp + 1} / ${rsvpEntries.length}`;
}

function stopRsvpRotation() {
  clearInterval(rsvpTimer);
  rsvpTimer = undefined;
}

function startRsvpRotation() {
  stopRsvpRotation();
  if (rsvpEntries.length < 2 || reducedMotion.matches || document.hidden ||
      rsvpSlides.matches(':hover') || rsvpSlides.matches(':focus-within') ||
      rsvpControls.matches(':hover') || rsvpControls.matches(':focus-within')) return;
  rsvpTimer = setInterval(() => showRsvp(currentRsvp + 1), 6500);
}

function renderRsvp() {
  stopRsvpRotation();
  rsvpSlides.replaceChildren();
  rsvpControls.hidden = rsvpEntries.length < 2;
  if (!rsvpEntries.length) {
    const empty = document.createElement('p');
    empty.className = 'rsvp-empty';
    empty.textContent = 'Belum ada ucapan. Doa pertama dari Anda akan tampil di sini.';
    rsvpSlides.append(empty);
    return;
  }
  rsvpEntries.forEach(entry => {
    const card = document.createElement('article');
    card.className = 'rsvp-card';
    const badge = document.createElement('span');
    badge.className = entry.attendance === 'Hadir' ? 'rsvp-badge is-attending' : 'rsvp-badge';
    badge.textContent = entry.attendance === 'Hadir' ? 'Akan hadir' : 'Berhalangan hadir';
    const quote = document.createElement('p');
    quote.className = 'rsvp-quote';
    quote.textContent = entry.message.trim() || 'Terima kasih sudah menyampaikan konfirmasi kehadiran.';
    const byline = document.createElement('div');
    byline.className = 'rsvp-byline';
    const name = document.createElement('strong');
    name.textContent = entry.name;
    const date = document.createElement('time');
    date.textContent = entry.date || '';
    byline.append(name, date);
    card.append(badge, quote, byline);
    rsvpSlides.append(card);
  });
  showRsvp(currentRsvp);
  startRsvpRotation();
}

function loadLocalRsvp() {
  try {
    const saved = JSON.parse(localStorage.getItem(rsvpStorageKey) || '[]');
    if (Array.isArray(saved)) rsvpEntries = saved.filter(isValidRsvp).slice(0, 50);
  } catch { rsvpEntries = []; }
  renderRsvp();
}

async function loadRemoteRsvp() {
  try {
    const response = await fetch(rsvpEndpoint, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.entries)) throw new Error('Invalid RSVP response');
    rsvpEntries = data.entries.filter(isValidRsvp).slice(0, 50);
    document.getElementById('rsvp-storage-note').hidden = true;
    renderRsvp();
  } catch {
    rsvpSlides.replaceChildren();
    const error = document.createElement('p');
    error.className = 'rsvp-empty';
    error.textContent = 'Ucapan belum dapat dimuat. Coba buka kembali halaman ini nanti.';
    rsvpSlides.append(error);
  }
}

document.getElementById('rsvp-prev').addEventListener('click', () => { showRsvp(currentRsvp - 1); startRsvpRotation(); });
document.getElementById('rsvp-next').addEventListener('click', () => { showRsvp(currentRsvp + 1); startRsvpRotation(); });
for (const area of [rsvpSlides, rsvpControls]) {
  area.addEventListener('mouseenter', stopRsvpRotation);
  area.addEventListener('mouseleave', startRsvpRotation);
  area.addEventListener('focusin', stopRsvpRotation);
  area.addEventListener('focusout', startRsvpRotation);
}
document.addEventListener('visibilitychange', startRsvpRotation);
reducedMotion.addEventListener('change', startRsvpRotation);

rsvpForm.addEventListener('submit', async event => {
  event.preventDefault();
  const data = new FormData(rsvpForm);
  const name = String(data.get('name') || '').trim().slice(0, 60);
  const attendance = String(data.get('attendance') || '');
  const guests = attendance === 'Hadir' ? Number(data.get('guests') || 1) : 0;
  const message = String(data.get('message') || '').trim().slice(0, 500);
  if (!name || !['Hadir', 'Tidak hadir'].includes(attendance)) return;
  const entry = {
    name, attendance, guests, message,
    date: new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())
  };
  const button = rsvpForm.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    if (rsvpEndpoint) {
      rsvpStatus.textContent = 'Mengirim konfirmasi...';
      const response = await fetch(rsvpEndpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entry)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await loadRemoteRsvp();
      rsvpStatus.textContent = `Terima kasih, ${name}. RSVP dan ucapan Anda sudah terkirim.`;
    } else {
      rsvpEntries.unshift(entry);
      rsvpEntries = rsvpEntries.slice(0, 50);
      currentRsvp = 0;
      localStorage.setItem(rsvpStorageKey, JSON.stringify(rsvpEntries));
      renderRsvp();
      rsvpStatus.textContent = `Terima kasih, ${name}. Respons tampil di pratinjau perangkat ini, belum terkirim secara online.`;
    }
    rsvpForm.reset();
  } catch {
    rsvpStatus.textContent = 'Konfirmasi belum tersimpan. Silakan coba lagi beberapa saat lagi.';
  } finally {
    button.disabled = false;
  }
});

if (rsvpEndpoint) loadRemoteRsvp();
else loadLocalRsvp();
