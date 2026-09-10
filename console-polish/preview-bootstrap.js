/* Static tour only. Runs before the console module, without connecting a gateway. */
(() => {
  try {
    localStorage.setItem('sy.demo', '1');
    localStorage.setItem('sy.theme', 'daylight');
    localStorage.setItem('sy.look', 'flat');
    localStorage.removeItem('sy.apiBase');
  } catch {
    location.replace('../design-polish/next/demo.html?storage=unavailable');
    return;
  }
  window.addEventListener('sy:mode', event => {
    if (localStorage.getItem('sy.demo') === '1') return;
    // Leaving the tour returns to the website, never to a nonexistent live backend.
    localStorage.setItem('sy.demo', '1');
    event.stopImmediatePropagation();
    location.replace('../design-polish/next/login.html');
  }, { capture: true });
})();
