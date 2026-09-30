const wishesEndpoint = 'https://ejdgpkgozhkteuofmwle.supabase.co/rest/v1/lizwan_naomi_rsvp';
// This publishable key is intended for browser use; database grants and RLS limit access.
const wishesApiKey = 'sb_publishable_rw8BP21SoBjbWevbz6Be6Q_eFDGp2QL';
const wishesForm = document.getElementById('rsvp-form');
const wishesStatus = document.getElementById('status');
const wishesTrack = document.getElementById('wishes-track');
const wishesControls = document.getElementById('wishes-controls');
const wishesCounter = document.getElementById('wishes-counter');
const wishesReducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let wishes = [];
let activeWish = 0;
let wishesTimer;

function showWish(index) {
  if (!wishes.length) return;
  activeWish = (index + wishes.length) % wishes.length;
  [...wishesTrack.children].forEach((card, position) => {
    card.hidden = position !== activeWish;
  });
  wishesCounter.textContent = `${activeWish + 1} / ${wishes.length}`;
}

function stopWishesRotation() {
  clearInterval(wishesTimer);
  wishesTimer = undefined;
}

function startWishesRotation() {
  stopWishesRotation();
  if (wishes.length < 2 || wishesReducedMotion.matches || document.hidden ||
      wishesTrack.matches(':hover') || wishesTrack.matches(':focus-within') ||
      wishesControls.matches(':hover') || wishesControls.matches(':focus-within')) return;
  wishesTimer = setInterval(() => showWish(activeWish + 1), 6500);
}

function showWishesMessage(message) {
  wishesTrack.replaceChildren();
  const note = document.createElement('p');
  note.className = 'wishes-empty';
  note.textContent = message;
  wishesTrack.append(note);
  wishesControls.hidden = true;
}

function renderWishes() {
  stopWishesRotation();
  if (!wishes.length) {
    showWishesMessage('Belum ada ucapan. Jadilah yang pertama mengirim doa untuk Lizwan & Naomi.');
    return;
  }
  wishesTrack.replaceChildren();
  wishes.forEach(entry => {
    const card = document.createElement('article');
    card.className = 'wish-card';
    const badge = document.createElement('span');
    badge.className = 'wish-badge';
    badge.textContent = entry.attendance === 'Hadir' ? 'Akan hadir' : 'Berhalangan hadir';
    const quote = document.createElement('p');
    quote.className = 'wish-quote';
    quote.textContent = entry.message;
    const byline = document.createElement('div');
    byline.className = 'wish-byline';
    const name = document.createElement('strong');
    name.textContent = entry.name;
    const date = document.createElement('time');
    date.textContent = entry.date;
    byline.append(name, date);
    card.append(badge, quote, byline);
    wishesTrack.append(card);
  });
  wishesControls.hidden = wishes.length < 2;
  showWish(activeWish);
  startWishesRotation();
}

async function loadWishes() {
  try {
    const query = '?select=name,attendance,message,created_at&order=created_at.desc&limit=50';
    const response = await fetch(wishesEndpoint + query, {
      headers: { apikey: wishesApiKey }, cache: 'no-store'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('Invalid RSVP response');
    wishes = data.filter(entry => entry && typeof entry.name === 'string' &&
      ['Hadir', 'Tidak hadir'].includes(entry.attendance) && typeof entry.message === 'string')
      .map(entry => ({
        ...entry,
        date: new Intl.DateTimeFormat('id-ID', {
          day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta'
        }).format(new Date(entry.created_at))
      }));
    activeWish = 0;
    renderWishes();
  } catch {
    if (!wishes.length) showWishesMessage('Ucapan belum dapat dimuat. Silakan coba lagi nanti.');
  }
}

document.getElementById('wishes-prev').addEventListener('click', () => {
  showWish(activeWish - 1);
  startWishesRotation();
});
document.getElementById('wishes-next').addEventListener('click', () => {
  showWish(activeWish + 1);
  startWishesRotation();
});
for (const area of [wishesTrack, wishesControls]) {
  area.addEventListener('mouseenter', stopWishesRotation);
  area.addEventListener('mouseleave', startWishesRotation);
  area.addEventListener('focusin', stopWishesRotation);
  area.addEventListener('focusout', startWishesRotation);
}
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) loadWishes();
  startWishesRotation();
});
wishesReducedMotion.addEventListener('change', startWishesRotation);

wishesForm.addEventListener('submit', async event => {
  event.preventDefault();
  const data = new FormData(wishesForm);
  const name = String(data.get('name') || '').trim();
  const attendance = String(data.get('attendance') || '');
  const guests = attendance === 'Hadir' ? Number(data.get('guests') || 1) : 0;
  const message = String(data.get('message') || '').trim();
  if (!name || name.length > 60 || !['Hadir', 'Tidak hadir'].includes(attendance) ||
      !Number.isInteger(guests) || guests < 0 || guests > 2 ||
      !message || message.length > 500) {
    wishesStatus.textContent = 'Periksa kembali nama, kehadiran, dan ucapan Anda.';
    return;
  }

  const button = wishesForm.querySelector('button[type="submit"]');
  button.disabled = true;
  wishesStatus.textContent = 'Mengirim konfirmasi...';
  try {
    const response = await fetch(wishesEndpoint, {
      method: 'POST',
      headers: {
        apikey: wishesApiKey,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({ name, attendance, guests, message })
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    wishes.unshift({
      name, attendance, message,
      date: new Intl.DateTimeFormat('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta'
      }).format(new Date())
    });
    wishes = wishes.slice(0, 50);
    activeWish = 0;
    renderWishes();
    wishesForm.reset();
    wishesStatus.textContent = `Mauliate, ${name}. RSVP dan ucapan Anda sudah tampil di undangan.`;
    loadWishes();
  } catch {
    wishesStatus.textContent = 'Konfirmasi belum tersimpan. Silakan coba lagi beberapa saat lagi.';
  } finally {
    button.disabled = false;
  }
});

showWishesMessage('Memuat doa dan ucapan tamu...');
loadWishes();
