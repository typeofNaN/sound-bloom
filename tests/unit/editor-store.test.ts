import { beforeEach, describe, expect, it } from 'vitest';
import { useEditorStore } from '../../src/stores/editor-store';

describe('editor store', () => {
  beforeEach(() => useEditorStore.getState().resetProject());

  it('starts with the complete default project and supports undo/redo', () => {
    expect(useEditorStore.getState().project.rendererId).toBe('bloom');
    useEditorStore.getState().updateCommon({ density: 1.4 });
    expect(useEditorStore.getState().project.common.density).toBe(1.4);
    useEditorStore.getState().undo();
    expect(useEditorStore.getState().project.common.density).toBe(1);
    useEditorStore.getState().redo();
    expect(useEditorStore.getState().project.common.density).toBe(1.4);
  });

  it('keeps history bounded to fifty edits', () => {
    for (let index = 0; index < 60; index += 1) useEditorStore.getState().updateCommon({ seed: index });
    expect(useEditorStore.getState().past).toHaveLength(50);
  });
});
