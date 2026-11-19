import type { StyleId } from '../core/renderers/types';

export interface CommonRenderOptions {
  width: number;
  height: number;
  background: string;
  transparent: boolean;
  primary: string;
  secondary: string;
  accent: string;
  opacity: number;
  scale: number;
  rotation: number;
  density: number;
  sensitivity: number;
  smoothing: number;
  seed: number;
}

export interface ArtworkText {
  title: string;
  subtitle: string;
  author: string;
  date: string;
  color: string;
  size: number;
  align: 'left' | 'center' | 'right';
}

export interface ProjectDocument {
  version: 1;
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  rendererId: StyleId;
  common: CommonRenderOptions;
  rendererOptions: Record<string, number | string | boolean>;
  text: ArtworkText;
  trim: { start: number; end: number };
}

export const createDefaultProject = (): ProjectDocument => ({
  version: 1,
  id: crypto.randomUUID?.() ?? `${Date.now()}`,
  name: '未命名作品',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  rendererId: 'bloom',
  common: {
    width: 1080,
    height: 1080,
    background: '#191510',
    transparent: false,
    primary: '#d88b52',
    secondary: '#ba6247',
    accent: '#f1c587',
    opacity: 0.86,
    scale: 1,
    rotation: 0,
    density: 1,
    sensitivity: 0.72,
    smoothing: 0.65,
    seed: 2026,
  },
  rendererOptions: {},
  text: {
    title: '',
    subtitle: '',
    author: 'typeofNaN',
    date: '',
    color: '#ffffff',
    size: 32,
    align: 'center',
  },
  trim: { start: 0, end: 1 },
});
