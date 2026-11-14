// README Markdown -> sanitised HTML. Only imported with `import()` after a repo modal is opened,
// so marked + DOMPurify never touch the initial page load.
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'a', 'img', 'ul', 'ol', 'li', 'blockquote',
  'pre', 'code', 'em', 'strong', 'del', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'details', 'summary', 'sup', 'sub', 'kbd',
];
const ALLOWED_ATTR = ['href', 'src', 'alt', 'title', 'align', 'width', 'height', 'colspan', 'rowspan', 'start'];
const ALLOWED_URI = /^(?:https?:|mailto:|#)/i;

/** Relative links and images in a README point into the repo: they resolve to raw.githubusercontent.com. */
const readmeBase = (owner: string, repo: string) => `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/`;

// Base of the README being rendered (set right before each sanitising; rendering is synchronous).
let base = '';

DOMPurify.addHook('beforeSanitizeAttributes', (node) => {
  for (const attr of ['href', 'src']) {
    const value = node.getAttribute?.(attr);
    if (!value || value.startsWith('#')) continue;
    try {
      node.setAttribute(attr, new URL(value, base).href);
    } catch {
      node.removeAttribute(attr);
    }
  }
});

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.hasAttribute('href') && !node.getAttribute('href')!.startsWith('#')) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
  if (node.tagName === 'IMG') {
    node.setAttribute('loading', 'lazy');
    node.setAttribute('decoding', 'async');
  }
});

export function renderReadme(markdown: string, owner: string, repo: string): string {
  base = readmeBase(owner, repo);
  const html = marked.parse(markdown, { gfm: true, async: false });
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR, ALLOWED_URI_REGEXP: ALLOWED_URI });
}
