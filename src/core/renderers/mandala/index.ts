import { createCanvasRenderer } from '../base/create-canvas-renderer';
import { radial } from '../base/draw-primitives';
export default () =>
  createCanvasRenderer(
    { id: 'mandala', nameKey: 'styles.mandala', supportsSvg: true, dimension: '2d' },
    (f) => radial(f, 12, 7),
  );
