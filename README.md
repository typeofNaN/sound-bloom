# SoundBloom · 声生

[English](./README.en.md)

把一段声音变成一幅画。SoundBloom 是一个浏览器里的声音艺术工作室，可根据音频的振幅变化生成花瓣、粒子、山脊等图形。录音与音频分析都在本机完成。

## 创作一件作品

1. 在首页切换声音示例，观察节奏如何改变花瓣轮廓；点击「开始创作」进入 `/#/studio`。
2. 录一段声音、上传音频，或使用内置示例。通过底部音轨试听、定位。
3. 从 36 种艺术风格中选择一种，调整配色、密度、随机种子与声音灵敏度。可为画面添加题字并选择字体。
4. 点击「导出作品」选择当前画面的 PNG，或生成 480 × 480、4 秒循环播放的无声 GIF。支持文件分享的设备可将图片交给系统分享菜单。也可以在微信或朋友圈中从相册选图，或通过面板打开微博、小红书、抖音、X、Instagram、Facebook，手动添加图片发布。

## 本地开发

使用支持 Vite 8 的 Node.js（如 Node.js 22.12+）和 pnpm 10。克隆项目后，在仓库根目录运行：

```sh
pnpm install --frozen-lockfile
pnpm dev
```

打开终端显示的本地地址。麦克风录制需要 localhost 或 HTTPS，并需要允许浏览器访问麦克风。

| 命令                     | 用途                                     |
| ------------------------ | ---------------------------------------- |
| `pnpm test`              | 运行音频分析、渲染及界面测试             |
| `pnpm lint`              | 检查代码规范                             |
| `pnpm build`             | 检查 TypeScript 并输出静态站点到 `dist/` |
| `pnpm exec vite preview` | 在本地预览已构建的站点                   |

## 部署

构建前将 `VITE_PUBLIC_SITE_URL` 设为站点的完整地址，保留末尾的斜杠（如 `https://example.com/`），用于生成 Open Graph 预览地址。将 `dist/` 部署到静态主机，工作台使用哈希路由，可直接访问或刷新 `/#/studio`；例如 `/#/studio?style=mosaic` 会打开菱格镶嵌风格。

## 代码入口

- `src/App.tsx` 负责哈希路由与跨页状态；首页和创作台分别位于 `src/pages/HomePage.tsx` 和 `src/pages/studio/`。
- `src/hooks/useAudioTrack.ts` 管理录音、导入、试听和进度；`useArtworkSettings.ts` 管理作品参数与保存。
- `src/data/` 保存示例声音、风格文案与色板。`src/core/` 包含音频分析、画布渲染和 GIF 编码。
- `src/components/` 包含画布、导出与分享面板及通用 UI 控件。`src/styles.css` 按层叠顺序引入 `src/styles/` 下的样式。

[MIT 许可证](./LICENSE)
