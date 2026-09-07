/* Show a table cue only when actual content extends beyond its scroll region. */
(() => {
  const root = document.querySelector('.nx');
  if (!root) return;
  const tables = [...root.querySelectorAll('.nx-table-wrap')].flatMap(region => {
    const table = region.querySelector('table');
    if (!table) return [];
    const hint = document.createElement('p');
    hint.className = 'cx-table-scroll-hint';
    hint.textContent = 'Scroll to see all columns. Use ← → when focused.';
    hint.hidden = true;
    let index = 1;
    while (document.getElementById(`cx-table-scroll-${index}`)) index += 1;
    hint.id = `cx-table-scroll-${index}`;
    region.before(hint);
    function update() {
      // Closed disclosures can retain their last layout dimensions in Chromium.
      const visible = !region.closest('details:not([open]), [hidden]') && region.clientWidth > 0;
      const overflow = visible && region.scrollWidth > region.clientWidth + 1;
      if (hint.hidden === !overflow) return;
      hint.hidden = !overflow;
      const describedBy = (region.getAttribute('aria-describedby') || '').split(/\s+/)
        .filter(id => id && id !== hint.id);
      if (overflow) {
        describedBy.push(hint.id);
        if (!region.hasAttribute('tabindex')) region.tabIndex = 0;
      }
      if (describedBy.length) region.setAttribute('aria-describedby', describedBy.join(' '));
      else region.removeAttribute('aria-describedby');
    }
    return [{ region, table, update }];
  });
  if (!tables.length) return;
  let frame = 0;
  function schedule() {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      tables.forEach(({ update }) => update());
    });
  }
  if (typeof ResizeObserver === 'function') {
    const observer = new ResizeObserver(schedule);
    tables.forEach(({ region, table }) => { observer.observe(region); observer.observe(table); });
  } else {
    window.addEventListener('resize', schedule);
  }
  root.addEventListener('toggle', schedule, true);
  document.fonts?.ready.then(schedule);
  schedule();
})();

/* Shared disclosure navigation for the independent website. */
(() => {
  const root = document.querySelector('.nx');
  if (!root) return;
  root.classList.add('js-ready');
  // A link to a specific FAQ should reveal the answer as well as its heading.
  function revealFragment() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = id && document.getElementById(id);
    if (!target || !root.contains(target)) return;
    const disclosure = target.closest('details');
    if (disclosure) disclosure.open = true;
  }
  revealFragment();
  window.addEventListener('hashchange', revealFragment);
  const groups = [...root.querySelectorAll('.nx-nav-group')];
  const toggle = root.querySelector('.nx-menu-toggle');
  const mobile = root.querySelector('#nx-mobile');
  let active = null;
  let leaveTimer;
  function closeDesktop(restore = false) {
    if (!active) return;
    const button = active.querySelector('button');
    button.setAttribute('aria-expanded', 'false');
    active.querySelector('.nx-mega').hidden = true;
    if (restore) button.focus();
    active = null;
  }
  function openDesktop(group) {
    clearTimeout(leaveTimer);
    if (active !== group) closeDesktop();
    active = group;
    group.querySelector('button').setAttribute('aria-expanded', 'true');
    group.querySelector('.nx-mega').hidden = false;
  }
  function closeMobile(restore = false) {
    if (!mobile || !toggle) return;
    mobile.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    if (restore) toggle.focus();
  }
  for (const group of groups) {
    const button = group.querySelector('button');
    group.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse') openDesktop(group);
    });
    group.addEventListener('pointerleave', () => {
      leaveTimer = setTimeout(() => {
        if (!group.contains(document.activeElement)) closeDesktop();
      }, 180);
    });
    button.addEventListener('click', event => {
      if (event.detail === 0 && active === group) return closeDesktop();
      openDesktop(group);
      if (event.detail === 0) group.querySelector('.nx-mega a').focus();
    });
    button.addEventListener('keydown', event => {
      if (event.key !== 'ArrowDown') return;
      event.preventDefault();
      openDesktop(group);
      group.querySelector('.nx-mega a').focus();
    });
    group.addEventListener('focusout', event => {
      if (!group.contains(event.relatedTarget)) closeDesktop();
    });
  }
  toggle?.addEventListener('click', () => {
    if (!mobile.hidden) return closeMobile();
    closeDesktop();
    mobile.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation');
    mobile.querySelector('summary, a').focus();
  });
  mobile?.addEventListener('click', event => {
    if (event.target.closest('a')) closeMobile();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    closeDesktop(true);
    if (mobile && !mobile.hidden) closeMobile(true);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.nx-nav-group')) closeDesktop();
    if (!event.target.closest('.nx-nav')) closeMobile();
  });
  matchMedia('(max-width: 900px)').addEventListener('change', () => {
    closeDesktop();
    closeMobile();
  });
})();
