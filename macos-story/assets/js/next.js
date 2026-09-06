/* Concept 02: illustrative scenarios, product exploration, and local-only copy. */
(() => {
  const root = document.querySelector('.nx');
  if (!root) return;
  const scenarios = {
    everyday: { request: '“Summarize this pull request.”', label: 'Right-sized routing', result: 'Use an efficient model when confidence allows.', destination: 'efficient' },
    complex: { request: '“Design a fault-tolerant payment system.”', label: 'Depth where it matters', result: 'Keep demanding work on a capable reasoning model.', destination: 'reasoning' },
    pinned: { request: '“Use my chosen model for this request.”', label: 'Your choice comes first', result: 'Honor the model pin. Keep the routing choice with you.', destination: 'original' },
  };
  function selectScenario(key) {
    const scenario = scenarios[key];
    if (!scenario) return;
    document.getElementById('nx-request').textContent = scenario.request;
    document.getElementById('nx-verdict-label').textContent = scenario.label;
    document.getElementById('nx-result').textContent = scenario.result;
    root.querySelectorAll('[data-scenario]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.scenario === key)));
    root.querySelectorAll('[data-destination]').forEach(node => { node.dataset.selected = String(node.dataset.destination === scenario.destination); });
  }
  root.querySelectorAll('[data-scenario]').forEach(button => button.addEventListener('click', () => selectScenario(button.dataset.scenario)));
  selectScenario('everyday');

  const titles = { overview: 'Control Room', spend: 'Spend & savings', attention: 'Needs attention' };
  function selectView(key) {
    if (!titles[key]) return;
    root.querySelectorAll('[data-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === key)));
    root.querySelectorAll('[data-product-panel]').forEach(panel => { panel.hidden = panel.dataset.productPanel !== key; });
    document.getElementById('nx-window-title').textContent = titles[key];
  }
  root.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => selectView(button.dataset.view)));
  selectView('overview');
  root.classList.add('js-ready');

  const examples = {
    claude: '# Your gateway. Your governed key.\nexport ANTHROPIC_BASE_URL="https://gateway.yourco.dev/anthropic"\nexport ANTHROPIC_API_KEY="<your governed key>"',
    openai: '# For clients that support these environment variables.\nexport OPENAI_BASE_URL="https://gateway.yourco.dev/openai/v1"\nexport OPENAI_API_KEY="<your governed key>"',
  };
  let selectedClient = 'claude';
  root.querySelectorAll('[data-client]').forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.client;
    if (!examples[key]) return;
    selectedClient = key;
    const code = document.getElementById('nx-code-content');
    const [comment, ...lines] = examples[key].split('\n');
    const commentNode = document.createElement('span');
    commentNode.className = 'c';
    commentNode.textContent = comment;
    code.replaceChildren(commentNode, document.createTextNode('\n' + lines.join('\n')));
    root.querySelectorAll('[data-client]').forEach(tab => tab.setAttribute('aria-pressed', String(tab.dataset.client === key)));
    document.getElementById('nx-copy-status').textContent = '';
  }));
  const copyButton = document.getElementById('nx-copy');
  copyButton.addEventListener('click', async () => {
    const status = document.getElementById('nx-copy-status');
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(examples[selectedClient]);
      status.textContent = 'Setup example copied. Replace the example URL and key with yours.';
      copyButton.textContent = 'Copied';
    } catch {
      const code = document.getElementById('nx-code-content');
      const range = document.createRange();
      range.selectNodeContents(code);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      code.closest('pre').focus();
      status.textContent = 'Automatic copy is unavailable. The example is selected; use your browser’s copy command.';
      copyButton.textContent = 'Select & copy';
    }
    window.setTimeout(() => { copyButton.textContent = 'Copy example ⧉'; }, 2200);
  });

})();
