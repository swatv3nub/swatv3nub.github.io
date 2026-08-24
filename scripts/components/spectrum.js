import { prefersReduced } from '../lib/motion.js';

export function initSpectrum() {
  const canvas = document.getElementById('spectrum-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const COLOR = '167, 139, 250';
  let w = 0, h = 0;
  let bars = [];
  let pointerX = -1000;
  let running = false;
  let raf = null;

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.max(36, Math.floor(w / 26));
    bars = Array.from({ length: count }, (_, i) => ({
      phase: i * 0.55,
      speed: 0.6 + ((i * 37) % 10) / 14,
      boost: 0
    }));
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    const bw = w / bars.length;
    const usableW = bw * 0.42;

    bars.forEach((bar, i) => {
      const x = i * bw + bw / 2;
      const dist = Math.abs(x - pointerX);
      const proximity = Math.max(0, 1 - dist / 180);

      const wave =
        Math.sin(t * bar.speed + bar.phase) * 0.32 +
        Math.sin(t * bar.speed * 2.7 + bar.phase * 1.618) * 0.18 +
        Math.sin(t * 0.31 + i) * 0.12;
      const level = Math.abs(wave) * 0.75 + 0.08 + proximity * 0.55 + bar.boost;
      const bh = Math.max(3, level * h * 0.82);

      const grad = ctx.createLinearGradient(0, h / 2 - bh / 2, 0, h / 2 + bh / 2);
      grad.addColorStop(0, `rgba(${COLOR}, ${0.15 + proximity * 0.35})`);
      grad.addColorStop(0.5, `rgba(${COLOR}, ${0.65 + proximity * 0.35})`);
      grad.addColorStop(1, `rgba(${COLOR}, ${0.15 + proximity * 0.35})`);
      ctx.fillStyle = grad;
      ctx.fillRect(x - usableW / 2, h / 2 - bh / 2, usableW, bh);

      // center hairline tick
      ctx.fillStyle = `rgba(${COLOR}, 0.28)`;
      ctx.fillRect(x - usableW / 2, h / 2 - 0.5, usableW, 1);
    });
  }

  function frame() {
    if (!running) return;
    draw(performance.now() / 1000);
    bars.forEach((b) => { b.boost *= 0.94; });
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (prefersReduced()) { draw(1.5); return; }
    if (!running) { running = true; frame(); }
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  resize();
  addEventListener('resize', () => { resize(); if (!running) draw(1.5); }, { passive: true });

  canvas.parentElement.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    pointerX = e.clientX - rect.left;
    // inject energy near the pointer
    bars.forEach((bar, i) => {
      const x = (i / bars.length) * rect.width;
      if (Math.abs(x - pointerX) < 120) bar.boost = Math.min(bar.boost + 0.06, 0.35);
    });
  }, { passive: true });

  canvas.parentElement.addEventListener('pointerleave', () => { pointerX = -1000; });

  new IntersectionObserver((entries) => {
    entries[0].isIntersecting ? start() : stop();
  }).observe(canvas);

  document.addEventListener('visibilitychange', () => {
    document.hidden ? stop() : start();
  });

  start();
}
