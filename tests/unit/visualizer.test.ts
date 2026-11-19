import { expect, it, vi } from 'vitest';
import { drawArtwork } from '../../src/core/renderers/visualizer';
import { buildVisualModel, styleIds } from '../../src/core/renderers/visualizer';
import { analyzeAudio } from '../../src/core/audio/analyzer';

it('paints theme colors into the actual canvas bitmap', () => {
  const addColorStop = vi.fn();
  const noop = () => {};
  const context = {
    createRadialGradient: () => ({ addColorStop }),
    clearRect: noop,
    fillRect: noop,
    save: noop,
    restore: noop,
    translate: noop,
    rotate: noop,
    beginPath: noop,
    lineTo: noop,
    moveTo: noop,
    closePath: noop,
    fill: noop,
    stroke: noop,
  } as unknown as CanvasRenderingContext2D;
  const features = analyzeAudio({
    samples: new Float32Array(32),
    sampleRate: 32,
    channels: 1,
    bucketCount: 32,
  });
  drawArtwork(context, 300, 300, 'bloom', features, 42, 0, ['#abcdef'], 1, 'light');
  expect(addColorStop).toHaveBeenCalledWith(1, '#e1d1bc');
  addColorStop.mockClear();
  drawArtwork(context, 300, 300, 'bloom', features, 42, 0, ['#abcdef'], 1, 'dark');
  expect(addColorStop).toHaveBeenCalledWith(1, '#221d1b');
});

it('offers twenty-two deterministic audio-reactive styles', () => {
  expect(styleIds).toHaveLength(22);
  const quiet = analyzeAudio({ samples: new Float32Array(64), sampleRate: 64, channels: 1, bucketCount: 32 });
  const loud = analyzeAudio({
    samples: Float32Array.from({ length: 64 }, (_, i) => Math.sin(i)),
    sampleRate: 64,
    channels: 1,
    bucketCount: 32,
  });
  const first = buildVisualModel('bloom', loud, 42, 18);
  expect(buildVisualModel('bloom', loud, 42, 18)).toEqual(first);
  expect(buildVisualModel('bloom', quiet, 42, 18)).not.toEqual(first);
});

it.each([
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
] as const)('%s changes its geometry with the audio', (style) => {
  const points: number[][] = [];
  const record = (...coordinates: number[]) => points.push(coordinates);
  const noop = () => {};
  const context = {
    createRadialGradient: () => ({ addColorStop: noop }),
    clearRect: noop,
    save: noop,
    restore: noop,
    translate: noop,
    rotate: noop,
    beginPath: noop,
    stroke: noop,
    fill: noop,
    fillRect: record,
    moveTo: record,
    lineTo: record,
    arc: record,
  } as unknown as CanvasRenderingContext2D;
  const render = (amplitude: number) => {
    points.length = 0;
    const features = analyzeAudio({
      samples: new Float32Array(64).fill(amplitude),
      sampleRate: 64,
      channels: 1,
      bucketCount: 32,
    });
    drawArtwork(context, 320, 240, style, features, 7, 0, ['#c27a42']);
    return points.slice();
  };
  const quiet = render(0);
  const loud = render(0.8);
  expect(loud).not.toEqual(quiet);
  expect(render(0.8)).toEqual(loud);
  expect(loud.flat().every(Number.isFinite)).toBe(true);
});
