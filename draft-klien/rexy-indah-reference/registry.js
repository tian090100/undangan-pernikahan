(() => {
  const endpoint='https://ejdgpkgozhkteuofmwle.supabase.co/functions/v1/rexy-demo-gifts';
  const publicKey='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqZGdwa2dvemhrdGV1b2Ztd2xlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NTU3ODcsImV4cCI6MjEwNjMzMTc4N30.iJ8s_jSOOV2kvkb46tAnjBvjQHlH7ZJl9qxgE6f2MWk';
  const gifts=window.rexyGiftCatalog.map(g=>[g.id,g.name,g.icon,g.url]);
  const catalog = document.createElement('dialog');
  catalog.className = 'rexy-dialog gift-catalog-dialog';
  catalog.setAttribute('aria-labelledby', 'gift-catalog-title');
  catalog.innerHTML = '<header class="gift-catalog-header"><h2 id="gift-catalog-title">Hadiah Fisik</h2><button type="button" class="dialog-close">Tutup ×</button></header><p>Pilih satu hadiah untuk dibooking. Ketersediaan diperiksa kembali saat konfirmasi.</p><p class="registry-status" role="status"></p><div class="gift-grid"></div>';
  document.body.append(catalog);
  const grid = catalog.querySelector('.gift-grid');
  const status = catalog.querySelector('.registry-status');
  document.querySelector('#physical-gifts').addEventListener('click', () => {
    catalog.showModal();
    catalog.scrollTop = 0;
    refresh();
  });
  catalog.querySelector('.dialog-close').addEventListener('click', () => catalog.close());

  gifts.forEach(([id,name,path,url])=>{const card=document.createElement('article');card.className='gift-card';card.innerHTML='<svg viewBox="0 0 140 120" aria-hidden="true">'+path+'</svg><small>TANDA KASIH</small>';const title=document.createElement('h3');title.textContent=name;card.append(title);if(url){const link=document.createElement('a');link.className='gift-product-link';link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Lihat produk di Shopee ↗';link.setAttribute('aria-label','Lihat '+name+' di Shopee');card.append(link)}else{const note=document.createElement('small');note.className='gift-link-note';note.textContent='Link produk menyusul';card.append(note)}const button=document.createElement('button');button.type='button';button.disabled=true;button.dataset.gift=id;button.textContent='Memuat…';card.append(button);grid.append(card)});
  const dialog=document.createElement('dialog');dialog.className='rexy-dialog';dialog.setAttribute('aria-labelledby','booking-title');
  dialog.innerHTML='<button type="button" class="dialog-close">Tutup ×</button><h2 id="booking-title">Booking hadiah</h2><p id="booking-item"></p><form><label>Nama pemberi<input name="name" autocomplete="name" required minlength="2" maxlength="80"></label><label>Nomor WhatsApp<input name="phone" type="tel" autocomplete="tel" inputmode="tel" required maxlength="20" placeholder="08xxxxxxxxxx"></label><label class="trap" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label><p>Nama dan WhatsApp disimpan privat untuk koordinasi hadiah. Booking mencatat pilihan hadiah, bukan pembelian.</p><button type="submit">Konfirmasi booking</button><p class="form-status" role="status"></p></form>';
  document.body.append(dialog);
  let selected=null,busy=false,available=false;const form=dialog.querySelector('form'),message=dialog.querySelector('.form-status');
  dialog.querySelector('.dialog-close').onclick=()=>{if(!busy)dialog.close()};
  dialog.addEventListener('cancel',e=>{if(busy)e.preventDefault()});
  async function api(body){const response=await fetch(endpoint,{method:body?'POST':'GET',headers:{apikey:publicKey,Authorization:'Bearer '+publicKey,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(15000)});if(!response.ok)throw Error('network');return response.json()}
  async function refresh(){status.textContent="Memuat ketersediaan…";available=false;grid.querySelectorAll("button").forEach(button=>button.disabled=true);try{const data=await api();available=true;grid.querySelectorAll('button').forEach(button=>{const booked=data.booked.includes(button.dataset.gift);button.disabled=booked;button.textContent=booked?'Sudah dibooking':'Booking'});status.textContent='Pilihan hadiah · ketersediaan diperiksa kembali saat konfirmasi.'}catch{available=false;grid.querySelectorAll('button').forEach(b=>{b.disabled=true;b.textContent='Belum tersedia'});status.textContent='Ketersediaan belum bisa dimuat. Tutup dan buka kembali daftar hadiah untuk mencoba lagi.'}}
  grid.addEventListener('click',e=>{const button=e.target.closest('button[data-gift]');if(!button||button.disabled||!available)return;selected=button.dataset.gift;form.reset();message.textContent='';dialog.querySelector('#booking-item').textContent='Hadiah: '+gifts.find(g=>g[0]===selected)[1];dialog.showModal()});
  form.addEventListener('submit',async e=>{e.preventDefault();if(busy)return;const fields=new FormData(form);const digits=String(fields.get('phone')).replace(/\D/g,'');const phone=digits.startsWith('0')?'62'+digits.slice(1):digits;if(!/^62[0-9]{8,13}$/.test(phone)){message.textContent='Isi nomor WhatsApp Indonesia yang valid, diawali 08 atau +62.';return}busy=true;form.querySelector('button').disabled=true;message.textContent='Memeriksa dan menyimpan booking…';try{const data=await api({gift:selected,name:String(fields.get('name')).trim(),phone,website:fields.get('website')});const messages={booked:'Booking berhasil. Hadiah ini sudah ditandai dipesan.',phone_taken:'Nomor WhatsApp ini sudah membooking satu hadiah.',gift_taken:'Hadiah ini baru saja dibooking tamu lain. Pilih hadiah lain.'};message.textContent=messages[data.result]||'Booking belum berhasil. Coba lagi.';if(data.result==='booked')form.reset();await refresh()}catch{message.textContent='Hasil booking belum dapat dipastikan. Muat ulang ketersediaan sebelum mencoba lagi.';await refresh()}finally{busy=false;form.querySelector('button').disabled=false}});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden && catalog.open)refresh()});
})();
