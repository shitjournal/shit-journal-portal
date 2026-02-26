import React from 'react';

const GUARDS = [
  {
    name: 'Dr.S.H.I.T',
    avatar: null,
    emoji: '\u{1F4A9}',
    role: 'Chief Scooper',
    roleCn: '首席铲屎官',
    bio: 'Founder & Editor-in-Chief. Dedicated to scooping the finest academic contributions from the depths.',
    bioCn: '创始人兼主编。致力于从深处铲出最优质的学术贡献。',
  },
  {
    name: '魔芋OwO',
    avatar: '/moyu-avatar.jpg',
    emoji: null,
    role: 'Scooper',
    roleCn: '铲屎官',
    bio: 'Community guardian and quality enforcer. Keeps the septic tank clean and the standards high.',
    bioCn: '社区守护者与质量把关人。保持发酵池清洁，维持高标准。',
  },
];

export const CommunityGuardPage: React.FC = () => (
  <div className="max-w-3xl mx-auto px-4 lg:px-8 py-12">
    <div className="mb-10">
      <h2 className="text-3xl font-serif font-bold mb-1">Community Guard</h2>
      <h3 className="chinese-serif text-xl text-charcoal-light">社区挑粪人</h3>
      <p className="text-sm text-gray-500 mt-3">
        The brave souls who keep the S.H.I.T flowing. / 维护学术粪池秩序的勇士们。
      </p>
    </div>

    <div className="grid gap-6 sm:grid-cols-2">
      {GUARDS.map((g) => (
        <div
          key={g.name}
          className="bg-white border border-gray-200 p-8 text-center hover:border-accent-gold transition-colors"
        >
          {g.avatar ? (
            <img
              src={g.avatar}
              alt={g.name}
              className="w-28 h-28 rounded-full mx-auto mb-5 object-cover border-4 border-gray-100"
            />
          ) : (
            <div className="w-28 h-28 rounded-full mx-auto mb-5 flex items-center justify-center bg-[#FFF8E1] border-4 border-gray-100">
              <span className="text-6xl leading-none">{g.emoji}</span>
            </div>
          )}

          <h3 className="text-xl font-serif font-bold mb-1">{g.name}</h3>

          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-accent-gold mb-4">
            {g.role} / {g.roleCn}
          </p>

          <p className="text-sm text-gray-600 leading-relaxed mb-2">{g.bio}</p>
          <p className="chinese-serif text-sm text-gray-400 leading-relaxed">{g.bioCn}</p>
        </div>
      ))}
    </div>

    <div className="mt-12 pt-8 border-t border-gray-100 text-center">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">
        S.H.I.T Journal — Community Guard Division
      </p>
    </div>
  </div>
);
