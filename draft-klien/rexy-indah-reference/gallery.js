(() => {
 const section=document.createElement('section');section.className='scenery gallery';section.id='gallery';
 section.innerHTML='<h2 class="gallery-heading">Our Moments</h2><p class="gallery-note">Foto ilustrasi untuk pratinjau. Galeri ini akan memakai foto asli Rexy dan Indah setelah diterima. Ketuk foto untuk memperbesar.</p><div class="gallery-grid"></div>';
 document.querySelector('#events').after(section);
 const grid=section.querySelector('.gallery-grid');for(let i=1;i<=3;i++){const b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Perbesar foto ilustrasi '+i);b.innerHTML='<span class="photo p'+i+'" aria-hidden="true"></span>';b.onclick=()=>show(i);grid.append(b)}
 const box=document.createElement('dialog');box.className='rexy-dialog';box.setAttribute('aria-label','Galeri foto ilustrasi');box.innerHTML='<button type="button" class="dialog-close">Tutup ×</button><div class="photo"></div><div class="lightbox-controls"><button type="button" aria-label="Foto sebelumnya">‹</button><span aria-live="polite"></span><button type="button" aria-label="Foto berikutnya">›</button></div><p>Foto ilustrasi · menunggu foto asli pasangan</p>';document.body.append(box);let current=1;
 function render(){box.querySelector('.photo').className='photo p'+current;box.querySelector('span').textContent=current+' / 3'}function show(i){current=i;render();box.showModal()}function move(d){current=(current-1+d+3)%3+1;render()}
 box.querySelector('.dialog-close').onclick=()=>box.close();const buttons=box.querySelectorAll('.lightbox-controls button');buttons[0].onclick=()=>move(-1);buttons[1].onclick=()=>move(1);box.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}if(e.key==='ArrowRight'){e.preventDefault();move(1)}});
})();
