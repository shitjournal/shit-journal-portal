import React from 'react';
import { Link } from 'react-router-dom';

export const EditorialSection: React.FC = () => (
  <section className="mb-8 sm:mb-16">
    <div className="flex justify-between items-end border-b-4 border-charcoal pb-2 mb-8">
      <h3 className="text-3xl font-serif font-black uppercase tracking-tight text-charcoal">
        Editorial / 社论
      </h3>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vol 1. Issue 1</span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
      <div className="relative group overflow-hidden">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0wZEPrfaM4LzLQry_BlZW6H3BGY1JLBsHP9QAqyZIHaAH9rjLg5jMqwVqgzc0kfzdKEmFjcCBbQn-IViTxdZtOqb8wu-cbdlGTx5QgUQR2HNeFD9WMeFywdYaMZR_2H62a5HQaNOFbM2tgGP46TPIG8nodhww5WoTHdJYvdtwEopL44Qxqwm4RIcfDsl6o1UedDcVZ0vZzl9EEijur0lAQpMfKQcIdjL6TVU2utudSEzzO_3oSBPC0DlZ80NheBC4BbEqc8gCIw2P"
          alt="Editorial Feature"
          className="w-full aspect-[4/3] object-cover grayscale contrast-125 transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 bg-white/95 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider border-t border-r border-gray-300">
          学术自由在 500 倍显微镜下的样子 / Academic freedom under a 500x microscope
        </div>
      </div>

      <div className="flex flex-col h-full">
        <h4 className="text-3xl sm:text-4xl font-serif font-bold leading-tight mb-2 hover:text-accent-gold transition-colors cursor-pointer">
          A Manifesto for Academic Decentralization
        </h4>
        <h5 className="text-xl sm:text-2xl chinese-serif font-bold text-gray-500 mb-6">学术去中心化宣言</h5>
        <p className="font-serif text-lg text-gray-700 leading-relaxed mb-4 italic">
          《S.H.I.T》是一场社会实验。我们试图回答一个问题：如果把编辑部的权力交还给社区，学术评价会变得更好还是更糟？
        </p>
        <p className="font-serif text-base text-gray-600 leading-relaxed mb-6">
          在这里，没有大佬，没有学阀。每一篇稿件都进入发酵池，由社区公开评审、公开评分。好的思想会自己浮上来，坏的自然沉底。
        </p>
        <Link
          to="/news/governance-1.0"
          className="inline-flex items-center gap-1 text-sm font-bold text-accent-gold hover:text-charcoal transition-colors"
        >
          想参与社区自治？提交你的方案
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </Link>
      </div>
    </div>
  </section>
);
