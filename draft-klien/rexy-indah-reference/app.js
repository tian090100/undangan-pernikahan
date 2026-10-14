(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const params = new URLSearchParams(location.search);
  const guest = (params.get('to') || 'Tamu Undangan').slice(0,100);
  $('#guest').textContent = guest;
  $$('input[name=name]').forEach(el => el.value = guest === 'Tamu Undangan' ? '' : guest.slice(0,60));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let opened = false, photo = 0, story = 0, photoTimer, storyTimer, audioContext, playing = false;
  const video = {hidden:false,pause(){},play(){return Promise.resolve();},addEventListener(){}};
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12}) : null;
  function startReveals(){if(observer){document.body.classList.add('animated');$$('.reveal').forEach(el => observer.observe(el));}}
  function showPhoto(index){photo=(index+3)%3;$$('.slide').forEach((el,i)=>el.classList.toggle('active',i===photo));$$('[data-photo]').forEach((el,i)=>{el.classList.toggle('active',i===photo);el.setAttribute('aria-pressed',String(i===photo));});}
  function showStory(index){story=(index+3)%3;$$('.story-slide').forEach((el,i)=>el.classList.toggle('active',i===story));$('#story-count').textContent=`${story+1} / 3`;}
  function syncTimers(){clearInterval(photoTimer);clearInterval(storyTimer);if(opened&&!document.hidden&&!reduced.matches){photoTimer=setInterval(()=>showPhoto(photo+1),5000);storyTimer=setInterval(()=>showStory(story+1),6500);}}
  $$('[data-photo]').forEach(el=>el.addEventListener('click',()=>{showPhoto(Number(el.dataset.photo));syncTimers();}));
  $('#story-prev').addEventListener('click',()=>{showStory(story-1);syncTimers();});
  $('#story-next').addEventListener('click',()=>{showStory(story+1);syncTimers();});
  function revealMotionText(){$('.motion-text').classList.add('shown');}
  async function open(){
    if(opened)return;opened=true;$('#open').disabled=true;
    $('#contents').hidden=false;$('#contents').inert=false;
    const cover=$('#cover');cover.style.position='absolute';cover.style.inset='0 0 auto';
    requestAnimationFrame(()=>cover.classList.add('leaving'));
    document.body.classList.remove('locked');window.scrollTo(0,0);
    $('#music').hidden=false;startReveals();syncTimers();
    setTimeout(()=>cover.hidden=true,reduced.matches?0:1300);
    setTimeout(revealMotionText,reduced.matches?0:700);
  }
  video.addEventListener('error',revealMotionText);video.addEventListener('ended',revealMotionText);
  $('#open').addEventListener('click',open);
  $('#music').addEventListener('click',async()=>{
    if(!audioContext){audioContext=new (window.AudioContext||window.webkitAudioContext)();const gain=audioContext.createGain();gain.gain.value=.025;gain.connect(audioContext.destination);[130.81,164.81,196].forEach(freq=>{const oscillator=audioContext.createOscillator();oscillator.type='sine';oscillator.frequency.value=freq;oscillator.connect(gain);oscillator.start();});}
    if(playing){await audioContext.suspend();playing=false;}else{await audioContext.resume();playing=true;}
    $('#music').setAttribute('aria-pressed',String(playing));$('#music').setAttribute('aria-label',playing?'Jeda musik ilustrasi':'Putar musik ilustrasi');
  });
  $('#rsvp-form').addEventListener('submit',event=>{event.preventDefault();$('#rsvp-status').textContent='Pratinjau: konfirmasi hanya tampil di tab ini dan belum dikirim online.';});
  $('#wish-form').addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.target);const entry=document.createElement('article'),name=document.createElement('b'),message=document.createElement('p');name.textContent=String(data.get('name')).slice(0,60);message.textContent=String(data.get('message')).slice(0,500);entry.append(name,message);$('#wish-list').prepend(entry);event.target.elements.message.value='';$('#wish-status').textContent='Pratinjau: ucapan tampil di tab ini saja; hilang setelah reload.';});
  document.addEventListener('visibilitychange',()=>{syncTimers();if(document.hidden){video.pause();if(audioContext)audioContext.suspend();playing=false;$('#music').setAttribute('aria-pressed','false');}});
  reduced.addEventListener('change',syncTimers);
  window.addEventListener('pagehide',()=>{clearInterval(photoTimer);clearInterval(storyTimer);video.pause();if(audioContext)audioContext.suspend();});
  if(params.get('preview')==='1')open();
})();