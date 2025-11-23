// script.js - simple drawer toggle & active link highlight
document.addEventListener('DOMContentLoaded', function(){
  const menuBtn = document.getElementById('menuBtn');
  const closeBtn = document.getElementById('closeBtn');
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('overlay');

  function openDrawer(){
    if(drawer) drawer.classList.add('open');
    if(overlay) overlay.classList.add('show');
    if(drawer) drawer.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer(){
    if(drawer) drawer.classList.remove('open');
    if(overlay) overlay.classList.remove('show');
    if(drawer) drawer.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  if(menuBtn) menuBtn.addEventListener('click', openDrawer);
  if(closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if(overlay) overlay.addEventListener('click', closeDrawer);

  // Close drawer on ESC
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeDrawer();
  });

  // mark active link in top nav (based on location)
  const links = document.querySelectorAll('.top-nav .nav-link');
  links.forEach(a=>{
    try {
      const href = a.getAttribute('href');
      const current = location.pathname.split('/').pop() || 'index.html';
      if(href === current) a.classList.add('active');
    } catch(e){}
  });
});
