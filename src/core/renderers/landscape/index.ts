import { createCanvasRenderer } from '../base/create-canvas-renderer';
import { waveform } from '../base/draw-primitives';
export default () =>
  createCanvasRenderer(
    { id: 'landscape', nameKey: 'styles.landscape', supportsSvg: true, dimension: '2d' },
    (f) => waveform(f, 7),
  );
