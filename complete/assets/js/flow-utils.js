export const money = amount => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

/** Accept explicit web destinations without credentials; insecure HTTP is local-only. */
export function webAddress(value, originOnly = false) {
  const url = new URL(value.trim());
  if (!/^[a-z0-9.-]+$/i.test(url.hostname) && !/^\[[0-9a-f:.]+\]$/i.test(url.hostname)) {
    throw new Error('Use a valid DNS hostname or IP address.');
  }
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && local)) {
    throw new Error('Use HTTPS, or HTTP on localhost for development.');
  }
  if (url.username || url.password) throw new Error('Use an address without embedded credentials.');
  if (originOnly && (url.pathname !== '/' || url.search || url.hash)) {
    throw new Error('Enter only the gateway origin, without a path, query, or fragment.');
  }
  return url;
}

export function summaryList(target, rows) {
  target.replaceChildren(...rows.map(([label, value]) => {
    const row = document.createElement('div');
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = label;
    dd.textContent = String(value);
    row.append(dt, dd);
    return row;
  }));
}

export function downloadText(filename, body) {
  const url = URL.createObjectURL(new Blob([body], { type: 'text/plain;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function selectedLabel(form, name) {
  return form.elements.namedItem(name).selectedOptions[0].textContent;
}
