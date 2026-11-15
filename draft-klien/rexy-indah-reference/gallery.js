(() => {
 'use strict';
 const photos=[
  {
    "alt": "Foto pranikah Rexy dan Indah",
    "src": "photos/gallery-ind09876.jpg",
    "width": 1067,
    "height": 1600
  },
  {
    "alt": "Foto pranikah Rexy dan Indah",
    "src": "photos/gallery-ind09854.jpg",
    "width": 1067,
    "height": 1600
  },
  {
    "alt": "Foto pranikah Rexy dan Indah",
    "src": "photos/gallery-ind09821.jpg",
    "width": 1067,
    "height": 1600
  },
  {
    "alt": "Foto pranikah Rexy dan Indah",
    "src": "photos/gallery-ind09811.jpg",
    "width": 1067,
    "height": 1600
  },
  {
    "alt": "Foto pranikah Rexy dan Indah",
    "src": "photos/gallery-mg_1682.jpg",
    "width": 1067,
    "height": 1600
  },
  {
    "alt": "Foto pranikah Rexy dan Indah",
    "src": "photos/gallery-mg_1677.jpg",
    "width": 1067,
    "height": 1600
  },
  {
    "alt": "Foto pranikah Rexy dan Indah",
    "src": "photos/gallery-img00116.jpg",
    "width": 1067,
    "height": 1600
  },
  {
    "alt": "Foto pranikah Rexy dan Indah",
    "src": "photos/gallery-img00243.jpg",
    "width": 1067,
    "height": 1600
  },
  {
    "src": "photos/rexy-indah-casual-02.jpg",
    "alt": "Foto casual Rexy dan Indah",
    "width": 1333,
    "height": 2000
  },
  {
    "alt": "Foto pranikah Rexy dan Indah",
    "src": "photos/rexy-indah-04.jpg",
    "width": 1333,
    "height": 2000
  },
  {
    "alt": "Foto pranikah Rexy dan Indah",
    "src": "photos/gallery-mg_1973.jpg",
    "width": 1067,
    "height": 1600
  },
  {
    "alt": "Foto pranikah Rexy dan Indah",
    "src": "photos/gallery-mg_1919.jpg",
    "width": 1066,
    "height": 1600
  },
  {
    "alt": "Foto pranikah Rexy dan Indah",
    "src": "photos/rexy-indah-07.jpg",
    "width": 1333,
    "height": 2000
  }
];
 const section=document.createElement('section');section.className='scenery gallery';section.id='gallery';
 section.innerHTML='<h2 class="gallery-heading">Our Moments</h2><p class="gallery-note">Potret kebersamaan Rexy dan Indah. Ketuk foto untuk memperbesar.</p><div class="gallery-grid"></div>';
 document.querySelector('#events').after(section);
 const grid=section.querySelector('.gallery-grid');
 photos.forEach((photo,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Perbesar foto Rexy dan Indah '+(i+1));const img=document.createElement('img');img.src=photo.src;img.alt=photo.alt;img.width=photo.width;img.height=photo.height;img.loading='lazy';img.decoding='async';b.append(img);b.addEventListener('click',()=>show(i));grid.append(b);});
 const box=document.createElement('dialog');box.className='rexy-dialog gallery-lightbox';box.setAttribute('aria-label','Galeri Rexy dan Indah');box.innerHTML='<button type="button" class="dialog-close">Tutup ×</button><img alt=""><div class="lightbox-controls"><button type="button" aria-label="Foto sebelumnya">‹</button><span aria-live="polite"></span><button type="button" aria-label="Foto berikutnya">›</button></div>';document.body.append(box);let current=0;
 function render(){const img=box.querySelector('img');img.src=photos[current].src;img.alt=photos[current].alt;box.querySelector('span').textContent=(current+1)+' / '+photos.length;}
 function show(i){current=i;render();box.showModal();}
 function move(d){current=(current+d+photos.length)%photos.length;render();}
 box.querySelector('.dialog-close').addEventListener('click',()=>box.close());const buttons=box.querySelectorAll('.lightbox-controls button');buttons[0].addEventListener('click',()=>move(-1));buttons[1].addEventListener('click',()=>move(1));box.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}if(e.key==='ArrowRight'){e.preventDefault();move(1);}});
})();
