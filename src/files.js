// Links marked [data-file] point at files you drop into public/ (your CV, say).
// If the file isn't there yet, the link stays visible but is switched off and says so
// (its data-missing text), rather than leading to a broken page.
export function hideMissingFiles(root = document) {
  const byUrl = new Map();
  root.querySelectorAll('a[data-file]').forEach((a) => {
    const url = a.getAttribute('href');
    if (!byUrl.has(url)) byUrl.set(url, []);
    byUrl.get(url).push(a);
  });
  const switchOff = (a) => {
    a.classList.add('is-missing');
    a.setAttribute('aria-disabled', 'true');
    a.removeAttribute('href');
    a.removeAttribute('download');
    const label = a.querySelector('[data-label]') || a;
    if (a.dataset.missing) label.textContent = a.dataset.missing;
  };
  byUrl.forEach((links, url) => {
    fetch(url, { method: 'HEAD' })
      .then((res) => {
        // a missing file can come back as the site's 404 page, so check it isn't HTML
        const isPage = (res.headers.get('content-type') || '').includes('text/html');
        if (!res.ok || isPage) links.forEach(switchOff);
      })
      .catch(() => links.forEach(switchOff));
  });
}
