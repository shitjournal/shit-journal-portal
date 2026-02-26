import React from 'react';
import { Link } from 'react-router-dom';
import { NEWS } from '../../constants';
import { JournalMetrics } from '../../components/sidebar/JournalMetrics';
import { COPEMember } from '../../components/sidebar/COPEMember';

export const HomeSidebar: React.FC = () => (
  <aside className="border-t lg:border-t-0 pt-8 lg:pt-0 lg:pl-12 lg:border-l border-gray-200">
    {/* Latest News */}
    <section className="mb-16">
      <div className="border-b-4 border-charcoal pb-1 mb-6">
        <h3 className="text-lg font-bold uppercase tracking-[0.1em]">Latest News / 最新动态</h3>
      </div>
      <div className="space-y-6">
        {NEWS.map((item, idx) => (
          <div key={idx} className="group cursor-pointer">
            <span className="text-[9px] font-bold text-science-red uppercase tracking-widest block mb-1">
              {item.date}
            </span>
            <h4 className="text-[16px] font-serif font-bold text-charcoal group-hover:text-accent-gold transition-colors leading-tight">
              {item.title}
            </h4>
            <p className="text-xs text-gray-500 mt-1 chinese-serif">{item.subtitle}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 text-right">
        <Link to="/news" className="text-[10px] font-bold text-science-red uppercase tracking-widest border-b border-transparent hover:border-science-red transition-all">
          More News / 更多新闻 ›
        </Link>
      </div>
    </section>

    <JournalMetrics />

    <section className="mb-12">
      <COPEMember />
    </section>

    <Link to="/submit" className="block w-full py-5 bg-accent-gold text-white text-xs font-bold uppercase tracking-[0.25em] hover:bg-[#B18E26] transition-colors shadow-lg text-center">
      SUBMIT S.H.I.T / 提交研究
    </Link>
  </aside>
);
