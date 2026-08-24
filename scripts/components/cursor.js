import { finePointer, prefersReduced } from '../lib/motion.js';

export function initCursor() {
  if (!finePointer.matches || prefersReduced()) return;

  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  const label = document.querySelector('.cursor-label');
  if (!dot || !ring) return;

  document.documentElement.classList.add('has-cursor');

  let mx = -100, my = -100;
  let dx = mx, dy = my, rx = mx, ry = my;
  let dotScale = 1, dotTarget = 1;
  let raf = null;

  function loop() {
    dx += (mx - dx) * 0.5;
    dy += (my - dy) * 0.5;
    rx += (mx - rx) * 0.16;
    dotScale += (dotTarget - dotScale) * 0.35;
    ry += (my - ry) * 0.16;
    dot.style.transform = `translate(${dx - 2.5}px, ${dy - 2.5}px) scale(${dotScale.toFixed(3)})`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    raf = requestAnimationFrame(loop);
  }
  loop();

  addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  }, { passive: true });

  const INTERACTIVE = 'a, button, [data-cursor], .skill, .project, input, textarea, [role="tab"]';

  document.addEventListener('mouseover', (e) => {
    const t = e.target.closest(INTERACTIVE);
    const text = (t?.dataset.cursor || '').toUpperCase();
    if (t) {
      ring.classList.add('is-active');
      ring.classList.toggle('has-label', Boolean(text));
      if (label) label.textContent = text;
    } else {
      ring.classList.remove('is-active', 'has-label');
      if (label) label.textContent = '';
    }
  }, { passive: true });

  document.addEventListener('mousedown', () => dotTarget = 1.8);
  document.addEventListener('mouseup', () => dotTarget = 1);

  // Magnetic buttons
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const relX = e.clientX - (r.left + r.width / 2);
      const relY = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${relX * 0.18}px, ${relY * 0.28}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}
