/* Scroll reveals + word-split headings */

function splitWords(el) {
  const text = el.textContent.trim();
  el.setAttribute('aria-label', text);
  el.textContent = '';
  text.split(/\s+/).forEach((word, i) => {
    const outer = document.createElement('span');
    outer.className = 'w';
    outer.setAttribute('aria-hidden', 'true');
    const inner = document.createElement('i');
    inner.textContent = word;
    inner.style.setProperty('--i', i);
    outer.appendChild(inner);
    el.appendChild(outer);
    el.appendChild(document.createTextNode(' '));
  });
}

export function initReveal() {
  document.querySelectorAll('.reveal-text').forEach(splitWords);

  const targets = document.querySelectorAll(
    '.reveal, .reveal-delay-1, .reveal-delay-2, .reveal-delay-3, .reveal-delay-4, .reveal-text'
  );

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-inview');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((el) => io.observe(el));
}

export function initNavHighlight() {
  const links = new Map();
  document.querySelectorAll('.nav__link').forEach((link) => {
    const id = link.getAttribute('href')?.slice(1);
    if (id) links.set(id, link);
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const link = links.get(entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach((l) => l.classList.remove('is-current'));
        link.classList.add('is-current');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  links.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) io.observe(section);
  });
}
