import { createCanvasRenderer } from '../base/create-canvas-renderer';
import { waveform } from '../base/draw-primitives';
export default () =>
  createCanvasRenderer(
    { id: 'cityscape', nameKey: 'styles.cityscape', supportsSvg: true, dimension: '2d' },
    (f) => waveform(f, 12, true),
  );
