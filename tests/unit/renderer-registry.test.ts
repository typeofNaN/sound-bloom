import { describe, expect, it } from 'vitest';
import { rendererDefinitions, loadRenderer } from '../../src/core/renderers/registry';

describe('renderer registry', () => {
  it('registers twelve independently loadable renderers', async () => {
    expect(rendererDefinitions).toHaveLength(12);
    expect(new Set(rendererDefinitions.map((item) => item.id)).size).toBe(12);
    const renderer = await loadRenderer('lunar');
    expect(renderer.metadata.id).toBe('lunar');
    expect(renderer.render).toBeTypeOf('function');
    expect(renderer.destroy).toBeTypeOf('function');
  });

  it('marks only actual vector renderers as svg capable', () => {
    expect(rendererDefinitions.find((item) => item.id === 'lunar')?.supportsSvg).toBe(true);
    expect(rendererDefinitions.find((item) => item.id === 'terrain')?.supportsSvg).toBe(false);
  });
});
