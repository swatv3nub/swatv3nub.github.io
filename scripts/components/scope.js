import { prefersReduced, onModeChange } from '../lib/motion.js';

export function initScope() {
  const canvas = document.getElementById('scope-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let accent = '#ff4d1f';
  let running = false;
  let raf = null;
  let t = 0;
  let w = 0, h = 0;

  function readAccent() {
    accent = getComputedStyle(document.body).getPropertyValue('--mode-accent').trim() || accent;
  }

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const layers = [
      { amp: h * 0.16, freq: 2.2, speed: 0.012, alpha: 0.5, width: 1.4 },
      { amp: h * 0.09, freq: 3.7, speed: -0.02, alpha: 0.25, width: 1 },
      { amp: h * 0.05, freq: 5.9, speed: 0.031, alpha: 0.15, width: 1 }
    ];

    for (const l of layers) {
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const y = h / 2
          + Math.sin(x / w * Math.PI * 2 * l.freq + t * l.speed * 60) * l.amp
          + Math.sin(x / w * Math.PI * 2 * l.freq * 0.37 + t * l.speed * 22) * l.amp * 0.35;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = accent;
      ctx.globalAlpha = l.alpha;
      ctx.lineWidth = l.width;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function frame() {
    if (!running) return;
    t += 0.016;
    draw();
    raf = requestAnimationFrame(frame);
  }

  function start() {
    readAccent();
    if (prefersReduced()) { draw(); return; }
    if (!running) { running = true; frame(); }
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  resize();
  addEventListener('resize', () => { resize(); if (!running) draw(); }, { passive: true });
  onModeChange(() => { readAccent(); if (!running) draw(); });

  new IntersectionObserver((entries) => {
    entries[0].isIntersecting ? start() : stop();
  }).observe(canvas);

  document.addEventListener('visibilitychange', () => {
    document.hidden ? stop() : start();
  });

  start();
}
