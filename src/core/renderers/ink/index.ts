import { createCanvasRenderer } from '../base/create-canvas-renderer';
import { particles } from '../base/draw-primitives';
export default () =>
  createCanvasRenderer({ id: 'ink', nameKey: 'styles.ink', supportsSvg: false, dimension: '2d' }, (f) =>
    particles(f, false),
  );
