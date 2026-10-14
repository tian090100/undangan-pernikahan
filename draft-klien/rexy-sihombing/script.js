(() => {
  'use strict';
  const config = window.REXY_CONFIG;
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const params = new URLSearchParams(location.search);
  const guest = (params.get('to') || '').trim().slice(0, 100);
  if (guest) { $('#guest-name').textContent = guest; $('[name=name]').value = guest.slice(0, 60); }
  $$('[data-groom]').forEach(el => { el.textContent = config.groom; });
  $$('[data-bride]').forEach(el => { el.textContent = config.bride; });
  document.title = `${config.groom} & ${config.bride} — DAPRITA Bespoke`;
  if (config.familyGroom) $('#family-groom').textContent = config.familyGroom;
  if (config.familyBride) $('#family-bride').textContent = config.familyBride;
  if (config.verse) $('#verse-text').textContent = config.verse;
  if (config.verseReference) $('#verse-reference').textContent = config.verseReference;
  let toastTimeout;
  function toast(text) {
    $('#toast').textContent = text; $('#toast').classList.add('show');
    clearTimeout(toastTimeout); toastTimeout = setTimeout(() => $('#toast').classList.remove('show'), 4000);
  }
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  // Four carved corners belong only to the heritage pages, never the slider/cover.
  $$('main > .section, main > .closing').forEach(page => {
    const corners = el('div', 'heritage-corners'); corners.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 4; i++) corners.append(el('span'));
    page.append(corners);
  });
  function validDate(value) { return !!value && Number.isFinite(new Date(value).getTime()); }
  function httpsUrl(value) { try { const url = new URL(value); return url.protocol === 'https:' ? url.href : null; } catch { return null; } }
  const dateFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'full', timeZone: 'Asia/Jakarta' });
  const formatDate = value => validDate(value) ? dateFormatter.format(new Date(value)) : 'Tanggal menyusul';
  function calendar(event) {
    if (!validDate(event.date)) return;
    const start = new Date(event.date); const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const stamp = date => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const escape = text => String(text || '').replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/[,;]/g, '\\$&');
    const content = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//DAPRITA//Wedding//ID','BEGIN:VEVENT',`UID:rexy-${start.getTime()}@daprita.web.id`,`DTSTAMP:${stamp(new Date())}`,`DTSTART:${stamp(start)}`,`DTEND:${stamp(end)}`,`SUMMARY:${escape(`${event.name} — ${config.groom} & ${config.bride}`)}`,`LOCATION:${escape([event.venue,event.address].filter(Boolean).join(', '))}`,'END:VEVENT','END:VCALENDAR'].join('\r\n');
    const href = URL.createObjectURL(new Blob([content], { type: 'text/calendar;charset=utf-8' }));
    const a = el('a'); a.href = href; a.download = 'pernikahan-rexy.ics'; a.click();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
  }
  config.events.forEach((event, index) => {
    const card = el('article', 'event-card reveal');
    const venueImage = el('div', `event-image venue-${index % 2}`);
    venueImage.setAttribute('role', 'img');
    venueImage.setAttribute('aria-label', index === 0 ? 'Ilustrasi gereja, bukan lokasi acara final' : 'Ilustrasi rumah Batak, bukan lokasi acara final');
    card.append(venueImage);
    card.append(el('p', 'eyebrow', `RANGKAIAN ${String(index + 1).padStart(2, '0')}`), el('h3', '', event.name));
    const details = el('dl');
    [['Tanggal', formatDate(event.date)], ['Waktu', event.time || 'Waktu menyusul'], ['Tempat', event.venue || 'Lokasi menyusul'], ['Alamat', event.address || 'Alamat menunggu konfirmasi']].forEach(([label,value]) => {
      const row = el('div'); row.append(el('dt','',label),el('dd','',value)); details.append(row);
    });
    card.append(details, el('p', 'venue-note', 'Foto ilustrasi · lokasi belum final'));
    const actions = el('div', 'event-actions'); const maps = httpsUrl(event.maps);
    if (maps) { const link = el('a', '', 'Lihat Maps ↗'); link.href = maps; link.target = '_blank'; link.rel = 'noopener noreferrer'; actions.append(link); }
    else { const button = el('button', '', 'Maps menyusul'); button.type = 'button'; button.disabled = true; actions.append(button); }
    const save = el('button', '', validDate(event.date) ? 'Simpan Tanggal ↗' : 'Tanggal menyusul'); save.type = 'button'; save.disabled = !validDate(event.date); save.addEventListener('click', () => calendar(event)); actions.append(save); card.append(actions); $('#event-list').append(card);
  });
  if (config.story?.length) {
    $('#story-list').replaceChildren();
    config.story.forEach((item,index) => { const article = el('article','reveal'); const copy=el('div'); copy.append(el('h3','',item.title),el('p','',item.text)); article.append(el('span','',String(index+1).padStart(2,'0')),copy); $('#story-list').append(article); });
    $('.story-section .section-header .fine').hidden = true;
  }
  let countdownTimer;
  if (validDate(config.date)) {
    $('#hero-date').textContent = formatDate(config.date); $('#countdown-note').textContent = formatDate(config.date);
    const update = () => { let remaining = Math.max(0, new Date(config.date).getTime() - Date.now()); const days = Math.floor(remaining / 86400000); remaining %= 86400000; const hours = Math.floor(remaining / 3600000); remaining %= 3600000; const minutes = Math.floor(remaining / 60000); const seconds = Math.floor(remaining % 60000 / 1000); Object.entries({days,hours,minutes,seconds}).forEach(([key,value]) => { $(`#${key}`).textContent = String(value).padStart(2,'0'); }); };
    update(); countdownTimer = setInterval(update,1000);
  }
  const giftToggle = $('#gift-toggle');
  giftToggle.addEventListener('click', () => { const open = giftToggle.getAttribute('aria-expanded') !== 'true'; giftToggle.setAttribute('aria-expanded',String(open)); $('#gift-details').hidden = !open; giftToggle.replaceChildren(document.createTextNode(open ? 'Sembunyikan Tanda Kasih ' : 'Lihat Tanda Kasih '),el('span','',open ? '−' : '+')); });
  if (config.bank?.number) {
    $('#bank-name').textContent = config.bank.name; $('#bank-number').textContent = config.bank.number; $('#bank-owner').textContent = config.bank.owner;
    $('#copy-bank').disabled = false; $('#copy-bank').textContent = 'Salin Rekening';
    $('#copy-bank').addEventListener('click', async () => { try { await navigator.clipboard.writeText(config.bank.number); toast('Nomor rekening tersalin.'); } catch { toast(`Salin manual: ${config.bank.number}`); } });
  }
  if (config.giftAddress) $('#gift-address').textContent = config.giftAddress;

  // Opening and hero slideshow. No motion starts under the closed cover.
  let opened = false; let slide = 0; let heroTimer; let heroPaused = reduced.matches; let heroVisible = true; let touchStart;
  const slides = $$('.hero-slide'); const dots = $$('[data-slide]');
  function showSlide(index) {
    slide = (index + slides.length) % slides.length;
    slides.forEach((node,i) => { node.classList.toggle('is-active',i === slide); node.setAttribute('aria-hidden',String(i !== slide)); });
    dots.forEach((node,i) => { node.classList.toggle('is-active',i === slide); node.setAttribute('aria-pressed',String(i === slide)); });
    $('#slide-counter').textContent = `${String(slide + 1).padStart(2,'0')} / 03`;
  }
  function syncHero() {
    clearInterval(heroTimer);
    if (opened && !heroPaused && heroVisible && !document.hidden && !$('#lightbox').open) heroTimer = setInterval(() => showSlide(slide + 1),6000);
  }
  dots.forEach(node => node.addEventListener('click', () => { showSlide(Number(node.dataset.slide)); syncHero(); }));
  $('.hero').addEventListener('touchstart', event => { touchStart = { x:event.changedTouches[0].clientX,y:event.changedTouches[0].clientY }; },{passive:true});
  $('.hero').addEventListener('touchend', event => { if (!touchStart) return; const dx=event.changedTouches[0].clientX-touchStart.x; const dy=event.changedTouches[0].clientY-touchStart.y; if(Math.abs(dx)>55 && Math.abs(dx)>Math.abs(dy)) { showSlide(slide+(dx<0?1:-1)); syncHero(); } touchStart=null; },{passive:true});

  // Original synthesized ambient sample, not a customer's chosen song.
  let audioContext, audioGain, ambientTimer, chordIndex = 0; let musicPlaying = false;
  const audio = $('#music-audio'); if(config.music) audio.src = config.music;
  function ambientChord() {
    if (!audioContext || audioContext.state !== 'running') return;
    const chords = [[196,246.94,293.66],[174.61,220,261.63],[164.81,196,246.94],[174.61,220,293.66]];
    const chord=chords[chordIndex++ % chords.length]; const now=audioContext.currentTime;
    chord.forEach((frequency,index) => { const oscillator=audioContext.createOscillator(); const envelope=audioContext.createGain(); oscillator.type='sine'; oscillator.frequency.value=frequency; const begin=now+index*.45; envelope.gain.setValueAtTime(0,begin); envelope.gain.linearRampToValueAtTime(.045,begin+.8); envelope.gain.exponentialRampToValueAtTime(.0001,begin+5.4); oscillator.connect(envelope); envelope.connect(audioGain); oscillator.start(begin); oscillator.stop(begin+5.5); oscillator.onended=()=>{oscillator.disconnect();envelope.disconnect();}; });
  }
  async function playMusic() {
    try {
      if(config.music) await audio.play();
      else { const AudioEngine=window.AudioContext || window.webkitAudioContext; if(!AudioEngine) throw new Error('Audio unavailable'); if(!audioContext) { audioContext=new AudioEngine(); audioGain=audioContext.createGain(); audioGain.gain.value=.7; audioGain.connect(audioContext.destination); } await audioContext.resume(); ambientChord(); clearInterval(ambientTimer); ambientTimer=setInterval(ambientChord,5200); }
      musicPlaying=true; syncMusic();
    } catch { musicPlaying=false; syncMusic(); toast('Musik belum dapat diputar. Ketuk tombol musik untuk mencoba.'); }
  }
  function pauseMusic() { audio.pause(); clearInterval(ambientTimer); if(audioContext) audioContext.suspend().catch(()=>{}); musicPlaying=false; syncMusic(); }
  function syncMusic() { $('#music-control').setAttribute('aria-pressed',String(musicPlaying)); $('#music-control').setAttribute('aria-label',`${musicPlaying?'Jeda':'Putar'} ${config.music?'musik':'musik ilustrasi'}`); }
  $('#music-control').addEventListener('click', () => musicPlaying ? pauseMusic() : playMusic());
  function openInvitation(withMusic = true) {
    if(opened) return; opened=true; $('#open-invitation').disabled=true;
    if(withMusic) playMusic();
    const transition = $('#opening-transition');
    const finish = () => {
      transition.hidden = true;
      transition.classList.remove('is-visible', 'opening');
      document.body.classList.remove('locked');
      $('#dock').hidden = false;
      $('#music-control').hidden = false;
      syncHero();
      syncWishes();
    };
    const reveal = () => { $('#cover').hidden=true; $('#invitation').inert=false; window.scrollTo({top:0,left:0,behavior:'instant'}); };
    if(reduced.matches || params.get('preview') === '1') { reveal(); finish(); return; }
    // Cloth is absent initially. It appears only after the user's opening tap,
    // briefly covers the artwork, then opens to reveal the photo homepage.
    transition.hidden=false; transition.dataset.phase='covering';
    requestAnimationFrame(() => requestAnimationFrame(() => transition.classList.add('is-visible')));
    setTimeout(() => { reveal(); transition.dataset.phase='opening'; transition.classList.add('opening'); },420);
    setTimeout(finish,2150);
  }
  $('#open-invitation').addEventListener('click', () => openInvitation());

  // Native modal: trapped focus, Escape, arrows, no photo description overlay.
  const lightbox=$('#lightbox'); let galleryIndex=0; let galleryTrigger;
  function showGallery(index) { galleryIndex=(index+3)%3; $('#lightbox-photo').style.backgroundPosition=`${galleryIndex*50}% 50%`; $('#lightbox-count').textContent=`${galleryIndex+1} / 3`; $('#lightbox-photo').setAttribute('aria-label',`Foto ilustrasi pasangan ${galleryIndex+1}`); }
  $$('[data-gallery]').forEach(button => button.addEventListener('click', () => { galleryTrigger=button; showGallery(Number(button.dataset.gallery)); lightbox.showModal(); document.body.classList.add('modal-open'); syncHero(); syncWishes(); }));
  $('#lightbox-close').addEventListener('click', () => lightbox.close());
  $('#lightbox-prev').addEventListener('click', () => showGallery(galleryIndex-1)); $('#lightbox-next').addEventListener('click', () => showGallery(galleryIndex+1));
  lightbox.addEventListener('keydown', event => { if(event.key==='ArrowRight') showGallery(galleryIndex+1); if(event.key==='ArrowLeft') showGallery(galleryIndex-1); });
  lightbox.addEventListener('click', event => { if(event.target===lightbox) { const r=lightbox.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) lightbox.close(); } });
  lightbox.addEventListener('close', () => { document.body.classList.remove('modal-open'); syncHero(); syncWishes(); galleryTrigger?.focus({preventScroll:true}); });

  // Draft RSVP only. In-memory data never leaks into another client's table.
  const wishes=[{name:'Keluarga Contoh',attendance:'Hadir',message:'Selamat menempuh perjalanan baru. Semoga selalu berjalan bersama dalam kasih dan sukacita.',date:'Ucapan ilustrasi'},{name:'Sahabat Contoh',attendance:'Hadir',message:'Turut berbahagia! Semoga hari pernikahan menjadi awal dari banyak kenangan indah.',date:'Ucapan ilustrasi'},{name:'Tamu Contoh',attendance:'Tidak hadir',message:'Doa terbaik untuk kalian berdua. Semoga rumah tangga kalian penuh damai dan kebahagiaan.',date:'Ucapan ilustrasi'}];
  let wishIndex=0; let wishTimer; let wishesPaused=reduced.matches; let wishesVisible=false; let wishInteracting=false;
  function renderWish(index) {
    wishIndex=(index+wishes.length)%wishes.length; const entry=wishes[wishIndex]; const top=el('div','wish-top'); top.append(el('span','wish-avatar',entry.name.slice(0,1).toUpperCase()),el('strong','wish-name',entry.name),el('span','wish-badge',entry.attendance));
    const message=el('p','wish-message',entry.message || 'Terima kasih atas konfirmasi kehadirannya.'); message.tabIndex=0;
    $('#wish-card').replaceChildren(top,message,el('p','wish-date',entry.date)); $('#wish-count').textContent=`${wishIndex+1} / ${wishes.length}`;
  }
  function syncWishes() {
    clearInterval(wishTimer); $('#wish-pause').textContent=wishesPaused?'▷':'Ⅱ'; $('#wish-pause').setAttribute('aria-label',wishesPaused?'Putar ucapan otomatis':'Jeda ucapan otomatis');
    if(opened&&wishesVisible&&!wishesPaused&&!wishInteracting&&!document.hidden&&!lightbox.open) wishTimer=setInterval(()=>renderWish(wishIndex+1),6500);
  }
  $('#wish-prev').addEventListener('click',()=>{renderWish(wishIndex-1);syncWishes();}); $('#wish-next').addEventListener('click',()=>{renderWish(wishIndex+1);syncWishes();}); $('#wish-pause').addEventListener('click',()=>{wishesPaused=!wishesPaused;syncWishes();});
  $('.wishes').addEventListener('pointerenter',()=>{wishInteracting=true;syncWishes();}); $('.wishes').addEventListener('pointerleave',()=>{wishInteracting=$('.wishes').contains(document.activeElement);syncWishes();});
  $('.wishes').addEventListener('focusin',()=>{wishInteracting=true;syncWishes();}); $('.wishes').addEventListener('focusout',()=>{setTimeout(()=>{wishInteracting=$('.wishes').contains(document.activeElement);syncWishes();},0);});
  renderWish(0);
  const form=$('#rsvp-form');
  form.addEventListener('change',()=>{const attending=form.elements.attendance.value; form.elements.guests.disabled=attending==='Tidak hadir';});
  form.addEventListener('submit',event=>{
    event.preventDefault(); const data=new FormData(form); const name=String(data.get('name')||'').trim().slice(0,60); const attendance=String(data.get('attendance')||''); const message=String(data.get('message')||'').trim().slice(0,500);
    if(!name||!['Hadir','Tidak hadir','Belum pasti'].includes(attendance)) { $('#rsvp-status').textContent='Isi nama dan konfirmasi kehadiran terlebih dahulu.'; return; }
    wishes.unshift({name,attendance,message,date:new Intl.DateTimeFormat('id-ID',{dateStyle:'medium'}).format(new Date())}); if(wishes.length>50) wishes.pop(); renderWish(0); syncWishes();
    $('#rsvp-status').textContent='Pratinjau berhasil. Kiriman tampil di tab ini saja dan hilang saat dimuat ulang; belum terkirim online.';
    form.elements.message.value=''; toast('Ucapan pratinjau ditampilkan.');
  });
  if('IntersectionObserver' in window) {
    document.body.classList.add('js-reveal');
    const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}}),{threshold:.08}); $$('.reveal').forEach(node=>revealObserver.observe(node));
    const activityObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.target===$('.hero')) {heroVisible=entry.isIntersecting;syncHero();} else {wishesVisible=entry.isIntersecting;syncWishes();}}),{threshold:.12}); activityObserver.observe($('.hero')); activityObserver.observe($('.wishes'));
    const navObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){$$('.dock a').forEach(link=>{const active=link.hash===`#${entry.target.id}`;link.classList.toggle('is-active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}}),{rootMargin:'-10% 0px -65% 0px',threshold:0}); $$('main>section[id]').filter(node=>$(`.dock a[href="#${node.id}"]`)).forEach(node=>navObserver.observe(node));
  } else { wishesVisible=true; }
  document.addEventListener('visibilitychange',()=>{syncHero();syncWishes();if(document.hidden&&musicPlaying)pauseMusic();});
  reduced.addEventListener('change',()=>{if(reduced.matches){heroPaused=true;wishesPaused=true;}syncHero();syncWishes();});
  window.addEventListener('pagehide',()=>{clearInterval(heroTimer);clearInterval(wishTimer);clearInterval(countdownTimer);pauseMusic();});
  if(params.get('preview')==='1') openInvitation(false);
})();
