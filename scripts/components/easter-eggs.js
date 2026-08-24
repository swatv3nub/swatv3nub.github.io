/* Easter eggs: command palette (/), Konami legacy mode, console message */

const COMMANDS = {
  help: [
    ['resp', 'available commands:'],
    ['accent', '  whoami      who are you?'],
    ['accent', '  projects    jump to selected work'],
    ['accent', '  security    jump to break/secure'],
    ['accent', '  music       jump to after hours'],
    ['accent', '  github      jump to the lab'],
    ['accent', '  contact     open a channel'],
    ['accent', '  legacy      engage maskedvirus mode'],
    ['accent', '  clear       wipe the terminal']
  ],
  whoami: [
    ['resp', 'swanit anuran'],
    ['dim', 'aka sw4nit · formerly maskedvirus'],
    ['dim', 'builder / breaker / thinker / creator'],
    ['dim', 'bengaluru, in · utc+5:30']
  ],
  projects: [['act', '#work']],
  security: [['act', '#security']],
  music: [['act', '#music']],
  github: [['act', '#lab']],
  contact: [['act', '#contact']],
  ls: [
    ['resp', 'build/  break/  think/  create/'],
    ['dim', '.masked_virus.swp  (permission denied)']
  ],
  sudo: [
    ['dim', 'nice try. this is my machine.']
  ],
  legacy: [['fn', 'legacy']],
  clear: [['fn', 'clear']]
};

let toastTimer = null;

export function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  requestAnimationFrame(() => toast.classList.add('is-visible'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('is-visible');
    setTimeout(() => { toast.hidden = true; }, 500);
  }, 3200);
}

function toggleLegacy() {
  const on = document.body.classList.toggle('legacy-mode');
  showToast(on
    ? '<MaskedVirus/> LEGACY MODE ENGAGED'
    : 'LEGACY MODE DISENGAGED — BACK TO THE PRESENT.');
}

export function initEasterEggs() {
  /* ---- Console message ---- */
  console.log(
    '%cIf you\'re reading this,\nyou probably inspect websites too much.\n\nRespect.',
    'color:#ff4d1f; font-size:14px; line-height:1.8;'
  );
  console.log('%cgithub.com/swatv3nub · psst: press "/" — or try the Konami code',
    'color:#9a9aa3; font-size:11px;');

  /* ---- Command palette ---- */
  const palette = document.getElementById('palette');
  const input = document.getElementById('palette-input');
  const output = document.getElementById('palette-output');
  if (!palette || !input || !output) return;

  let history = [];

  function print(lines) {
    lines.forEach(([cls, text]) => {
      const li = document.createElement('li');
      li.className = `cmd-${cls}`;
      li.textContent = text;
      output.appendChild(li);
    });
    output.scrollTop = output.scrollHeight;
  }

  function run(raw) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    print([['echo', `❯ ${cmd}`]]);
    const def = COMMANDS[cmd];
    if (!def) {
      print([['dim', `command not found: ${cmd} — try "help"`]]);
      return;
    }
    for (const [kind, val] of def) {
      if (kind === 'fn') {
        if (val === 'clear') output.textContent = '';
        if (val === 'legacy') toggleLegacy();
      } else if (kind === 'act') {
        print([['dim', `jumping to ${val}…`]]);
        setTimeout(() => {
          palette.close();
          document.querySelector(val)?.scrollIntoView({ behavior: 'smooth' });
        }, 350);
      } else {
        print([[kind, val]]);
      }
    }
  }

  function openPalette() {
    if (typeof palette.showModal !== 'function') return;
    if (document.getElementById('project-modal')?.open) return;
    output.textContent = '';
    history.forEach(([, text]) => {
      const li = document.createElement('li');
      li.className = 'cmd-dim';
      li.textContent = text;
      output.appendChild(li);
    });
    palette.showModal();
    input.value = '';
    input.focus();
  }

  addEventListener('keydown', (e) => {
    const tag = document.activeElement?.tagName;
    const typing = tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable;
    if ((e.key === '/' || e.key === '`') && !typing && !palette.open) {
      e.preventDefault();
      openPalette();
    }
  });

  palette.addEventListener('click', (e) => {
    if (e.target === palette) palette.close();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const value = input.value;
      history.push(['echo', `❯ ${value}`]);
      run(value);
      input.value = '';
    }
  });

  /* ---- Konami code → legacy mode ---- */
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let kIndex = 0;

  addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    kIndex = key === KONAMI[kIndex] ? kIndex + 1 : (key === KONAMI[0] ? 1 : 0);
    if (kIndex === KONAMI.length) {
      kIndex = 0;
      toggleLegacy();
    }
  });
}
