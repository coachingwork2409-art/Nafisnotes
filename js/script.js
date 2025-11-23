const sideMenu = document.getElementById('sideMenu');
const overlay = document.getElementById('overlay');

function openMenu() {
    sideMenu.classList.add('open');
    overlay.classList.add('show');
}

function closeMenu() {
    sideMenu.classList.remove('open');
    overlay.classList.remove('show');
}

document.addEventListener('keydown', function(e){
    if(e.key === "Escape") closeMenu();
});
