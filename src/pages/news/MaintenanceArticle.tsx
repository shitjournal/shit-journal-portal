import React from 'react';
import { Link } from 'react-router-dom';

export const MaintenanceArticle: React.FC = () => (
  <div className="max-w-3xl mx-auto px-4 lg:px-8 py-12">
    <Link
      to="/news"
      className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-accent-gold transition-colors mb-8 inline-block"
    >
      &larr; Back to News / 返回新闻
    </Link>

    <article>
      <div className="mb-8">
        <span className="text-[10px] font-bold text-science-red uppercase tracking-widest">Announcement / 公告</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold mt-2 mb-2">
          投稿通道暂时关闭，评论功能维护中
        </h1>
        <p className="text-gray-500 font-serif text-lg mb-2">Submissions Temporarily Closed, Comments Under Maintenance</p>
        <p className="text-sm text-gray-400">2026-03-03 · S.H.I.T Editorial</p>
      </div>

      <div className="border-l-4 border-accent-gold pl-6 mb-8">
        <p className="font-serif text-lg text-gray-700 leading-relaxed italic">
          暂时的关闭是为了未来更公平、更长久的存在。
        </p>
      </div>

      <div className="prose prose-charcoal max-w-none space-y-6">
        <div>
          <h2 className="text-xl font-serif font-bold mb-3">致各位石友</h2>
          <p className="text-sm text-charcoal leading-relaxed">
            说句心里话，我们做这个的初衷最开始真的只是整活。
          </p>
          <p className="text-sm text-charcoal leading-relaxed mt-3">
            但后来发现，原来这里也可以成为大家表达和释放的地方。看着后台涌入的几千的投稿，我们真的被震撼到了。但随之而来的，是内容开始变得有些不可控。所以我们不希望《SHIT》构石变成一个昙花一现的产物，而是真的很希望能够成为我们这一群人的社群。
          </p>
          <p className="text-sm text-charcoal leading-relaxed mt-3">
            因为有些人真的花了很大的功夫去写稿，我们不希望你们的付出白费。为了让这里能长久、健康地存在下去，我们目前要做以下几件事：
          </p>
        </div>

        <div className="bg-yellow-50 border border-accent-gold/30 p-6 space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-accent-gold font-bold text-lg leading-none mt-0.5">1</span>
            <div>
              <p className="text-sm text-charcoal font-bold">完善稿件、评论合规审查机制</p>
              <p className="text-sm text-gray-500 mt-1">面对不可控的内容增长，我们要建立起有效的保护机制。</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-accent-gold font-bold text-lg leading-none mt-0.5">2</span>
            <div>
              <p className="text-sm text-charcoal font-bold">完善评分系统</p>
              <p className="text-sm text-gray-500 mt-1">尽可能的让大家的稿件受到公平的对待，逐步靠近去中心化，不让好内容被埋没。</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-accent-gold font-bold text-lg leading-none mt-0.5">3</span>
            <div>
              <p className="text-sm text-charcoal font-bold">完善功能上的不足</p>
              <p className="text-sm text-gray-500 mt-1">增加更多的交互和更多的玩法，让社群更有生命力。</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-serif font-bold mb-3">具体措施</h2>
          <div className="space-y-4">
            <div className="border-l-2 border-science-red pl-5">
              <p className="text-sm text-charcoal font-bold">投稿入口暂时关闭</p>
              <p className="text-sm text-gray-500 mt-1">
                目前我们正在全力闭关开发。投稿通道暂时关闭，不用担心——你们已经投的稿件，后期审核之后都会再上线。
              </p>
            </div>
            <div className="border-l-2 border-science-red pl-5">
              <p className="text-sm text-charcoal font-bold">评论功能维护中</p>
              <p className="text-sm text-gray-500 mt-1">
                评论功能暂时关闭，后续会接入内容审核机制，确保评论区的健康生态。
              </p>
            </div>
            <div className="border-l-2 border-green-500 pl-5">
              <p className="text-sm text-charcoal font-bold">评分功能正常开放</p>
              <p className="text-sm text-gray-500 mt-1">
                阅读和评分功能一切正常。欢迎继续为旱厕中的稿件评分，帮助它们毕业。
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-serif font-bold mb-3">已投稿件怎么办？</h2>
          <p className="text-sm text-charcoal leading-relaxed">
            所有已提交的稿件都安全保存在系统中。维护期间，编辑团队会逐步对已有稿件进行合规审查。审核通过的稿件会正常上线进入旱厕评分流程。请各位作者耐心等待，你们的付出不会白费。
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 p-6">
          <p className="text-sm text-charcoal leading-relaxed">
            <strong>SHIT是所有人的SHIT。</strong>如果你有什么建议，欢迎前往投稿页面留言，我们会认真阅读每一条反馈。
          </p>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500 mb-4">
          有建议？前往留言板告诉我们
        </p>
        <Link
          to="/submit"
          className="inline-block px-10 py-4 bg-accent-gold text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B18E26] transition-colors shadow-lg"
        >
          Leave Feedback / 前往留言
        </Link>
      </div>

      <div className="mt-8 text-right">
        <p className="font-serif text-gray-500">—— 《SHIT》构石 敬上</p>
      </div>
    </article>
  </div>
);
