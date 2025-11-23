// script.js

const sideMenu = document.getElementById('sideMenu');
const overlay = document.getElementById('overlay');

function openMenu() {
  if (sideMenu) {
    sideMenu.classList.add('open');
  }
  if (overlay) {
    overlay.classList.add('show');
  }
  // set aria
  if (sideMenu) sideMenu.setAttribute('aria-hidden', 'false');
}

function closeMenu() {
  if (sideMenu) {
    sideMenu.classList.remove('open');
  }
  if (overlay) {
    overlay.classList.remove('show');
  }
  if (sideMenu) sideMenu.setAttribute('aria-hidden', 'true');
}

// Close with Escape key
document.addEventListener('keydown', function(e){
  if (e.key === 'Escape') closeMenu();
});
