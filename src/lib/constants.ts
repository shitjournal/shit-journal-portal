export const STATUS_LABELS: Record<string, { en: string; cn: string; color: string }> = {
  pending: { en: 'Screening', cn: '待预审', color: 'bg-gray-100 text-gray-500' },
  under_review: { en: 'Scooper Review', cn: '铲屎官评审中', color: 'bg-yellow-50 text-yellow-700' },
  revisions_requested: { en: 'Revisions Requested', cn: '需要修改', color: 'bg-blue-50 text-blue-700' },
  accepted: { en: 'Approved for Flush', cn: '批准冲水', color: 'bg-green-50 text-green-700' },
  rejected: { en: 'Clogged', cn: '堵塞了', color: 'bg-red-50 text-red-700' },
  flushed: { en: 'Desk Flushed', cn: '直接冲掉', color: 'bg-red-50 text-red-500' },

  '待预审': { en: 'Pending', cn: '待预审', color: 'bg-gray-100 text-gray-500' },
  '通过预审': { en: 'Scooper Review', cn: '铲屎官评审中', color: 'bg-yellow-50 text-yellow-700' },
  '退回修改': { en: 'Revisions Requested', cn: '需要修改', color: 'bg-blue-50 text-blue-700' },
  '被退回': { en: 'Desk Flushed', cn: '直接冲掉', color: 'bg-red-50 text-red-500' },
  '被删除': { en: 'Deleted', cn: '被删除', color: 'bg-red-50 text-red-700' },
};

export const EDITOR_STATUS_LABELS: Record<string, { en: string; cn: string; color: string }> = {
  pending: { en: 'Pending', cn: '待预审', color: 'bg-amber-50 text-amber-700' },
  under_review: { en: 'In Tank', cn: '已入池', color: 'bg-green-50 text-green-700' },
  revisions_requested: { en: 'Revisions', cn: '需修改', color: 'bg-blue-50 text-blue-700' },
  accepted: { en: 'Accepted', cn: '已接受', color: 'bg-green-50 text-green-700' },
  rejected: { en: 'Rejected', cn: '已拒绝', color: 'bg-red-50 text-red-700' },
  flushed: { en: 'Flushed', cn: '已冲掉', color: 'bg-red-50 text-red-500' },
};

export const VISCOSITY_LABELS: Record<string, string> = {
  stringy: 'Stringy / 拉丝型',
  semi: 'Semi-solid / 半固态',
  'high-entropy': 'High-Entropy / 高熵态',
};

export type Zone = 'latrine' | 'septic' | 'stone' | 'sediment';
export type Discipline = 'science' | 'engineering' | 'medical' | 'agriculture' | 'law_social' | 'humanities' | 'interdisciplinary';

export const ZONE_LABELS: Record<Zone, { en: string; cn: string; icon: string }> = {
  latrine: { en: 'The Latrine', cn: '旱厕', icon: '🚽' },
  septic: { en: 'Septic Tank', cn: '化粪池', icon: '🧪' },
  stone: { en: 'The Stone', cn: '构石', icon: '🪨' },
  sediment: { en: 'Sediment', cn: '沉淀区', icon: '🕳️' },
};

export const DISCIPLINE_LABELS: Record<Discipline, { en: string; cn: string }> = {
  interdisciplinary: { en: 'Interdisciplinary', cn: '交叉' },
  science: { en: 'Science', cn: '理' },
  engineering: { en: 'Engineering', cn: '工' },
  medical: { en: 'Medical', cn: '医' },
  agriculture: { en: 'Agriculture', cn: '农' },
  law_social: { en: 'Law & Social', cn: '法社' },
  humanities: { en: 'Humanities', cn: '文' },
};

export const ZONE_THRESHOLDS = {
  LATRINE_TO_SEPTIC_COUNT: 30,
  LATRINE_TO_SEPTIC_SCORE: 3.8,
  SEPTIC_TO_STONE_COUNT: 100,
  SEPTIC_TO_STONE_SCORE: 4.5,
  SNIFFER_BADGE_THRESHOLD: 20,
} as const;
