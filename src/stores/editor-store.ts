import { create } from 'zustand';
import type { CommonRenderOptions, ProjectDocument } from '../types/project';
import { createDefaultProject } from '../types/project';
import type { StyleId } from '../core/renderers/types';

interface EditorState {
  project: ProjectDocument;
  past: ProjectDocument[];
  future: ProjectDocument[];
  setRenderer(id: StyleId): void;
  updateCommon(patch: Partial<CommonRenderOptions>): void;
  updateProject(patch: Partial<ProjectDocument>): void;
  undo(): void;
  redo(): void;
  resetProject(): void;
}

const snapshot = (project: ProjectDocument) => structuredClone(project);
const commit = (state: EditorState, project: ProjectDocument) => ({
  project: { ...project, updatedAt: Date.now() },
  past: [...state.past, snapshot(state.project)].slice(-50),
  future: [],
});

export const useEditorStore = create<EditorState>((set) => ({
  project: createDefaultProject(),
  past: [],
  future: [],
  setRenderer: (rendererId) => set((state) => commit(state, { ...state.project, rendererId })),
  updateCommon: (patch) =>
    set((state) => commit(state, { ...state.project, common: { ...state.project.common, ...patch } })),
  updateProject: (patch) => set((state) => commit(state, { ...state.project, ...patch })),
  undo: () =>
    set((state) => {
      const previous = state.past.at(-1);
      return previous
        ? {
            project: previous,
            past: state.past.slice(0, -1),
            future: [snapshot(state.project), ...state.future].slice(0, 50),
          }
        : state;
    }),
  redo: () =>
    set((state) => {
      const next = state.future[0];
      return next
        ? {
            project: next,
            past: [...state.past, snapshot(state.project)].slice(-50),
            future: state.future.slice(1),
          }
        : state;
    }),
  resetProject: () => ({ project: createDefaultProject(), past: [], future: [] }),
}));
