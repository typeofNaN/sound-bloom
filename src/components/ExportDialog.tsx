import { useEffect, useState, type RefObject } from 'react';
import { toast } from 'sonner';
import { ArtworkShare, type ExportedArtwork } from './ArtworkShare';
import { Button } from './ui/button';
import type { ArtworkFrame } from '../core/renderers/artworkFrame';
import { styleName } from '../data/artStyles';
export function ExportDialog({
  en,
  frame,
  exportDialog,
}: {
  en: boolean;
  frame: ArtworkFrame;
  exportDialog: RefObject<HTMLDialogElement | null>;
}) {
  const [exported, setExported] = useState<ExportedArtwork | null>(null);
  useEffect(
    () => () => {
      if (exported) URL.revokeObjectURL(exported.url);
    },
    [exported],
  );
  const [gifProgress, setGifProgress] = useState<number | null>(null);
  const finishExport = (blob: Blob, format: 'gif' | 'png') => {
    const file = new File([blob], `soundbloom-${frame.style}.${format}`, { type: blob.type });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    link.click();
    if (exportDialog.current?.open) exportDialog.current.close();
    setExported({ file, url, title: frame.title?.trim() || styleName(frame.style, en) });
  };
  const download = (format: 'gif' | 'png') => {
    if (format === 'png') {
      document.querySelector<HTMLCanvasElement>('.canvas-frame canvas')?.toBlob((blob) => {
        if (blob) finishExport(blob, format);
        else toast.error(en ? 'PNG export failed.' : 'PNG 导出失败。');
      }, 'image/png');
      return;
    }
    setGifProgress(0);
    void import('../core/export/animatedGif')
      .then(({ animatedGif }) => animatedGif(frame, setGifProgress))
      .then((blob) => finishExport(blob, format))
      .catch(() => toast.error(en ? 'GIF export failed. Try again.' : 'GIF 导出失败，请重试。'))
      .finally(() => setGifProgress(null));
  };
  return (
    <>
      <dialog
        ref={exportDialog}
        aria-labelledby="export-options"
        onCancel={(event) => {
          if (gifProgress !== null) event.preventDefault();
        }}
        className="m-auto w-[min(90vw,24rem)] rounded-xl border border-foreground/20 bg-panel p-5 text-foreground backdrop:bg-black/55"
      >
        <div className="flex items-center justify-between">
          <h2 id="export-options" className="font-display text-xl">
            {en ? 'Export format' : '导出格式'}
          </h2>
          <Button disabled={gifProgress !== null} onClick={() => exportDialog.current?.close()}>
            {en ? 'Close' : '关闭'}
          </Button>
        </div>
        <div className="mt-4 grid gap-2">
          <Button
            variant="outline"
            size="default"
            disabled={gifProgress !== null}
            onClick={() => download('png')}
          >
            {en ? 'PNG · Still image' : 'PNG · 静态图片'}
          </Button>
          <Button
            variant="outline"
            size="default"
            disabled={gifProgress !== null}
            onClick={() => download('gif')}
          >
            {en ? 'GIF · Animated loop' : 'GIF · 循环动图'}
          </Button>
        </div>
        <p className="mt-3 text-sm text-muted" role="status">
          {gifProgress === null
            ? en
              ? 'GIF · 480 × 480 · 4 seconds · silent'
              : 'GIF · 480 × 480 · 4 秒 · 无声'
            : `${en ? 'Encoding' : '正在生成'} ${gifProgress}%`}
        </p>
      </dialog>
      {exported && <ArtworkShare artwork={exported} en={en} close={() => setExported(null)} />}
    </>
  );
}
