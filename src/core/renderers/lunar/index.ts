import { createCanvasRenderer } from '../base/create-canvas-renderer';
import { radial } from '../base/draw-primitives';
export default () =>
  createCanvasRenderer({ id: 'lunar', nameKey: 'styles.lunar', supportsSvg: true, dimension: '2d' }, (f) =>
    radial(f, 48, 3),
  );
