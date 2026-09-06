// A local teaching interaction: never a request to the gateway or a policy change.
// Play the finite reveal when the reader reaches the object, not during page load.
const entrance = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    entry.target.dataset.exEntered = '';
    entrance.unobserve(entry.target);
  }
}, { threshold: 0.15 }) : null;
for (const scene of document.querySelectorAll('[data-explainer]')) {
  const controls = scene.querySelector('.ex-controls');
  const choices = [...scene.querySelectorAll('[data-ex-choice]')];
  const frames = [...scene.querySelectorAll('[data-ex-frame]')];
  if (!controls || !choices.length || !frames.length) continue;
  // Named groups preserve each example's context without repeating the selected
  // control as a hidden heading. The static fallback keeps its visible headings.
  for (const frame of frames) {
    const title = frame.querySelector('.ex-frame-title')?.textContent.trim();
    if (title) {
      frame.setAttribute('role', 'group');
      frame.setAttribute('aria-label', title);
    }
  }
  const announcement = scene.querySelector('.ex-announcement');
  function select(choice, announce = true) {
    const frame = frames.find(item => item.dataset.exFrame === choice.dataset.exChoice);
    if (!frame) return;
    for (const item of frames) item.hidden = item !== frame;
    for (const item of choices) item.setAttribute('aria-pressed', String(item === choice));
    if (announce && announcement) announcement.textContent = frame.querySelector('.ex-result')?.textContent || choice.textContent;
  }
  for (const choice of choices) choice.addEventListener('click', () => select(choice));
  select(choices[0], false);
  controls.hidden = false;
  scene.dataset.exReady = '';
  if (entrance) entrance.observe(scene);
  else scene.dataset.exEntered = '';
}
