import type { AudioAnalysisInput, AudioFeatures } from './types';

const safe = (value: number) => (Number.isFinite(value) ? value : 0);

export function normalizeSamples(input: Float32Array): Float32Array {
  let peak = 0;
  for (const raw of input) peak = Math.max(peak, Math.abs(safe(raw)));
  if (peak === 0) return new Float32Array(input.length);
  return Float32Array.from(input, (raw) => safe(raw) / peak);
}

export function bucketSamples(input: Float32Array, count: number): Float32Array {
  const size = Math.max(1, Math.floor(count));
  const output = new Float32Array(size);
  if (!input.length) return output;
  for (let bucket = 0; bucket < size; bucket += 1) {
    const start = Math.floor((bucket * input.length) / size);
    const end = Math.max(start + 1, Math.floor(((bucket + 1) * input.length) / size));
    let sum = 0;
    let n = 0;
    for (let index = start; index < Math.min(end, input.length); index += 1) {
      sum += safe(input[index]);
      n += 1;
    }
    output[bucket] = n ? sum / n : 0;
  }
  return output;
}

function spectrumFromWaveform(waveform: Float32Array): Float32Array {
  const bins = Math.max(1, Math.floor(waveform.length / 2));
  const output = new Float32Array(bins);
  for (let k = 0; k < bins; k += 1) {
    let real = 0;
    let imaginary = 0;
    for (let n = 0; n < waveform.length; n += 1) {
      const angle = (2 * Math.PI * k * n) / waveform.length;
      real += waveform[n] * Math.cos(angle);
      imaginary -= waveform[n] * Math.sin(angle);
    }
    output[k] = Math.hypot(real, imaginary) / waveform.length;
  }
  return output;
}

export function analyzeAudio(input: AudioAnalysisInput): AudioFeatures {
  const clean = Float32Array.from(input.samples, safe);
  let squares = 0;
  let peak = 0;
  let hash = 2166136261;
  for (const sample of clean) {
    squares += sample * sample;
    peak = Math.max(peak, Math.abs(sample));
    hash ^= Math.round((sample + 1) * 32767);
    hash = Math.imul(hash, 16777619);
  }
  const waveform = bucketSamples(clean, input.bucketCount);
  const envelope = new Float32Array(waveform.length);
  for (let bucket = 0; bucket < envelope.length && clean.length; bucket++) {
    const start = Math.floor((bucket * clean.length) / envelope.length);
    const end = Math.max(start + 1, Math.floor(((bucket + 1) * clean.length) / envelope.length));
    let power = 0;
    for (let i = start; i < end; i++) power += clean[i] * clean[i];
    envelope[bucket] = Math.sqrt(power / (end - start));
  }
  const spectrum = spectrumFromWaveform(waveform);
  const third = Math.max(1, Math.floor(spectrum.length / 3));
  const average = (start: number, end: number) => {
    let sum = 0;
    for (let i = start; i < Math.min(end, spectrum.length); i += 1) sum += spectrum[i];
    return sum / Math.max(1, Math.min(end, spectrum.length) - start);
  };
  const rms = clean.length ? Math.sqrt(squares / clean.length) : 0;
  return {
    waveform,
    envelope,
    spectrum,
    rms,
    peak,
    energy: rms * rms,
    low: average(0, third),
    mid: average(third, third * 2),
    high: average(third * 2, spectrum.length),
    duration: clean.length / Math.max(1, input.sampleRate),
    sampleRate: input.sampleRate,
    channels: input.channels,
    fingerprint: (hash >>> 0).toString(16).padStart(8, '0'),
  };
}

export type { AudioAnalysisInput, AudioFeatures } from './types';
