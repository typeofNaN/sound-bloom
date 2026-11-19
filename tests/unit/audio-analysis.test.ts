import { describe, expect, it } from 'vitest';
import { analyzeAudio, bucketSamples, normalizeSamples } from '../../src/core/audio/analyzer';

describe('audio analysis', () => {
  it('retains the loud sections of balanced oscillations in time order', () => {
    const samples = Float32Array.from({ length: 128 }, (_, i) => (i % 2 ? 1 : -1) * (i < 64 ? 0.25 : 1));
    const result = analyzeAudio({ samples, sampleRate: 128, channels: 1, bucketCount: 4 });
    expect([...result.envelope]).toEqual([0.25, 0.25, 1, 1]);
    expect([...result.waveform]).toEqual([0, 0, 0, 0]);
  });
  it('calculates finite hand-derived features', () => {
    const result = analyzeAudio({
      samples: new Float32Array([0, 1, -1, 0]),
      sampleRate: 4,
      channels: 1,
      bucketCount: 4,
    });
    expect(result.rms).toBeCloseTo(Math.sqrt(0.5), 5);
    expect(result.peak).toBe(1);
    expect(result.duration).toBe(1);
    expect([...result.waveform]).toEqual([0, 1, -1, 0]);
  });

  it('returns safe zeroes for empty, silent, and non-finite input', () => {
    for (const samples of [
      new Float32Array(),
      new Float32Array(8),
      new Float32Array([NaN, Infinity, -Infinity]),
    ]) {
      const result = analyzeAudio({ samples, sampleRate: 44100, channels: 1, bucketCount: 32 });
      expect(result.rms).toBe(0);
      expect(result.peak).toBe(0);
      expect([...result.waveform].every(Number.isFinite)).toBe(true);
    }
  });

  it('normalizes and buckets without exceeding bounds', () => {
    expect([...normalizeSamples(new Float32Array([0, 2, -1]))]).toEqual([0, 1, -0.5]);
    expect([...bucketSamples(new Float32Array([1, 3, 5, 7]), 2)]).toEqual([2, 6]);
  });
});
