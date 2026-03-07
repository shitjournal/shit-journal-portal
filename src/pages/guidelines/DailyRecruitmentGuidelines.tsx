import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export const DailyRecruitmentGuidelines: React.FC = () => {
  // 每次进入页面自动滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
  <div className="min-h-screen bg-gray-50 py-12 md:py-20">
    <div className="max-w-4xl mx-auto px-4 lg:px-8">
      
      {/* 返回按钮 */}
      <Link to="/" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-accent-gold mb-8 inline-block transition-colors">
        ← Back to Home
      </Link>

      {/* 文书主体 */}
      <div className="bg-white border border-gray-300 p-8 md:p-16 shadow-sm">
        
        {/* 标头区域 */}
        <div className="border-b-2 border-charcoal pb-8 mb-8 text-center">
          <h1 className="text-3xl font-serif font-bold text-charcoal mb-4 tracking-tight">SHIT Journal 每日录用准则</h1>
          <div className="flex justify-center gap-6 text-sm text-gray-500 font-mono">
            <span>版本号: v1.0</span>
            <span>生效日期: 2026/03/08</span>
          </div>
        </div>

        {/* 正文区域 */}
        <div className="prose prose-sm md:prose-base max-w-none text-charcoal leading-loose text-justify">
          
          <p className="font-bold mb-8 italic text-gray-600">
            “为了确保每一份优质学术成果都能在信息的洪流中获得应有的关注，我们建立了这套动态录用与审核机制。”
          </p>

          {/* 第一部分 */}
          <h2 className="text-xl font-bold mt-10 mb-6 text-charcoal flex items-center">
            <span className="mr-3 text-gray-300 font-serif">01</span> 第一条：制定目的
          </h2>
          <p className="mb-8">
            为提升读者可见性与内容质量，避免稿件因投稿量过大而被埋没，并保障每日优质作品获得充分展示，本刊特制定本《每日录用准则》。我们旨在平衡社区活力与内容深度，构建一个高信噪比的学术交流空间。
          </p>

          <hr className="my-8 border-gray-100" />

          {/* 第二部分 */}
          <h2 className="text-xl font-bold mt-10 mb-6 text-charcoal flex items-center">
            <span className="mr-3 text-gray-300 font-serif">02</span> 第二条：投稿频率限制
          </h2>
          <div className="pl-4 space-y-4 text-gray-700 border-l-2 border-gray-100">
            <p>
              <span className="font-bold text-charcoal">2.1 单日上限：</span> 每个用户（以唯一账号为准）在每自然日内最多仅可投稿 <span className="underline decoration-accent-gold decoration-2">1 篇</span> 稿件。
            </p>
            <p>
              <span className="font-bold text-charcoal">2.2 重复投稿认定：</span> 同一自然日内针对同一内容或通过多账号重复投稿等规避行为，均视为违反本条规定。
            </p>
          </div>

          {/* 第三部分 */}
          <h2 className="text-xl font-bold mt-10 mb-6 text-charcoal flex items-center">
            <span className="mr-3 text-gray-300 font-serif">03</span> 第三条：每日接收名额
          </h2>
          <div className="pl-4 space-y-4 text-gray-700 border-l-2 border-gray-100">
            <p>
              <span className="font-bold text-charcoal">3.1 审核准入制：</span> 本刊每日仅接收当日投稿队列中的 <span className="font-mono font-bold text-accent-gold">前 500 篇</span> 进入审核流程与当日候选池。
            </p>
            <p>
              <span className="font-bold text-charcoal">3.2 熔断机制：</span> 超过当日名额的投稿将无法成功上传。作者需待系统于次日重新开放后再次尝试。
            </p>
            <p>
              <span className="font-bold text-charcoal">3.3 时间基准：</span> 每日名额的起止时间以本刊系统显示的自然日（00:00 – 23:59）为准。
            </p>
          </div>

          {/* 第四部分 */}
          <h2 className="text-xl font-bold mt-10 mb-6 text-charcoal flex items-center">
            <span className="mr-3 text-gray-300 font-serif">04</span> 第四条：分区与审核强度
          </h2>
          <div className="pl-4 space-y-4 text-gray-700 border-l-2 border-gray-100">
            <p>
              <span className="font-bold text-charcoal">4.1 强制分区：</span> 投稿时必须明确选择分区标签：<span className="px-2 py-0.5 bg-gray-100 rounded text-xs">硬核区 (Hardcore)</span> 或 <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">抽象区 (Abstract)</span>。
            </p>
            <p>
              <span className="font-bold text-charcoal">4.2 审核差异化：</span> 硬核区执行极其严格的内容核验与合规审查，重点针对 AI 生成比例及 AI 直接产出的整稿进行深度溯源。
            </p>
            <p>
              <span className="font-bold text-charcoal">4.3 修正权利：</span> 初审编辑有权基于内容实际性质，直接调整稿件分区标签或要求作者重投至正确的分区。
            </p>
          </div>

          {/* 第五部分 */}
          <h2 className="text-xl font-bold mt-10 mb-6 text-charcoal flex items-center">
            <span className="mr-3 text-red-200 font-serif">05</span> 第五条：硬核区 AI 审查与严惩
          </h2>
          <div className="pl-4 space-y-4 text-gray-700 border-l-2 border-red-500 bg-red-50/30 p-4">
            <p>
              <span className="font-bold text-charcoal">5.1 核验要求：</span> 投递至硬核区的稿件必须同步提交并通过《AI 使用声明》及必要的真实性核验流程。
            </p>
            <p>
              <span className="font-bold text-charcoal">5.2 违规处置：</span> 凡涉及 AI 滥用、未声明生成及相关欺诈情形，本刊将执行直接拒稿或强制下架处理。
            </p>
            <p>
              <span className="font-bold text-charcoal">5.3 累积处罚：</span> 若同一账号违规下架记录累计达 <span className="font-bold text-red-600 underline">3 次</span>，本刊有权执行拉黑、封禁投稿权限等操作。处罚期限由运营团队决定，情节严重者将永久停权。
            </p>
          </div>

          {/* 第六部分 */}
          <h2 className="text-xl font-bold mt-10 mb-6 text-charcoal flex items-center">
            <span className="mr-3 text-gray-300 font-serif">06</span> 第六条：规避行为认定
          </h2>
          <p className="mb-4 text-gray-600">下列旨在规避名额限制或逃避审核的恶意行为，将被视为违规并加重处理：</p>
          <ul className="list-decimal pl-10 space-y-3 mb-8 text-gray-700">
            <li>利用多账号、借用他人账号或团队账号轮流抢占每日名额；</li>
            <li>同日内针对未修改的稿件进行反复投递以占用系统名额；</li>
            <li>采用拆分稿件、修改标题或局部洗稿等手段重复投递同一内容；</li>
            <li>在抽象区投递硬核内容以规避严苛审查，或利用分区差异进行违规操作。</li>
          </ul>

          <hr className="my-8 border-gray-200" />

          {/* 第七/八部分 */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <h3 className="text-lg font-bold mb-4 text-charcoal">第七/八条：补充说明与效力</h3>
            <p className="text-sm text-gray-600 mb-4">
              本准则旨在通过合理的秩序管理，确保每一篇优质作品不会因投稿激增而失去曝光空间。我们致力于通过技术与人工的双重审查，维护学术记录的可信度与期刊库的整体质量。
            </p>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• 本准则由 SHIT Journal 运营与治理团队负责解释。</p>
              <p>• 本准则自发布之日起即时施行。</p>
              <p>• 运营团队将根据实际投稿量动态调整【每日名额数量】及执行细则，并提前通过官方公告公示。</p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 text-center text-gray-400 text-xs tracking-widest font-mono">
            END OF DOCUMENT - SHIT JOURNAL COMPLIANCE
          </div>

        </div>
      </div>
    </div>
  </div>
);
};