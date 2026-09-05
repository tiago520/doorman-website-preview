(() => {
  const root = document.querySelector(".nx-branding");
  if (!root) return;
  const states = {
    protected: ['Protected', 'Active and settled.', 'One entrance · 0.6 s'],
    reconnecting: ['Reconnecting', 'A connection is being restored.', 'Soft wave · 1.5 s'],
    paused: ['Paused', 'Routing is paused.', 'Static · pause mark'],
    attention: ['Needs attention', 'There is something to review.', 'Amber pulse · 1.8 s'],
    managed: ['Managed', 'Settings are managed by your team.', 'Static · managed bar'],
    signedOut: ['Signed out', 'Sign in to connect Doorman.', 'Static · outlined'],
  };
  const controls = [...root.querySelectorAll('[data-select-state]')];
  controls.forEach(button => button.addEventListener('click', () => {
    const state = button.dataset.selectState;
    const [title, description, timing] = states[state];
    controls.forEach(control => control.setAttribute('aria-pressed', String(control === button)));
    root.querySelectorAll('[data-preview-icon] .switch-mark').forEach(mark => {
      const next = mark.cloneNode(true);
      next.dataset.state = state;
      mark.replaceWith(next);
    });
    root.querySelector('#state-title').textContent = title;
    root.querySelector('#state-description').textContent = description;
    root.querySelector('#motion-description').textContent = timing;
  }));
  const toggle = root.querySelector('#motion-toggle');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let motionWanted = true;
  function updateMotion() {
    const enabled = motionWanted && !reduced.matches;
    root.classList.toggle('motion-off', !enabled);
    toggle.setAttribute('aria-pressed', String(enabled));
    toggle.textContent = enabled ? 'Motion on' : 'Motion off';
    toggle.disabled = reduced.matches;
    root.querySelector('#motion-note').textContent = reduced.matches
      ? 'Your reduced-motion preference is active. All states remain visible without animation.'
      : 'Motion follows the current native app’s timing. Reduced-motion preferences are respected.';
  }
  toggle.addEventListener('click', () => { motionWanted = !motionWanted; updateMotion(); });
  reduced.addEventListener('change', updateMotion);
  updateMotion();
})();
