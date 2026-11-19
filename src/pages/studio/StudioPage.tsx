import { SoundLabPanel } from './SoundLabPanel';
import type { SoundLab } from '../../hooks/useSoundLab';
import { useRef, useState } from 'react';
import { Download, Mic, RotateCcw, Save, Sparkles, Upload, Waves } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { ArtCanvas } from '../../components/ArtCanvas';
import { palettes, styleName } from '../../data/artStyles';
import { gallerySamples } from '../../data/samples';
import { styleIds, type StyleId } from '../../core/renderers/visualizer';
import { formatTime } from '../../lib/formatTime';
import type { AudioTrack } from '../../hooks/useAudioTrack';
import type { ArtworkSettings } from '../../hooks/useArtworkSettings';
import { Inspector } from './Inspector';
import { Player } from './Player';
interface StudioProps {
  en: boolean;
  dark: boolean;
  style: StyleId;
  setStyle: (id: StyleId) => void;
  onHome: () => void;
  onExport: () => void;
  audio: AudioTrack;
  lab: SoundLab;
  settings: ArtworkSettings;
}
export function StudioPage({
  en,
  dark,
  style,
  setStyle,
  onHome,
  onExport,
  audio,
  lab,
  settings,
}: StudioProps) {
  const [mobilePanel, setMobilePanel] = useState<'sound' | 'styles' | 'settings'>('sound');
  const fileRef = useRef<HTMLInputElement>(null);
  const { duration, displaySourceLabel, playing, recording, toggleRecording, upload, switchSample } = audio;
  const { regenerate, saveProject, artworkFeatures, seed, palette, density, title, titleFont } = settings;
  return (
    <main
      className="studio page-enter bg-surface text-foreground"
      data-mobile-panel={mobilePanel}
      lang={en ? 'en-US' : 'zh-CN'}
    >
      <header className="studio-top">
        <Button
          className="brand compact"
          onClick={() => {
            lab.stopListening();
            if (audio.playing) audio.togglePlayback();
            onHome();
          }}
        >
          <span className="brandmark">
            <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="" width="34" height="34" />
          </span>
          SoundBloom
        </Button>
        <div className="project-name">
          <span />
          {title || (en ? 'Untitled work' : '未命名作品')}
        </div>
        <div className="top-actions">
          <Button
            onClick={regenerate}
            title={en ? 'Regenerate artwork' : '刷新作品'}
            aria-label={en ? 'Regenerate artwork' : '刷新作品'}
          >
            <RotateCcw />
          </Button>
          <Button onClick={saveProject}>
            <Save /> {en ? 'Save' : '保存'}
          </Button>
          <Button
            className="primary small"
            onClick={onExport}
            aria-label={en ? 'Export artwork' : '导出作品'}
          >
            <Download />
            <span className="hidden min-[410px]:inline">{en ? 'Export artwork' : '导出作品'}</span>
            <span aria-hidden="true" className="min-[410px]:hidden">
              {en ? 'Export' : '导出'}
            </span>
          </Button>
        </div>
      </header>
      <aside className="left-panel">
        <div className="sound-sources">
          <h3>{en ? 'Audio' : '声音素材'}</h3>
          <div className="source active">
            <Waves />
            <span className="min-w-0">
              <b className="truncate" title={displaySourceLabel}>
                {displaySourceLabel}
              </b>
              <small>{formatTime(duration)}</small>
            </span>
          </div>
          <div className="source-grid">
            <Button
              variant="outline"
              onClick={() => {
                lab.stopListening();
                void toggleRecording();
              }}
              className={recording ? 'recording' : ''}
            >
              <Mic />
              <span>
                {recording ? (en ? 'Stop recording' : '停止录音') : en ? 'Record audio' : '麦克风录音'}
              </span>
            </Button>
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              <Upload />
              <span>{en ? 'Upload audio' : '上传音频'}</span>
            </Button>
            <Button className="wide" onClick={switchSample}>
              <Sparkles />
              <span>{en ? 'Switch sample' : '切换示例音频'}</span>
            </Button>
          </div>
          <input
            ref={fileRef}
            hidden
            type="file"
            accept="audio/*"
            onChange={(e) => {
              void upload(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
          <SoundLabPanel lab={lab} en={en} audio={audio} />
        </div>
        <div className="style-library">
          <h3>
            {en ? 'Art styles' : '艺术风格'} <small>{styleIds.length}</small>
          </h3>
          <div className="styles-list">
            {styleIds.map((id) => (
              <Button
                key={id}
                className={style === id ? 'selected' : ''}
                onClick={() => setStyle(id)}
                aria-label={styleName(id, en)}
                aria-pressed={style === id}
              >
                <span
                  className={`${en ? 'size-7' : 'size-[38px]'} shrink-0 overflow-hidden rounded-md`}
                  aria-hidden="true"
                >
                  <ArtCanvas
                    light={!dark}
                    features={gallerySamples[2].features}
                    style={id}
                    seed={styleIds.indexOf(id) + 3}
                    colors={palettes[0]}
                    playing={false}
                  />
                </span>
                <span className="min-w-0">{styleName(id, en)}</span>
              </Button>
            ))}
          </div>
        </div>
      </aside>
      <section className="canvas-stage">
        <div className="stage-label">
          <span />
          {en ? 'Sound canvas' : '声音画布'} <b>{styleName(style, en)}</b>
        </div>
        <div className="canvas-frame">
          <ArtCanvas
            light={!dark}
            features={artworkFeatures}
            style={style}
            seed={seed}
            colors={palettes[palette]}
            playing={playing || lab.listening}
            density={density}
            title={title}
            titleFont={titleFont}
          />
        </div>
        {lab.secondary && (
          <div className="canvas-comparison" role="group" aria-label={en ? 'Compare artwork' : '对比作品'}>
            <Button aria-pressed={lab.comparing} onClick={() => lab.setComparing(true)}>
              {en ? 'Original' : '原声作品'}
            </Button>
            <Button aria-pressed={!lab.comparing} onClick={() => lab.setComparing(false)}>
              {en ? 'Together' : '双声作品'}
            </Button>
          </div>
        )}
        <div className="zoom">
          {lab.secondary
            ? lab.comparing
              ? en
                ? 'Viewing & exporting the original'
                : '正在查看与导出原声作品'
              : en
                ? 'Two voices, one artwork'
                : '两段声音，一幅作品'
            : en
              ? 'All audio stays on your device'
              : '声音仅在本机处理'}
        </div>
      </section>
      <div className="studio-inspector">
        <Inspector en={en} settings={settings} />
      </div>
      <nav className="studio-mobile-nav" aria-label={en ? 'Studio tools' : '创作工具'}>
        {(['sound', 'styles', 'settings'] as const).map((panel, i) => (
          <Button key={panel} aria-pressed={mobilePanel === panel} onClick={() => setMobilePanel(panel)}>
            {(en ? ['Audio', 'Styles', 'Settings'] : ['声音', '风格', '参数'])[i]}
          </Button>
        ))}
      </nav>
      <Player
        en={en}
        audio={audio}
        onBeforePlay={lab.stopListening}
        secondaryActive={Boolean(lab.secondary)}
      />
    </main>
  );
}
