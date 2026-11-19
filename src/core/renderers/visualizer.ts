import type { AudioFeatures } from '../audio/types';
import { createSeededRandom } from '../algorithms/prng';

import { drawFern, drawNautilus, drawWindChimes } from './acousticStudies';

import { drawButterfly, drawRain, drawCoral, drawDunes, drawCrystals } from './prints/nature';
import {
  drawScore,
  drawHourglass,
  drawLissajous,
  drawFan,
  drawPunchCard,
  drawStringBridge,
} from './prints/instruments';
const studies = {
  fern: drawFern,
  nautilus: drawNautilus,
  'wind-chimes': drawWindChimes,
  butterfly: drawButterfly,
  rain: drawRain,
  coral: drawCoral,
  dunes: drawDunes,
  crystals: drawCrystals,
  score: drawScore,
  hourglass: drawHourglass,
  lissajous: drawLissajous,
  fan: drawFan,
  'punch-card': drawPunchCard,
  'string-bridge': drawStringBridge,
};
export const styleIds = [
  'lunar',
  'galaxy',
  'bloom',
  'landscape',
  'fluid',
  'cityscape',
  'tree-ring',
  'mandala',
  'ink',
  'neon',
  'terrain',
  'planet',
  'loom',
  'tide',
  'orbit',
  'halftone',
  'ribbons',
  'origami',
  'matrix',
  'pendulum',
  'mosaic',
  'corona',
  'fern',
  'nautilus',
  'wind-chimes',
  'butterfly',
  'rain',
  'coral',
  'dunes',
  'crystals',
  'score',
  'hourglass',
  'lissajous',
  'fan',
  'punch-card',
  'string-bridge',
] as const;
export type StyleId = (typeof styleIds)[number];
function isStudy(id: StyleId): id is keyof typeof studies {
  return Object.hasOwn(studies, id);
}
export interface VisualPoint {
  x: number;
  y: number;
  size: number;
  value: number;
}

export function buildVisualModel(
  style: StyleId,
  features: AudioFeatures,
  seed: number,
  count = 120,
): VisualPoint[] {
  const random = createSeededRandom(seed + styleIds.indexOf(style) * 997);
  const energy = Math.min(1, features.rms * 1.8);
  return Array.from({ length: count }, (_, index) => {
    const audio = Math.min(1, features.envelope[index % features.envelope.length] ?? 0);
    const angle = (index / count) * Math.PI * 2 + random() * 0.08;
    const radius = 0.18 + (index / count) * 0.3 + audio * 0.28 + energy * 0.08;
    return {
      x: 0.5 + Math.cos(angle) * radius,
      y: 0.5 + Math.sin(angle) * radius,
      size: 1 + (audio + energy) * 9 + random() * 2,
      value: audio,
    };
  });
}

export function drawArtwork(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  style: StyleId,
  features: AudioFeatures,
  seed: number,
  phase: number,
  colors: string[],
  density = 1,
  theme: 'light' | 'dark' = 'dark',
) {
  ctx.clearRect(0, 0, width, height);
  const gradient = ctx.createRadialGradient(
    width * 0.48,
    height * 0.44,
    0,
    width * 0.5,
    height * 0.5,
    width * 0.72,
  );
  const light = theme === 'light';
  gradient.addColorStop(0, light ? '#faf4e9' : '#433632');
  gradient.addColorStop(0.65, light ? '#efe3d2' : '#312824');
  gradient.addColorStop(1, light ? '#e1d1bc' : '#221d1b');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  const unit = Math.min(width, height);
  ctx.save();
  ctx.translate(width / 2, height / 2);
  const panoramic = ['landscape', 'terrain', 'cityscape', 'neon', 'fluid', 'ink'].includes(style);
  if (!isStudy(style) && !panoramic && style !== 'loom' && style !== 'tide') ctx.rotate(phase * 0.04);
  const wave = features.envelope;
  const energyAt = (fraction: number) =>
    Math.min(1, wave[Math.floor(fraction * wave.length) % wave.length] ?? 0);
  if (isStudy(style)) {
    studies[style]({ ctx, unit, colors, energyAt, density, phase, seed });
  } else if (style === 'pendulum' || style === 'mosaic' || style === 'corona') {
    const count = Math.max(12, Math.round(48 * density));
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const energy = energyAt(t);
      const angle = t * Math.PI * 2;
      ctx.fillStyle = ctx.strokeStyle = colors[i % colors.length];
      ctx.globalAlpha = 0.43 + energy * 0.52;
      if (style === 'mosaic') {
        const cell = (unit * 0.76) / Math.max(8, Math.ceil(count / 8));
        const x = ((i % 8) - 3.5) * cell;
        const y = (Math.floor(i / 8) - (Math.ceil(count / 8) - 1) / 2) * cell;
        const side = cell * (0.12 + energy * 0.33);
        ctx.beginPath();
        ctx.moveTo(x, y - side);
        ctx.lineTo(x + side, y);
        ctx.lineTo(x, y + side);
        ctx.lineTo(x - side, y);
        ctx.fill();
      } else {
        const inner = unit * 0.24;
        const outer = unit * (0.27 + energy * 0.16);
        const x = (t - 0.5) * unit * 0.8;
        ctx.beginPath();
        if (style === 'corona') {
          ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
          ctx.lineTo(Math.cos(angle + energy * 0.11) * outer, Math.sin(angle + energy * 0.11) * outer);
        } else {
          ctx.moveTo(x, -unit * 0.28);
          ctx.lineTo(x + Math.sin(angle + phase) * energy * unit * 0.062, unit * (0.02 + energy * 0.3));
        }
        ctx.lineWidth = Math.max(1, unit * 0.0035);
        ctx.stroke();
      }
    }
  } else if (style === 'halftone' || style === 'matrix') {
    const columns = Math.max(6, Math.round(18 * density));
    const rows = 10;
    const cell = Math.min((width * 0.8) / columns, (height * 0.76) / rows);
    for (let column = 0; column < columns; column++) {
      for (let row = 0; row < rows; row++) {
        const t = style === 'matrix' ? column / columns : (column * rows + row) / (columns * rows);
        const energy = energyAt(t);
        const x = (column - (columns - 1) / 2) * cell;
        const y = (row - (rows - 1) / 2) * cell;
        ctx.fillStyle = colors[(column + row) % colors.length];
        if (style === 'halftone') {
          ctx.globalAlpha = 0.35 + energy * 0.6;
          ctx.beginPath();
          ctx.arc(x, y, cell * (0.05 + energy * 0.39), 0, Math.PI * 2);
          ctx.fill();
        } else {
          const level = Math.max(0, Math.min(1, energy * rows - (rows - 1 - row)));
          ctx.globalAlpha = 0.15 + level * 0.8;
          const size = cell * (0.38 + level * 0.48);
          ctx.fillRect(x - size / 2, y - size / 2, size, size);
        }
      }
    }
  } else if (style === 'ribbons') {
    const bands = Math.max(3, Math.round(9 * density));
    for (let band = 0; band < bands; band++) {
      ctx.beginPath();
      for (let step = 0; step <= 96; step++) {
        const t = step / 96;
        const angle = Math.PI * (0.12 + t * 0.76);
        const lift = energyAt((t * 0.98 + (band / bands) * 0.12) % 1);
        const radius = unit * (0.08 + (band / bands) * 0.23 + lift * 0.075);
        const x = Math.cos(angle) * radius;
        const y = unit * 0.16 - Math.sin(angle) * radius;
        if (step === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = colors[band % colors.length];
      ctx.globalAlpha = 0.63;
      ctx.lineWidth = Math.max(1, unit * 0.009);
      ctx.stroke();
    }
  } else if (style === 'origami') {
    const folds = Math.max(5, Math.round(14 * density));
    const span = (width * 0.84) / folds;
    for (let fold = 0; fold < folds; fold++) {
      const energy = energyAt(fold / folds);
      const x = -width * 0.42 + fold * span;
      const peak = height * (0.06 + energy * 0.31);
      ctx.beginPath();
      ctx.moveTo(x, height * 0.09);
      ctx.lineTo(x + span * 0.48, (fold % 2 ? 1 : -1) * peak);
      ctx.lineTo(x + span, height * 0.09);
      ctx.fillStyle = colors[fold % colors.length];
      ctx.globalAlpha = 0.42 + energy * 0.52;
      ctx.fill();
    }
  } else if (style === 'loom') {
    const columns = Math.max(8, Math.round(26 * density));
    const cell = Math.min((width * 0.86) / columns, height * 0.1);
    for (let column = 0; column < columns; column++) {
      const energy = energyAt(column / columns);
      const x = (column - (columns - 1) / 2) * cell;
      for (let row = -4; row <= 4; row++) {
        const y = row * cell;
        const long = cell * (0.18 + energy * 0.27);
        const short = cell * 0.13;
        const vertical = (row + column + 8) % 2 === 0;
        ctx.fillStyle = colors[(row + column + 8) % colors.length];
        ctx.globalAlpha = 0.22 + energy * 0.76;
        const halfWidth = vertical ? short : long;
        const halfHeight = vertical ? long : short;
        ctx.fillRect(x - halfWidth, y - halfHeight, halfWidth * 2, halfHeight * 2);
      }
    }
  } else if (style === 'tide') {
    const bands = Math.max(4, Math.round(12 * density));
    for (let band = 0; band < bands; band++) {
      const baseline = (band / (bands - 1) - 0.5) * height * 0.57;
      ctx.beginPath();
      for (let step = 0; step <= 120; step++) {
        const t = step / 120;
        const audio = energyAt((t * 0.999 + band * 0.021) % 1);
        const y = baseline + Math.sin(t * Math.PI * 2 + band * 0.32 + phase) * audio * height * 0.13;
        if (step === 0) ctx.moveTo((t - 0.5) * width * 0.88, y);
        else ctx.lineTo((t - 0.5) * width * 0.88, y);
      }
      ctx.strokeStyle = colors[band % colors.length];
      ctx.lineWidth = Math.max(1, unit * 0.0024);
      ctx.globalAlpha = 0.75;
      ctx.stroke();
    }
  } else if (style === 'orbit') {
    const marks = Math.max(12, Math.round(90 * density));
    for (let i = 0; i < marks; i++) {
      const energy = energyAt(i / marks);
      const arm = i % 3;
      const angle = (i / marks) * Math.PI * 4 + (arm * Math.PI * 2) / 3;
      const radius = unit * (0.06 + (i / marks) * 0.28 + energy * 0.05);
      const size = unit * (0.002 + energy * 0.013);
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * radius, Math.sin(angle) * radius, size, 0, Math.PI * 2);
      ctx.fillStyle = colors[arm % colors.length];
      ctx.globalAlpha = 0.38 + energy * 0.6;
      ctx.fill();
    }
  } else if (style === 'landscape' || style === 'terrain' || style === 'cityscape') {
    for (let layer = 0; layer < 5; layer++) {
      ctx.beginPath();
      ctx.moveTo(-width * 0.46, height * 0.3);
      for (let i = 0; i < wave.length; i++) {
        const x = -width * 0.46 + (i / Math.max(1, wave.length - 1)) * width * 0.92;
        const y = height * 0.22 - layer * height * 0.09 - Math.min(1, wave[i]) * unit * (0.12 + layer * 0.02);
        if (style === 'cityscape') ctx.lineTo(x, y);
        else ctx.lineTo(x, y + Math.sin(i * 0.7 + layer) * 8);
      }
      ctx.lineTo(width * 0.46, height * 0.46);
      ctx.lineTo(-width * 0.46, height * 0.46);
      const g = ctx.createLinearGradient(0, -height / 2, 0, height / 2);
      g.addColorStop(0, colors[layer % colors.length] + 'dd');
      g.addColorStop(1, light ? '#e9dfd3' : '#302822');
      ctx.fillStyle = g;
      ctx.fill();
    }
  } else if (style === 'bloom') {
    const random = createSeededRandom(seed);
    const twist = (random() - 0.5) * 0.5;
    const layers = Math.round(24 * density);
    for (let layer = 0; layer < layers; layer++) {
      const depth = layer / layers;
      ctx.beginPath();
      for (let step = 0; step <= 192; step++) {
        const progress = step / 192;
        const angle = progress * Math.PI * 2;
        const sample = (progress % 1) * wave.length;
        const index = Math.floor(sample);
        const first = wave[index] ?? 0;
        const second = wave[(index + 1) % wave.length] ?? 0;
        const amplitude = Math.tanh(first + (second - first) * (sample - index));
        const contour = 0.47 + 0.17 * Math.cos(7 * angle - depth * 4 + twist + phase * 0.2);
        const radius = unit * (0.09 + depth * 0.29) * (contour + amplitude * 0.68);
        const direction = angle + depth * twist;
        const x = Math.cos(direction) * radius;
        const y = Math.sin(direction) * radius;
        if (step) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      }
      ctx.closePath();
      ctx.globalAlpha = 0.24 + depth * 0.57;
      ctx.globalCompositeOperation = light ? 'multiply' : 'screen';
      ctx.strokeStyle = colors[Math.floor(depth * colors.length)];
      ctx.lineWidth = Math.max(0.8, unit * 0.0017);
      ctx.stroke();
    }
  } else if (style === 'mandala' || style === 'lunar' || style === 'tree-ring') {
    const layers = style === 'tree-ring' ? 12 : 3;
    for (let layer = layers; layer > 0; layer--) {
      const petals = style === 'mandala' ? 12 : Math.max(24, Math.floor(wave.length / 2));
      const radius = unit * (0.06 + (layer / layers) * 0.16);
      const steps = petals * 2;
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        const amp = Math.abs(wave[i % wave.length] || 0);
        const petal = Math.pow(Math.abs(Math.sin((a * petals) / 2)), 1.7);
        const r = radius + petal * unit * 0.035 + Math.min(1, amp) * unit * 0.19;
        const x = Math.cos(a) * r,
          y = Math.sin(a) * r;
        if (i) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      }
      ctx.closePath();
      ctx.globalAlpha = 0.25 + (layer / layers) * 0.35;
      ctx.strokeStyle = colors[layer % colors.length];
      ctx.fillStyle = colors[layer % colors.length] + '24';
      ctx.lineWidth = 1 + layer * 0.35;
      ctx.fill();
      ctx.stroke();
    }
  } else if (style === 'neon' || style === 'fluid' || style === 'ink') {
    ctx.globalCompositeOperation = light ? 'multiply' : 'lighter';
    for (let line = 0; line < 6; line++) {
      ctx.beginPath();
      for (let i = 0; i < wave.length; i++) {
        const x = -width * 0.42 + (i / Math.max(1, wave.length - 1)) * width * 0.84;
        const y =
          Math.min(1, wave[i]) * unit * (0.12 + line * 0.012) +
          Math.sin(i * 0.13 + phase + line) * unit * 0.025 +
          (line - 3) * unit * 0.015;
        if (i) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      }
      ctx.strokeStyle = colors[line % colors.length];
      ctx.shadowColor = colors[line % colors.length];
      ctx.shadowBlur = style === 'ink' ? 3 : 18;
      ctx.lineWidth = style === 'fluid' ? 3 : 1.6;
      ctx.globalAlpha = 0.35 + line * 0.08;
      ctx.stroke();
    }
  } else {
    const model = buildVisualModel(style, features, seed, Math.max(36, Math.floor(110 * density)));
    ctx.globalCompositeOperation = light ? 'multiply' : 'lighter';
    for (const [i, p] of model.entries()) {
      const x = (p.x - 0.5) * unit * 0.48,
        y = (p.y - 0.5) * unit * 0.48;
      ctx.beginPath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.globalAlpha = 0.25 + p.value * 0.65;
      ctx.arc(x, y, p.size * unit * (style === 'planet' ? 0.0009 : 0.0013), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  ctx.shadowBlur = 0;
}
