// Search the static product directory. All destinations remain available without JS.
const productSearch = document.querySelector('[data-product-search]');
if (productSearch) {
  const query = document.querySelector('#pd-query');
  const audience = document.querySelector('#pd-audience');
  const products = [...document.querySelectorAll('[data-product]')];
  const groups = [...document.querySelectorAll('[data-product-group]')];
  const count = document.querySelector('#pd-count');
  const empty = document.querySelector('#pd-empty');
  const capabilityCount = document.querySelector('#pd-capability-count');
  const reset = document.querySelector('#pd-reset');
  let searching = false;
  const priorOpen = new Map();
  function filterProducts() {
    const terms = query.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const matches = text => {
      const normalized = text.toLowerCase();
      const words = normalized.split(/[^\p{L}\p{N}]+/u);
      return terms.every(term => /^[a-z0-9]{1,3}$/.test(term) ? words.some(word => word.startsWith(term)) : normalized.includes(term));
    };
    if (terms.length && !searching) {
      for (const product of products) {
        const disclosure = product.querySelector('details');
        priorOpen.set(disclosure, disclosure.open);
      }
    }
    let visible = 0, capabilities = 0;
    for (const product of products) {
      const entries = [...product.querySelectorAll('[data-capability]')];
      const familyMatches = matches(product.dataset.product);
      const matching = entries.filter(entry => familyMatches || matches(entry.dataset.capability));
      product.hidden = !matching.length
        || Boolean(audience.value && !product.dataset.audience.split(' ').includes(audience.value));
      for (const entry of entries) entry.hidden = !matching.includes(entry);
      const disclosure = product.querySelector('details');
      const n = matching.length;
      disclosure.querySelector('summary').textContent = `View ${n} ${n === 1 ? 'capability' : 'capabilities'}`;
      if (terms.length) disclosure.open = !product.hidden;
      else if (searching) disclosure.open = priorOpen.get(disclosure) ?? false;
      if (!product.hidden) { visible++; capabilities += matching.length; }
    }
    for (const group of groups) group.hidden = !group.querySelector('[data-product]:not([hidden])');
    for (const link of document.querySelectorAll('.pd-index a')) {
      const group = document.getElementById(link.hash.slice(1));
      link.hidden = Boolean(group?.hidden);
    }
    count.textContent = `${visible} product ${visible === 1 ? 'family' : 'families'}`;
    capabilityCount.textContent = `${capabilities} ${capabilities === 1 ? 'capability' : 'capabilities'}`;
    empty.hidden = visible > 0;
    reset.hidden = !terms.length && !audience.value;
    searching = terms.length > 0;
    if (!searching) priorOpen.clear();
  }
  query.addEventListener('input', filterProducts);
  audience.addEventListener('change', filterProducts);
  reset.addEventListener('click', () => {
    query.value = ''; audience.value = ''; filterProducts(); query.focus();
  });
  filterProducts();
  productSearch.hidden = false;
}
