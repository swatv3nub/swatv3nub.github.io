export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
export const finePointer = window.matchMedia('(pointer: fine)');

export const prefersReduced = () => reduceMotion.matches;

export function onModeChange(cb) {
  document.addEventListener('modechange', (e) => cb(e.detail.mode));
}
