(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const params = new URLSearchParams(location.search);
  const guest = (params.get('to') || 'Tamu Undangan').slice(0,100);
  $('#guest').textContent = guest;
  $$('input[name=name]').forEach(el => el.value = guest === 'Tamu Undangan' ? '' : guest.slice(0,60));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let opened = false, photo = 0, story = 0, photoTimer;
  const musicButton = $('#music');
  const soundtrack = $('#soundtrack');
  const video = {hidden:false,pause(){},play(){ document.querySelector('.motion').classList.add('batak-playing'); return Promise.resolve(); },addEventListener(){}};
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12}) : null;
  function startReveals(){if(observer){document.body.classList.add('animated');$$('.reveal').forEach(el => observer.observe(el));}}
  function showPhoto(index){photo=(index+3)%3;$$('.slide').forEach((el,i)=>el.classList.toggle('active',i===photo));}
  function showStory(index){story=(index+3)%3;$$('.story-slide').forEach((el,i)=>el.classList.toggle('active',i===story));$('#story-count').textContent=`${story+1} / 3`;}
  function syncTimers(){clearInterval(photoTimer);if(opened&&!document.hidden&&!reduced.matches){photoTimer=setInterval(()=>showPhoto(photo+1),5000);}}
  $('#story-prev').addEventListener('click',()=>{showStory(story-1);syncTimers();});
  $('#story-next').addEventListener('click',()=>{showStory(story+1);syncTimers();});
  function revealMotionText(){$('.motion-text').classList.add('shown');}
  async function open(){
    if(opened)return;opened=true;$('#open').disabled=true;
    $('#contents').hidden=false;musicButton.hidden=false;
    if(params.get('preview')!=='1') playSoundtrack();
    const cover=$('#cover');cover.style.position='absolute';cover.style.inset='0 0 auto';
    requestAnimationFrame(()=>cover.classList.add('leaving'));
    document.body.classList.remove('locked');window.scrollTo(0,0);startReveals();syncTimers();
    setTimeout(()=>cover.hidden=true,reduced.matches?0:1300);
    if(reduced.matches){video.hidden=true;revealMotionText();return;}
    setTimeout(revealMotionText,800);
    try{await video.play();}catch{revealMotionText();}
  }
  video.addEventListener('error',revealMotionText);video.addEventListener('ended',revealMotionText);
  $('#open').addEventListener('click',open);
  function playSoundtrack(){
    soundtrack.play().catch(syncMusicButton);
  }
  function syncMusicButton(){
    const playing = !soundtrack.paused && !soundtrack.error;
    musicButton.setAttribute('aria-pressed', String(playing));
    musicButton.setAttribute('aria-label', playing ? 'Jeda Horbo Paung' : 'Putar Horbo Paung');
  }
  for(const event of ['playing', 'pause', 'error']){
    soundtrack.addEventListener(event, syncMusicButton);
  }
  musicButton.addEventListener('click', ()=>{
    if(soundtrack.paused) playSoundtrack();
    else soundtrack.pause();
  });
  const wishEndpoint = 'https://ejdgpkgozhkteuofmwle.supabase.co/rest/v1/rexy_indah_wishes';
  const wishHeaders = { apikey: 'sb_publishable_rw8BP21SoBjbWevbz6Be6Q_eFDGp2QL' };
  const wishForm = $('#wish-form');
  const wishList = $('#wish-list');
  const wishStatus = $('#wish-status');
  const wishButton = wishForm.querySelector('button');

  async function loadWishes() {
    try {
      const response = await fetch(wishEndpoint + '?select=name,message&order=created_at.desc&limit=50', {
        headers: wishHeaders, cache: 'no-store'
      });
      if (!response.ok) throw new Error('Unable to load wishes');
      const wishes = await response.json();
      wishList.replaceChildren(...wishes.map(({name, message}) => {
        const entry = document.createElement('article');
        const author = document.createElement('b');
        const body = document.createElement('p');
        author.textContent = name;
        body.textContent = message;
        entry.append(author, body);
        return entry;
      }));
      if (!wishes.length) wishList.textContent = 'Belum ada ucapan.';
    } catch {
      if (!wishList.childElementCount) wishList.textContent = 'Ucapan belum bisa dimuat. Coba muat ulang halaman.';
    }
  }

  wishForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (wishButton.disabled) return;
    const name = wishForm.elements.namedItem('name').value.trim();
    const messageField = wishForm.elements.namedItem('message');
    const message = messageField.value.trim();
    if (!name || !message) {
      wishStatus.textContent = 'Isi nama dan ucapan terlebih dahulu.';
      return;
    }
    wishButton.disabled = true;
    wishStatus.textContent = 'Mengirim ucapan…';
    try {
      const response = await fetch(wishEndpoint, {
        method: 'POST',
        headers: {...wishHeaders, 'Content-Type': 'application/json', Prefer: 'return=minimal'},
        body: JSON.stringify({name, message})
      });
      if (!response.ok) throw new Error('Unable to save wish');
      messageField.value = '';
      wishStatus.textContent = 'Ucapan terkirim. Terima kasih!';
      await loadWishes();
    } catch {
      wishStatus.textContent = 'Ucapan belum terkirim. Silakan coba lagi.';
    } finally {
      wishButton.disabled = false;
    }
  });
  loadWishes();
  document.addEventListener('visibilitychange',()=>{syncTimers();if(document.hidden){video.pause();soundtrack.pause();}});
  reduced.addEventListener('change',syncTimers);
  window.addEventListener('pagehide',()=>{clearInterval(photoTimer);video.pause();soundtrack.pause();});
  // The form leaves the countdown choice blank; use the first ceremony (WIB).
  const ceremonyTime=Date.parse('2026-11-21T09:00:00+07:00');
  function updateCountdown(){const remaining=Math.max(0,Math.floor((ceremonyTime-Date.now())/1000));const values=[Math.floor(remaining/86400),Math.floor(remaining/3600)%24,Math.floor(remaining/60)%60,remaining%60];$$('.countdown b').forEach((el,i)=>el.textContent=String(values[i]).padStart(2,'0'));}
  updateCountdown();const countdownTimer=setInterval(updateCountdown,1000);
  window.addEventListener('pagehide',()=>clearInterval(countdownTimer));
  const shareButton = $('#share-invitation');
  shareButton.addEventListener('click', async () => {
    const invitationUrl = new URL('./', location.href);
    const guestName = params.get('to')?.trim().slice(0, 100);
    const recipient = guestName || 'Bapak/Ibu/Saudara/i';
    if (guestName) invitationUrl.searchParams.set('to', guestName);
    const invitationText = `Kepada Yth.\n*${recipient}*\n\nShalom, Horas.\n\nTanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri pernikahan kami.\n\nBerikut link undangan kami untuk informasi lengkap acara:\n${invitationUrl.href}\n\nMerupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.\n\nTerima kasih.\nRexy & Indah`;
    if (navigator.share) {
      try {
        await navigator.share({title: 'Undangan Pernikahan Rexy & Indah', text: invitationText});
        return;
      } catch (error) {
        if (error.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(invitationText);
      shareButton.textContent = 'Pesan disalin';
      setTimeout(() => { shareButton.textContent = 'Bagikan Undangan'; }, 1800);
    } catch {
      window.prompt('Salin pesan undangan', invitationText);
    }
  });
  if(params.get('preview')==='1')open();
})();