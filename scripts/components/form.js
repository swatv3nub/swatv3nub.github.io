export function initForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('cf-status');
  const submit = document.getElementById('cf-submit');
  if (!form || !status) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submit.disabled = true;
    status.classList.remove('is-error');
    status.textContent = 'TRANSMITTING…';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) throw new Error('failed');
      status.textContent = '✓ SIGNAL RECEIVED — I\'LL GET BACK TO YOU.';
      form.reset();
    } catch {
      status.classList.add('is-error');
      status.textContent = '✗ TRANSMISSION FAILED — TRY A SOCIAL CHANNEL INSTEAD.';
    } finally {
      submit.disabled = false;
    }
  });
}
