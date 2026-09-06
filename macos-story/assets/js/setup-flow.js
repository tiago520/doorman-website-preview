import { webAddress, downloadText, selectedLabel } from './flow-utils.js';

export function setupFlow(form) {
  const steps = [...form.querySelectorAll('[data-setup-step]')];
  const progress = [...form.querySelectorAll('.nx-progress li')];
  const back = form.querySelector('#nx-setup-back');
  const next = form.querySelector('#nx-setup-next');
  const error = form.querySelector('#nx-setup-error');
  let step = 0;
  let notes = '';
  // Validate only the active step; hidden required fields must not block the first step.
  form.noValidate = true;
  function show(index, focus = true) {
    step = index;
    steps.forEach((fieldset, i) => {
      fieldset.hidden = i !== index;
      fieldset.disabled = i !== index;
      if (i === index) progress[i].setAttribute('aria-current', 'step');
      else progress[i].removeAttribute('aria-current');
    });
    back.hidden = index === 0;
    next.textContent = ['Next: connection ↗', 'Build my checklist ↗', 'Start again'][index];
    error.textContent = '';
    if (focus) (steps[index].querySelector('input, select, legend')).focus();
  }
  function prepare() {
    const origin = webAddress(form.elements.gateway.value, true).origin;
    const client = form.elements.client.value;
    const endpoint = origin + (client === 'claude' ? '/anthropic' : '/openai/v1');
    const snippet = client === 'claude'
      ? `export ANTHROPIC_BASE_URL="${endpoint}"\nexport ANTHROPIC_API_KEY="YOUR_DOORMAN_KEY"\nclaude`
      : `export OPENAI_BASE_URL="${endpoint}"\nexport OPENAI_API_KEY="YOUR_DOORMAN_KEY"`;
    const mode = form.elements.deployment.value;
    const instructions = mode === 'fleet'
      ? 'Give this checklist to your fleet administrator. Configure the approved forwarding policy and certificate trust first. Use this client example only to verify a direct test connection; it does not configure fleet interception.'
      : mode === 'self-hosted'
        ? 'Deploy and secure your gateway first. Confirm TLS, provider credentials, and your organization settings with its administrator, then configure a test client.'
        : 'Obtain a governed key from your administrator, set these variables locally, then start a new client session.';
    const heading = `${form.elements.team.value.trim()} · ${selectedLabel(form, 'deployment')}`;
    const summary = form.querySelector('#nx-setup-summary');
    const title = document.createElement('h3');
    title.textContent = heading;
    const description = document.createElement('p');
    description.textContent = instructions;
    summary.replaceChildren(title, description);
    form.querySelector('#nx-setup-code').textContent = snippet;
    notes = `Doorman setup checklist\n${heading}\n\n${instructions}\n\n${snippet}\n\nReplace YOUR_DOORMAN_KEY locally. Verify a harmless request in your own console, checking provider, selected model, and coverage. This file does not provision or change your environment.\n`;
  }
  steps.forEach(fieldset => { fieldset.querySelector('legend').tabIndex = -1; });
  show(0, false);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (step === 2) return show(0);
    const invalid = [...steps[step].querySelectorAll('input, select')].find(input => !input.checkValidity());
    if (invalid) return invalid.reportValidity();
    if (step === 0 && !form.elements.team.value.trim()) {
      error.textContent = 'Enter a team or project name.';
      return form.elements.team.focus();
    }
    if (step === 1) {
      try { prepare(); } catch (issue) {
        error.textContent = issue instanceof TypeError ? 'Enter a complete gateway address, such as https://gateway.example.com.' : issue.message;
        return form.elements.gateway.focus();
      }
    }
    show(step + 1);
  });
  back.addEventListener('click', () => show(Math.max(0, step - 1)));
  form.querySelector('[data-download="setup"]').addEventListener('click', () => downloadText('doorman-setup.txt', notes));
}
