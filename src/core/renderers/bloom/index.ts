import { createCanvasRenderer } from '../base/create-canvas-renderer';
import { radial } from '../base/draw-primitives';
export default () =>
  createCanvasRenderer({ id: 'bloom', nameKey: 'styles.bloom', supportsSvg: true, dimension: '2d' }, (f) =>
    radial(f, 8, 5),
  );
