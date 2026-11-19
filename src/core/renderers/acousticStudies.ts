import { createSeededRandom } from '../algorithms/prng';

export interface Study {
  ctx: CanvasRenderingContext2D;
  unit: number;
  colors: string[];
  energyAt: (fraction: number) => number;
  density: number;
  phase: number;
  seed: number;
}

// Each mirrored leaflet samples a different moment along the recording.
export function drawFern({ ctx, unit, colors, energyAt, density, phase, seed }: Study) {
  const random = createSeededRandom(seed);
  const pairs = Math.round(10 + 12 * density);
  const stemX = (t: number) => unit * (0.22 * (t - 0.5) + 0.06 * Math.sin(t * Math.PI + phase * 0.15));
  const stemY = (t: number) => unit * (0.4 - 0.79 * t);
  ctx.lineWidth = Math.max(0.7, unit * 0.003);
  ctx.strokeStyle = colors[0];
  ctx.beginPath();
  for (let i = 0; i <= pairs; i++) {
    const t = i / pairs;
    if (i === 0) ctx.moveTo(stemX(t), stemY(t));
    else ctx.lineTo(stemX(t), stemY(t));
  }
  ctx.stroke();
  for (let i = 1; i < pairs; i++) {
    const t = i / pairs,
      x = stemX(t),
      y = stemY(t);
    for (const side of [-1, 1]) {
      const energy = energyAt((i + (side + 1) * 0.25) / pairs);
      const length = unit * Math.sin(Math.PI * t) ** 0.75 * (0.11 + 0.16 * energy + 0.035 * random());
      const lift = length * (0.28 + 0.27 * t);
      ctx.fillStyle = colors[(i + (side + 1) / 2) % colors.length];
      ctx.globalAlpha = 0.56 + 0.38 * energy;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + side * length * 0.44, y - lift - unit * 0.025, x + side * length, y - lift);
      ctx.quadraticCurveTo(x + side * length * 0.52, y + unit * 0.028, x, y);
      ctx.fill();
    }
  }
}

export function drawNautilus({ ctx, unit, colors, energyAt, density, phase, seed }: Study) {
  const turns = 1.85,
    count = Math.round(35 + 32 * density);
  const angleOffset = createSeededRandom(seed)() * Math.PI * 2;
  const point = (t: number, inside: boolean) => {
    const energy = energyAt(t * 0.999);
    const angle = t * Math.PI * 2 * turns + angleOffset + phase * 0.035;
    const radius =
      unit * 0.41 * Math.exp((t - 1) * 2.7) * (inside ? 0.46 + 0.13 * energy : 0.84 + 0.15 * energy);
    return [Math.cos(angle) * radius, Math.sin(angle) * radius] as const;
  };
  for (let i = 0; i < count; i++) {
    const t = i / count,
      next = (i + 1) / count;
    const a = point(t, true),
      b = point(t, false),
      c = point(next, false),
      d = point(next, true);
    ctx.beginPath();
    ctx.moveTo(...a);
    ctx.quadraticCurveTo(b[0] * 0.96, b[1] * 0.96, ...c);
    ctx.lineTo(...d);
    ctx.quadraticCurveTo(a[0] * 1.08, a[1] * 1.08, ...a);
    ctx.fillStyle = colors[i % colors.length];
    ctx.globalAlpha = 0.32 + 0.52 * energyAt(t);
    ctx.fill();
    ctx.globalAlpha = 0.8;
    ctx.lineWidth = Math.max(0.45, unit * 0.0016);
    ctx.strokeStyle = colors[0];
    ctx.stroke();
  }
}

export function drawWindChimes({ ctx, unit, colors, energyAt, density, phase, seed }: Study) {
  const random = createSeededRandom(seed),
    count = Math.round(5 + 6 * density);
  const spacing = (0.75 * unit) / count;
  ctx.lineWidth = Math.max(0.65, unit * 0.0025);
  ctx.strokeStyle = colors[0];
  ctx.beginPath();
  ctx.moveTo(-0.39 * unit, -0.32 * unit);
  ctx.lineTo(0.39 * unit, -0.32 * unit);
  ctx.stroke();
  for (let i = 0; i < count; i++) {
    const energy = energyAt((i + 0.5) / count),
      x = (i - (count - 1) / 2) * spacing;
    const top = unit * (-0.22 + 0.16 * random());
    const end = top + unit * (0.16 + 0.27 * energy);
    const sway = spacing * 0.27 * Math.sin(phase + i * 0.85 + random()) * (0.25 + 0.75 * energy);
    const half = spacing * (0.12 + 0.14 * energy);
    ctx.strokeStyle = colors[i % colors.length];
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.moveTo(x, -0.32 * unit);
    ctx.lineTo(x + sway, top);
    ctx.stroke();
    ctx.fillStyle = ctx.strokeStyle;
    ctx.beginPath();
    ctx.moveTo(x + sway - half, top);
    ctx.lineTo(x + sway + half, top);
    ctx.lineTo(x + 2 * sway + half, end);
    ctx.lineTo(x + 2 * sway - half, end + half * 0.65);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 2 * sway, end + unit * 0.035, Math.max(0.5, half * 0.42), 0, Math.PI * 2);
    ctx.fill();
  }
}
