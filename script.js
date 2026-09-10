document.addEventListener('DOMContentLoaded', () => {
  const yearNode = document.getElementById('year');
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  const closeMenu = () => {
    if (!menuToggle || !navMenu) return;
    menuToggle.classList.remove('active');
    navMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Buka menu');
  };

  menuToggle?.addEventListener('click', () => {
    const willOpen = !navMenu?.classList.contains('open');
    menuToggle.classList.toggle('active', willOpen);
    navMenu?.classList.toggle('open', willOpen);
    menuToggle.setAttribute('aria-expanded', String(willOpen));
    menuToggle.setAttribute('aria-label', willOpen ? 'Tutup menu' : 'Buka menu');
  });

  navMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  document.querySelectorAll('.package-button').forEach((button) => {
    button.addEventListener('click', (event) => {
      const packageName = button.dataset.package;
      const whatsappLink = document.getElementById('whatsapp-link');
      if (!packageName || !whatsappLink) return;
      event.preventDefault();
      const message = `Halo DAPRITA, saya tertarik dengan Paket Undangan ${packageName}. Bisa dibantu konsultasi?`;
      const whatsappUrl = `https://wa.me/6282229377438?text=${encodeURIComponent(message)}`;
      whatsappLink.href = whatsappUrl;
      whatsappLink.textContent = `Konsultasikan Paket ${packageName} via WhatsApp`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  });

  document.querySelector('[data-preview-button]')?.addEventListener('click', () => {
    window.location.href = 'undangan.html?to=Tamu%20Undangan';
  });

  const consultationSection = document.getElementById('konsultasi');
  const consultationStatus = document.getElementById('consultation-status');

  document.querySelectorAll('.vendor-filter').forEach((filter) => {
    filter.addEventListener('click', () => {
      const category = filter.dataset.filter;
      document.querySelectorAll('.vendor-filter').forEach((button) => {
        const isActive = button === filter;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });
      document.querySelectorAll('.vendor-card').forEach((card) => {
        card.classList.toggle('filtered-out', category !== 'all' && card.dataset.category !== category);
      });
    });
  });

  document.querySelectorAll('.vendor-contact').forEach((button) => {
    button.addEventListener('click', () => {
      if (consultationStatus) consultationStatus.textContent = `Layanan pilihan: ${button.dataset.vendor}. Lengkapi data untuk mengecek ketersediaan.`;
      consultationSection?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  document.querySelectorAll('.bundle-button').forEach((button) => {
    button.addEventListener('click', () => {
      if (consultationStatus) consultationStatus.textContent = `Paket pilihan: ${button.dataset.bundle}. Lengkapi kebutuhan Anda untuk mendapatkan penawaran.`;
      consultationSection?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  document.getElementById('consultation-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const services = data.getAll('service');
    if (!services.length) {
      consultationStatus.textContent = 'Pilih minimal satu layanan yang Anda butuhkan.';
      event.currentTarget.querySelector('fieldset').focus?.();
      return;
    }
    const message = [
      `Halo DAPRITA, saya ingin konsultasi kebutuhan pernikahan.`,
      `Nama: ${data.get('name')}`,
      `Tanggal acara: ${data.get('date')}`,
      `Lokasi: ${data.get('location')}`,
      `Paket yang diminati: ${data.get('budget')}`,
      `Layanan: ${services.join(', ')}`,
      `Catatan: ${data.get('notes') || '-'}`
    ].join('\n');
    consultationStatus.textContent = 'Membuka WhatsApp dengan ringkasan kebutuhan Anda…';
    window.open(`https://wa.me/6282229377438?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  });

  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const button = item.querySelector('button');
    if (!button) return;

    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      faqItems.forEach((faq) => {
        faq.classList.remove('active');
        const btn = faq.querySelector('button');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
});
