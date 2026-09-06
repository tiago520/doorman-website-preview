// Native anchors are the fallback. Large images and the console load only on intent.
let lightbox;
let returnFocus;
function buildLightbox() {
  const dialog = document.createElement('dialog');
  dialog.className = 'nx-shot-dialog';
  dialog.setAttribute('aria-labelledby', 'nx-shot-title');
  dialog.innerHTML = '<div class="nx-shot-toolbar"><h2 id="nx-shot-title">Console screenshot</h2><button type="button" class="btn btn-secondary">Close</button></div><div class="nx-shot-canvas"><img width="3200" height="2200" alt=""></div><p>Full resolution · Scroll to inspect the details.</p>';
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => returnFocus?.focus());
  document.body.append(dialog);
  return dialog;
}
document.querySelectorAll('[data-enlarge]').forEach(link => {
  link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!('HTMLDialogElement' in window)) return;
    event.preventDefault();
    lightbox ||= buildLightbox();
    returnFocus = link;
    lightbox.querySelector('h2').textContent = `${link.dataset.enlarge} · Full resolution`;
    const img = lightbox.querySelector('img');
    img.alt = `${link.dataset.enlarge} in the white-and-yellow sample console`;
    img.src = link.href;
    lightbox.showModal();
  });
});
document.querySelectorAll('[data-console-embed]').forEach(panel => {
  const launch = panel.querySelector('[data-console-launch]');
  const tools = panel.querySelector('.nx-embed-tools');
  const host = panel.querySelector('[data-console-frame]');
  launch.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const frame = document.createElement('iframe');
    frame.src = launch.href;
    frame.title = 'Interactive Doorman sample console';
    frame.className = 'nx-console-frame';
    host.replaceChildren(frame);
    launch.hidden = true;
    tools.hidden = false;
    panel.querySelector('[data-console-close]').focus();
  });
  panel.querySelector('[data-console-close]').addEventListener('click', () => {
    host.replaceChildren();
    tools.hidden = true;
    launch.hidden = false;
    launch.focus();
  });
});
