import { createCanvasRenderer } from '../base/create-canvas-renderer';
import { particles } from '../base/draw-primitives';
export default () =>
  createCanvasRenderer({ id: 'planet', nameKey: 'styles.planet', supportsSvg: false, dimension: '3d' }, (f) =>
    particles(f, true),
  );
