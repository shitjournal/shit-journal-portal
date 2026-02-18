
import React from 'react';
import { Layout } from './components/Layout';
import { NEWS, ARTICLES, METRICS } from './constants';
import { Article, Metric, NewsItem } from './types';

const HeroQuote: React.FC = () => (
  <div className="py-8 sm:py-16 text-center max-w-4xl mx-auto px-4 relative">
    <div className="w-full h-[1px] bg-gray-200 mb-8 sm:mb-12"></div>
    <div className="absolute top-[1.75rem] sm:top-[3.5rem] left-1/2 -translate-x-1/2 bg-paper px-6 z-10 text-4xl">
      💩
    </div>
    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal leading-tight">
      "Truth Fades, but Trash is Forever."
    </h2>
    <p className="mt-4 chinese-serif text-2xl text-charcoal-light font-medium tracking-wide">
      “真理会过时，但垃圾永远是垃圾。”
    </p>
    <div className="w-full h-[1px] bg-gray-200 mt-6 sm:mt-12"></div>
  </div>
);

const EditorialSection: React.FC = () => (
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
            —— 首席奥力给院士：Dr. Ouligei
          </span>
        </div>
      </div>
    </div>
  </section>
);

const CallForPapers: React.FC = () => (
  <section className="bg-[#FCFCFC] p-6 sm:p-10 border border-gray-200 mb-16 shadow-sm">
    <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
      <div className="max-w-2xl">
        <h6 className="text-xs font-bold text-science-red uppercase tracking-[0.2em] mb-3">Call for Papers / 征稿启事</h6>
        <h3 className="text-2xl font-serif font-bold text-charcoal mb-2">Topic: "DISCHARGE NOW" / 主题：“立即排泄”</h3>
        <p className="text-base text-gray-500 font-sans">
          Collecting the soul-remnants floating between 'Academic Breakthrough' and 'Pure Rubbish'. <br/>
          我们收容那些介于‘学术突破’与‘纯粹垃圾’之间的灵魂边角料。
        </p>
      </div>
      <button className="flex-shrink-0 w-full md:w-auto px-8 py-4 bg-white border-2 border-charcoal text-xs font-bold uppercase tracking-widest hover:bg-charcoal hover:text-white transition-all shadow-md">
        Submit Manuscript / 提交手稿
      </button>
    </div>
  </section>
);

const ArticleRow: React.FC<{ article: Article }> = ({ article }) => (
  <div className="group pt-8 pb-8 border-b border-gray-100 last:border-0">
    <div className="flex gap-4 sm:gap-8 items-start">
      <div className="flex-1">
        <span className={`inline-block px-2 py-1 border text-[9px] font-bold uppercase tracking-widest mb-3 ${article.type === 'Original Research' ? 'border-accent-gold text-accent-gold' : 'border-gray-400 text-gray-500'}`}>
          {article.type} / {article.type === 'Original Research' ? '原创研究' : '综述'}
        </span>
        <h4 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal mb-1 group-hover:text-accent-gold transition-colors cursor-pointer leading-tight">
          {article.title}
        </h4>
        <h5 className="text-xl chinese-serif text-gray-400 mb-4">{article.chineseTitle}</h5>
        <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">{article.description}</p>
        <div className="flex flex-wrap items-center text-[10px] font-bold text-gray-400 gap-3 uppercase tracking-wider">
          <span className="text-charcoal">{article.authors}</span>
          <span>•</span>
          <span>DOI: {article.doi}</span>
        </div>
      </div>
      {article.imageUrl && (
        <div className="w-48 h-32 hidden lg:block overflow-hidden border border-gray-100 mt-9">
          <img src={article.imageUrl} alt="Abstract" className="w-full h-full object-cover mix-blend-multiply opacity-80" />
        </div>
      )}
    </div>
  </div>
);

const Sidebar: React.FC = () => (
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
        <a href="#" className="text-[10px] font-bold text-science-red uppercase tracking-widest border-b border-transparent hover:border-science-red transition-all">
          More News / 更多新闻 ›
        </a>
      </div>
    </section>

    {/* Journal Metrics */}
    <section className="mb-16">
      <div className="border-b border-gray-200 pb-1 mb-8">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Journal Metrics / 期刊指标</h3>
      </div>
      <div className="grid grid-cols-2 gap-y-10 gap-x-4 max-w-xs mx-auto lg:max-w-none lg:mx-0">
        {METRICS.map((metric, idx) => (
          <div key={idx}>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              {metric.label} / {metric.labelCn}
            </p>
            <p className="text-3xl font-serif font-bold text-charcoal">
              {metric.value} {metric.unit && <span className="text-xs font-normal text-gray-300 ml-1">{metric.unit}</span>}
            </p>
          </div>
        ))}
      </div>
    </section>

    {/* Accreditation */}
    <section className="mb-12">
      <div className="bg-white border border-gray-200 p-8 text-center shadow-sm">
        <div className="flex justify-center gap-4 mb-6">
          <span className="text-5xl">💩</span>
          <span className="text-5xl">👃</span>
        </div>
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal mb-2">COPE MEMBER / 会员</h4>
        <p className="text-[11px] font-serif text-gray-500 leading-relaxed">
          Committee on Professional Excrement ethics. <br/>
          专业排泄物伦理委员会。
        </p>
      </div>
    </section>

    <button className="w-full py-5 bg-accent-gold text-white text-xs font-bold uppercase tracking-[0.25em] hover:bg-[#B18E26] transition-colors shadow-lg">
      Submit Research / 提交研究
    </button>
  </aside>
);

const App: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-24">
        <HeroQuote />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-8">
            <EditorialSection />
            <CallForPapers />
            
            <section className="mb-2 sm:mb-16">
              <div className="border-b-2 border-charcoal pb-1 mb-6">
                <h3 className="text-xl font-bold uppercase tracking-[0.1em]">Research Articles / 研究论文</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {ARTICLES.map((article) => (
                  <ArticleRow key={article.id} article={article} />
                ))}
              </div>
              
              <div className="mt-6 sm:mt-12 text-center border-t border-gray-100 pt-4 sm:pt-8">
                <a href="#" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-accent-gold hover:text-charcoal transition-all">
                  View All Research / 查看所有研究
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>
            </section>
          </div>
          
          <div className="lg:col-span-4">
            <Sidebar />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;
