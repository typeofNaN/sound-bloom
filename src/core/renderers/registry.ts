import type { Renderer, StyleId } from './types';

export const rendererDefinitions = [
  { id: 'lunar', nameKey: 'styles.lunar', supportsSvg: true, dimension: '2d', load: () => import('./lunar') },
  {
    id: 'galaxy',
    nameKey: 'styles.galaxy',
    supportsSvg: false,
    dimension: '2d',
    load: () => import('./galaxy'),
  },
  { id: 'bloom', nameKey: 'styles.bloom', supportsSvg: true, dimension: '2d', load: () => import('./bloom') },
  {
    id: 'landscape',
    nameKey: 'styles.landscape',
    supportsSvg: true,
    dimension: '2d',
    load: () => import('./landscape'),
  },
  {
    id: 'fluid',
    nameKey: 'styles.fluid',
    supportsSvg: false,
    dimension: '2d',
    load: () => import('./fluid'),
  },
  {
    id: 'cityscape',
    nameKey: 'styles.cityscape',
    supportsSvg: true,
    dimension: '2d',
    load: () => import('./cityscape'),
  },
  {
    id: 'tree-ring',
    nameKey: 'styles.treeRing',
    supportsSvg: true,
    dimension: '2d',
    load: () => import('./tree-ring'),
  },
  {
    id: 'mandala',
    nameKey: 'styles.mandala',
    supportsSvg: true,
    dimension: '2d',
    load: () => import('./mandala'),
  },
  { id: 'ink', nameKey: 'styles.ink', supportsSvg: false, dimension: '2d', load: () => import('./ink') },
  { id: 'neon', nameKey: 'styles.neon', supportsSvg: false, dimension: '2d', load: () => import('./neon') },
  {
    id: 'terrain',
    nameKey: 'styles.terrain',
    supportsSvg: false,
    dimension: '3d',
    load: () => import('./terrain'),
  },
  {
    id: 'planet',
    nameKey: 'styles.planet',
    supportsSvg: false,
    dimension: '3d',
    load: () => import('./planet'),
  },
] as const;

export async function loadRenderer(id: StyleId): Promise<Renderer> {
  const definition = rendererDefinitions.find((item) => item.id === id);
  if (!definition) throw new Error(`Unknown renderer: ${id}`);
  return (await definition.load()).default();
}
