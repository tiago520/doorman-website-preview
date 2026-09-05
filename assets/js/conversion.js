const search = document.querySelector('#cx-guide-query');
if (search) {
  const guides = [...document.querySelectorAll('[data-guide]')];
  search.addEventListener('input', () => {
    const terms = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    let visible = 0;
    for (const guide of guides) {
      guide.hidden = !terms.every(term => guide.dataset.guide.toLowerCase().includes(term));
      if (!guide.hidden) visible++;
    }
    document.querySelector('#cx-guide-empty').hidden = visible > 0;
  });
}
// Intent only selects an existing contact topic. No values are sent automatically.
const intent = new URLSearchParams(location.search).get('intent');
const topic = document.querySelector('#nx-contact-form select[name="topic"]');
if (topic && intent) {
  const labels = { macos: 'macos', team: 'team', security: 'security', deployment: 'deployment', support: 'support' };
  const option = [...topic.options].find(option => (option.value + ' ' + option.text).toLowerCase().includes(labels[intent] || '\u0000'));
  if (option) topic.value = option.value;
}

// Native disclosure keeps the full guide list available without JavaScript.
const guideBrowser = document.querySelector('.cx-doc-browser');
if (guideBrowser) {
  const narrow = window.matchMedia('(max-width: 720px)');
  const updateGuideBrowser = () => { guideBrowser.open = !narrow.matches; };
  updateGuideBrowser();
  narrow.addEventListener('change', updateGuideBrowser);
}
