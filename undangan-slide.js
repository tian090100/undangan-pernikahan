document.addEventListener('DOMContentLoaded',()=>{
  const body=document.body,cover=document.getElementById('cover'),invitation=document.getElementById('invitation');
  const pages=[...document.querySelectorAll('.page')],dots=document.getElementById('page-dots'),prev=document.getElementById('prev-page'),next=document.getElementById('next-page'),pageName=document.getElementById('page-name');
  const music=document.getElementById('background-music'),musicButton=document.getElementById('music-button');
  const guest=(new URLSearchParams(location.search).get('to')||'Tamu Undangan').slice(0,60);let current=0,touchStartX=0,flipping=false;
  document.getElementById('guest-name').textContent=guest;document.getElementById('hero-guest').textContent=guest;
  pages.forEach((page,index)=>{const dot=document.createElement('button');dot.type='button';dot.setAttribute('aria-label',`Ke halaman ${page.dataset.page}`);dot.addEventListener('click',()=>showPage(index));dots.append(dot)});
  function showPage(index){
    if(index<0||index>=pages.length||index===current||flipping)return;
    const oldPage=pages[current],newPage=pages[index],forward=index>current;
    const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    flipping=true;newPage.scrollTop=0;newPage.classList.add('book-under');oldPage.classList.add(forward?'flip-forward':'flip-backward');
    current=index;updateNavigation();
    window.setTimeout(()=>{
      oldPage.classList.remove('active','flip-forward','flip-backward','exit-left');
      newPage.classList.remove('book-under','exit-left');newPage.classList.add('active');flipping=false;
    },reduceMotion?0:760);
  }
  function updateNavigation(){[...dots.children].forEach((dot,index)=>{dot.classList.toggle('active',index===current);dot.setAttribute('aria-current',index===current?'page':'false')});prev.disabled=current===0;next.disabled=current===pages.length-1;pageName.textContent=pages[current].dataset.page}
  document.getElementById('open-invitation').addEventListener('click',()=>{cover.classList.add('opened');body.classList.remove('locked');invitation.classList.add('ready');invitation.setAttribute('aria-hidden','false');music.play().catch(()=>updateMusicButton(false))});
  prev.addEventListener('click',()=>showPage(current-1));next.addEventListener('click',()=>showPage(current+1));document.addEventListener('keydown',event=>{if(event.key==='ArrowRight')showPage(current+1);if(event.key==='ArrowLeft')showPage(current-1)});
  invitation.addEventListener('touchstart',event=>{touchStartX=event.changedTouches[0].clientX},{passive:true});invitation.addEventListener('touchend',event=>{const distance=event.changedTouches[0].clientX-touchStartX;if(Math.abs(distance)>60)showPage(current+(distance<0?1:-1))},{passive:true});
  const weddingDate=new Date('2026-11-22T08:00:00+07:00').getTime();function updateCountdown(){const distance=Math.max(0,weddingDate-Date.now()),values={days:Math.floor(distance/86400000),hours:Math.floor(distance/3600000%24),minutes:Math.floor(distance/60000%60),seconds:Math.floor(distance/1000%60)};Object.entries(values).forEach(([id,value])=>document.getElementById(id).textContent=String(value).padStart(2,'0'))}updateCountdown();setInterval(updateCountdown,1000);
  const defaults=[{name:'Rina & Dika',attendance:'Hadir',message:'Selamat menempuh hidup baru. Semoga selalu bahagia.'},{name:'Keluarga Hendra',attendance:'Hadir',message:'Semoga cinta kalian selalu tumbuh dalam setiap musim.'},{name:'Nadia Putri',attendance:'Belum bisa hadir',message:'Turut berbahagia. Semoga acaranya berjalan lancar!'}],track=document.getElementById('wishes-track');let saved=[];try{saved=JSON.parse(localStorage.getItem('daprita-basic-wishes'))||[]}catch{saved=[]}
  function renderWishes(){const wishes=[...saved,...defaults];track.replaceChildren();[...wishes,...wishes].forEach((wish,index)=>{const item=document.createElement('article'),name=document.createElement('strong'),attendance=document.createElement('span'),message=document.createElement('p');item.className='wish-item';if(index>=wishes.length)item.setAttribute('aria-hidden','true');name.textContent=wish.name;attendance.textContent=wish.attendance;message.textContent=wish.message;item.append(name,attendance,message);track.append(item)});track.style.setProperty('--wish-count',wishes.length)}renderWishes();
  document.getElementById('rsvp-form').addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.currentTarget),name=String(data.get('name')).trim();saved.unshift({name,attendance:String(data.get('attendance')),message:String(data.get('message')).trim()});saved=saved.slice(0,20);try{localStorage.setItem('daprita-basic-wishes',JSON.stringify(saved))}catch{}renderWishes();document.getElementById('form-status').textContent=`Terima kasih, ${name}. Konfirmasi Anda berhasil dicatat pada demo.`;event.currentTarget.reset()});
  function updateMusicButton(playing){musicButton.classList.toggle('playing',playing);musicButton.textContent=playing?'♫':'♪';musicButton.title=playing?'Jeda musik':'Putar musik';musicButton.setAttribute('aria-label',musicButton.title)}music.addEventListener('play',()=>updateMusicButton(true));music.addEventListener('pause',()=>updateMusicButton(false));musicButton.addEventListener('click',()=>music.paused?music.play().catch(()=>updateMusicButton(false)):music.pause());updateNavigation();
});

