// Search the static product directory. All destinations remain available without JS.
const productSearch = document.querySelector('[data-product-search]');
if (productSearch) {
  const query = document.querySelector('#pd-query');
  const audience = document.querySelector('#pd-audience');
  const products = [...document.querySelectorAll('[data-product]')];
  const groups = [...document.querySelectorAll('[data-product-group]')];
  const count = document.querySelector('#pd-count');
  const empty = document.querySelector('#pd-empty');
  function filterProducts() {
    const terms = query.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    let visible = 0;
    for (const product of products) {
      product.hidden = !terms.every(term => product.dataset.product.toLowerCase().includes(term))
        || Boolean(audience.value && !product.dataset.audience.split(' ').includes(audience.value));
      if (!product.hidden) visible++;
    }
    for (const group of groups) group.hidden = !group.querySelector('[data-product]:not([hidden])');
    for (const link of document.querySelectorAll('.pd-index a')) {
      const group = document.getElementById(link.hash.slice(1));
      link.hidden = Boolean(group?.hidden);
    }
    count.textContent = `${visible} product ${visible === 1 ? 'family' : 'families'}`;
    empty.hidden = visible > 0;
  }
  query.addEventListener('input', filterProducts);
  audience.addEventListener('change', filterProducts);
  filterProducts();
  productSearch.hidden = false;
}
