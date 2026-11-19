import type { RenderFrame } from '../types';
import { createSeededRandom } from '../../algorithms/prng';

export function prepare({ ctx, width, height, options }: RenderFrame) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = options.background;
  ctx.fillRect(0, 0, width, height);
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate((options.rotation * Math.PI) / 180);
  ctx.scale(options.scale, options.scale);
  ctx.globalAlpha = options.opacity;
}
export function finish(frame: RenderFrame) {
  frame.ctx.restore();
  frame.ctx.globalAlpha = 1;
  frame.ctx.shadowBlur = 0;
  frame.ctx.globalCompositeOperation = 'source-over';
}
export function radial(frame: RenderFrame, petals: number, layers: number) {
  const { ctx, width, height, features, options } = frame;
  prepare(frame);
  const unit = Math.min(width, height);
  for (let l = layers; l > 0; l--) {
    ctx.beginPath();
    for (let i = 0; i <= petals * 2; i++) {
      const a = (i / (petals * 2)) * Math.PI * 2;
      const amp = Math.abs(features.waveform[i % features.waveform.length] || 0) * options.sensitivity;
      const r =
        unit * (0.08 + l * 0.035) +
        Math.pow(Math.abs(Math.sin((a * petals) / 2)), 1.6) * unit * 0.09 +
        amp * unit * 0.1;
      const x = Math.cos(a) * r,
        y = Math.sin(a) * r;
      if (i) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = l % 2 ? options.primary : options.secondary;
    ctx.fillStyle = (l % 2 ? options.primary : options.secondary) + '22';
    ctx.lineWidth = 1 + l * 0.4;
    ctx.fill();
    ctx.stroke();
  }
  finish(frame);
}
export function particles(frame: RenderFrame, spiral = false) {
  const { ctx, width, height, features, options } = frame;
  prepare(frame);
  const rand = createSeededRandom(options.seed);
  const count = Math.floor(80 * options.density);
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < count; i++) {
    const a = rand() * Math.PI * 2 + (spiral ? i * 0.12 : 0),
      r = rand() * Math.min(width, height) * 0.42;
    const amp = Math.abs(features.waveform[i % features.waveform.length] || 0);
    ctx.beginPath();
    ctx.fillStyle = i % 2 ? options.primary : options.accent;
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 10;
    ctx.arc(Math.cos(a) * r, Math.sin(a) * r, (1 + amp * 8) * options.sensitivity, 0, Math.PI * 2);
    ctx.fill();
  }
  finish(frame);
}
export function waveform(frame: RenderFrame, layers = 5, vertical = false) {
  const { ctx, width, height, features, options } = frame;
  prepare(frame);
  for (let l = 0; l < layers; l++) {
    ctx.beginPath();
    for (let i = 0; i < features.waveform.length; i++) {
      const t = i / (features.waveform.length - 1) - 0.5;
      const amp = features.waveform[i] * options.sensitivity;
      const x = vertical ? amp * width * 0.3 : t * width * 0.85;
      const y = vertical ? t * height * 0.85 : amp * height * 0.22 + (l - layers / 2) * 18;
      if (i) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    }
    ctx.strokeStyle = l % 2 ? options.primary : options.secondary;
    ctx.lineWidth = 1 + l * 0.5;
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 12;
    ctx.stroke();
  }
  finish(frame);
}
