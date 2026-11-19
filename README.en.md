# SoundBloom

[简体中文](./README.md)

Turn a recording into a piece of generative art. SoundBloom uses changes in audio amplitude to shape petals, particles and ridgelines. Recording and audio analysis run locally in the browser.

## Create an artwork

1. Switch between samples on the home page to see how rhythm changes the petals. Choose **Start creating** to open `/#/studio`.
2. Record a sound, upload an audio file or use a built-in sample. Use the waveform timeline to play and seek.
3. Choose from 36 art styles. Adjust the palette, density, random seed and audio sensitivity, then add a title and choose its typeface.
4. Choose **Export artwork** to download a PNG of the current frame or a silent, four-second looping GIF at 480 × 480. On compatible devices, send the image through the system share sheet. For WeChat or Moments, select the saved image from your album. The share panel also links to Weibo, RedNote, Douyin, X, Instagram and Facebook, where you can attach the exported file yourself.

## Local development

Use a Node.js version supported by Vite 8 (such as Node.js 22.12+) and pnpm 10. From the cloned repository, run:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL printed in the terminal. Recording requires localhost or HTTPS and permission to access the microphone.

| Command                  | Purpose                                           |
| ------------------------ | ------------------------------------------------- |
| `pnpm test`              | Run audio, renderer and UI tests                  |
| `pnpm lint`              | Check code style                                  |
| `pnpm build`             | Type-check and build the static site into `dist/` |
| `pnpm exec vite preview` | Preview the production build locally              |

## Deployment

Before building, set `VITE_PUBLIC_SITE_URL` to the full public site address with a trailing slash, such as `https://example.com/`, for Open Graph previews. Publish `dist/` to a static host. The studio uses hash routing, so direct visits and reloads work at `/#/studio`. For example, `/#/studio?style=mosaic` opens the Mosaic style.

## Code map

- `src/App.tsx` coordinates hash routing and cross-page state. The home page lives in `src/pages/HomePage.tsx` and the studio in `src/pages/studio/`.
- `src/hooks/useAudioTrack.ts` handles recording, import, playback and seeking. `useArtworkSettings.ts` manages artwork parameters and saving.
- `src/data/` contains sample audio, style descriptions and palettes. `src/core/` contains audio analysis, canvas rendering and GIF encoding.
- `src/components/` contains the canvas, export and share dialogs, and shared UI controls. `src/styles.css` imports the stylesheets from `src/styles/` in cascade order.

[MIT license](./LICENSE)
