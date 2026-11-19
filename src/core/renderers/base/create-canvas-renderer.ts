import type { Renderer, RendererMetadata, RenderFrame } from '../types';
import type { CommonRenderOptions } from '../../../types/project';

export type DrawFunction = (frame: RenderFrame) => void;
export function createCanvasRenderer(metadata: RendererMetadata, draw: DrawFunction): Renderer {
  let canvas: HTMLCanvasElement | null = null;
  let options: CommonRenderOptions | null = null;
  return {
    metadata,
    init: (next) => {
      canvas = next;
    },
    render: draw,
    resize: (width, height) => {
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
    },
    updateOptions: (next) => {
      options = next;
      void options;
    },
    destroy: () => {
      canvas = null;
      options = null;
    },
  };
}
