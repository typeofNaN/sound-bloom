import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import { paintFrame, type ArtworkFrame } from '../renderers/artworkFrame';

export async function animatedGif(art: ArtworkFrame, progress: (percent: number) => void) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 480;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas unavailable');
  const encoder = GIFEncoder();
  const frames = 40;
  let palette: number[][] = [];
  for (let index = 0; index < frames; index++) {
    const angle = (index * Math.PI * 2) / frames;
    // Move through the sound envelope and back to the starting frame for a seamless loop.
    const travel = (1 - Math.cos(angle)) / 2;
    const wave = art.features.envelope;
    const shift = Math.round((travel * wave.length) / 4);
    const features = { ...art.features, envelope: wave.map((_, i) => wave[(i + shift) % wave.length]) };
    paintFrame(ctx, canvas.width, canvas.height, travel * 5, { ...art, features });
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    if (!index) palette = quantize(data, 256);
    encoder.writeFrame(applyPalette(data, palette), canvas.width, canvas.height, {
      palette: index ? undefined : palette,
      delay: 100,
      repeat: 0,
    });
    progress(Math.round(((index + 1) / frames) * 100));
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
  encoder.finish();
  return new Blob([encoder.bytes()], { type: 'image/gif' });
}
