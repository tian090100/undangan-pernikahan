document.addEventListener('DOMContentLoaded',()=>{
  const guest=new URLSearchParams(location.search).get('to');
  if(guest)document.getElementById('guest-name').textContent=guest.slice(0,60);
  const open=document.getElementById('open-invitation');
  open.onclick=()=>{document.getElementById('opening').classList.add('opened');document.body.classList.remove('locked');document.getElementById('invitation').setAttribute('aria-hidden','false');playMusic()};
  const target=new Date('2026-11-07T09:00:00+07:00').getTime();
  const tick=()=>{const n=Math.max(0,target-Date.now()),v={days:Math.floor(n/86400000),hours:Math.floor(n/3600000%24),minutes:Math.floor(n/60000%60),seconds:Math.floor(n/1000%60)};Object.entries(v).forEach(([k,x])=>document.getElementById(k).textContent=String(x).padStart(2,'0'))};tick();setInterval(tick,1000);
  const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('visible')),{threshold:.12});document.querySelectorAll('.reveal').forEach(e=>io.observe(e));
  const cal=new URLSearchParams({action:'TEMPLATE',text:'Pernikahan Lizwan & Naomi',dates:'20261107T020000Z/20261107T090000Z',location:'Gereja HKI dan BPU Bagas Raya, Lubuklinggau',details:'Pemberkatan Nikah pukul 09.00 WIB dan Pesta Adat Batak pukul 11.00 WIB.'});const cl=document.getElementById('calendar');cl.href=`https://calendar.google.com/calendar/render?${cal}`;cl.target='_blank';cl.rel='noopener noreferrer';
  document.getElementById('share').onclick=async e=>{try{if(navigator.share)await navigator.share({title:document.title,url:location.href});else{await navigator.clipboard.writeText(location.href);e.currentTarget.textContent='Disalin ✓'}}catch{}};
  let saved=[];try{saved=JSON.parse(localStorage.getItem('lizwan-naomi-wishes'))||[]}catch{}
  const samples=[{name:'Keluarga Sitorus',message:'Selamat berbahagia. Tuhan memberkati keluarga baru kalian.'},{name:'Keluarga Aritonang',message:'Horas! Kiranya kasih dan sukacita selalu menyertai.'}];
  const render=()=>{const list=document.getElementById('wish-list');list.replaceChildren();[...saved,...samples].slice(0,8).forEach(w=>{const a=document.createElement('article'),s=document.createElement('strong'),p=document.createElement('p');s.textContent=w.name;p.textContent=w.message;a.append(s,p);list.append(a)})};render();
  document.getElementById('rsvp-form').onsubmit=e=>{e.preventDefault();const d=new FormData(e.currentTarget),name=String(d.get('name')).trim(),attendance=String(d.get('attendance')),guests=String(d.get('guests')),message=String(d.get('message')).trim();saved.unshift({name,message});saved=saved.slice(0,6);try{localStorage.setItem('lizwan-naomi-wishes',JSON.stringify(saved))}catch{}render();document.getElementById('status').textContent=`Mauliate, ${name}. WhatsApp akan dibuka untuk mengirim konfirmasi.`;const text=`RSVP Pernikahan Lizwan & Naomi\n\nNama: ${name}\nKehadiran: ${attendance}\nJumlah tamu: ${guests}\nUcapan: ${message}`;window.open(`https://wa.me/6282260327488?text=${encodeURIComponent(text)}`,'_blank','noopener');};
  document.querySelectorAll('.copy-account').forEach(btn=>btn.onclick=async()=>{try{await navigator.clipboard.writeText(btn.dataset.account);btn.textContent='Berhasil Disalin ✓'}catch{btn.textContent=btn.dataset.account}});
  document.querySelectorAll('.copy-address').forEach(btn=>btn.onclick=async()=>{try{await navigator.clipboard.writeText(btn.dataset.address);btn.textContent='Alamat Berhasil Disalin ✓'}catch{btn.textContent='Silakan salin alamat secara manual'}});
  document.getElementById('copy-hashtag').onclick=async e=>{try{await navigator.clipboard.writeText(e.currentTarget.dataset.hashtag);e.currentTarget.innerHTML='Hashtag Disalin <span>✓</span>'}catch{e.currentTarget.textContent='#NAOWithTheWAN'}};
  const dlg=document.getElementById('lightbox'),img=dlg.querySelector('img');document.querySelectorAll('.photo').forEach(b=>b.onclick=()=>{const x=b.querySelector('img');img.src=x.src;img.alt=x.alt;dlg.showModal()});dlg.querySelector('button').onclick=()=>dlg.close();dlg.onclick=e=>e.target===dlg&&dlg.close();
});

let youtubePlayer;
function onYouTubeIframeAPIReady(){youtubePlayer=new YT.Player('youtube-player',{height:'1',width:'1',videoId:'3fFpkaOjxW8',playerVars:{playsinline:1,controls:0,loop:1,playlist:'3fFpkaOjxW8'},events:{onStateChange:e=>updateMusic(e.data===YT.PlayerState.PLAYING)}})}
function updateMusic(playing){const b=document.getElementById('music');b.classList.toggle('active',playing);b.textContent=playing?'♫':'♪';b.title=playing?'Jeda musik':'Putar Kau yang Ku Sayang — Dewa 19 feat. Ello';b.setAttribute('aria-label',b.title)}
function playMusic(){if(youtubePlayer&&youtubePlayer.playVideo)youtubePlayer.playVideo()}
document.getElementById('music').addEventListener('click',()=>{if(!youtubePlayer)return;if(youtubePlayer.getPlayerState()===YT.PlayerState.PLAYING)youtubePlayer.pauseVideo();else youtubePlayer.playVideo()});
