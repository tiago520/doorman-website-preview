import { money, webAddress, summaryList, downloadText, selectedLabel } from './flow-utils.js';
import { setupFlow } from './setup-flow.js';

function boundaries(form) {
  let worksheet = '';
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const rows = [
      ['Plan', form.elements.name.value.trim()],
      ['Scope', selectedLabel(form, 'scope')],
      ['Monthly budget', money(Number(form.elements.budget.value))],
      ['Budget intention', selectedLabel(form, 'enforcement')],
      ['Data classes', [...form.querySelectorAll('[name="data"]:checked')].map(input => input.parentElement.textContent.trim()).join(', ') || 'None selected'],
      ['Agent intention', selectedLabel(form, 'agents')],
    ];
    summaryList(document.querySelector('#nx-boundary-summary'), rows);
    worksheet = 'Doorman boundary planning worksheet\n\n' + rows.map(([key, value]) => `${key}: ${value}`).join('\n')
      + '\n\nPlanning only: this is not an importable policy. Review support, enforcement modes, exceptions, and access permissions with your administrator. Apply and verify the corresponding settings in your authenticated console.\n';
    const result = document.querySelector('#nx-boundary-result');
    result.hidden = false;
    result.focus();
    document.querySelector('#nx-boundary-status').textContent = 'Your worksheet is ready. No production settings have changed.';
  });
  document.querySelector('[data-download="boundary"]').addEventListener('click', () => downloadText('doorman-boundary-plan.txt', worksheet));
}

function pricing(form) {
  function calculate() {
    if (!form.checkValidity()) return;
    const seats = Number(form.elements.seats.value);
    const overage = Math.max(0, Number(form.elements.requests.value) - Number(form.dataset.included));
    const seatCents = seats * Math.round(Number(form.dataset.seatRate) * 100);
    const usageCents = overage * Math.round(Number(form.dataset.requestRate) * 100);
    document.querySelector('#nx-price-total').textContent = money((seatCents + usageCents) / 100);
    summaryList(document.querySelector('#nx-price-breakdown'), [
      [`${seats.toLocaleString('en-US')} seats`, money(seatCents / 100)],
      [`${overage.toLocaleString('en-US')} requests above allowance`, money(usageCents / 100)],
    ]);
  }
  form.addEventListener('submit', event => { event.preventDefault(); calculate(); });
  form.addEventListener('input', calculate);
  calculate();
}

function contact(form) {
  let brief = '';
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const subject = `Doorman: ${values.get('topic')}`;
    brief = `Name: ${values.get('name')}\nEmail: ${values.get('email')}\nCompany: ${values.get('company')}\nTopic: ${values.get('topic')}\n\n${values.get('message')}\n`;
    document.querySelector('#nx-contact-email').href = `mailto:sales@doorman.dev?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(brief)}`;
    const text = document.querySelector('#nx-contact-text');
    if (text) text.value = `To: sales@doorman.dev\nSubject: ${subject}\n\n${brief}`;
    const result = document.querySelector('#nx-contact-result');
    result.hidden = false;
    result.focus();
  });
  document.querySelector('[data-download="contact"]').addEventListener('click', () => downloadText('doorman-conversation-brief.txt', brief));
  const copy = document.querySelector('#nx-contact-copy');
  copy?.addEventListener('click', async () => {
    const text = document.querySelector('#nx-contact-text');
    const status = document.querySelector('#nx-contact-copy-status');
    try {
      await navigator.clipboard.writeText(text.value);
      status.textContent = 'Email text copied. Paste it into your email app and send when ready.';
    } catch {
      text.focus();
      text.select();
      status.textContent = 'Email text selected. Use your browser’s copy command, then paste it into your email app.';
    }
  });
}

function consoleLogin(form) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const error = document.querySelector('#nx-console-error');
    error.textContent = '';
    try { window.location.assign(webAddress(form.elements.console.value).href); }
    catch (issue) {
      error.textContent = issue instanceof TypeError ? 'Enter the complete HTTPS address of your console.' : issue.message;
      form.elements.console.focus();
    }
  });
}

function tour() {
  const buttons = [...document.querySelectorAll('[data-tour]')];
  if (!buttons.length) return;
  function select(key) {
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.tour === key)));
    document.querySelectorAll('[data-tour-panel]').forEach(panel => { panel.hidden = panel.dataset.tourPanel !== key; });
  }
  buttons.forEach(button => button.addEventListener('click', () => select(button.dataset.tour)));
  select(buttons[0].dataset.tour);
}

for (const [selector, initialize] of [
  ['#nx-boundary-form', boundaries], ['#nx-price-form', pricing],
  ['#nx-setup-form', setupFlow], ['#nx-contact-form', contact], ['#nx-console-form', consoleLogin],
]) {
  const form = document.querySelector(selector);
  if (form) { initialize(form); form.inert = false; }
}
tour();
