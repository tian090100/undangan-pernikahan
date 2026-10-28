(function () {
  'use strict';
  function buildInvitationMessage(guestName) {
    const name = String(guestName || '').replace(/[\r\n]+/g, ' ').trim() || 'Tamu Undangan';
    const url = 'https://www.daprita.web.id/wedding/lizwan-naomi/?to=' + encodeURIComponent(name);
    return `Kepada Yth.
Bapak/Ibu/Saudara/i
${name}
di Tempat

Dengan hormat,

Kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara kami. Informasi lengkap dapat diakses melalui tautan berikut:

${url}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.

Mohon maaf perihal undangan hanya di bagikan melalui pesan ini.

Atas perhatiannya kami ucapkan terima kasih🙏🏻

Hormat Kami,
Naomi & Lizwan🤍`;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { buildInvitationMessage };
  if (typeof document === 'undefined') return;
  document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('share');
    if (!button) return;
    const originalLabel = button.textContent;
    let restoreTimer;
    function feedback(label) {
      button.textContent = label;
      clearTimeout(restoreTimer);
      restoreTimer = setTimeout(() => { button.textContent = originalLabel; }, 4000);
    }
    function showManualCopy(text) {
      let dialog = document.getElementById('share-message-dialog');
      if (!dialog) {
        dialog = document.createElement('dialog');
        dialog.id = 'share-message-dialog';
        dialog.setAttribute('aria-label', 'Salin pesan undangan');
        dialog.style.cssText = 'width:min(92vw,540px);max-height:90dvh;padding:24px;border:0;border-radius:16px;background:#edf4f8;color:#273747';
        const heading = document.createElement('h2'); heading.textContent = 'Pesan undangan';
        const explanation = document.createElement('p'); explanation.textContent = 'Pilih dan salin seluruh pesan di bawah, lalu tempel di WhatsApp.';
        const textarea = document.createElement('textarea'); textarea.readOnly = true;
        textarea.setAttribute('aria-label', 'Pesan undangan lengkap');
        textarea.style.cssText = 'width:100%;height:48dvh;padding:12px;font:14px/1.6 sans-serif;background:white;color:#273747';
        const close = document.createElement('button'); close.type = 'button'; close.textContent = 'Tutup';
        close.style.cssText = 'margin-top:16px;padding:10px 18px'; close.onclick = () => dialog.close();
        dialog.append(heading, explanation, textarea, close); document.body.append(dialog);
        dialog.addEventListener('close', () => button.focus());
      }
      dialog.querySelector('textarea').value = text;
      dialog.showModal(); dialog.querySelector('textarea').focus(); dialog.querySelector('textarea').select();
    }
    button.onclick = async () => {
      const text = buildInvitationMessage(new URLSearchParams(location.search).get('to'));
      if (typeof navigator.share === 'function') {
        try {
          // The URL is already in the message; do not append it a second time.
          await navigator.share({ title: 'Undangan Pernikahan Naomi & Lizwan', text });
          return;
        } catch (error) { if (error.name === 'AbortError') return; }
      }
      try { await navigator.clipboard.writeText(text); feedback('Pesan disalin ✓'); }
      catch { showManualCopy(text); }
    };
  });
})();
