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
      const message = `Halo Ever After Studio, saya tertarik dengan Paket ${packageName}. Bisa dibantu konsultasi?`;
      const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
      whatsappLink.href = whatsappUrl;
      whatsappLink.textContent = `Konsultasikan Paket ${packageName} via WhatsApp`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  });

  document.querySelector('[data-preview-button]')?.addEventListener('click', () => {
    window.location.href = 'undangan.html?to=Tamu%20Undangan';
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
