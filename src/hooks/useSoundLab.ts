import { useEffect, useMemo, useRef, useState } from 'react';
import { analyzeAudio } from '../core/audio/analyzer';
import { composeFeatures, type CompositionMode } from '../core/audio/composeFeatures';
import type { AudioFeatures } from '../core/audio/types';
import { gallerySamples, englishSamples } from '../data/samples';

export function useSoundLab(primary: AudioFeatures, en: boolean) {
  const [secondary, setSecondary] = useState<{
    features: AudioFeatures;
    name: string;
    samples: Float32Array;
    sampleRate: number;
  } | null>(null);
  const [comparing, setComparing] = useState(false);
  const [listening, setListening] = useState(false);
  const playback = useRef<{ context: AudioContext; source: AudioBufferSourceNode } | null>(null);
  const stopListening = () => {
    const current = playback.current;
    playback.current = null;
    if (current) {
      current.source.onended = null;
      current.source.stop();
      void current.context.close().catch(() => {});
    }
    setListening(false);
  };
  const [mode, setMode] = useState<CompositionMode>('blend');
  const [ratio, setRatio] = useState(0.5);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const request = useRef(0);
  useEffect(
    () => () => {
      request.current++;
      const current = playback.current;
      if (current) {
        current.source.onended = null;
        current.source.stop();
        void current.context.close().catch(() => {});
      }
    },
    [],
  );
  const reset = () => {
    stopListening();
    setComparing(false);
    request.current++;
    setPending(false);
    setError('');
    setSecondary(null);
  };
  const exampleIndex = useRef(1);
  const example = () => {
    stopListening();
    setComparing(false);
    exampleIndex.current = (exampleIndex.current + 1) % gallerySamples.length;
    const sample = gallerySamples[exampleIndex.current];
    request.current++;
    setPending(false);
    setError('');
    setSecondary({
      features: sample.features,
      name: en ? englishSamples[exampleIndex.current] : sample.name,
      samples: sample.samples,
      sampleRate: 44100,
    });
  };
  const upload = async (file?: File) => {
    if (!file) return;
    const id = ++request.current;
    setError('');
    setPending(true);
    let context: AudioContext | undefined;
    try {
      if (file.size > 50 * 1024 * 1024)
        throw new Error(en ? 'Maximum file size: 50 MB.' : '文件不能超过 50MB。');
      context = new AudioContext();
      const buffer = await context.decodeAudioData(await file.arrayBuffer());
      if (buffer.duration > 600 || buffer.length === 0)
        throw new Error(en ? 'Choose audio between 0 and 10 minutes.' : '请选择 10 分钟以内的非空音频。');
      if (id !== request.current) return;
      stopListening();
      setComparing(false);
      setSecondary({
        samples: buffer.getChannelData(0),
        sampleRate: buffer.sampleRate,
        name: file.name,
        features: analyzeAudio({
          samples: buffer.getChannelData(0),
          sampleRate: buffer.sampleRate,
          channels: 1,
          bucketCount: 128,
        }),
      });
    } catch (err) {
      if (id === request.current)
        setError(
          err instanceof Error && !context
            ? err.message
            : en
              ? 'Could not read audio. Use a valid MP3, WAV or OGG under 10 minutes.'
              : '无法读取音频，请使用 10 分钟以内的有效 MP3、WAV 或 OGG。',
        );
    } finally {
      if (context) void context.close().catch(() => {});
      if (id === request.current) setPending(false);
    }
  };
  const toggleListening = async () => {
    if (listening) {
      stopListening();
      return;
    }
    if (!secondary) return;
    try {
      const context = new AudioContext();
      const source = context.createBufferSource();
      const buffer = context.createBuffer(1, secondary.samples.length, secondary.sampleRate);
      buffer.getChannelData(0).set(secondary.samples);
      source.buffer = buffer;
      source.connect(context.destination);
      playback.current = { context, source };
      source.onended = () => {
        if (playback.current?.source === source) {
          playback.current = null;
          setListening(false);
        }
        void context.close().catch(() => {});
      };
      source.start();
      setListening(true);
      await context.resume();
    } catch {
      stopListening();
      setError(en ? 'Playback unavailable. Please try again.' : '暂时无法试听，请重试。');
    }
  };
  const features = useMemo(
    () => (secondary && !comparing ? composeFeatures(primary, secondary.features, ratio, mode) : primary),
    [primary, secondary, ratio, mode, comparing],
  );
  return {
    comparing,
    setComparing,
    listening,
    toggleListening,
    stopListening,
    secondary,
    mode,
    setMode,
    ratio,
    setRatio,
    pending,
    error,
    reset,
    example,
    upload,
    features,
  };
}
export type SoundLab = ReturnType<typeof useSoundLab>;
