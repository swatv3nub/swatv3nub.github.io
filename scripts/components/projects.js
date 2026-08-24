export function initProjects() {
  const modal = document.getElementById('project-modal');
  const content = document.getElementById('pmodal-content');
  const closeBtn = document.getElementById('pmodal-close');
  if (!modal || !content) return;

  function open(id) {
    const tpl = document.getElementById(`tpl-${id}`);
    if (!tpl) return;
    content.textContent = '';
    content.appendChild(tpl.content.cloneNode(true));
    const name = content.querySelector('.pmodal__name');
    if (name) {
      name.id = 'pmodal-title-slot';
      modal.setAttribute('aria-labelledby', 'pmodal-title-slot');
    }
    modal.showModal();
  }

  document.querySelectorAll('[data-project-open]').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      open(card.dataset.projectOpen);
    });
    card.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target === card) {
        e.preventDefault();
        open(card.dataset.projectOpen);
      }
    });
  });

  closeBtn?.addEventListener('click', () => modal.close());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });
}
