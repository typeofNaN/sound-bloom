import type { AudioFeatures } from './types';
export type CompositionMode = 'blend' | 'graft';

export function composeFeatures(
  a: AudioFeatures,
  b: AudioFeatures,
  ratio: number,
  mode: CompositionMode,
): AudioFeatures {
  const t = Number.isFinite(ratio) ? Math.max(0, Math.min(1, ratio)) : 0;
  if (t === 0) return a;
  if (t === 1 && mode === 'blend') return b;
  const mix = (x: number, y: number) => x * (1 - t) + y * t;
  const array = (x: Float32Array, y: Float32Array) =>
    Float32Array.from(x, (v, i) => {
      if (!y.length) return mix(v, 0);
      const p = x.length <= 1 ? 0 : (i * (y.length - 1)) / (x.length - 1);
      const lo = Math.floor(p);
      return mix(v, y[lo] + (y[Math.min(lo + 1, y.length - 1)] - y[lo]) * (p - lo));
    });
  const texture = array(new Float32Array(a.envelope.length), b.spectrum);
  return {
    ...a,
    // Modulate the contour by at most 20%; silence and the parent silhouette survive.
    envelope: a.envelope.map((value, i) => value * (1 - 0.2 * Math.max(0, Math.min(1, texture[i])))),
    ...(mode === 'blend'
      ? {
          waveform: array(a.waveform, b.waveform),
          envelope: array(a.envelope, b.envelope),
          rms: mix(a.rms, b.rms),
          peak: mix(a.peak, b.peak),
          energy: mix(a.energy, b.energy),
        }
      : {}),
    spectrum: array(a.spectrum, b.spectrum),
    low: mix(a.low, b.low),
    mid: mix(a.mid, b.mid),
    high: mix(a.high, b.high),
    fingerprint: `${a.fingerprint}:${b.fingerprint}:${mode}:${t}`,
  };
}
