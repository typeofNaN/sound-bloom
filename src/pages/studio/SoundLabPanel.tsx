import { useRef, useState } from 'react';
import { Plus, Play, Pause, Upload, Sparkles, X, AudioLines } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Slider } from '../../components/ui/slider';
import { formatTime } from '../../lib/formatTime';
import type { SoundLab } from '../../hooks/useSoundLab';
import type { AudioTrack } from '../../hooks/useAudioTrack';

export function SoundLabPanel({ lab, en, audio }: { lab: SoundLab; en: boolean; audio: AudioTrack }) {
  const input = useRef<HTMLInputElement>(null);
  const [adding, setAdding] = useState(false);
  const open = adding || Boolean(lab.secondary) || lab.pending;
  return (
    <section className="sound-composition" aria-label={en ? 'Second voice' : '第二段声音'}>
      {!open ? (
        <Button className="add-voice" onClick={() => setAdding(true)}>
          <Plus />
          {en ? 'Add a second voice' : '添加第二段声音'}
          <span>{en ? 'Create together' : '一起创作'}</span>
        </Button>
      ) : (
        <>
          <div className="voice-heading">
            <h3>{en ? 'Second voice' : '第二段声音'}</h3>
            <Button
              className="voice-icon"
              aria-label={en ? 'Remove second voice' : '移除第二段声音'}
              onClick={() => {
                lab.reset();
                setAdding(false);
              }}
            >
              <X />
            </Button>
          </div>
          {lab.secondary ? (
            <div className="voice-track">
              <div className="voice-track-title">
                <AudioLines />
                <span title={lab.secondary.name}>{lab.secondary.name}</span>
                <small>{formatTime(lab.secondary.features.duration)}</small>
              </div>
              <svg className="voice-wave" viewBox="0 0 256 36" preserveAspectRatio="none" aria-hidden="true">
                {Array.from(lab.secondary.features.envelope, (value, i) => (
                  <path
                    key={i}
                    d={`M${i * 2 + 1} ${18 - value * 16}v${Math.max(2, value * 32)}`}
                    stroke="currentColor"
                  />
                ))}
              </svg>
              <Button
                className="voice-preview"
                onClick={() => {
                  if (audio.playing) audio.togglePlayback();
                  void lab.toggleListening();
                }}
              >
                {lab.listening ? <Pause /> : <Play />}
                {lab.listening
                  ? en
                    ? 'Stop preview'
                    : '停止试听'
                  : en
                    ? 'Listen to this voice'
                    : '试听这段声音'}
              </Button>
            </div>
          ) : (
            <p className="voice-hint">
              {en
                ? 'A friend’s voice, a little rain, another melody. Let two sounds shape one artwork.'
                : '朋友的一句话、一场雨、另一段旋律。让两段声音共同塑造画面。'}
            </p>
          )}
          <div className="voice-imports">
            <Button variant="outline" onClick={() => input.current?.click()}>
              <Upload />
              {lab.secondary ? (en ? 'Replace' : '替换音频') : en ? 'Choose audio' : '选择音频'}
            </Button>
            <Button onClick={lab.example}>
              <Sparkles />
              {lab.secondary ? (en ? 'Next sample' : '换个示例') : en ? 'Try a sample' : '先试试示例'}
            </Button>
          </div>
          {lab.pending && (
            <div className="voice-feedback" role="status">
              {en ? 'Reading audio…' : '正在读取声音…'}
              <Button onClick={lab.reset}>{en ? 'Cancel' : '取消'}</Button>
            </div>
          )}
          {lab.error && (
            <p className="voice-error" role="alert">
              {lab.error}
            </p>
          )}
          {lab.secondary && (
            <div className="composition-settings">
              <h3>{en ? 'How they meet' : '让声音如何相遇'}</h3>
              <div
                className="composition-modes"
                role="group"
                aria-label={en ? 'Composition mode' : '融合方式'}
              >
                <Button
                  aria-pressed={lab.mode === 'blend'}
                  onClick={() => {
                    lab.setMode('blend');
                    lab.setComparing(false);
                  }}
                >
                  <b>{en ? 'Blend' : '交融'}</b>
                  <span>{en ? 'Share the shape' : '共同塑造轮廓'}</span>
                </Button>
                <Button
                  aria-pressed={lab.mode === 'graft'}
                  onClick={() => {
                    lab.setMode('graft');
                    lab.setComparing(false);
                  }}
                >
                  <b>{en ? 'Weave' : '织入'}</b>
                  <span>{en ? 'Add fine texture' : '为原声增添纹理'}</span>
                </Button>
              </div>
              <div className="composition-balance">
                <span>{en ? 'Original voice' : '原声'}</span>
                <output>
                  {Math.round(lab.ratio * 100)}% {en ? 'second voice' : '第二声'}
                </output>
              </div>
              <Slider
                aria-label={en ? 'Second voice influence' : '第二段声音参与度'}
                min={0}
                max={100}
                step={1}
                value={[Math.round(lab.ratio * 100)]}
                onValueChange={([value]) => {
                  lab.setRatio(value / 100);
                  lab.setComparing(false);
                }}
              />
              <p className="voice-hint">
                {en
                  ? 'Watch the canvas change as you adjust. Both voices stay on your device.'
                  : '拖动滑块，观察画面变化。两段声音都留在你的设备上。'}
              </p>
            </div>
          )}
        </>
      )}
      <input
        ref={input}
        type="file"
        accept="audio/*"
        hidden
        aria-label={en ? 'Second voice file' : '第二段声音文件'}
        onChange={(e) => {
          void lab.upload(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </section>
  );
}
