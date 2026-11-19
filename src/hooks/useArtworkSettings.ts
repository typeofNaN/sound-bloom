import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { palettes } from '../data/artStyles';
import type { StyleId } from '../core/renderers/visualizer';
import type { ArtworkFont } from '../core/renderers/artworkFrame';
import type { AudioFeatures } from '../core/audio/types';
export function useArtworkSettings(features: AudioFeatures, style: StyleId, en: boolean) {
  const [seed, setSeed] = useState(2026);
  const [density, setDensity] = useState(1);
  const [palette, setPalette] = useState(0);
  const regenerate = () => {
    const offset = 1 + Math.floor(Math.random() * 9998);
    setSeed((current) => 1 + ((current - 1 + offset) % 9999));
    setPalette((current) => (current + 1) % palettes.length);
  };
  const [title, setTitle] = useState('');
  const [titleFont, setTitleFont] = useState<ArtworkFont>('serif');
  const [sensitivity, setSensitivity] = useState(72);
  const artworkFeatures = useMemo(() => {
    const gain = sensitivity / 72;
    return {
      ...features,
      rms: features.rms * gain,
      envelope: features.envelope.map((value) => Math.min(1, value * gain)),
    };
  }, [features, sensitivity]);
  const saveProject = () => {
    try {
      localStorage.setItem(
        'soundbloom-project',
        JSON.stringify({ version: 1, title, titleFont, style, seed, density, palette, sensitivity }),
      );
      toast.success(en ? 'Artwork settings saved in this browser.' : '作品参数已保存在当前浏览器');
    } catch {
      toast.error(
        en
          ? 'Could not save settings. Check local storage permissions.'
          : '无法保存作品参数，请检查浏览器的本地存储权限。',
      );
    }
  };
  return {
    seed,
    setSeed,
    density,
    setDensity,
    palette,
    setPalette,
    title,
    setTitle,
    titleFont,
    setTitleFont,
    sensitivity,
    setSensitivity,
    artworkFeatures,
    regenerate,
    saveProject,
  };
}
export type ArtworkSettings = ReturnType<typeof useArtworkSettings>;
