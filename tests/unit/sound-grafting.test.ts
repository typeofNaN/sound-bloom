import { expect, it } from 'vitest';
import { composeFeatures } from '../../src/core/audio/composeFeatures';
import { gallerySamples } from '../../src/data/samples';
const a = {
  ...gallerySamples[0].features,
  envelope: new Float32Array([0, 1]),
  spectrum: new Float32Array([0.2, 0.4]),
  rms: 0.2,
};
const b = {
  ...gallerySamples[1].features,
  envelope: new Float32Array([1, 0.5, 0]),
  spectrum: new Float32Array([0.8, 1]),
  rms: 0.8,
};
it('preserves exact parents at fusion endpoints', () => {
  expect(composeFeatures(a, b, 0, 'blend')).toBe(a);
  expect(composeFeatures(a, b, 1, 'blend')).toBe(b);
});
it('aligns unequal envelopes and blends without changing parents', () => {
  const result = composeFeatures(a, b, 0.5, 'blend');
  expect([...result.envelope]).toEqual([0.5, 0.5]);
  expect(result.rms).toBeCloseTo(0.5);
  expect([...a.envelope]).toEqual([0, 1]);
});
it('inherits contour from A and spectral texture from B', () => {
  const result = composeFeatures(a, b, 1, 'graft');
  expect(result.envelope[0]).toBe(0);
  expect(result.envelope[1]).toBeCloseTo(0.8);
  expect(result.spectrum).toEqual(b.spectrum);
  expect(result.low).toBe(b.low);
});
it('handles invalid ratios and empty arrays without NaN', () => {
  expect(composeFeatures(a, b, NaN, 'blend')).toBe(a);
  const result = composeFeatures(a, { ...b, envelope: new Float32Array() }, 0.5, 'blend');
  expect([...result.envelope]).toEqual([0, 0.5]);
});
