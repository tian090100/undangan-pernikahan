const cover=document.getElementById('cover');
const invitation=document.getElementById('invitation');
const guestName=new URLSearchParams(location.search).get('to');
if(guestName)document.getElementById('guest-name').textContent=guestName.trim().slice(0,80)||'Tamu Undangan';

function openInvitation(){
  cover.classList.add('opened');
  document.body.classList.remove('locked');
  invitation.inert=false;
  document.querySelector('.scroll-cue').focus({preventScroll:true});
}
document.getElementById('open-invitation').addEventListener('click',openInvitation);
if(new URLSearchParams(location.search).get('preview')==='1')openInvitation();

const giftToggle=document.getElementById('gift-toggle');
const accounts=document.getElementById('accounts');
giftToggle.addEventListener('click',()=>{
  const isOpen=giftToggle.getAttribute('aria-expanded')==='true';
  giftToggle.setAttribute('aria-expanded',String(!isOpen));
  giftToggle.innerHTML=isOpen?'Lihat Rekening <span>＋</span>':'Sembunyikan Rekening <span>−</span>';
  accounts.hidden=isOpen;
});

document.querySelectorAll('[data-account]').forEach(button=>button.addEventListener('click',async()=>{
  try{
    await navigator.clipboard.writeText(button.dataset.account);
    button.textContent='Nomor Tersalin ✓';
  }catch{
    button.textContent=button.dataset.account;
  }
}));
