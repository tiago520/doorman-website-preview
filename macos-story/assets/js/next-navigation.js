/* Shared disclosure navigation for the independent website. */
(() => {
  const root = document.querySelector('.nx');
  if (!root) return;
  root.classList.add('js-ready');
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
