import { useState, useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { analyzeAudio } from '../core/audio/analyzer';
import { gallerySamples, englishSamples, makeSamples } from '../data/samples';
export function useAudioTrack(en: boolean) {
  const [samples, setSamples] = useState<Float32Array>(() => makeSamples(1));
  const [sampleRate, setSampleRate] = useState(44100);
  const [position, setPosition] = useState(0);
  const [sourceLabel, setSourceLabel] = useState('内置示例');
  const sampleNameIndex = gallerySamples.findIndex((sample) => sample.name === sourceLabel);
  const displaySourceLabel = !en
    ? sourceLabel
    : sampleNameIndex >= 0
      ? englishSamples[sampleNameIndex]
      : sourceLabel === '内置示例'
        ? 'Built-in sample'
        : sourceLabel === '麦克风录音'
          ? 'Microphone recording'
          : sourceLabel;
  const playbackStart = useRef(0);
  const exampleIndex = useRef(1);
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  useEffect(
    () => () => {
      sourceRef.current?.stop();
      void audioContextRef.current?.close();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    },
    [],
  );
  const features = useMemo(
    () => analyzeAudio({ samples, sampleRate, channels: 1, bucketCount: 128 }),
    [samples, sampleRate],
  );
  const duration = features.duration;
  const stopPlayback = () => {
    const source = sourceRef.current;
    if (source) {
      source.onended = null;
      source.stop();
      source.disconnect();
    }
    sourceRef.current = null;
    const context = audioContextRef.current;
    audioContextRef.current = null;
    if (context) void context.close();
    setPlaying(false);
  };
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      const context = audioContextRef.current;
      if (context) setPosition(Math.min(duration, context.currentTime - playbackStart.current));
    }, 50);
    return () => window.clearInterval(timer);
  }, [playing, duration]);
  const replaceTrack = (next: Float32Array, rate: number, label: string) => {
    stopPlayback();
    setPosition(0);
    setSamples(next);
    setSampleRate(rate);
    setSourceLabel(label);
  };
  const upload = async (file?: File) => {
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      toast.error(en ? 'Audio files must be 50 MB or smaller.' : '文件不能超过 50MB');
      return;
    }
    const context = new AudioContext();
    try {
      const buffer = await context.decodeAudioData(await file.arrayBuffer());
      if (buffer.duration > 600) {
        toast.error(en ? 'Audio must be 10 minutes or shorter.' : '音频时长不能超过 10 分钟');
        return;
      }
      replaceTrack(buffer.getChannelData(0), buffer.sampleRate, file.name);
    } catch {
      toast.error(
        en
          ? 'Could not decode this file. Try MP3, WAV or OGG.'
          : '无法解码此音频文件，请尝试 MP3、WAV 或 OGG。',
      );
    } finally {
      await context.close();
    }
  };
  const startPlayback = (offset: number) => {
    const context = new AudioContext();
    const buffer = context.createBuffer(1, samples.length, sampleRate);
    buffer.getChannelData(0).set(samples);
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.onended = () => {
      sourceRef.current = null;
      audioContextRef.current = null;
      source.disconnect();
      setPosition(duration);
      setPlaying(false);
      void context.close();
    };
    audioContextRef.current = context;
    sourceRef.current = source;
    playbackStart.current = context.currentTime - offset;
    source.start(0, offset);
    setPlaying(true);
  };
  const togglePlayback = () => {
    if (playing) {
      const context = audioContextRef.current;
      if (context) setPosition(Math.min(duration, context.currentTime - playbackStart.current));
      stopPlayback();
    } else if (duration > 0) {
      const offset = position >= duration ? 0 : position;
      setPosition(offset);
      startPlayback(offset);
    }
  };
  const toggleRecording = async () => {
    if (recording) {
      recorderRef.current?.stop();
      setRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const preferred = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm'].find((type) =>
        MediaRecorder.isTypeSupported(type),
      );
      const recorder = new MediaRecorder(stream, preferred ? { mimeType: preferred } : undefined);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (event) => event.data.size && chunks.push(event.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const file = new File(chunks, '麦克风录音', { type: recorder.mimeType });
        await upload(file);
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      toast.error(
        en
          ? 'Microphone unavailable. Check your browser permissions.'
          : '无法使用麦克风。请检查浏览器权限后重试。',
      );
    }
  };
  function switchSample() {
    exampleIndex.current = (exampleIndex.current + 1) % gallerySamples.length;
    replaceTrack(makeSamples(exampleIndex.current), 44100, '内置示例');
  }
  function seek(next: number) {
    setPosition(next);
    if (playing) {
      stopPlayback();
      if (next < duration) startPlayback(next);
    }
  }
  return {
    position,
    displaySourceLabel,
    playing,
    recording,
    duration,
    features,
    replaceTrack,
    toggleRecording,
    togglePlayback,
    upload,
    seek,
    switchSample,
  };
}
export type AudioTrack = ReturnType<typeof useAudioTrack>;
