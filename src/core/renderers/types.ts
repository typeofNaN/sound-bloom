import type { AudioFeatures } from '../audio/types';
import type { CommonRenderOptions } from '../../types/project';

export const rendererIds = [
  'lunar',
  'galaxy',
  'bloom',
  'landscape',
  'fluid',
  'cityscape',
  'tree-ring',
  'mandala',
  'ink',
  'neon',
  'terrain',
  'planet',
] as const;
export type StyleId = (typeof rendererIds)[number];
export interface RenderFrame {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  features: AudioFeatures;
  options: CommonRenderOptions;
  phase: number;
}
export interface RendererMetadata {
  id: StyleId;
  nameKey: string;
  supportsSvg: boolean;
  dimension: '2d' | '3d';
}
export interface Renderer {
  metadata: RendererMetadata;
  init(canvas: HTMLCanvasElement): void;
  render(frame: RenderFrame): void;
  resize(width: number, height: number): void;
  updateOptions(options: CommonRenderOptions): void;
  destroy(): void;
  toSvg?(frame: Omit<RenderFrame, 'ctx'>): string;
}
