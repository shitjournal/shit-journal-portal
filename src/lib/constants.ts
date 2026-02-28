export const STATUS_LABELS: Record<string, { en: string; cn: string; color: string }> = {
  pending: { en: 'Screening', cn: '待预审', color: 'bg-gray-100 text-gray-500' },
  under_review: { en: 'Scooper Review', cn: '铲屎官评审中', color: 'bg-yellow-50 text-yellow-700' },
  revisions_requested: { en: 'Revisions Requested', cn: '需要修改', color: 'bg-blue-50 text-blue-700' },
  accepted: { en: 'Approved for Flush', cn: '批准冲水', color: 'bg-green-50 text-green-700' },
  rejected: { en: 'Clogged', cn: '堵塞了', color: 'bg-red-50 text-red-700' },
  flushed: { en: 'Desk Flushed', cn: '直接冲掉', color: 'bg-red-50 text-red-500' },
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
