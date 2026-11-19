import { createCanvasRenderer } from '../base/create-canvas-renderer';
import { radial } from '../base/draw-primitives';
export default () =>
  createCanvasRenderer(
    { id: 'tree-ring', nameKey: 'styles.treeRing', supportsSvg: true, dimension: '2d' },
    (f) => radial(f, 64, 12),
  );
