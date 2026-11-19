import { useEffect, useRef } from 'react';
import type { AudioFeatures } from '../core/audio/types';
import type { StyleId } from '../core/renderers/visualizer';

import { artworkFonts, paintFrame, type ArtworkFont } from '../core/renderers/artworkFrame';
export type { ArtworkFont } from '../core/renderers/artworkFrame';
export function ArtCanvas({
  features,
  style,
  seed,
  colors,
  playing,
  density = 1,
  title,
  titleFont = 'serif',
  light = false,
}: {
  features: AudioFeatures;
  style: StyleId;
  seed: number;
  colors: string[];
  playing: boolean;
  density?: number;
  title?: string;
  titleFont?: ArtworkFont;
  light?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let raf = 0;
    let phase = 0;
    let lastFrame = -Infinity;
    let disposed = false;
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { family } = artworkFonts[titleFont];
    const fontStyle = titleFont === 'italic' ? 'italic 600' : '400';
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, playing ? 1.5 : 2);
      const w = Math.max(1, Math.floor(rect.width * dpr)),
        h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };
    const paint = () => {
      const { width: w, height: h } = canvas;
      paintFrame(ctx, w, h, phase, { features, style, seed, colors, density, title, titleFont, light });
    };
    const tick = (now: number) => {
      if (now - lastFrame >= 1000 / 30) {
        phase += 0.05;
        paint();
        lastFrame = now;
      }
      raf = requestAnimationFrame(tick);
    };
    const handleVisibility = () => {
      cancelAnimationFrame(raf);
      if (document.hidden) return;
      resize();
      paint();
      if (playing && !reducedMotion) raf = requestAnimationFrame(tick);
    };
    const observer =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => {
            resize();
            paint();
          });
    observer?.observe(canvas);
    document.addEventListener('visibilitychange', handleVisibility);
    handleVisibility();
    if (title && document.fonts) {
      const families = titleFont === 'serif' ? [family, 'Noto Serif SC'] : [family];
      // User-entered titles may contain glyphs outside the interface font subsets.
      void import('../styles/artwork-fonts.css')
        .then(() =>
          Promise.allSettled(
            families.map((name) => document.fonts.load(`${fontStyle} 24px "${name}"`, title)),
          ),
        )
        .then(() => {
          if (!disposed && !document.hidden) paint();
        })
        .catch(() => {
          /* The canvas already contains the fallback-font rendering. */
        });
    }
    return () => {
      disposed = true;
      observer?.disconnect();
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [features, style, seed, colors, playing, density, title, titleFont, light]);
  return <canvas ref={ref} className="art-canvas" aria-label="声音生成艺术画布" />;
}
