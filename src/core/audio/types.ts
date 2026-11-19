export interface AudioAnalysisInput {
  samples: Float32Array;
  sampleRate: number;
  channels: number;
  bucketCount: 32 | 64 | 128 | 256 | 512 | 1024 | number;
}

export interface AudioFeatures {
  waveform: Float32Array;
  envelope: Float32Array;
  spectrum: Float32Array;
  rms: number;
  peak: number;
  energy: number;
  low: number;
  mid: number;
  high: number;
  duration: number;
  sampleRate: number;
  channels: number;
  fingerprint: string;
}
