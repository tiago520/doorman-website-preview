// Selecting a screenshot never simulates a live app action.
const gallery = document.querySelector('.mi-gallery');
if (gallery) {
  const select = gallery.querySelector('#mi-screen');
  const picture = gallery.querySelector('#mi-screen-image');
  const imageLink = gallery.querySelector('#mi-screen-link');
  const original = gallery.querySelector('#mi-original');
  const caption = gallery.querySelector('#mi-screen-caption');
  const status = gallery.querySelector('#mi-gallery-status');
  const themes = [...gallery.querySelectorAll('[data-mi-theme]')];
  const assetRoot = new URL('.', picture.src);
  let requestedTheme = 'light';
  let rendered = { screen: select.value, theme: requestedTheme };
  let selection = 0;
  const syncControls = state => {
    select.value = state.screen;
    requestedTheme = state.theme;
    themes.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.miTheme === state.theme)));
  };
  fetch(new URL('manifest.json', assetRoot)).then(response => {
    if (!response.ok) throw new Error('Screenshot metadata unavailable');
    return response.json();
  }).then(manifest => {
    const show = async () => {
      const revision = ++selection;
      const requested = { screen: select.value, theme: requestedTheme };
      const label = select.selectedOptions[0].text;
      const key = `${requested.screen}-${requested.theme}`;
      const metadata = manifest[key];
      status.textContent = `Loading ${label.toLowerCase()} in ${requested.theme} appearance…`;
      picture.setAttribute('aria-busy', 'true');
      try {
        if (!metadata || !Number.isFinite(metadata.width) || !Number.isFinite(metadata.height)) throw new Error('Missing dimensions');
        const src = new URL(`${key}@2x.png`, assetRoot).href;
        const next = new Image();
        next.src = src;
        await next.decode();
        if (revision !== selection) return;
        if (next.naturalWidth !== metadata.width || next.naturalHeight !== metadata.height) throw new Error('Unexpected screenshot dimensions');
        picture.width = metadata.width;
        picture.height = metadata.height;
        imageLink.style.setProperty('--mi-preview-width', `${metadata.width / 2}px`);
        picture.src = src;
        picture.alt = `Approved Mac interface design preview: ${label}, ${requested.theme} appearance. Example data.`;
        imageLink.href = original.href = src;
        caption.textContent = `${label} · ${requested.theme === 'dark' ? 'Dark' : 'Light'} appearance`;
        rendered = requested;
        syncControls(rendered);
        status.textContent = `${label} loaded in ${requested.theme} appearance.`;
      } catch {
        if (revision !== selection) return;
        syncControls(rendered);
        status.textContent = 'This screenshot could not load. The previous screen is still shown. Choose a screen or appearance to try again.';
      } finally {
        if (revision === selection) picture.removeAttribute('aria-busy');
      }
    };
    select.addEventListener('change', show);
    themes.forEach(button => button.addEventListener('click', () => {
      requestedTheme = button.dataset.miTheme;
      show();
    }));
    gallery.querySelector('.mi-gallery-controls').hidden = false;
  }).catch(() => {
    status.textContent = 'Screen selection is unavailable. You can still open the original image or browse the full gallery below.';
  });
}
