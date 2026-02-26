export const NAV_LINKS_FULL = [
  { label: 'News', cn: '新闻', to: '/news' },
  { label: 'Preprints', cn: '发酵池', to: '/preprints' },
  { label: 'Submit', cn: '投稿', to: '/submit' },
  { label: 'Dashboard', cn: '仪表台', to: '/dashboard', authRequired: true, userMenuOnly: true },
  { label: 'Screening', cn: '预审稿', to: '/screening', authRequired: true, editorOnly: true, userMenuOnly: true },
  { label: 'Editorial Board', cn: '编委会', to: '/editorial-board' },
  { label: 'Journals', cn: '子刊', to: '/journals' },
];
