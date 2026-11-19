import { Play, Pause } from 'lucide-react';
import { Slider } from '../../components/ui/slider';
import { Button } from '../../components/ui/button';
import { formatTime } from '../../lib/formatTime';
import type { AudioTrack } from '../../hooks/useAudioTrack';
export function Player({
  en,
  audio,
  onBeforePlay,
  secondaryActive,
}: {
  en: boolean;
  audio: AudioTrack;
  onBeforePlay?: () => void;
  secondaryActive?: boolean;
}) {
  const { playing, position, duration, features, togglePlayback, seek } = audio;
  return (
    <footer className="player">
      <Button
        className="play"
        onClick={() => {
          onBeforePlay?.();
          togglePlayback();
        }}
        aria-label={playing ? (en ? 'Pause' : '暂停') : en ? 'Play' : '播放'}
      >
        {playing ? <Pause /> : <Play />}
      </Button>
      {secondaryActive && <span className="player-source">{en ? 'Original audio' : '原声试听'}</span>}
      <span className="tabular-nums">{formatTime(position)}</span>
      <div className="relative flex h-10 min-w-0 flex-1 items-center">
        <svg
          aria-hidden="true"
          viewBox="0 0 256 32"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 size-full text-accent opacity-35"
        >
          {Array.from(features.envelope, (energy, index) => {
            const peak = 1 + Math.min(1, energy * 2) * 14;
            return (
              <path key={index} d={`M${index * 2 + 1} ${16 - peak}v${peak * 2}`} stroke="currentColor" />
            );
          })}
        </svg>
        <Slider
          aria-label={en ? 'Playback progress' : '播放进度'}
          min={0}
          max={duration || 1}
          step={0.01}
          value={[position]}
          className="relative min-h-8 w-full cursor-pointer"
          onValueChange={([next]) => seek(next)}
        />
      </div>
      <span className="tabular-nums">{formatTime(duration)}</span>
    </footer>
  );
}
