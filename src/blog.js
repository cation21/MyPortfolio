// The Blog page: the latest Substack posts, saved from the feed at build time (see vite.config.js).
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const when = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export async function initBlog(root) {
  const list = root.querySelector('.posts');
  let data = { posts: [] };
  try {
    data = await (await fetch(`${import.meta.env.BASE_URL}blog.json`)).json();
  } catch { /* no feed saved: the subscribe link below the list still works */ }
  if (!data.posts?.length) {
    list.innerHTML = '<p class="posts__empty">♪ The first post is on its way. Subscribe to get it in your inbox.</p>';
    return;
  }
  list.innerHTML = data.posts
    .map(
      (p) => `
    <a class="post" href="${esc(p.link)}" target="_blank" rel="noopener">
      ${p.image ? `<img class="post__img" src="${esc(p.image)}" alt="" loading="lazy" decoding="async" />` : ''}
      <span class="post__date">${esc(when(p.date))}</span>
      <strong class="post__title">${esc(p.title)}</strong>
      ${p.summary ? `<span class="post__summary">${esc(p.summary)}</span>` : ''}
      <span class="post__more">Read on Substack ↗</span>
    </a>`
    )
    .join('');
}
