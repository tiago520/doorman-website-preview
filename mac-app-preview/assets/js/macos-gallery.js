// Original approved mockup exports. Selecting a screen never simulates a live app action.
const gallery = document.querySelector('.mi-gallery');
if (gallery) {
  const select = gallery.querySelector('#mi-screen');
  const picture = gallery.querySelector('#mi-screen-image');
  const imageLink = gallery.querySelector('#mi-screen-link');
  const original = gallery.querySelector('#mi-original');
  const caption = gallery.querySelector('#mi-screen-caption');
  const themes = [...gallery.querySelectorAll('[data-mi-theme]')];
  const assetRoot = new URL('.', picture.src);
  let theme = 'light';
  let selection = 0;
  fetch(new URL('manifest.json', assetRoot)).then(response => {
    if (!response.ok) throw new Error('Screenshot metadata unavailable');
    return response.json();
  }).then(manifest => {
    const show = async () => {
      const revision = ++selection;
      const key = `${select.value}-${theme}`;
      const metadata = manifest[key];
      if (!metadata) return;
      const src = new URL(`${key}@2x.png`, assetRoot).href;
      const next = new Image();
      next.src = src;
      try { await next.decode(); } catch { return; }
      if (revision !== selection) return;
      picture.width = metadata.width;
      picture.height = metadata.height;
      picture.src = src;
      const label = select.selectedOptions[0].text;
      picture.alt = `Approved Mac interface design preview: ${label}, ${theme} appearance. Example data.`;
      imageLink.href = original.href = src;
      caption.textContent = `${label} · ${theme === 'dark' ? 'Dark' : 'Light'} appearance`;
    };
    select.addEventListener('change', show);
    themes.forEach(button => button.addEventListener('click', () => {
      theme = button.dataset.miTheme;
      themes.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      show();
    }));
    gallery.querySelector('.mi-gallery-controls').hidden = false;
  }).catch(() => { /* The original image and full gallery links remain available. */ });
}
