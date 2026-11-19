import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Share2, X } from 'lucide-react';
import { Button } from './ui/button';

export interface ExportedArtwork {
  file: File;
  url: string;
  title: string;
}

const platforms = [
  ['微', '微博', 'Weibo', 'https://weibo.com/'],
  ['书', '小红书', 'RedNote', 'https://creator.xiaohongshu.com/publish/publish'],
  ['♪', '抖音', 'Douyin', 'https://creator.douyin.com/'],
  ['𝕏', 'X', 'X', 'https://x.com/compose/post'],
  ['Ig', 'Instagram', 'Instagram', 'https://www.instagram.com/'],
  ['f', 'Facebook', 'Facebook', 'https://www.facebook.com/'],
] as const;

export function ArtworkShare({
  artwork,
  en,
  close,
}: {
  artwork: ExportedArtwork;
  en: boolean;
  close: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState('');
  const format = artwork.file.type === 'image/gif' ? 'GIF' : 'PNG';
  const files = [artwork.file];
  const native = Boolean(typeof navigator.share === 'function' && navigator.canShare?.({ files }));
  useEffect(() => {
    dialog.current?.showModal();
  }, []);
  return (
    <dialog
      ref={dialog}
      onClose={close}
      aria-labelledby="artwork-share-title"
      className="m-auto max-h-[90dvh] w-[min(92vw,29rem)] overflow-auto rounded-2xl border border-foreground/20 bg-panel p-6 text-foreground shadow-xl backdrop:bg-black/55"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="artwork-share-title" className="font-display text-2xl">
            {en ? 'Share your artwork' : '分享你的作品'}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {artwork.title} · {format}
          </p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          aria-label={en ? 'Close' : '关闭'}
          onClick={() => dialog.current?.close()}
        >
          <X size={18} />
        </Button>
      </div>
      <img
        className="mx-auto my-4 max-h-[32dvh] max-w-full object-contain"
        src={artwork.url}
        alt={artwork.title}
      />
      <div className="flex flex-wrap items-center gap-4">
        {native && (
          <Button
            className="primary"
            onClick={async () => {
              try {
                await navigator.share({ files });
              } catch (error) {
                if (!(error instanceof Error && error.name === 'AbortError'))
                  setStatus(
                    en
                      ? 'File sharing failed. Save the image and attach it in your app.'
                      : '分享未成功，可保存图片后在应用中添加。',
                  );
              }
            }}
          >
            <Share2 size={16} />
            {en ? 'Share image…' : '分享图片到…'}
          </Button>
        )}
        <a className="text-sm underline underline-offset-4" href={artwork.url} download={artwork.file.name}>
          {en ? 'Save' : '保存'} {format}
        </a>
      </div>
      <p className="my-4 text-sm leading-relaxed text-muted">
        {en
          ? 'For WeChat or Moments, choose the saved image from your album. To post elsewhere, open a platform below and attach the image.'
          : '发微信或朋友圈时，从相册选择已保存的作品。也可以打开下方平台，在发布时添加刚导出的图片。'}
      </p>
      <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">
        {platforms.map(([mark, zh, english, href]) => (
          <a
            className="group flex min-h-12 items-center gap-2 rounded-lg border border-foreground/15 bg-surface px-3 text-sm font-medium transition-colors hover:border-accent/50 focus-visible:ring-2 focus-visible:ring-accent"
            key={href}
            href={href}
            target="_blank"
            rel="noreferrer"
          >
            <span
              aria-hidden="true"
              className="grid size-7 shrink-0 place-items-center rounded-md bg-accent/10 font-display text-base text-accent"
            >
              {mark}
            </span>
            {en ? english : zh}
            <ArrowUpRight
              aria-hidden="true"
              size={13}
              className="ml-auto shrink-0 text-muted group-hover:text-accent"
            />
          </a>
        ))}
      </div>
      <p role="status" className="mt-2 text-sm">
        {status}
      </p>
    </dialog>
  );
}
