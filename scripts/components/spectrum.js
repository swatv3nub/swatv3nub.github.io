import { reduceMotion } from '../lib/motion.js';

export function initSpectrum() {
  const canvas = document.getElementById('spectrum-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const TAU = Math.PI * 2;
  let width = 0;
  let height = 0;
  let fill;
  let visible = false;
  let frameId = 0;
  let lastFrame = 0;
  let phase = 0;
  let pointerX = -1000;
  let step = 0;
  let count = 0;
  let upper = new Float32Array(0);
  let lower = new Float32Array(0);

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    if (!width || !height) return;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    step = width < 600 ? 2 : 2.5;
    count = Math.ceil(width / step);
    upper = new Float32Array(count + 1);
    lower = new Float32Array(count + 1);

    fill = ctx.createLinearGradient(0, 0, 0, height);
    fill.addColorStop(0, 'rgba(167, 139, 250, 0.14)');
    fill.addColorStop(0.35, 'rgba(167, 139, 250, 0.58)');
    fill.addColorStop(0.5, 'rgba(210, 194, 255, 0.9)');
    fill.addColorStop(0.65, 'rgba(167, 139, 250, 0.58)');
    fill.addColorStop(1, 'rgba(167, 139, 250, 0.14)');

    draw(phase);
  }

  function amplitude(x, time) {
    const u = x / width;
    const edge = Math.pow(Math.sin(Math.PI * u), 0.45);
    const beat = Math.pow(0.5 + 0.5 * Math.sin(TAU * (u * 4.2 - time * 0.22)), 2.5);
    const swell = 0.5 + 0.5 * Math.sin(TAU * (u * 1.8 + time * 0.09) + 0.8);
    const carrier =
      0.54 * Math.sin(TAU * (u * 16.5 - time * 1.35)) +
      0.29 * Math.sin(TAU * (u * 37 - time * 2.92) + 1.1) +
      0.17 * Math.sin(TAU * (u * 69 - time * 4.4) + 2.4);
    const proximity = Math.max(0, 1 - Math.abs(x - pointerX) / 160);

    return edge * (0.18 + 0.54 * beat + 0.18 * swell + 0.28 * proximity) *
      (0.16 + 0.84 * Math.abs(carrier));
  }

  function draw(time) {
    if (!width || !height) return;
    ctx.clearRect(0, 0, width, height);

    const center = height / 2;
    const reach = height * 0.43;
    ctx.fillStyle = 'rgba(167, 139, 250, 0.12)';
    ctx.fillRect(0, center - 0.5, width, 1);

    for (let i = 0; i <= count; i++) {
      const x = Math.min(i * step, width);
      const reachAtX = Math.max(1, amplitude(x, time) * reach);
      upper[i] = center - reachAtX;
      lower[i] = center + reachAtX * (0.86 + 0.1 * Math.sin(x * 0.027 + time));
    }

    ctx.beginPath();
    ctx.moveTo(0, upper[0]);
    for (let i = 1; i <= count; i++) ctx.lineTo(Math.min(i * step, width), upper[i]);
    for (let i = count; i >= 0; i--) ctx.lineTo(Math.min(i * step, width), lower[i]);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();

    ctx.lineWidth = 1.1;
    ctx.strokeStyle = 'rgba(211, 198, 255, 0.8)';
    ctx.beginPath();
    for (let i = 0; i <= count; i++) {
      const x = Math.min(i * step, width);
      if (i === 0) ctx.moveTo(x, upper[i]);
      else ctx.lineTo(x, upper[i]);
    }
    ctx.stroke();

    ctx.strokeStyle = 'rgba(167, 139, 250, 0.48)';
    ctx.beginPath();
    for (let i = 0; i <= count; i++) {
      const x = Math.min(i * step, width);
      if (i === 0) ctx.moveTo(x, lower[i]);
      else ctx.lineTo(x, lower[i]);
    }
    ctx.stroke();
  }

  function frame(now) {
    if (!visible || document.hidden) return;
    if (lastFrame) phase += Math.min((now - lastFrame) / 1000, 0.05) *
      (reduceMotion.matches ? 0.85 : 1.8);
    lastFrame = now;
    draw(phase);
    frameId = requestAnimationFrame(frame);
  }

  function syncPlayback() {
    cancelAnimationFrame(frameId);
    if (visible && !document.hidden) {
      lastFrame = 0;
      frameId = requestAnimationFrame(frame);
    }
  }

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncPlayback();
  }).observe(canvas);

  canvas.parentElement.addEventListener('pointermove', (event) => {
    pointerX = event.clientX - canvas.getBoundingClientRect().left;
  }, { passive: true });
  canvas.parentElement.addEventListener('pointerleave', () => { pointerX = -1000; });
  document.addEventListener('visibilitychange', syncPlayback);
  reduceMotion.addEventListener('change', syncPlayback);
}
