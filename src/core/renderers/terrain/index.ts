import { createCanvasRenderer } from '../base/create-canvas-renderer';
import { waveform } from '../base/draw-primitives';
export default () =>
  createCanvasRenderer(
    { id: 'terrain', nameKey: 'styles.terrain', supportsSvg: false, dimension: '3d' },
    (f) => waveform(f, 18),
  );
