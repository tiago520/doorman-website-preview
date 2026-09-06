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
    document.querySelectorAll('[data-guide-group]').forEach(group => {
      group.hidden = ![...group.querySelectorAll('[data-guide]')].some(guide => !guide.hidden);
    });
    document.querySelector('#cx-guide-empty').hidden = visible > 0;
    const count = document.querySelector('#cx-guide-count');
    if (count) count.textContent = `${visible} ${visible === 1 ? 'guide' : 'guides'}`;
  });
}
// Intent only selects an existing contact topic. No values are sent automatically.
const intent = new URLSearchParams(location.search).get('intent');
const topic = document.querySelector('#nx-contact-form select[name="topic"]');
if (topic && intent) {
  const labels = { macos: 'macos', team: 'team', security: 'security', deployment: 'deployment', enterprise: 'deployment', support: 'support', finance: 'finance', pricing: 'pricing', evals: 'quality', tune: 'tune', models: 'models', mcp: 'mcp', integrations: 'integrations', vibeguard: 'browser', sustainability: 'sustainability', assessment: 'assessment' };
  const option = [...topic.options].find(option => (option.value + ' ' + option.text).toLowerCase().includes(labels[intent] || '\u0000'));
  if (option) topic.value = option.value;
}
if (topic) {
  const prompts = {
    'Team pilot': 'Name the team, its AI tools, and the result that would justify a wider rollout.',
    'macOS access': 'Share the macOS version, tools you use, and whether you need personal or managed installation.',
    'Enterprise deployment': 'Tell us where traffic runs, who manages identity, and your hosting or network requirements.',
    'Security review': 'Name the data classes, agent actions, and evidence your review needs.',
    'Finance and AI Close': 'Share the reporting period, cost owners, provider bills, and reconciliation question.',
    'Quality and evaluations': 'Describe one workload, its acceptance criteria, and which model choices you want to compare.',
    'Tune evaluation': 'Name the decision you want to adapt and the reviewed examples you can use to evaluate it.',
    'Models and provider access': 'List the providers you use and the access, routing, or billing problem you want to solve.',
    'MCP and agent governance': 'Name the agent, its tool servers, and the actions that need a boundary or approval.',
    'Organization integrations': 'Describe your identity provider, event destination, and who will own the connection.',
    'Browser AI coverage': 'Name the browser platforms and data or spending controls you need to evaluate.',
    'Sustainability reporting': 'Share the period and scope you need to report, and how you will use the estimate.',
    'AI visibility assessment': 'Choose a representative team and tool set. Tell us which coverage, spend, or quality question the pilot should answer.',
  };
  const updateTopic = () => {
    const copy = prompts[topic.value] || 'Share your tools, the problem to solve, and the decision you want to make.';
    const guidance = document.querySelector('#nx-contact-guidance');
    if (guidance) guidance.textContent = copy;
    const direct = document.querySelector('#nx-contact-direct');
    if (direct) direct.href = `mailto:sales@doorman.dev?subject=${encodeURIComponent('Doorman: ' + topic.value)}`;
  };
  topic.addEventListener('change', updateTopic);
  updateTopic();
}

// Native disclosure keeps the full guide list available without JavaScript.
const guideBrowser = document.querySelector('.cx-doc-browser');
if (guideBrowser) {
  const narrow = window.matchMedia('(max-width: 720px)');
  const updateGuideBrowser = () => { guideBrowser.open = !narrow.matches; };
  updateGuideBrowser();
  narrow.addEventListener('change', updateGuideBrowser);
  guideBrowser.querySelectorAll('a').forEach(link => {
    if (new URL(link.href).pathname === location.pathname) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}
