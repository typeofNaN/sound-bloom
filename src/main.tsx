import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import './locales/i18n';

// Migrate bookmarks from the previous history router when the host serves the app.
const base = import.meta.env.BASE_URL;
const { pathname, search, hash } = window.location;
if (
  !hash.startsWith('#/') &&
  (pathname.replace(/\/$/, '') === base + 'studio' ||
    (pathname === base && (new URLSearchParams(search).has('style') || hash === '#styles')))
) {
  const route = pathname === base && hash === '#styles' ? '/#styles' : '/studio' + search;
  window.history.replaceState(null, '', base + '#' + route);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
