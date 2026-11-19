import type { StyleId } from '../core/renderers/visualizer';
export const names: Record<StyleId, string> = {
  lunar: '月光声纹',
  galaxy: '星空粒子',
  bloom: '音之花',
  landscape: '山川声景',
  fluid: '流体声波',
  cityscape: '频谱之城',
  'tree-ring': '声音年轮',
  mandala: '曼陀罗',
  ink: '声音墨迹',
  neon: '霓虹声场',
  terrain: '三维声景',
  planet: '声音星球',
  loom: '声纹织锦',
  tide: '潮汐谱',
  orbit: '回声轨道',
  halftone: '半调声印',
  ribbons: '声弧缎带',
  origami: '折声纸雕',
  matrix: '音量方阵',
  pendulum: '声摆阵列',
  mosaic: '菱格镶嵌',
  corona: '日冕声针',
};
export const palettes = [
  ['#AC6955', '#BAA07E', '#877B67'],
  ['#F8BBD0', '#B39DDB', '#80DEEA'],
  ['#FF6B8B', '#7B61FF', '#2DE2E6'],
  ['#F4D35E', '#EE964B', '#F95738'],
  ['#A8E6CF', '#56C596', '#329D9C'],
];
export const styleDescriptions = [
  ['起伏的振幅沿圆周展开。', 'Amplitude ripples around a circular outline.'],
  ['每段声音的能量改变粒子的大小和分布。', 'Audio energy shapes the size and spread of the particles.'],
  ['响起时花瓣伸展，安静处轮廓收拢。', 'Petals extend in louder passages and contract in quiet ones.'],
  ['把响度变化叠成一层层山脊。', 'Changes in loudness stack into ridgelines.'],
  ['声音推动多条流线起伏。', 'Sound bends a series of flowing lines.'],
  ['把响度包络排成一列天际线。', 'The amplitude envelope forms a skyline.'],
  ['不同时间段的振幅刻进同心轮廓。', 'Amplitude leaves its mark on concentric contours.'],
  ['声音在重复的径向图案里留下变化。', 'Sound introduces variation into a repeating radial motif.'],
  ['把声音画成笔触交叠的线条。', 'Sound becomes a set of overlapping strokes.'],
  ['用发光线条描出声音的强弱。', 'Glowing lines trace the sound’s intensity.'],
  ['把响度变化铺成层叠地形。', 'The changing envelope builds a layered terrain.'],
  ['把声音的强弱散布在粒子星球上。', 'Loud and quiet passages shape a field of particles.'],
  ['响度决定横纵织线的长度。', 'Loudness sets the length of interwoven threads.'],
  ['声音越强，潮线起伏越深。', 'Louder passages deepen the ripples in each tide line.'],
  [
    '声音的强弱改变螺旋上每颗光点的位置和大小。',
    'Audio energy shifts the position and size of each dot along the spiral.',
  ],
  ['用大小不一的圆点印出声音强弱。', 'Dot sizes print the intensity of each passage.'],
  ['声音推开一层层弧形丝带。', 'Audio energy stretches layers of arcing ribbons.'],
  ['由响度决定交错三角折面的高度。', 'Loudness shapes the height of alternating triangular folds.'],
  ['每列方格显示一段声音的响度。', 'Each column of tiles shows the loudness of an audio segment.'],
  ['声音越强，悬垂的摆线越长。', 'Louder passages lengthen hanging pendulums.'],
  ['不同时间段的响度改变菱形大小。', 'Loudness scales each diamond tile.'],
  ['强音把环形声针推向外侧。', 'Loud passages push the radial needles outward.'],
];

export const styleName = (id: StyleId, en: boolean) =>
  en
    ? id
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' ')
    : names[id];
