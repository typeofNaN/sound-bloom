import { beforeEach, expect, it } from 'vitest';
import { usePreferencesStore } from '../../src/stores/preferences-store';

beforeEach(() => {
  localStorage.clear();
  usePreferencesStore.setState({ theme: 'dark', locale: 'zh-CN' });
});
it('persists complete theme and locale preferences', () => {
  usePreferencesStore.getState().setTheme('light');
  usePreferencesStore.getState().setLocale('en-US');
  expect(localStorage.getItem('soundbloom-preferences')).toContain('light');
  expect(localStorage.getItem('soundbloom-preferences')).toContain('en-US');
});
