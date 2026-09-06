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
    root.dispatchEvent(new CustomEvent('brand-motion-preference'));
    root.querySelector('#motion-note').textContent = reduced.matches
      ? 'Your reduced-motion preference is active. All states remain visible without animation.'
      : 'Motion follows the current native app’s timing. Reduced-motion preferences are respected.';
  }
  toggle.addEventListener('click', () => { motionWanted = !motionWanted; updateMotion(); });
  reduced.addEventListener('change', updateMotion);
  updateMotion();
})();

/* Local specimens only: no requests, settings writes, or synthetic telemetry. */
(() => {
  const root = document.querySelector('.nx-branding');
  const gallery = root?.querySelector('.bm-gallery');
  if (!gallery) return;
  const patterns = [...gallery.querySelectorAll('[data-bm-pattern]')];
  const choices = [...gallery.querySelectorAll('[data-bm-select]')];
  const replay = root.querySelector('#bm-replay');
  const pause = root.querySelector('#bm-pause');
  const playback = root.querySelector('#bm-playback');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let selected = 'page';
  let generation = 0;
  let animations = [];
  let paused = false;
  const initial = {
    page: ['Preparing your workspace', 'The example is waiting for its first view.'],
    button: ['Saving changes', 'This is a button specimen, not a settings form.'],
    retry: ['Reconnecting', 'Waiting for the gateway to respond.'],
  };
  const final = {
    page: ['Example view ready', 'A real page would now show its content.'],
    button: ['Changes saved', 'Example result only. No settings were changed.'],
    retry: ['Retry available', 'The example attempt ended without a connection.'],
  };
  const motionAllowed = () => !reduced.matches && !root.classList.contains('motion-off');
  const active = () => patterns.find(pattern => pattern.dataset.bmPattern === selected);
  function stop() {
    generation += 1;
    animations.forEach(animation => animation.cancel());
    animations = [];
    paused = false;
    pause.disabled = true;
    pause.textContent = 'Pause';
    pause.setAttribute('aria-pressed', 'false');
  }
  function setCopy(copy) {
    if (!copy) return;
    active().querySelector('[data-bm-status]').textContent = copy[0];
    active().querySelector('[data-bm-detail]').textContent = copy[1];
  }
  function reset() {
    setCopy(initial[selected]);
    const mark = active().querySelector('.switch-mark');
    mark.dataset.state = selected === 'attention' ? 'attention' : initial[selected] ? 'reconnecting' : 'protected';
  }
  function play() {
    stop();
    reset();
    if (selected === 'progress') {
      playback.textContent = 'Move the control to set completed example steps.';
      return;
    }
    if (!motionAllowed()) {
      playback.textContent = 'Static example. Motion is off; every meaning remains visible.';
      return;
    }
    const sequence = generation;
    const mark = active().querySelector('.switch-mark');
    const gates = [...mark.querySelectorAll('.gate')];
    if (selected === 'success') {
      animations = gates.map(gate => gate.animate([
        { opacity: .2, transform: 'translateY(3px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration: 600, easing: 'cubic-bezier(.2,.7,.3,1)' }));
    } else if (selected === 'attention') {
      animations = [gates[1].animate([{ opacity: 1 }, { opacity: .35 }, { opacity: 1 }], { duration: 1800, easing: 'ease-in-out' })];
    } else {
      animations = gates.map((gate, index) => gate.animate([
        { opacity: 1, offset: 0 }, { opacity: .24, offset: .3 },
        { opacity: 1, offset: .7 }, { opacity: 1, offset: 1 },
      ], { duration: 1500, iterations: 2, delay: index * 180, easing: 'ease-in-out' }));
    }
    pause.disabled = false;
    playback.textContent = 'Playing one finite example.';
    Promise.all(animations.map(animation => animation.finished)).then(() => {
      if (sequence !== generation) return;
      animations = [];
      setCopy(final[selected]);
      if (selected === 'page' || selected === 'button') mark.dataset.state = 'protected';
      pause.disabled = true;
      playback.textContent = 'Example finished. Replay whenever you like.';
    }).catch(() => { /* Selection, preference or visibility change cancels this local sequence. */ });
  }
  function select(key, animate = true) {
    stop();
    selected = key;
    patterns.forEach(pattern => { pattern.hidden = pattern.dataset.bmPattern !== key; });
    choices.forEach(choice => choice.setAttribute('aria-pressed', String(choice.dataset.bmSelect === key)));
    replay.disabled = key === 'progress';
    reset();
    if (animate) play();
  }
  choices.forEach(choice => choice.addEventListener('click', () => select(choice.dataset.bmSelect)));
  replay.addEventListener('click', play);
  pause.addEventListener('click', () => {
    paused = !paused;
    animations.forEach(animation => paused ? animation.pause() : animation.play());
    pause.textContent = paused ? 'Resume' : 'Pause';
    pause.setAttribute('aria-pressed', String(paused));
    playback.textContent = paused ? 'Example paused. Resume or replay when ready.' : 'Playing one finite example.';
  });
  const progressInput = root.querySelector('#bm-progress-input');
  progressInput.disabled = false;
  progressInput.addEventListener('input', () => {
    const value = Number(progressInput.value);
    root.querySelector('#bm-progress-meter').value = value;
    root.querySelector('#bm-count').value = String(value);
    root.querySelector('#bm-progress-meter').textContent = `${value} of 4`;
  });
  const preferenceChanged = () => {
    if (!motionAllowed()) {
      stop();
      playback.textContent = 'Static example. Motion is off; every meaning remains visible.';
    } else {
      playback.textContent = 'Motion available. Replay to start an example.';
    }
  };
  root.addEventListener('brand-motion-preference', preferenceChanged);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && animations.length) {
      stop();
      playback.textContent = 'Example stopped while this tab was away. Replay to start again.';
    }
  });
  gallery.classList.add('is-enhanced');
  gallery.querySelector('.bm-choices').hidden = false;
  root.querySelector('.bm-toolbar').hidden = false;
  select('page', false);
  const entry = new IntersectionObserver(entries => {
    if (entries.some(item => item.isIntersecting)) { entry.disconnect(); play(); }
  }, { threshold: .3 });
  entry.observe(gallery);
})();
