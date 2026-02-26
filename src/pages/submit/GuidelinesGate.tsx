import React from 'react';

export const GuidelinesGate: React.FC<{ onAgree: () => void }> = ({ onAgree }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif font-bold mb-2">S.H.I.T. Journal 准入契约</h2>
        <p className="text-sm text-gray-500">Admission Covenant</p>
      </div>

      <div className="bg-white border border-gray-200 p-8 shadow-sm mb-8">
        <p className="font-serif text-charcoal leading-relaxed mb-6">
          <span className="font-bold">重要启示：</span>本刊系一项针对学术指标崇拜、评价体系异化及言语行为理论的<span className="font-bold">长期性社会实验</span>。点击"同意"即代表您已深陷这场社会实验。
        </p>

        {/* 一、投稿准则 */}
        <h3 className="text-xl font-serif font-bold mb-4">一、投稿准则</h3>

        <div className="space-y-6 mb-8">
          {/* 1. 法律与伦理红线 */}
          <div>
            <h4 className="font-serif font-bold text-charcoal mb-2">1. 法律与伦理红线 (The No-Go Zone)</h4>
            <ul className="space-y-1.5 ml-4">
              <li className="text-sm text-charcoal leading-relaxed">
                <span className="font-bold">非政治化：</span>严禁涉及现实政治人物或地缘博弈的"政企整活"。
              </li>
              <li className="text-sm text-charcoal leading-relaxed">
                <span className="font-bold">非危险性：</span>拒绝真实的犯罪指南或会引发医疗纠纷的"偏方"。
              </li>
              <li className="text-sm text-charcoal leading-relaxed">
                <span className="font-bold">零客尼区：</span>严禁真暴言论或针对真实人类的"数字凌势"（开盒）。
              </li>
            </ul>
          </div>

          {/* 2. 学术规范外壳 */}
          <div>
            <h4 className="font-serif font-bold text-charcoal mb-2">2. 学术规范外壳 (The Intellectual Camouflage)</h4>
            <ul className="space-y-1.5 ml-4">
              <li className="text-sm text-charcoal leading-relaxed">
                <span className="font-bold">高仿排版：</span>必须使用官方 LaTeX/Doc 模板，用视觉秩序掩盖灵魂的荒漠。
              </li>
              <li className="text-sm text-charcoal leading-relaxed">
                <span className="font-bold">八股结构：</span>摘要、引言、参考文献缺一不可——即使你的参考文献全是隔壁超市的收银条。
              </li>
              <li className="text-sm text-charcoal leading-relaxed">
                <span className="font-bold">视觉证据：</span>全文至少包含一张<em>"哪怕你看不懂，但看起来很酷"</em>的图表或复杂公式。
              </li>
            </ul>
          </div>

          {/* 3. 逻辑自洽性 */}
          <div>
            <h4 className="font-serif font-bold text-charcoal mb-2">3. 逻辑自洽性 (Logical Integrity)</h4>
            <ul className="space-y-1.5 ml-4">
              <li className="text-sm text-charcoal leading-relaxed">
                <span className="font-bold">拒绝无脑：</span>本刊不接收低端网络烂梗或单纯的国骂发泄。
              </li>
              <li className="text-sm text-charcoal leading-relaxed">
                <span className="font-bold">荒谬的严谨：</span>如果你要证明"月亮是奶酪做的"，请务必使用流体力学进行严格推演。
              </li>
            </ul>
          </div>
        </div>

        {/* 二、初审流程 */}
        <h3 className="text-xl font-serif font-bold mb-4">二、初审流程：社区守护人的最后防线</h3>

        <p className="text-sm text-charcoal leading-relaxed mb-4">
          为了保障本刊不变成"404"，我们设立了极其克制的审查机制：
        </p>

        <ul className="space-y-1.5 ml-4 mb-8">
          <li className="text-sm text-charcoal leading-relaxed">
            <span className="font-bold">二元初筛：</span>"社区守护人"只进行 Yes/No 判别。
          </li>
          <li className="text-sm text-charcoal leading-relaxed">
            <span className="font-bold">合规一票否决：</span>只要涉及安全红线（涉政、黄暴、侵权），文章将直接被扔进历史的垃圾桶，永不进入发酵池。
          </li>
          <li className="text-sm text-charcoal leading-relaxed">
            <span className="font-bold">学术质量宽容：</span>只要格式像模像样且逻辑闭环，即便观点再疯，只要守护人没否定，我们都倾向于将其放行给社区公议。
          </li>
        </ul>
      </div>

      <button
        onClick={onAgree}
        className="w-full py-5 bg-accent-gold text-white text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#B18E26] transition-colors shadow-lg cursor-pointer"
      >
        我已阅读并同意准入契约 / I Agree to the Covenant
      </button>
    </div>
  );
};
