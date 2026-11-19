import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Slider } from '../../components/ui/slider';
import { Sparkles } from 'lucide-react';
import type { ArtworkSettings } from '../../hooks/useArtworkSettings';
import { palettes } from '../../data/artStyles';
import type { ArtworkFont } from '../../core/renderers/artworkFrame';
export function Inspector({ en, settings }: { en: boolean; settings: ArtworkSettings }) {
  const {
    title,
    setTitle,
    titleFont,
    setTitleFont,
    density,
    setDensity,
    seed,
    setSeed,
    sensitivity,
    setSensitivity,
    palette,
    setPalette,
    regenerate,
  } = settings;
  return (
    <aside className="inspector">
      <h3>{en ? 'Artwork settings' : '作品参数'}</h3>
      <label>
        {en ? 'Artwork title' : '作品标题'}
        <Input
          value={title}
          placeholder={en ? 'Add a line of text' : '添加一行文字'}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label>
        {en ? 'Title font' : '标题字体'}
        <Select value={titleFont} onValueChange={(value) => setTitleFont(value as ArtworkFont)}>
          <SelectTrigger className="mt-2 w-full" aria-label={en ? 'Title font' : '标题字体'}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="serif">{en ? 'Editorial serif' : '典雅衬线'}</SelectItem>
            <SelectItem value="brush">{en ? 'Chinese brush' : '手写毛笔'}</SelectItem>
            <SelectItem value="ink">{en ? 'Running script' : '墨迹草书'}</SelectItem>
            <SelectItem value="italic">{en ? 'Decorative italic' : '花体斜衬线'}</SelectItem>
            <SelectItem value="sans">{en ? 'Modern sans' : '现代黑体'}</SelectItem>
          </SelectContent>
        </Select>
      </label>
      <label>
        {en ? 'Density' : '图形密度'} <output>{Math.round(density * 100)}%</output>
        <Slider
          aria-label={en ? 'Density' : '图形密度'}
          className="mt-3 min-h-5"
          min={0.4}
          max={1.6}
          step={0.05}
          value={[density]}
          onValueChange={([next]) => setDensity(next)}
        />
      </label>
      <label>
        {en ? 'Seed' : '随机种子'} <output>{seed}</output>
        <Slider
          aria-label={en ? 'Seed' : '随机种子'}
          className="mt-3 min-h-5"
          min={1}
          max={9999}
          value={[seed]}
          onValueChange={([next]) => setSeed(next)}
        />
      </label>
      <label>
        {en ? 'Audio sensitivity' : '声音灵敏度'} <output>{sensitivity}%</output>
        <Slider
          className="mt-3 min-h-5"
          aria-label={en ? 'Audio sensitivity' : '声音灵敏度'}
          value={[sensitivity]}
          onValueChange={([value]) => setSensitivity(value)}
        />
      </label>
      <h3>{en ? 'Colors' : '色彩'}</h3>
      <RadioGroup
        className="palette-options"
        aria-label={en ? 'Colors' : '色彩'}
        value={String(palette)}
        onValueChange={(value) => setPalette(Number(value))}
      >
        {palettes.map((colors, index) => (
          <label key={index} className="palette-option">
            <RadioGroupItem value={String(index)} aria-label={`${en ? 'Palette' : '色板'} ${index + 1}`} />
            <span className="flex h-5 flex-1 overflow-hidden rounded-sm" aria-hidden="true">
              {colors.map((color) => (
                <span key={color} className="flex-1" style={{ backgroundColor: color }} />
              ))}
            </span>
          </label>
        ))}
      </RadioGroup>
      <Button className="randomize" onClick={regenerate}>
        <Sparkles /> {en ? 'Randomize' : '随机生长'}
      </Button>
    </aside>
  );
}
