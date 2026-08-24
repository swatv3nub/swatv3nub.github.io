const USER = 'swatv3nub';
const CACHE_KEY = 'sw4nit-gh-cache-v1';
const TTL = 6 * 60 * 60 * 1000; // 6 hours

function readCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (cached && Date.now() - cached.t < TTL) return cached;
  } catch { /* ignore */ }
  return null;
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...data, t: Date.now() }));
  } catch { /* ignore */ }
}

async function fetchStats() {
  const userRes = await fetch(`https://api.github.com/users/${USER}`);
  if (!userRes.ok) throw new Error('user fetch failed');
  const user = await userRes.json();

  let stars = 0;
  for (let page = 1; page <= 2; page++) {
    const res = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&page=${page}&sort=updated`);
    if (!res.ok) break;
    const repos = await res.json();
    stars += repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
    if (repos.length < 100) break;
  }

  return { repos: user.public_repos, followers: user.followers, stars };
}

function countUp(el, target, suffix = '') {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = `${target}${suffix}`;
    return;
  }
  const dur = 1200;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = `${Math.round(target * eased)}${suffix}`;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

export function initGitHub() {
  const els = {
    repos: document.querySelector('[data-stat="repos"]'),
    stars: document.querySelector('[data-stat="stars"]'),
    followers: document.querySelector('[data-stat="followers"]')
  };
  if (!els.repos) return;

  // heatmap graceful degradation
  const heatmapImg = document.querySelector('.github__heatmap img');
  heatmapImg?.addEventListener('error', () => {
    const box = heatmapImg.closest('.github__heatmap');
    box.classList.add('is-empty');
    heatmapImg.remove();
  });

  let resolved = null;

  const statIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      statIO.disconnect();
      const show = () => {
        if (resolved) {
          countUp(els.repos, resolved.repos);
          countUp(els.stars, resolved.stars);
          countUp(els.followers, resolved.followers);
        } else {
          Object.values(els).forEach((el) => {
            el.textContent = `${el.dataset.fallback}+`;
          });
        }
      };
      // small delay so numbers resolve before the block is seen
      setTimeout(show, resolved ? 50 : 600);
    });
  }, { threshold: 0.4 });

  statIO.observe(els.repos.closest('.github'));

  const cached = readCache();
  if (cached) {
    resolved = cached;
    return;
  }

  fetchStats()
    .then((stats) => {
      resolved = stats;
      writeCache(stats);
      // update live if already visible
      if (els.repos.textContent !== '—') {
        countUp(els.repos, stats.repos);
        countUp(els.stars, stats.stars);
        countUp(els.followers, stats.followers);
      }
    })
    .catch(() => { /* fallback values stay */ });
}
