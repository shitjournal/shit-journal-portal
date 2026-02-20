import React from 'react';

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
          排泄物在 500 倍显微镜下的样子 / Excrement under a 500x microscope
        </div>
      </div>

      <div className="flex flex-col h-full">
        <h4 className="text-3xl sm:text-4xl font-serif font-bold leading-tight mb-2 hover:text-accent-gold transition-colors cursor-pointer">
          A Manifesto for Academic Rubbish
        </h4>
        <h5 className="text-xl sm:text-2xl chinese-serif font-bold text-gray-500 mb-6">学术糟粕宣言</h5>
        <p className="font-serif text-lg text-gray-700 leading-relaxed mb-8 italic">
          他们追求真理，却在真理的排泄物面前掩鼻而过。《SHIT》的诞生，是为了建立一个前卫的学术避难所。我们拒绝平庸的真理，我们只欢迎那些经过严谨同行评审的、最纯粹的思维垃圾。无论是在结肠中孕育的灵感，还是在PPT架构中迷失的灵魂，都将在本刊获得永生。
        </p>
        <div className="mt-auto border-t border-gray-100 pt-4">
          <span className="text-accent-gold font-bold uppercase text-xs tracking-widest">
            —— 首席奥力给院士：Dr. Shit
          </span>
        </div>
      </div>
    </div>
  </section>
);
