import { prefersReduced } from '../lib/motion.js';

const MODES = {
  dev: {
    state: 'compiling ideas…',
    lines: [
      { prompt: true, text: 'whoami --mode=dev' },
      { text: 'swanit anuran // sw4nit' },
      { key: 'role', value: 'developer' },
      { key: 'stack', value: 'python · go · kotlin · dart · js' },
      { key: 'focus', value: 'shipping useful software' },
      { key: 'state', value: 'building…' }
    ]
  },
  sec: {
    state: 'enumerating…',
    lines: [
      { prompt: true, text: 'whoami --mode=sec' },
      { text: 'swanit anuran // sw4nit' },
      { key: 'role', value: 'security researcher' },
      { key: 'stack', value: 'owasp · mitre att&ck · osint · vapt' },
      { key: 'focus', value: "finding what shouldn't be there" },
      { key: 'rule', value: 'recon first, always' },
      { key: 'state', value: 'enumerating…' }
    ]
  },
  ai: {
    state: 'orchestrating agents…',
    lines: [
      { prompt: true, text: 'whoami --mode=ai' },
      { text: 'swanit anuran // sw4nit' },
      { key: 'role', value: 'ai tinkerer' },
      { key: 'stack', value: 'langgraph · langchain · nlp' },
      { key: 'focus', value: 'automating the boring parts' },
      { key: 'state', value: 'orchestrating…' }
    ]
  },
  music: {
    state: 'bouncing stems…',
    lines: [
      { prompt: true, text: 'whoami --mode=music' },
      { text: 'swanit anuran // formerly maskedvirus' },
      { key: 'role', value: 'music producer' },
      { key: 'stack', value: 'fl studio · ableton · vst / dsp' },
      { key: 'focus', value: 'loud noises, on purpose' },
      { key: 'state', value: 'bouncing stems…' }
    ]
  }
};

let typingToken = 0;

function buildLine(line) {
  const el = document.createElement('span');
  el.className = 't-line';
  if (line.prompt) {
    const p = document.createElement('span');
    p.className = 'prompt';
    p.textContent = '$ ';
    const c = document.createElement('span');
    c.className = 'cmd';
    el.append(p, c);
    return { el, textEl: c };
  }
  const k = document.createElement('span');
  k.className = 'k';
  const v = document.createElement('span');
  v.className = 'v';
  if (line.key) {
    k.textContent = line.key.padEnd(6, ' ') + ' ';
    v.textContent = line.value;
  } else {
    k.textContent = '';
    v.textContent = line.text;
  }
  el.append(k, v);
  return { el, textEl: null };
}

async function renderMode(mode) {
  const container = document.querySelector('[data-term-lines]');
  const stateEl = document.querySelector('[data-term-state]');
  if (!container) return;

  const token = ++typingToken;
  const data = MODES[mode];
  container.textContent = '';

  if (stateEl) stateEl.textContent = data.state;
  document.body.dataset.mode = mode;
  document.dispatchEvent(new CustomEvent('modechange', { detail: { mode } }));

  if (prefersReduced()) {
    data.lines.forEach((line) => container.appendChild(buildLine(line).el));
    return;
  }

  for (const line of data.lines) {
    if (token !== typingToken) return;
    const { el, textEl } = buildLine(line);
    container.appendChild(el);
    if (textEl) {
      const full = line.text;
      for (let i = 1; i <= full.length; i++) {
        if (token !== typingToken) return;
        textEl.textContent = full.slice(0, i);
        await new Promise((r) => setTimeout(r, 14));
      }
    } else if (line.key) {
      const v = el.querySelector('.v');
      const full = line.value;
      for (let i = 1; i <= full.length; i++) {
        if (token !== typingToken) return;
        v.textContent = full.slice(0, i);
        await new Promise((r) => setTimeout(r, 9));
      }
    }
    await new Promise((r) => setTimeout(r, 60));
  }

  if (token === typingToken) {
    const caret = document.createElement('span');
    caret.className = 't-caret';
    caret.setAttribute('aria-hidden', 'true');
    container.appendChild(caret);
  }
}

export function initTerminal() {
  const tabs = Array.from(document.querySelectorAll('[data-mode-tab]'));
  const panel = document.getElementById('term-body');

  tabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });
      if (panel) panel.setAttribute('aria-labelledby', tab.id);
      renderMode(tab.dataset.modeTab);
    });

    tab.addEventListener('keydown', (e) => {
      let next = null;
      if (e.key === 'ArrowRight') next = tabs[(idx + 1) % tabs.length];
      if (e.key === 'ArrowLeft') next = tabs[(idx - 1 + tabs.length) % tabs.length];
      if (next) {
        e.preventDefault();
        next.focus();
        next.click();
      }
    });
  });

  renderMode('dev');
}
