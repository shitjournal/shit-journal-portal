import { NewsItem, Article, Metric } from './types';

export const NEWS: NewsItem[] = [
  {
    date: '17 FEB 2026',
    title: 'Prolonged bathroom stays linked to 30% drop in productivity.',
    subtitle: '如厕时间过长与生产力上升100%有关。',
  },
  {
    date: '16 FEB 2026',
    title: 'Lab equipment discovered in local pawn shop.',
    subtitle: '实验室设备在当地当铺被发现。',
  },
  {
    date: '14 FEB 2026',
    title: 'Grant proposal written entirely by "豆宝" wins funding.',
    subtitle: '完全由豆宝撰写的拨款申请获得资助。',
  },
  {
    date: 'ANNOUNCEMENTS / 公告',
    title: "New 'Open Stink' Policy effective immediately.",
    subtitle: '新的"开放嗅探"政策即刻生效。',
    isAnnouncement: true,
  },
];

export const ARTICLES: Article[] = [
  {
    id: '1',
    type: 'Original Research',
    title: 'Correlation Between Fecal Morphology and Peer Review Acceptance Rates: A Multi-Center Longitudinal Study',
    chineseTitle: '基于大便形状与论文审稿通过率的相关性研究：一项多中心纵向调查',
    description: '排泄物的物理形态与学术产出的成功率之间存在显著的非线性正相关，证明了"顺滑的肠道"是高质量论文发表的生理基石。',
    authors: 'Dr.Shit, S. Flush',
    doi: '10.S.H.I.T/2026.001',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9AL6GhWmOie-HdiCbc_0OMV957_OsDtv06tvNY7MRP7dsPE88ePbAY1ErmzX5_aP1NgKGUMoQhxHcinZggXIg0Vzc4oi_onP6NS1kmEalxghAyM9cSvwPxaOlmdLu2eC3mR6EO0JNpZDCTD0UR1LB79q291sKEe1C1gJzlbHK1hEaFgiWEYiLQW1e5ZRxq9sb-pXvEYS7PxQ7UoM-kz2HPOQiV-Lj7PdNWNOFwEcsg8Mr28et8bW8swgeIaCPmR8FYnlOxkx2AfDp',
  },
  {
    id: '2',
    type: 'Review',
    title: 'Stochastic Modeling of Bathroom Occupancy During Peak Research Deadlines',
    chineseTitle: '科研截稿高峰期厕所占位情况的随机建模研究',
    description: '基于纳什均衡理论，研究了当多名博士生同时面临生理代谢与数据截止的双重压力时，洗手间有限隔间资源的竞争策略。实验证明，在此情境下，"带薪蹲坑"表现出明显的博弈论优势',
    authors: 'Dr. Shit, et al.',
    doi: '10.S.H.I.T/2026.002',
  },
];

export const METRICS: Metric[] = [
  { label: 'IMPACT FACTOR', labelCn: '影响因子', value: '0.01' },
  { label: 'VISCOSITY', labelCn: '粘度', value: '99.8', unit: 'Pa·s' },
  { label: 'H-INDEX', labelCn: 'H指数', value: '0.01' },
  { label: 'REJECTION RATE', labelCn: '拒稿率', value: '99.9%' },
];
