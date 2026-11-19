import type { Study } from '../acousticStudies';
import { paper, curve, turn, type Point } from './paper';

export function drawButterfly(study: Study) {
  const { path, energy, random, phase, count } = paper(study);
  const ribs = count(26),
    tilt = random() * 0.2;
  for (const side of [-1, 1]) {
    for (let i = 0; i < ribs; i++) {
      const t = i / (ribs - 1),
        loud = energy(t * 0.999);
      const angle = -1.25 + t * 2.45 + tilt;
      const length = (0.19 + 0.18 * Math.sin(t * turn) ** 2 + 0.06 * loud) * (0.96 + 0.04 * Math.cos(phase));
      const tip: Point = [side * Math.cos(angle) * length, Math.sin(angle) * length];
      path(
        curve(20, (s) => [
          side * 0.012 + tip[0] * Math.sin(s * Math.PI) + side * 0.016 * Math.sin(turn * s),
          tip[1] * Math.sin(s * Math.PI) + (s - 0.5) * 0.14,
        ]),
        i,
        false,
        0.002 + 0.002 * loud,
      );
    }
  }
  path(
    [
      [0, -0.09],
      [0, 0.11],
    ],
    0,
    false,
    0.009,
  );
}

export function drawRain(study: Study) {
  const { path, energy, random, count, phase } = paper(study);
  for (let i = 0; i < count(65); i++) {
    const x = (random() - 0.5) * 0.74,
      y = (random() - 0.5) * 0.64;
    const loud = energy(i / count(65)),
      r = 0.009 + 0.039 * loud;
    const drift = 0.008 * Math.sin(phase + i);
    path(
      [
        [x + drift, y - 0.035 - 0.07 * loud],
        [x, y],
      ],
      i,
      false,
      0.002,
    );
    path(
      curve(26, (t) => [x + r * Math.cos(t * turn), y + 0.012 + r * 0.32 * Math.sin(t * turn)]),
      i,
      false,
      0.0025,
      0.7,
    );
  }
}

export function drawCoral(study: Study) {
  const { path, energy, random, phase, count } = paper(study);
  const levels = Math.min(7, Math.max(4, count(5)));
  let index = 0;
  function branch(x: number, y: number, heading: number, length: number, depth: number) {
    const loud = energy((index++ * 0.618) % 1);
    const angle = heading + 0.05 * Math.sin(phase + depth);
    const endX = x + Math.cos(angle) * length,
      endY = y + Math.sin(angle) * length;
    path(
      [
        [x, y],
        [endX, endY],
      ],
      depth,
      false,
      0.003 + 0.014 * (1 - depth / levels),
    );
    if (depth === levels) return;
    const spread = 0.22 + 0.35 * loud;
    branch(endX, endY, angle - spread, length * (0.65 + 0.08 * random()), depth + 1);
    branch(endX, endY, angle + spread, length * (0.66 + 0.07 * random()), depth + 1);
  }
  branch(0, 0.35, -Math.PI / 2, 0.19, 0);
}

export function drawDunes(study: Study) {
  const { path, energy, random, phase, count } = paper(study);
  const bands = count(8),
    shift = random() * turn;
  for (let i = 0; i < bands; i++) {
    const ridge = curve(72, (t) => {
      const amplitude = energy((0.72 * t + (0.27 * i) / bands) % 1);
      return [
        (t - 0.5) * 0.82,
        -0.26 +
          (i / bands) * 0.55 +
          0.062 * Math.sin(t * turn + i * 0.46 + shift + phase * 0.12) -
          amplitude * 0.1,
      ];
    });
    path([...ridge, [0.41, 0.35], [-0.41, 0.35]], i, true, 0.002, 0.75);
    path(ridge, i + 1, false, 0.003);
  }
}

export function drawCrystals(study: Study) {
  const { path, energy, random, phase, count } = paper(study);
  const crystals = count(13);
  for (let i = 0; i < crystals; i++) {
    const t = i / (crystals - 1),
      loud = energy(t * 0.999);
    const x = (t - 0.5) * 0.61,
      y = 0.24 + 0.06 * random();
    const h = (0.13 + 0.32 * loud + 0.13 * random()) * (0.97 + 0.03 * Math.cos(phase + i));
    const tip: Point = [x + (t - 0.5) * 0.13, y - h],
      w = 0.02 + 0.02 * random();
    const ridge: Point = [tip[0] + w * 0.2, tip[1] + w * 1.8];
    path([[x - w, y], [tip[0] - w, tip[1] + w * 2], tip, ridge, [x, y + 0.015]], i, true);
    path([tip, [tip[0] + w, tip[1] + w * 2], [x + w, y], [x, y + 0.015], ridge], i + 1, true, 0.002, 0.77);
  }
}
