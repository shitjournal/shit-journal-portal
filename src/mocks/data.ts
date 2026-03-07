export type MockRole = 'author' | 'reviewer' | 'community_guard' | 'editor' | 'admin' | 'super_admin';

export interface MockUser {
  id: string;
  email: string;
  display_name: string;
  institution: string | null;
  social_media: string | null;
  avatar_url: string | null;
  role: MockRole;
  created_at: string;
  author_badge: 'stone' | 'septic' | null;
  is_sniffer_today: boolean;
}

export interface MockArticle {
  id: string;
  title: string;
  manuscript_title: string;
  tag: string;
  discipline: string;
  status: string;
  created_at: string;
  topic: string | null;
  avg_score: number;
  weighted_score: number;
  rating_count: number;
  co_authors: Array<{
    name: string;
    email: string;
    institution: string;
    contribution: 'co-first' | 'other';
  }>;
  author: {
    id: string;
    display_name: string;
    institution: string | null;
    social_media: string | null;
    email: string;
  };
  suggestions?: string;
  pdf_url: string;
  file_path: string;
  file_name: string;
  file_size_bytes: number;
}

export interface MockComment {
  id: string;
  article_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  like_count: number;
  hidden: boolean;
  user: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  };
}

export interface MockNotification {
  id: string;
  target_user_id: string;
  type: string;
  is_read: boolean;
  created_at: string;
  actor: { id: string; display_name: string; avatar_url: string | null } | null;
  article: { id: string; title: string } | null;
  comment: { id: string; content: string } | null;
}

export interface MockFeedback {
  id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    display_name: string;
    email: string;
  } | null;
}

export interface MockDatabase {
  users: MockUser[];
  articles: MockArticle[];
  comments: MockComment[];
  notifications: MockNotification[];
  feedback: MockFeedback[];
  sessions: Record<string, string>;
}

const isoFromNow = (daysAgo: number, hourOffset = 0) => {
  const value = new Date();
  value.setDate(value.getDate() - daysAgo);
  value.setHours(value.getHours() - hourOffset);
  return value.toISOString();
};

const LOCAL_DAIYU_PDF_PATH = '/探究林黛玉的真实武力值以及她长期被树立为弱不禁风形象的深层原因——由一系列网络meme视频所触发的思考.pdf';

export const DEMO_ACCOUNTS = [
  { email: 'bukolosier@gmail.com', password: 'mock123456', role: 'super_admin', label: 'Super Admin' },
  { email: 'editor@shitjournal.org', password: 'mock123456', role: 'editor', label: 'Editor' },
  { email: 'admin@shitjournal.org', password: 'mock123456', role: 'admin', label: 'Admin' },
  { email: 'author@shitjournal.org', password: 'mock123456', role: 'author', label: 'Author' },
] as const;

const users: MockUser[] = [
  {
    id: 'user-kl',
    email: 'bukolosier@gmail.com',
    display_name: 'KL',
    institution: 'Bowel Systems Lab',
    social_media: '@bukolosier',
    avatar_url: null,
    role: 'super_admin',
    created_at: isoFromNow(120),
    author_badge: 'stone',
    is_sniffer_today: true,
  },
  {
    id: 'user-editor',
    email: 'editor@shitjournal.org',
    display_name: 'Editor Jiang',
    institution: 'Scooper Review Board',
    social_media: '@editorjiang',
    avatar_url: null,
    role: 'editor',
    created_at: isoFromNow(95),
    author_badge: null,
    is_sniffer_today: false,
  },
  {
    id: 'user-admin',
    email: 'admin@shitjournal.org',
    display_name: 'Admin Liu',
    institution: 'Moderation Desk',
    social_media: '@adminliu',
    avatar_url: null,
    role: 'admin',
    created_at: isoFromNow(80),
    author_badge: null,
    is_sniffer_today: false,
  },
  {
    id: 'user-author',
    email: 'author@shitjournal.org',
    display_name: 'Dr. Flush',
    institution: 'Institute of Gastro Studies',
    social_media: '@drflush',
    avatar_url: null,
    role: 'author',
    created_at: isoFromNow(60),
    author_badge: 'septic',
    is_sniffer_today: false,
  },
  {
    id: 'user-commenter',
    email: 'commenter@shitjournal.org',
    display_name: 'Prof. Fiber',
    institution: 'Fiber Analytics Center',
    social_media: '@proffiber',
    avatar_url: null,
    role: 'reviewer',
    created_at: isoFromNow(30),
    author_badge: null,
    is_sniffer_today: false,
  },
];

const articles: MockArticle[] = [
  {
    id: 'art-latrine-1',
    title: 'Benchmarking Latrine Throughput Under Conference Deadline Stress',
    manuscript_title: 'Benchmarking Latrine Throughput Under Conference Deadline Stress',
    tag: 'hardcore',
    discipline: 'engineering',
    status: 'passed',
    created_at: isoFromNow(2, 3),
    topic: 'S.H.I.T社区治理1.0',
    avg_score: 4.1,
    weighted_score: 4.03,
    rating_count: 12,
    co_authors: [
      {
        name: 'Assoc. Prof. Pan',
        email: 'pan@shitjournal.org',
        institution: 'Transit Toilet Lab',
        contribution: 'co-first',
      },
    ],
    author: {
      id: 'user-author',
      display_name: 'Dr. Flush',
      institution: 'Institute of Gastro Studies',
      social_media: '@drflush',
      email: 'author@shitjournal.org',
    },
    pdf_url: '/mock-manuscript.pdf',
    file_path: '/mock-manuscript.pdf',
    file_name: 'latrine-throughput.pdf',
    file_size_bytes: 182344,
  },
  {
    id: 'art-latrine-long-en-1',
    title: 'A Multi-Site Observational Reassessment of Whether Reheating Office Pizza at 02:13 AM Predictably Improves Reviewer Generosity, Response Latency, and Marginal Citation Performance Under Mild Social Embarrassment',
    manuscript_title: 'A Multi-Site Observational Reassessment of Whether Reheating Office Pizza at 02:13 AM Predictably Improves Reviewer Generosity, Response Latency, and Marginal Citation Performance Under Mild Social Embarrassment',
    tag: 'hardcore',
    discipline: 'interdisciplinary',
    status: 'passed',
    created_at: isoFromNow(0, 1),
    topic: 'Layout Regression Probe',
    avg_score: 4.32,
    weighted_score: 4.21,
    rating_count: 7,
    co_authors: [],
    author: {
      id: 'user-commenter',
      display_name: 'Prof. Fiber',
      institution: 'Fiber Analytics Center',
      social_media: '@proffiber',
      email: 'commenter@shitjournal.org',
    },
    pdf_url: '/mock-manuscript.pdf',
    file_path: '/mock-manuscript.pdf',
    file_name: 'long-title-pizza-reviewers.pdf',
    file_size_bytes: 245112,
  },
  {
    id: 'art-latrine-long-cn-1',
    title: '基于临床观察的头孢类抗生素与小麦制饮品低成本口服式即时肤色调控技术对人体肤色亮度提升及其不可逆副作用的可行性研究及其社会学意义',
    manuscript_title: '基于临床观察的头孢类抗生素与小麦制饮品低成本口服式即时肤色调控技术对人体肤色亮度提升及其不可逆副作用的可行性研究及其社会学意义（原《同时服用头孢和啤酒可以短期内让人皮肤变白原理》）',
    tag: 'meme',
    discipline: 'medical',
    status: 'passed',
    created_at: isoFromNow(0, 4),
    topic: 'Clinical Meme Translation',
    avg_score: 4.67,
    weighted_score: 4.58,
    rating_count: 12,
    co_authors: [],
    author: {
      id: 'user-author',
      display_name: '真名',
      institution: '皇家新国立柯基大',
      social_media: '@drflush',
      email: 'author@shitjournal.org',
    },
    pdf_url: '/mock-manuscript.pdf',
    file_path: '/mock-manuscript.pdf',
    file_name: 'long-title-cephalosporin-beer.pdf',
    file_size_bytes: 238001,
  },
  {
    id: 'art-septic-1',
    title: 'Bayesian Ranking of Peer-Reviewed Excretions in Shared Academic Toilets',
    manuscript_title: 'Bayesian Ranking of Peer-Reviewed Excretions in Shared Academic Toilets',
    tag: 'hardcore',
    discipline: 'science',
    status: 'passed',
    created_at: isoFromNow(6, 5),
    topic: null,
    avg_score: 4.25,
    weighted_score: 4.18,
    rating_count: 46,
    co_authors: [],
    author: {
      id: 'user-commenter',
      display_name: 'Prof. Fiber',
      institution: 'Fiber Analytics Center',
      social_media: '@proffiber',
      email: 'commenter@shitjournal.org',
    },
    pdf_url: '/mock-manuscript.pdf',
    file_path: '/mock-manuscript.pdf',
    file_name: 'bayesian-ranking.pdf',
    file_size_bytes: 224108,
  },
  {
    id: 'art-septic-long-cn-1',
    title: '医院大门或降低人类智力：基于现代医患矛盾发生的综述与一项关于挂号窗口排队行为的初步行为经济学补充说明',
    manuscript_title: '医院大门或降低人类智力：基于现代医患矛盾发生的综述与一项关于挂号窗口排队行为的初步行为经济学补充说明',
    tag: 'meme',
    discipline: 'medical',
    status: 'passed',
    created_at: isoFromNow(5, 2),
    topic: null,
    avg_score: 4.81,
    weighted_score: 4.74,
    rating_count: 140,
    co_authors: [],
    author: {
      id: 'user-admin',
      display_name: '聆春意',
      institution: 'North Market Slope Medical College',
      social_media: '@adminliu',
      email: 'admin@shitjournal.org',
    },
    pdf_url: '/mock-manuscript.pdf',
    file_path: '/mock-manuscript.pdf',
    file_name: 'long-title-hospital-gate-intelligence.pdf',
    file_size_bytes: 212450,
  },
  {
    id: 'art-stone-1',
    title: 'A Canonical Theory of Crystallized Academic Waste',
    manuscript_title: 'A Canonical Theory of Crystallized Academic Waste',
    tag: 'hardcore',
    discipline: 'humanities',
    status: 'passed',
    created_at: isoFromNow(21, 4),
    topic: null,
    avg_score: 4.82,
    weighted_score: 4.74,
    rating_count: 128,
    co_authors: [],
    author: {
      id: 'user-kl',
      display_name: 'KL',
      institution: 'Bowel Systems Lab',
      social_media: '@bukolosier',
      email: 'bukolosier@gmail.com',
    },
    pdf_url: '/mock-manuscript.pdf',
    file_path: '/mock-manuscript.pdf',
    file_name: 'canonical-theory.pdf',
    file_size_bytes: 301255,
  },
  {
    id: 'art-stone-long-cn-1',
    title: '「她是不是喜欢我？」信号误判率的贝叶斯更新模型与认知偏差修正机制——一种多轮社交博弈的概率收敛分析',
    manuscript_title: '「她是不是喜欢我？」信号误判率的贝叶斯更新模型与认知偏差修正机制——一种多轮社交博弈的概率收敛分析',
    tag: 'meme',
    discipline: 'interdisciplinary',
    status: 'passed',
    created_at: isoFromNow(4, 3),
    topic: 'Longform Debate',
    avg_score: 4.82,
    weighted_score: 4.82,
    rating_count: 128,
    co_authors: [],
    author: {
      id: 'user-kl',
      display_name: '特种兵溜娃',
      institution: '清醒点行为经济学联合研究中心',
      social_media: '@bukolosier',
      email: 'bukolosier@gmail.com',
    },
    pdf_url: '/mock-manuscript.pdf',
    file_path: '/mock-manuscript.pdf',
    file_name: 'long-title-bayesian-crush.pdf',
    file_size_bytes: 278320,
  },
  {
    id: 'art-sediment-1',
    title: 'Negative Externalities of Over-Flushing Draft Manuscripts',
    manuscript_title: 'Negative Externalities of Over-Flushing Draft Manuscripts',
    tag: 'meme',
    discipline: 'law_social',
    status: 'passed',
    created_at: isoFromNow(9, 2),
    topic: null,
    avg_score: 3.05,
    weighted_score: 3.11,
    rating_count: 38,
    co_authors: [],
    author: {
      id: 'user-admin',
      display_name: 'Admin Liu',
      institution: 'Moderation Desk',
      social_media: '@adminliu',
      email: 'admin@shitjournal.org',
    },
    pdf_url: '/mock-manuscript.pdf',
    file_path: '/mock-manuscript.pdf',
    file_name: 'over-flushing.pdf',
    file_size_bytes: 166512,
  },
  {
    id: 'art-sediment-long-en-1',
    title: 'Toward a General Theory of Why Sending Twelve Consecutive Follow-Up Emails to a Potential Coauthor Does Not, in Practice, Increase Reply Probability, Mutual Trust, or the Likelihood of a Shared Grant Application',
    manuscript_title: 'Toward a General Theory of Why Sending Twelve Consecutive Follow-Up Emails to a Potential Coauthor Does Not, in Practice, Increase Reply Probability, Mutual Trust, or the Likelihood of a Shared Grant Application',
    tag: 'hardcore',
    discipline: 'law_social',
    status: 'passed',
    created_at: isoFromNow(7, 1),
    topic: 'Inbox Overfitting',
    avg_score: 3.18,
    weighted_score: 3.24,
    rating_count: 61,
    co_authors: [],
    author: {
      id: 'user-editor',
      display_name: 'Editor Jiang',
      institution: 'Scooper Review Board',
      social_media: '@editorjiang',
      email: 'editor@shitjournal.org',
    },
    pdf_url: '/mock-manuscript.pdf',
    file_path: '/mock-manuscript.pdf',
    file_name: 'long-title-follow-up-emails.pdf',
    file_size_bytes: 231044,
  },
  {
    id: 'art-daiyu-1',
    title: '探究林黛玉的真实武力值以及她长期被树立为弱不禁风形象的深层原因',
    manuscript_title: '探究林黛玉的真实武力值以及她长期被树立为弱不禁风形象的深层原因——由一系列网络meme视频所触发的思考',
    tag: 'meme',
    discipline: 'humanities',
    status: 'passed',
    created_at: isoFromNow(3, 4),
    topic: '红楼梦 meme 研究',
    avg_score: 4.48,
    weighted_score: 4.36,
    rating_count: 34,
    co_authors: [],
    author: {
      id: 'user-kl',
      display_name: 'KL',
      institution: 'Bowel Systems Lab',
      social_media: '@bukolosier',
      email: 'bukolosier@gmail.com',
    },
    pdf_url: LOCAL_DAIYU_PDF_PATH,
    file_path: LOCAL_DAIYU_PDF_PATH,
    file_name: '探究林黛玉的真实武力值以及她长期被树立为弱不禁风形象的深层原因——由一系列网络meme视频所触发的思考.pdf',
    file_size_bytes: 851192,
  },
  {
    id: 'art-pending-1',
    title: 'Mock-Ready Submission for Screening',
    manuscript_title: 'Mock-Ready Submission for Screening',
    tag: 'hardcore',
    discipline: 'interdisciplinary',
    status: 'pending',
    created_at: isoFromNow(1, 1),
    topic: 'S.H.I.T社区治理1.0',
    avg_score: 0,
    weighted_score: 0,
    rating_count: 0,
    co_authors: [],
    author: {
      id: 'user-kl',
      display_name: 'KL',
      institution: 'Bowel Systems Lab',
      social_media: '@bukolosier',
      email: 'bukolosier@gmail.com',
    },
    suggestions: '',
    pdf_url: '/mock-manuscript.pdf',
    file_path: '/mock-manuscript.pdf',
    file_name: 'mock-ready-screening.pdf',
    file_size_bytes: 121400,
  },
  {
    id: 'art-revisions-1',
    title: 'Revision Needed: Ceramic Durability of The Stone',
    manuscript_title: 'Revision Needed: Ceramic Durability of The Stone',
    tag: 'hardcore',
    discipline: 'engineering',
    status: 'revisions',
    created_at: isoFromNow(4, 7),
    topic: null,
    avg_score: 0,
    weighted_score: 0,
    rating_count: 0,
    co_authors: [],
    author: {
      id: 'user-kl',
      display_name: 'KL',
      institution: 'Bowel Systems Lab',
      social_media: '@bukolosier',
      email: 'bukolosier@gmail.com',
    },
    suggestions: 'Please add a stronger discussion of load-bearing performance.',
    pdf_url: '/mock-manuscript.pdf',
    file_path: '/mock-manuscript.pdf',
    file_name: 'stone-durability.pdf',
    file_size_bytes: 214987,
  },
  {
    id: 'art-flushed-1',
    title: 'Desk-Flushed Case Study for Moderator Review',
    manuscript_title: 'Desk-Flushed Case Study for Moderator Review',
    tag: 'meme',
    discipline: 'agriculture',
    status: 'flushed',
    created_at: isoFromNow(12, 2),
    topic: null,
    avg_score: 0,
    weighted_score: 0,
    rating_count: 0,
    co_authors: [],
    author: {
      id: 'user-author',
      display_name: 'Dr. Flush',
      institution: 'Institute of Gastro Studies',
      social_media: '@drflush',
      email: 'author@shitjournal.org',
    },
    suggestions: 'The premise currently reads as satire without a method section.',
    pdf_url: '/mock-manuscript.pdf',
    file_path: '/mock-manuscript.pdf',
    file_name: 'desk-flushed.pdf',
    file_size_bytes: 109000,
  },
  {
    id: 'art-hidden-1',
    title: 'Temporarily Hidden Article for Admin Restore Flow',
    manuscript_title: 'Temporarily Hidden Article for Admin Restore Flow',
    tag: 'meme',
    discipline: 'science',
    status: 'hidden',
    created_at: isoFromNow(14, 6),
    topic: null,
    avg_score: 3.4,
    weighted_score: 3.3,
    rating_count: 17,
    co_authors: [],
    author: {
      id: 'user-commenter',
      display_name: 'Prof. Fiber',
      institution: 'Fiber Analytics Center',
      social_media: '@proffiber',
      email: 'commenter@shitjournal.org',
    },
    suggestions: 'Hidden after repeated user reports.',
    pdf_url: '/mock-manuscript.pdf',
    file_path: '/mock-manuscript.pdf',
    file_name: 'hidden-article.pdf',
    file_size_bytes: 187000,
  },
];

const comments: MockComment[] = [
  {
    id: 'comment-1',
    article_id: 'art-latrine-1',
    parent_id: null,
    content: 'This is the cleanest randomized bowel trial I have seen this quarter.',
    created_at: isoFromNow(1, 2),
    like_count: 4,
    hidden: false,
    user: { id: 'user-commenter', display_name: 'Prof. Fiber', avatar_url: null },
  },
  {
    id: 'comment-2',
    article_id: 'art-latrine-1',
    parent_id: 'comment-1',
    content: 'Agreed. The sample preparation section is surprisingly rigorous.',
    created_at: isoFromNow(1, 1),
    like_count: 2,
    hidden: false,
    user: { id: 'user-admin', display_name: 'Admin Liu', avatar_url: null },
  },
  {
    id: 'comment-3',
    article_id: 'art-septic-1',
    parent_id: null,
    content: 'The Bayesian prior is funny, but the math still holds.',
    created_at: isoFromNow(3, 3),
    like_count: 5,
    hidden: false,
    user: { id: 'user-kl', display_name: 'KL', avatar_url: null },
  },
  {
    id: 'comment-hidden-1',
    article_id: 'art-septic-1',
    parent_id: null,
    content: 'This comment was hidden by moderation for testing the restore flow.',
    created_at: isoFromNow(2, 4),
    like_count: 0,
    hidden: true,
    user: { id: 'user-author', display_name: 'Dr. Flush', avatar_url: null },
  },
];

const notifications: MockNotification[] = [
  {
    id: 'notif-1',
    target_user_id: 'user-kl',
    type: 'reply',
    is_read: false,
    created_at: isoFromNow(0, 2),
    actor: { id: 'user-commenter', display_name: 'Prof. Fiber', avatar_url: null },
    article: { id: 'art-latrine-1', title: 'Benchmarking Latrine Throughput Under Conference Deadline Stress' },
    comment: { id: 'comment-2', content: 'Agreed. The sample preparation section is surprisingly rigorous.' },
  },
  {
    id: 'notif-2',
    target_user_id: 'user-kl',
    type: 'like',
    is_read: false,
    created_at: isoFromNow(0, 5),
    actor: { id: 'user-admin', display_name: 'Admin Liu', avatar_url: null },
    article: { id: 'art-septic-1', title: 'Bayesian Ranking of Peer-Reviewed Excretions in Shared Academic Toilets' },
    comment: { id: 'comment-3', content: 'The Bayesian prior is funny, but the math still holds.' },
  },
  {
    id: 'notif-3',
    target_user_id: 'user-kl',
    type: 'new_comment',
    is_read: true,
    created_at: isoFromNow(4, 1),
    actor: { id: 'user-author', display_name: 'Dr. Flush', avatar_url: null },
    article: { id: 'art-pending-1', title: 'Mock-Ready Submission for Screening' },
    comment: { id: 'comment-4', content: 'When will screening finish?' },
  },
];

const feedback: MockFeedback[] = [
  {
    id: 'feedback-1',
    content: 'Mock environment is much faster for polishing the dashboard states.',
    created_at: isoFromNow(1, 3),
    user: {
      id: 'user-kl',
      display_name: 'KL',
      email: 'bukolosier@gmail.com',
    },
  },
  {
    id: 'feedback-2',
    content: 'Please keep the maintenance notice configurable in one place.',
    created_at: isoFromNow(3, 2),
    user: {
      id: 'user-editor',
      display_name: 'Editor Jiang',
      email: 'editor@shitjournal.org',
    },
  },
];

export function createInitialMockDatabase(): MockDatabase {
  return {
    users: structuredClone(users),
    articles: structuredClone(articles),
    comments: structuredClone(comments),
    notifications: structuredClone(notifications),
    feedback: structuredClone(feedback),
    sessions: {},
  };
}
