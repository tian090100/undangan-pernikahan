const galleryImages = [...document.querySelectorAll('.gallery-grid img')];

if (galleryImages.length) {
  const lightbox = document.createElement('dialog');
  lightbox.className = 'gallery-lightbox';
  lightbox.setAttribute('aria-label', 'Foto galeri Tanjung dan Yuli');
  lightbox.innerHTML = `
    <button class="gallery-close" type="button" aria-label="Tutup foto">×</button>
    <button class="gallery-nav gallery-prev" type="button" aria-label="Foto sebelumnya">‹</button>
    <img alt="">
    <p class="gallery-caption"></p>
    <span class="gallery-counter" aria-live="polite"></span>
    <button class="gallery-nav gallery-next" type="button" aria-label="Foto berikutnya">›</button>
  `;
  document.body.append(lightbox);

  const fullImage = lightbox.querySelector('img');
  const caption = lightbox.querySelector('.gallery-caption');
  const counter = lightbox.querySelector('.gallery-counter');
  let currentImage = 0;
  let lastTrigger;

  function showImage(index) {
    currentImage = (index + galleryImages.length) % galleryImages.length;
    const source = galleryImages[currentImage];
    fullImage.src = source.currentSrc || source.src;
    fullImage.alt = source.alt;
    caption.textContent = source.alt;
    counter.textContent = `${currentImage + 1} / ${galleryImages.length}`;
  }

  galleryImages.forEach((image, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `Perbesar foto ${index + 1}: ${image.alt}`);
    image.parentNode.insertBefore(button, image);
    button.append(image);
    button.addEventListener('click', () => {
      lastTrigger = button;
      showImage(index);
      lightbox.showModal();
    });
  });

  lightbox.querySelector('.gallery-close').addEventListener('click', () => lightbox.close());
  lightbox.querySelector('.gallery-prev').addEventListener('click', () => showImage(currentImage - 1));
  lightbox.querySelector('.gallery-next').addEventListener('click', () => showImage(currentImage + 1));
  lightbox.addEventListener('close', () => lastTrigger?.focus());
  lightbox.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') showImage(currentImage - 1);
    if (event.key === 'ArrowRight') showImage(currentImage + 1);
  });
}
