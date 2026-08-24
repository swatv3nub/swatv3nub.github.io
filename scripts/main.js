import { initReveal, initNavHighlight } from './components/reveal.js';
import { initNav } from './components/nav.js';
import { initTerminal } from './components/terminal.js';
import { initCursor } from './components/cursor.js';
import { initProjects } from './components/projects.js';
import { initGitHub } from './components/github.js';
import { initScope } from './components/scope.js';
import { initSpectrum } from './components/spectrum.js';
import { initSkills } from './components/skills.js';
import { initForm } from './components/form.js';
import { initEasterEggs } from './components/easter-eggs.js';

function boot() {
  try { initNav(); } catch (e) { console.error('nav', e); }
  try { initReveal(); } catch (e) { console.error('reveal', e); }
  try { initNavHighlight(); } catch (e) { console.error('navhl', e); }
  try { initTerminal(); } catch (e) { console.error('terminal', e); }
  try { initCursor(); } catch (e) { console.error('cursor', e); }
  try { initProjects(); } catch (e) { console.error('projects', e); }
  try { initGitHub(); } catch (e) { console.error('github', e); }
  try { initScope(); } catch (e) { console.error('scope', e); }
  try { initSpectrum(); } catch (e) { console.error('spectrum', e); }
  try { initSkills(); } catch (e) { console.error('skills', e); }
  try { initForm(); } catch (e) { console.error('form', e); }
  try { initEasterEggs(); } catch (e) { console.error('eggs', e); }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
