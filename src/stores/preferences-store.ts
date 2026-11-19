import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export type Theme = 'dark' | 'light';
export type Locale = 'zh-CN' | 'en-US';
interface PreferencesState {
  theme: Theme;
  locale: Locale;
  setTheme(theme: Theme): void;
  setLocale(locale: Locale): void;
}
export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: 'dark',
      locale: 'zh-CN',
      setTheme: (theme) => set({ theme }),
      setLocale: (locale) => set({ locale }),
    }),
    { name: 'soundbloom-preferences' },
  ),
);
