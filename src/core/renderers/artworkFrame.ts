import type { AudioFeatures } from '../audio/types';
import { drawArtwork, type StyleId } from './visualizer';
export const artworkFonts = {
  serif: { family: 'Playfair Display', fallback: '"Noto Serif SC", Georgia, serif' },
  brush: { family: 'Ma Shan Zheng', fallback: '"Playfair Display", Georgia, serif' },
  ink: { family: 'Zhi Mang Xing', fallback: '"Ma Shan Zheng", "Noto Serif SC", cursive' },
  italic: { family: 'Cormorant Garamond', fallback: '"Playfair Display", "Noto Serif SC", Georgia, serif' },
  sans: { family: 'Noto Sans SC', fallback: 'system-ui, sans-serif' },
} as const;
export type ArtworkFont = keyof typeof artworkFonts;

export interface ArtworkFrame {
  features: AudioFeatures;
  style: StyleId;
  seed: number;
  colors: string[];
  density: number;
  title?: string;
  titleFont: ArtworkFont;
  light: boolean;
}
export function paintFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  phase: number,
  { features, style, seed, colors, density, title, titleFont, light }: ArtworkFrame,
) {
  const { family, fallback } = artworkFonts[titleFont];
  const fontStyle = titleFont === 'italic' ? 'italic 600' : '400';
  ctx.save();
  drawArtwork(ctx, w, h, style, features, seed, phase, colors, density, light ? 'light' : 'dark');
  if (title) {
    ctx.fillStyle = light ? '#45352d' : '#fff';
    ctx.globalAlpha = 0.86;
    ctx.textAlign = 'center';
    ctx.font = `${fontStyle} ${Math.max(18, w * 0.045)}px "${family}", ${fallback}`;
    ctx.fillText(title, w / 2, h * 0.86, w * 0.88);
  }
  ctx.restore();
}
