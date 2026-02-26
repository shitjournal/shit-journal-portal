import React from 'react';
import { Link } from 'react-router-dom';

export const GovernanceArticle: React.FC = () => (
  <div className="max-w-3xl mx-auto px-4 lg:px-8 py-12">
    <Link
      to="/news"
      className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-accent-gold transition-colors mb-8 inline-block"
    >
      &larr; Back to News / 返回新闻
    </Link>

    <article>
      <div className="mb-8">
        <span className="text-[10px] font-bold text-science-red uppercase tracking-widest">Call for Papers / 征稿启事</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold mt-2 mb-2">
          S.H.I.T 治理公约 1.0：学术去中心化方案征稿
        </h1>
        <p className="text-sm text-gray-400">2026-02-20 · S.H.I.T Editorial</p>
      </div>

      <div className="border-l-4 border-accent-gold pl-6 mb-8">
        <p className="font-serif text-lg text-gray-700 leading-relaxed italic">
          如果把编辑部的权力交还给社区，学术评价会变得更好还是更糟？我们需要你的方案。
        </p>
      </div>

      <div className="prose prose-charcoal max-w-none space-y-6">
        <div>
          <h2 className="text-xl font-serif font-bold mb-3">项目背景</h2>
          <p className="text-sm text-charcoal leading-relaxed">
            本社会实验旨在通过构建一套自运行的评价与治理逻辑，探讨在无行政干预、无传统同行评审（Peer Review）的环境下，学术平权与内容质量自治的可能性。
          </p>
        </div>

        <div className="bg-red-50 border border-science-red/20 p-5">
          <p className="text-sm text-science-red font-bold leading-relaxed">
            重要提示：本征稿不接受以 AI 为核心的治理方案。我们寻求的是人类社区自治逻辑，而非将决策外包给算法黑箱。
          </p>
        </div>

        <div>
          <h2 className="text-xl font-serif font-bold mb-3">结构建议：四大核心模块</h2>
          <p className="text-sm text-gray-500 mb-4">
            我们诚邀各位"嗅探兽"针对以下机制缺陷提交辩稿方案：
          </p>

          <div className="space-y-6">
            <div className="border-l-2 border-gray-200 pl-5">
              <h3 className="text-base font-serif font-bold mb-2">一、价值度量模块：贡献度的量化模型</h3>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-bold">研究课题：</span>如何精准定义创作者与嗅探兽（审稿人）的行为权重？
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-bold">方案要求：</span>设计一套博弈论模型，量化个人贡献，确保社区话语权随学术输出质量动态调整，而非受身份地位驱动。
              </p>
            </div>

            <div className="border-l-2 border-gray-200 pl-5">
              <h3 className="text-base font-serif font-bold mb-2">二、见刊判定模块：发酵池自动降解与晋升算法</h3>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-bold">研究课题：</span>稿件如何从预印本（Preprint Reservoir）自动转化为"已见刊"状态？
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-bold">方案要求：</span>设定"S.H.I.T 分数"的具体加权算法（包含阅读量、争议度、深度评价等），明确自动晋升的阈值。
              </p>
            </div>

            <div className="border-l-2 border-gray-200 pl-5">
              <h3 className="text-base font-serif font-bold mb-2">三、冲突解决机制：学术不端自动降解系统</h3>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-bold">研究课题：</span>在捍卫学术自由的同时，如何识别并清除真正的毒素？
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-bold">方案要求：</span>建立一套基于算法的"降解协议"，在无需编辑部介入的前提下，有效识别并处理人身攻击、涉及敏感或恶意灌水。
              </p>
            </div>

            <div className="border-l-2 border-gray-200 pl-5">
              <h3 className="text-base font-serif font-bold mb-2">四、资源配置模块：有限资源下的逻辑闭环</h3>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-bold">研究课题：</span>如何在低算力的极端环境下维持系统运行？
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-bold">方案要求：</span>提供一套自治的社群激励与技术运行方案，防止系统因过载或资源枯萎而崩塌。
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500 mb-4">
          投稿时请勾选「S.H.I.T社区治理1.0」专题约稿选项
        </p>
        <Link
          to="/submit"
          className="inline-block px-10 py-4 bg-accent-gold text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B18E26] transition-colors shadow-lg"
        >
          Submit Your Proposal / 提交方案
        </Link>
      </div>
    </article>
  </div>
);
