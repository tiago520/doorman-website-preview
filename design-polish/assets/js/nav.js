/* Doorman nav: mega menus (hover intent + click + keyboard) and the mobile sheet.
   No dependencies. Progressive: links work without JS. */
(function () {
  var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-menu]'));
  var backdrop = document.querySelector('.menu-backdrop');
  var openId = null, closeTimer = null;

  function panelFor(id) { return document.getElementById('menu-' + id); }
  function setOpen(id) {
    if (openId && openId !== id) { panelFor(openId).dataset.open = 'false'; trigger(openId).setAttribute('aria-expanded', 'false'); }
    openId = id;
    if (id) { panelFor(id).dataset.open = 'true'; trigger(id).setAttribute('aria-expanded', 'true'); }
    if (backdrop) backdrop.dataset.open = id ? 'true' : 'false';
  }
  function trigger(id) { return document.querySelector('[data-menu="' + id + '"]'); }
  function close() { if (openId) { panelFor(openId).dataset.open = 'false'; trigger(openId).setAttribute('aria-expanded', 'false'); } openId = null; if (backdrop) backdrop.dataset.open = 'false'; }

  triggers.forEach(function (t) {
    var id = t.dataset.menu, li = t.parentElement, panel = panelFor(id);
    if (!panel) return;
    t.setAttribute('aria-haspopup', 'true'); t.setAttribute('aria-expanded', 'false'); t.setAttribute('aria-controls', 'menu-' + id);
    t.addEventListener('click', function (e) { e.preventDefault(); openId === id ? close() : setOpen(id); });
    li.addEventListener('mouseenter', function () { clearTimeout(closeTimer); setOpen(id); });
    li.addEventListener('mouseleave', function () { closeTimer = setTimeout(close, 180); });
    panel.addEventListener('mouseenter', function () { clearTimeout(closeTimer); });
    panel.addEventListener('mouseleave', function () { closeTimer = setTimeout(close, 180); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(id); var f = panel.querySelector('a'); if (f) f.focus(); }
    });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { close(); closeSheet(); } });
  document.addEventListener('click', function (e) { if (openId && !e.target.closest('.nav-links') && !e.target.closest('.menu')) close(); });
  if (backdrop) backdrop.addEventListener('click', close);

  // mobile sheet
  var burger = document.querySelector('.burger'), sheet = document.querySelector('.sheet');
  function closeSheet() { if (sheet) sheet.dataset.open = 'false'; if (burger) burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
  if (burger && sheet) {
    burger.addEventListener('click', function () {
      var open = sheet.dataset.open === 'true';
      sheet.dataset.open = open ? 'false' : 'true'; burger.setAttribute('aria-expanded', String(!open)); document.body.style.overflow = open ? '' : 'hidden';
    });
    sheet.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeSheet); });
  }
})();
