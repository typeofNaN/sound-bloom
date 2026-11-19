import { expect, it } from 'vitest';
import { createSeededRandom } from '../../src/core/algorithms/prng';

it('repeats the same sequence for an equal seed', () => {
  const a = createSeededRandom(42);
  const b = createSeededRandom(42);
  expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  expect(a()).toBeGreaterThanOrEqual(0);
  expect(a()).toBeLessThan(1);
});
