export function initSkills() {
  const hint = document.getElementById('skills-hint');
  const skills = document.querySelectorAll('.skill');
  if (!skills.length) return;

  function projectLabel(id) {
    const card = document.querySelector(`.project[data-id="${id}"]`);
    return card?.querySelector('.project__name')?.childNodes[0]?.textContent.trim() ?? id.toUpperCase();
  }

  skills.forEach((skill) => {
    skill.addEventListener('click', () => {
      const wasLinked = skill.classList.contains('is-linked');
      skills.forEach((s) => s.classList.remove('is-linked'));
      document.querySelectorAll('.project.is-flash').forEach((p) => p.classList.remove('is-flash'));

      if (wasLinked) {
        hint.textContent = '';
        return;
      }
      skill.classList.add('is-linked');

      const ids = (skill.dataset.links || '').split(/\s+/).filter(Boolean);
      if (!ids.length) {
        hint.textContent = `${skill.textContent.trim()} → CORE TOOL, USED EVERYWHERE.`;
        return;
      }

      ids.forEach((id) => {
        const card = document.querySelector(`.project[data-id="${id}"]`);
        if (!card) return;
        card.classList.add('is-flash');
        setTimeout(() => card.classList.remove('is-flash'), 2400);
      });

      const names = ids.map(projectLabel).join(' · ');
      hint.textContent = `${skill.textContent.trim()} → ${names}`;

      const work = document.getElementById('work');
      if (work) {
        const rect = work.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > innerHeight) {
          work.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}
