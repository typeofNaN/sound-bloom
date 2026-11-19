import { createCanvasRenderer } from '../base/create-canvas-renderer';
import { waveform } from '../base/draw-primitives';
export default () =>
  createCanvasRenderer({ id: 'neon', nameKey: 'styles.neon', supportsSvg: false, dimension: '2d' }, (f) =>
    waveform(f, 6),
  );
