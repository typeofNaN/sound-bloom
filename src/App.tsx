import { useEffect, useRef, useState } from 'react';
import { HashRouter, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { ExportDialog } from './components/ExportDialog';
import { HomePage } from './pages/HomePage';
import { StudioPage } from './pages/studio/StudioPage';
import { useAudioTrack } from './hooks/useAudioTrack';
import { useArtworkSettings } from './hooks/useArtworkSettings';
import { palettes } from './data/artStyles';
import { styleIds, type StyleId } from './core/renderers/visualizer';
function styleFromSearch(search: string): StyleId | undefined {
  const value = new URLSearchParams(search).get('style');
  return styleIds.find((id) => id === value);
}

export default function App() {
  return (
    <HashRouter>
      <SoundBloom />
    </HashRouter>
  );
}

function SoundBloom() {
  const location = useLocation();
  const navigate = useNavigate();
  const linkedStyle = styleFromSearch(location.search);
  const base = import.meta.env.BASE_URL;
  const entryPath = window.location.pathname;
  const validEntry = entryPath === base || entryPath === base + 'index.html';
  const homeRoute = validEntry && location.pathname === '/';
  const legacyLink = homeRoute && Boolean(linkedStyle);
  const studioRoute =
    validEntry && (location.pathname === '/studio' || location.pathname === '/studio/' || legacyLink);
  const page = studioRoute ? 'studio' : homeRoute ? 'home' : 'not-found';
  useEffect(() => {
    if (legacyLink) void navigate(`/studio${location.search}`, { replace: true });
  }, [legacyLink, location.search, navigate]);
  useEffect(() => {
    if (page === 'home' && location.hash === '#styles') document.getElementById('styles')?.scrollIntoView?.();
  }, [page, location.hash, location.key]);
  const setPage = (next: 'home' | 'studio') => {
    void navigate(next === 'home' ? '/' : '/studio');
  };
  const [demoIndex, setDemoIndex] = useState(2);
  const [dark, setDark] = useState(() => localStorage.getItem('soundbloom-theme') !== 'light');
  const [en, setEn] = useState(() => localStorage.getItem('soundbloom-locale') === 'en-US');
  const style = linkedStyle ?? 'bloom';
  const setStyle = (next: StyleId) => {
    void navigate(`/studio?style=${next}`, { replace: page === 'studio' });
  };
  useEffect(() => {
    localStorage.setItem('soundbloom-theme', dark ? 'dark' : 'light');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#211d1c' : '#f4efe5');
  }, [dark]);
  useEffect(() => {
    localStorage.setItem('soundbloom-locale', en ? 'en-US' : 'zh-CN');
    document.documentElement.lang = en ? 'en-US' : 'zh-CN';
  }, [en]);
  const exportDialog = useRef<HTMLDialogElement>(null);
  const audio = useAudioTrack(en);
  const settings = useArtworkSettings(audio.features, style, en);
  const frame = {
    features: settings.artworkFeatures,
    style,
    seed: settings.seed,
    colors: palettes[settings.palette],
    density: settings.density,
    title: settings.title,
    titleFont: settings.titleFont,
    light: !dark,
  };
  return (
    <div className={`${dark ? 'app dark' : 'app light'} min-h-screen bg-surface text-foreground font-sans`}>
      <Toaster theme={dark ? 'dark' : 'light'} />
      <ExportDialog en={en} frame={frame} exportDialog={exportDialog} />
      {page === 'home' ? (
        <HomePage
          en={en}
          dark={dark}
          setDark={setDark}
          setEn={setEn}
          setPage={setPage}
          setStyle={setStyle}
          demoIndex={demoIndex}
          setDemoIndex={setDemoIndex}
          replaceTrack={audio.replaceTrack}
        />
      ) : page === 'studio' ? (
        <StudioPage
          en={en}
          dark={dark}
          style={style}
          setStyle={setStyle}
          onHome={() => setPage('home')}
          onExport={() => exportDialog.current?.showModal()}
          audio={audio}
          settings={settings}
        />
      ) : (
        <main className="mx-auto grid min-h-screen max-w-xl content-center gap-6 px-6">
          <h1 className="font-display text-4xl">{en ? '404 · Page not found' : '404 · 页面不存在'}</h1>
          <a className="w-fit underline underline-offset-4" href={base + '#/'}>
            {en ? 'Back to home' : '返回首页'}
          </a>
        </main>
      )}
    </div>
  );
}
