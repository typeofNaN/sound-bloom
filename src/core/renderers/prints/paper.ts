import type { Study } from '../acousticStudies';
import { createSeededRandom } from '../../algorithms/prng';
export type Point = [number, number];

// Coordinates are fractions of the shortest canvas edge; the origin is the centre.
export function paper({ ctx, unit, colors, energyAt, density, seed, phase }: Study) {
  ctx.scale(unit, unit);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  function path(points: Point[], color: number, filled = false, width = 0.0025, alpha = 0.85) {
    ctx.beginPath();
    ctx.moveTo(...points[0]);
    for (const point of points.slice(1)) ctx.lineTo(...point);
    ctx.globalAlpha = alpha;
    if (filled) {
      ctx.fillStyle = colors[color % colors.length];
      ctx.fill();
    } else {
      ctx.lineWidth = width;
      ctx.strokeStyle = colors[color % colors.length];
      ctx.stroke();
    }
  }
  return {
    path,
    energy: energyAt,
    random: createSeededRandom(seed),
    phase,
    count: (base: number) => Math.max(3, Math.round(base * density)),
  };
}
export function curve(steps: number, point: (fraction: number) => Point) {
  return Array.from({ length: steps + 1 }, (_, i) => point(i / steps));
}
export const turn = 2 * Math.PI;
