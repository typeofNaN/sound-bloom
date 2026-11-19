import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { useSoundLab } from '../../src/hooks/useSoundLab';
import { gallerySamples } from '../../src/data/samples';
afterEach(() => vi.unstubAllGlobals());
it('rejects oversized files and preserves the previous parent', async () => {
  const { result } = renderHook(() => useSoundLab(gallerySamples[0].features, false));
  act(() => result.current.example());
  const previous = result.current.secondary;
  await act(() => result.current.upload({ size: 51 * 1024 * 1024 } as File));
  expect(result.current.error).toContain('50MB');
  expect(result.current.secondary).toBe(previous);
  expect(result.current.pending).toBe(false);
});
it('does not restore B when a cancelled decode finishes', async () => {
  let resolve!: (value: unknown) => void;
  const close = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal(
    'AudioContext',
    class {
      close = close;
      decodeAudioData() {
        return new Promise((r) => {
          resolve = r;
        });
      }
    },
  );
  const { result } = renderHook(() => useSoundLab(gallerySamples[0].features, false));
  let upload!: Promise<void>;
  act(() => {
    upload = result.current.upload({ size: 10, arrayBuffer: async () => new ArrayBuffer(10) } as File);
  });
  await waitFor(() => expect(resolve).toBeTypeOf('function'));
  act(() => result.current.reset());
  await act(async () => {
    resolve({ duration: 1, length: 44100 });
    await upload;
  });
  expect(result.current.secondary).toBeNull();
  expect(result.current.pending).toBe(false);
  expect(close).toHaveBeenCalledOnce();
});

it('compares A without losing the second voice or the chosen composition', () => {
  const a = gallerySamples[0].features;
  const { result } = renderHook(() => useSoundLab(a, false));
  act(() => result.current.example());
  const composed = result.current.features;
  act(() => result.current.setComparing(true));
  expect(result.current.features).toBe(a);
  expect(result.current.secondary).not.toBeNull();
  act(() => result.current.setComparing(false));
  expect(result.current.features.envelope).toEqual(composed.envelope);
  act(() => result.current.reset());
  expect(result.current.features).toBe(a);
});

it('stops and releases secondary playback when the voice is removed', async () => {
  const stop = vi.fn();
  const close = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal(
    'AudioContext',
    class {
      destination = {};
      close = close;
      resume = vi.fn().mockResolvedValue(undefined);
      createBuffer() {
        return { getChannelData: () => new Float32Array(44100 * 8) };
      }
      createBufferSource() {
        return { connect: vi.fn(), start: vi.fn(), stop, onended: null, buffer: null };
      }
    },
  );
  const { result } = renderHook(() => useSoundLab(gallerySamples[0].features, false));
  act(() => result.current.example());
  await act(() => result.current.toggleListening());
  expect(result.current.listening).toBe(true);
  act(() => result.current.reset());
  expect(result.current.listening).toBe(false);
  expect(stop).toHaveBeenCalledOnce();
  expect(close).toHaveBeenCalledOnce();
});
