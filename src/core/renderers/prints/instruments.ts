import type { Study } from '../acousticStudies';
import { paper, curve, turn, type Point } from './paper';

export function drawScore(study: Study) {
  const { path, energy, random, phase, count } = paper(study);
  for (let row = 0; row < 3; row++) {
    const y = (row - 1) * 0.24;
    for (let line = -2; line <= 2; line++)
      path(
        [
          [-0.4, y + line * 0.023],
          [0.4, y + line * 0.023],
        ],
        0,
        false,
        0.0016,
        0.55,
      );
    const notes = count(9);
    for (let i = 0; i < notes; i++) {
      const loud = energy((row + i / notes) / 3),
        x = -0.36 + (i / notes) * 0.75;
      const pitch = y + (0.5 - loud) * 0.105 + 0.01 * random() + 0.003 * Math.sin(phase + i);
      path(
        curve(18, (t) => [
          x + 0.016 * Math.cos(turn * t),
          pitch + 0.01 * Math.sin(turn * t) - 0.005 * Math.cos(turn * t),
        ]),
        i,
        true,
      );
      path(
        [
          [x + 0.014, pitch],
          [x + 0.014, pitch - 0.055 - 0.025 * loud],
        ],
        i,
      );
    }
  }
}

export function drawHourglass(study: Study) {
  const { path, energy, random, phase, count } = paper(study);
  for (const side of [-1, 1])
    path(
      curve(48, (t) => [side * (0.014 + 0.27 * Math.abs(2 * t - 1) ** 1.45), 0.72 * (t - 0.5)]),
      0,
      false,
      0.004,
    );
  for (const y of [-0.36, 0.36])
    path(
      [
        [-0.29, y],
        [0.29, y],
      ],
      1,
      false,
      0.008,
    );
  const grains = count(420);
  for (let i = 0; i < grains; i++) {
    const t = random(),
      loud = energy(i / grains),
      sign = i % 2 ? 1 : -1;
    const y = sign * (0.012 + 0.335 * t);
    const x = (random() - 0.5) * (0.018 + 0.52 * t ** 1.45) * (0.45 + 0.55 * loud);
    path(
      [
        [x, y],
        [x + 0.001, y + 0.002 * Math.sin(phase + i)],
      ],
      i,
      false,
      0.003 + 0.003 * loud,
    );
  }
}

export function drawLissajous(study: Study) {
  const { path, energy, random, phase, count } = paper(study);
  const offset = random() * turn,
    layers = count(10);
  for (let i = 0; i < layers; i++) {
    const delta = 0.013 * i;
    path(
      curve(240, (t) => {
        const e = energy(t * 0.999),
          a = t * turn;
        return [
          (0.3 + 0.08 * e) * Math.sin(3 * a + offset + delta + phase * 0.1),
          (0.26 + delta * 0.4) * Math.sin(2 * a + 0.29 * e),
        ];
      }),
      i,
      false,
      0.0018,
      0.65,
    );
  }
}

export function drawFan(study: Study) {
  const { path, energy, random, count, phase } = paper(study);
  const folds = count(25),
    tilt = (random() - 0.5) * 0.17;
  const hinge: Point = [0, 0.28];
  function edge(i: number): Point {
    const t = i / folds,
      a = -1.33 + 2.66 * t + tilt;
    const r = 0.43 + 0.12 * energy(t * 0.999) + 0.008 * Math.sin(phase + a);
    return [Math.sin(a) * r * 0.77, hinge[1] - Math.cos(a) * r];
  }
  for (let i = 0; i < folds; i++) path([hinge, edge(i), edge(i + 1)], i, true, 0.002, i % 2 ? 0.55 : 0.94);
}

export function drawPunchCard(study: Study) {
  const { path, energy, random, count, phase } = paper(study);
  const cols = count(22),
    rows = 9,
    margin = 0.38,
    dx = (margin * 2) / cols,
    dy = 0.054;
  path(
    [
      [-0.42, -0.31],
      [0.36, -0.31],
      [0.42, -0.25],
      [0.42, 0.31],
      [-0.42, 0.31],
      [-0.42, -0.31],
    ],
    0,
    false,
    0.004,
  );
  const bias = random() * 0.08;
  for (let col = 0; col < cols; col++) {
    const e = energy(col / cols),
      active = Math.min(rows - 1, Math.floor((e + bias) * rows));
    for (let row = 0; row < rows; row++) {
      const x = -margin + (col + 0.5) * dx,
        y = (4 - row) * dy;
      const w = dx * (row === active ? 0.39 : 0.12),
        h = 0.006 + 0.012 * e;
      path(
        [
          [x - w, y - h],
          [x + w, y - h],
          [x + w, y + h],
          [x - w, y + h],
        ],
        col,
        true,
        0.002,
        row === active ? 0.95 : 0.15 + 0.05 * Math.cos(phase),
      );
    }
  }
}

export function drawStringBridge(study: Study) {
  const { path, energy, random, count, phase } = paper(study);
  const strings = count(34),
    skew = (random() - 0.5) * 0.06;
  for (let i = 0; i < strings; i++) {
    const t = i / (strings - 1),
      loud = energy(t * 0.999);
    const left: Point = [-0.38 + t * 0.16, -0.31 + t * 0.62];
    const right: Point = [0.23 + 0.14 * t, 0.29 - 0.58 * t + skew];
    path(
      curve(32, (s) => [
        left[0] * (1 - s) + right[0] * s,
        left[1] * (1 - s) +
          right[1] * s +
          Math.sin(s * Math.PI) * Math.sin(s * turn + phase * 0.25 + t * turn) * (0.02 + 0.095 * loud),
      ]),
      i,
      false,
      0.002 + 0.0015 * loud,
    );
  }
}
