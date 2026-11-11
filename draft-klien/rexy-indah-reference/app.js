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
  $('#wish-form').addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.target);const entry=document.createElement('article'),name=document.createElement('b'),message=document.createElement('p');name.textContent=String(data.get('name')).slice(0,60);message.textContent=String(data.get('message')).slice(0,500);entry.append(name,message);$('#wish-list').prepend(entry);event.target.elements.message.value='';$('#wish-status').textContent='Pratinjau: ucapan tampil di tab ini saja; hilang setelah reload.';});
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
    const url = new URL('./', location.href).href;
    if (navigator.share) {
      try {
        await navigator.share({title: 'Undangan Rexy & Indah', url});
        return;
      } catch (error) {
        if (error.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      shareButton.textContent = 'Tautan disalin';
      setTimeout(() => { shareButton.textContent = 'Bagikan Undangan'; }, 1800);
    } catch {
      window.prompt('Salin tautan undangan', url);
    }
  });
  if(params.get('preview')==='1')open();
})();