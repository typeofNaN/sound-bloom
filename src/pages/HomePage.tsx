import { Link } from 'react-router-dom';
import { ArrowUpRight, Moon, Sparkles, Sun } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ArtCanvas } from '../components/ArtCanvas';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { gallerySamples, englishSamples } from '../data/samples';
import { palettes, names, styleDescriptions } from '../data/artStyles';
import { styleIds, type StyleId } from '../core/renderers/visualizer';
import type { AudioTrack } from '../hooks/useAudioTrack';
interface HomeProps {
  en: boolean;
  dark: boolean;
  setDark: (value: boolean) => void;
  setEn: (value: boolean) => void;
  demoIndex: number;
  setDemoIndex: (value: number) => void;
  setPage: (page: 'home' | 'studio') => void;
  setStyle: (id: StyleId) => void;
  replaceTrack: AudioTrack['replaceTrack'];
}
export function HomePage({
  en,
  dark,
  setDark,
  setEn,
  demoIndex,
  setDemoIndex,
  setPage,
  setStyle,
  replaceTrack,
}: HomeProps) {
  return (
    <>
      <header className="masthead mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 px-5 py-3 sm:px-10">
        <Button className="brand" onClick={() => setPage('home')}>
          <span className="brandmark">
            <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="" width="34" height="34" />
          </span>
          <span>
            SoundBloom <small>声生</small>
          </span>
        </Button>
        <nav className="mast-nav" aria-label={en ? 'Main navigation' : '主导航'}>
          <div className="mast-links">
            <Link to="/#styles">{en ? 'Styles' : '艺术风格'}</Link>
            <a href="https://github.com/typeofnan/sound-bloom" target="_blank" rel="noreferrer">
              GitHub <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </div>
          <div className="mast-tools">
            <Button
              variant="ghost"
              size="icon"
              aria-label={en ? 'Switch language' : '切换语言'}
              title={en ? '切换到中文' : 'Switch to English'}
              onClick={() => setEn(!en)}
            >
              <span lang={en ? 'zh' : 'en'}>{en ? '中' : 'EN'}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={en ? 'Switch theme' : '切换主题'}
              title={dark ? (en ? 'Light theme' : '亮色主题') : en ? 'Dark theme' : '暗色主题'}
              onClick={() => setDark(!dark)}
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
          </div>
        </nav>
      </header>
      <main className="page-enter">
        <section className="exhibit mx-auto max-w-7xl px-5 sm:px-10">
          <div className="exhibit-copy">
            <div className="sample-signature" aria-hidden="true">
              {Array.from({ length: 48 }, (_, index) => {
                const envelope = gallerySamples[demoIndex].features.envelope;
                const amplitude = envelope[Math.floor((index * envelope.length) / 48)] ?? 0;
                return <i key={index} style={{ height: Math.min(100, 6 + amplitude * 160) + '%' }} />;
              })}
            </div>
            <h1
              aria-label={en ? 'Let every sound bloom into art.' : '让声音，自由生长。'}
              className="bloom-heading text-balance"
              lang={en ? 'en-US' : 'zh-CN'}
            >
              <span>{en ? 'Let every sound' : '让声音，'}</span>{' '}
              <em>{en ? 'bloom into art.' : '自由生长。'}</em>
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-pretty text-muted sm:text-base">
              {en
                ? 'Transform every sound into a singular piece of generative art.'
                : '将每一段声音转化为独一无二的艺术作品，让无形的声音拥有可见的形状。'}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="primary" onClick={() => setPage('studio')}>
                {en ? 'Start creating' : '开始创作'} <Sparkles />
              </Button>
              <Link className="secondary !border-foreground/25" to="/#styles">
                {en ? 'Explore styles' : '探索艺术风格'}
              </Link>
            </div>
          </div>
          <figure className="exhibit-plate overflow-hidden border border-foreground/15 bg-panel">
            <div className="exhibit-print relative overflow-hidden">
              <ArtCanvas
                light={!dark}
                features={gallerySamples[demoIndex].features}
                style="bloom"
                seed={12}
                colors={palettes[0]}
                playing={true}
              />
            </div>
            <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-foreground/10 px-5 py-3 text-xs text-muted sm:px-7">
              <span className="font-medium text-foreground">{en ? 'Bloom' : '音之花'}</span>
              <div className="flex flex-wrap gap-2" role="group" aria-label={en ? 'Demo audio' : '演示音频'}>
                {gallerySamples.map((sample, index) => (
                  <Button
                    key={sample.name}
                    type="button"
                    aria-pressed={demoIndex === index}
                    className="min-h-9 rounded-full !border !border-foreground/15 px-3 aria-pressed:!border-accent aria-pressed:text-foreground"
                    onClick={() => setDemoIndex(index)}
                  >
                    {en ? englishSamples[index] : sample.name}
                  </Button>
                ))}
              </div>
            </figcaption>
          </figure>
          <div className="exhibit-note flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
            <p>
              {en
                ? 'Switch samples to see how different rhythms shape the petals.'
                : '切换上方的示例，对比不同声音如何改变花瓣轮廓。'}
            </p>
            <Button
              className="min-h-10 font-medium text-foreground underline decoration-accent underline-offset-4"
              onClick={() => {
                replaceTrack(gallerySamples[demoIndex].samples, 44100, gallerySamples[demoIndex].name);
                setPage('studio');
              }}
            >
              {en ? 'Edit this sample in the studio' : '用这段声音创作'}
            </Button>
          </div>
        </section>
        <section className="mx-auto max-w-7xl scroll-mt-6 px-5 pb-16 sm:px-10" id="styles">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-t border-foreground/15 pt-8">
            <h2 className="font-display text-3xl sm:text-5xl">{en ? 'Explore styles' : '探索艺术风格'}</h2>
            <p className="text-sm text-muted">
              {en ? 'Choose a piece to open it in the studio.' : '选择一件作品，在工作台继续创作。'}
            </p>
          </div>
          <div className="grid auto-rows-fr grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-7 lg:grid-cols-3">
            {styleIds.map((id, i) => (
              <Button
                className="gallery-print group !block h-full min-w-0 content-start !rounded-none !border-0 !bg-transparent !p-0 !text-left"
                key={id}
                onClick={() => {
                  setStyle(id);
                }}
              >
                <div className="mr-auto aspect-[4/3] w-full overflow-hidden border border-foreground/15">
                  <ArtCanvas
                    light={!dark}
                    features={gallerySamples[2].features}
                    style={id}
                    seed={i + 3}
                    colors={i % 2 ? palettes[4] : palettes[0]}
                    playing={false}
                  />
                </div>
                <span className="block min-w-0 pt-3 pb-1 text-left">
                  <span className="flex items-start justify-start gap-2 text-sm leading-5 font-medium capitalize">
                    <span className="min-w-0 break-words">{en ? id : names[id]}</span>
                    <ArrowUpRight size={16} aria-hidden="true" className="mt-0.5 text-accent" />
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted">
                    {styleDescriptions[i][en ? 1 : 0]}
                  </span>
                </span>
              </Button>
            ))}
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-10">
          <div className="grid gap-8 rounded-2xl border border-foreground/15 bg-panel p-6 sm:p-10 md:grid-cols-[1fr_1.35fr]">
            <div>
              <h2 className="font-display text-3xl">{en ? 'Before you begin' : '开始之前'}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {en
                  ? 'Try a built-in sample, or make a piece from your own recording.'
                  : '可以先用示例练习，也可以带一段自己的录音来创作。'}
              </p>
            </div>
            <Accordion type="single" collapsible>
              {(en
                ? [
                    [
                      'Does my audio leave my device?',
                      'Your browser decodes and analyzes audio locally. The microphone requests permission when you start recording.',
                    ],
                    [
                      'What files can I use?',
                      'Try MP3, WAV or OGG. Supported formats depend on your browser. Files must be under 50 MB and no longer than 10 minutes.',
                    ],
                    [
                      'What can I export?',
                      'Use Export in the studio to download the current artwork as a PNG or an animated GIF.',
                    ],
                  ]
                : [
                    [
                      '声音会上传吗？',
                      '音频在当前浏览器里解码和分析。点击开始录音时，浏览器才会请求麦克风权限。',
                    ],
                    [
                      '支持哪些音频文件？',
                      '可尝试 MP3、WAV 或 OGG，实际格式支持取决于浏览器。单个文件上限为 50 MB，时长上限为 10 分钟。',
                    ],
                    ['可以导出什么？', '点击工作台里的「导出作品」，可选择 PNG 静态图片或 GIF 循环动图。'],
                  ]
              ).map(([question, answer]) => (
                <AccordionItem key={question} value={question} className="border-foreground/15">
                  <AccordionTrigger className="text-foreground">{question}</AccordionTrigger>
                  <AccordionContent className="leading-relaxed text-muted">{answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-10">
          <h2 className="mb-5 font-display text-2xl">{en ? 'How to create' : '创作流程'}</h2>
          <ol className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
            {(en
              ? ['Add audio', 'Choose a style', 'Edit the artwork', 'Export']
              : ['录制或上传声音', '选择艺术风格', '调整作品参数', '导出作品']
            ).map((step, index) => (
              <li className="flex items-baseline gap-3 border-t border-foreground/15 py-4 text-sm" key={step}>
                <span className="font-mono text-xs text-muted">{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </section>
      </main>
      <footer>
        <div className="brand">
          SoundBloom <small>声生</small>
        </div>
        <p>声音只在你的浏览器中生长。不会上传，不会离开。</p>
        <a href="https://typeofnan.cn">Designed by typeofNaN</a>
      </footer>
    </>
  );
}
