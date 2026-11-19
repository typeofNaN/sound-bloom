import { createCanvasRenderer } from '../base/create-canvas-renderer';
import { particles } from '../base/draw-primitives';
export default () =>
  createCanvasRenderer({ id: 'galaxy', nameKey: 'styles.galaxy', supportsSvg: false, dimension: '2d' }, (f) =>
    particles(f, true),
  );
