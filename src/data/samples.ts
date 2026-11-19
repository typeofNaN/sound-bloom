import { analyzeAudio } from '../core/audio/analyzer';
export const makeSamples = (kind = 0) =>
  Float32Array.from({ length: 44100 * 8 }, (_, i) => {
    const time = i / 44100;
    const shape =
      kind === 0
        ? Math.exp(-9 * ((time * 2) % 1))
        : kind === 1
          ? Math.sin((Math.PI * time) / 8) ** 2
          : Math.sin((Math.PI * time) / 2) ** 4;
    return Math.sin(i * (0.035 + kind * 0.017)) * shape * 0.88;
  });

export const gallerySamples = ['节奏脉冲', '缓慢渐强', '起伏长音'].map((name, index) => {
  const samples = makeSamples(index);
  return {
    name,
    samples,
    features: analyzeAudio({ samples, sampleRate: 44100, channels: 1, bucketCount: 128 }),
  };
});
export const englishSamples = ['Rhythmic pulses', 'Slow crescendo', 'Sustained swells'];
