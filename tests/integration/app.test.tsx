import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import App from '../../src/App';

afterEach(() => {
  cleanup();
  localStorage.removeItem('soundbloom-locale');
  window.history.replaceState(null, '', '/');
});

it('keeps the selected English language when opening the studio', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: '切换语言' }));
  fireEvent.click(screen.getByRole('button', { name: 'Start creating' }));
  expect(window.location.hash).toBe('#/studio');
  expect(screen.getByRole('heading', { name: 'Artwork settings' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Export artwork' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Bloom', pressed: true })).toBeInTheDocument();
  expect(screen.getByRole('slider', { name: 'Playback progress' })).toBeInTheDocument();
});

it('moves from the immersive home into a usable studio', async () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: '让声音，自由生长。' })).toBeInTheDocument();
  const question = screen.getByRole('button', { name: '声音会上传吗？' });
  fireEvent.click(question);
  expect(question).toHaveAttribute('aria-expanded', 'true');
  fireEvent.click(screen.getByRole('button', { name: '开始创作' }));
  expect(window.location.hash).toBe('#/studio');
  expect(await screen.findByText('声音画布')).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /音之花/ }).length).toBeGreaterThan(0);
  expect(screen.getByRole('button', { name: '导出作品' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '保存' }));
  expect(await screen.findByText('作品参数已保存在当前浏览器')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '日冕声针' }));
  const png = new Blob(['fixture'], { type: 'image/png' });
  const resizeObserver = globalThis.ResizeObserver;
  const share = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal('navigator', Object.assign(Object.create(navigator), { share, canShare: () => true }));
  vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback) => callback(png));
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  vi.stubGlobal(
    'URL',
    class extends URL {
      static createObjectURL() {
        return 'blob:exported-artwork';
      }
      static revokeObjectURL() {}
    },
  );
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.open = true;
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.open = false;
    },
  });
  try {
    fireEvent.click(screen.getByRole('button', { name: '导出作品' }));
    fireEvent.click(screen.getByRole('button', { name: 'PNG · 静态图片' }));
    expect(screen.getByRole('link', { name: '保存 PNG' })).toHaveAttribute(
      'download',
      'soundbloom-corona.png',
    );
    fireEvent.click(screen.getByRole('button', { name: '分享图片到…' }));
    expect(share).toHaveBeenCalledWith({
      files: [expect.objectContaining({ name: 'soundbloom-corona.png', type: 'image/png', size: png.size })],
    });
  } finally {
    cleanup();
    Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal');
    Reflect.deleteProperty(HTMLDialogElement.prototype, 'close');
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.stubGlobal('ResizeObserver', resizeObserver);
  }
});

it('opens a shared style directly in the studio', () => {
  const previousUrl = window.location.href;
  window.history.replaceState(null, '', '/#/studio?style=mosaic');
  const app = render(<App />);
  try {
    expect(app.getByText('声音画布').textContent).toContain('菱格镶嵌');
  } finally {
    app.unmount();
    window.history.replaceState(null, '', previousUrl);
  }
});

it('regenerates the current piece while preserving its title and style', () => {
  window.history.replaceState(null, '', '/#/studio?style=mosaic');
  render(<App />);
  const title = screen.getByPlaceholderText('添加一行文字');
  fireEvent.change(title, { target: { value: '风起' } });
  const seed = screen.getByRole('slider', { name: '随机种子' });
  const initial = seed.getAttribute('aria-valuenow');
  fireEvent.click(screen.getByRole('button', { name: '刷新作品' }));
  expect(seed.getAttribute('aria-valuenow')).not.toBe(initial);
  expect(title).toHaveValue('风起');
  expect(window.location.hash).toBe('#/studio?style=mosaic');
});

it.each(['/#/missing', '/#/studio/missing?style=bloom', '/missing'])(
  'shows a 404 at %s without redirecting',
  (url) => {
    window.history.replaceState(null, '', url);
    render(<App />);
    expect(screen.getByRole('heading', { name: '404 · 页面不存在' })).toBeInTheDocument();
    expect(window.location.pathname + window.location.search + window.location.hash).toBe(url);
    expect(screen.getByRole('link', { name: '返回首页' })).toHaveAttribute('href', '/#/');
  },
);

it('lets users combine a second local example, switch inheritance and remove it', () => {
  window.history.replaceState(null, '', '/#/studio');
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /添加第二段声音/ }));
  fireEvent.click(screen.getByRole('button', { name: '先试试示例' }));
  expect(screen.getByRole('button', { name: /交融/ })).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(screen.getByRole('button', { name: /织入/ }));
  expect(screen.getByRole('button', { name: /织入/ })).toHaveAttribute('aria-pressed', 'true');
  fireEvent.keyDown(screen.getByRole('slider', { name: '第二段声音参与度' }), { key: 'ArrowRight' });
  expect(screen.getByText('51% 第二声')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '原声作品' }));
  expect(screen.getByRole('button', { name: '原声作品' })).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(screen.getByRole('button', { name: '双声作品' }));
  fireEvent.click(screen.getByRole('button', { name: '移除第二段声音' }));
  expect(screen.queryByRole('slider', { name: '第二段声音参与度' })).not.toBeInTheDocument();
});
