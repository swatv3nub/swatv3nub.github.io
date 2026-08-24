export function initNav() {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');

  function onScroll() {
    nav?.classList.toggle('is-scrolled', scrollY > 24);
  }
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  function setMenu(open) {
    if (!burger || !menu) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  }

  burger?.addEventListener('click', () => {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });

  menu?.querySelectorAll('a').forEach((link, i) => {
    link.style.setProperty('--i', i);
    link.addEventListener('click', () => setMenu(false));
  });

  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu && !menu.hidden) {
      setMenu(false);
      burger?.focus();
    }
  });
}
