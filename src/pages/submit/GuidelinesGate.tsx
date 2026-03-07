import React from 'react';

export const GuidelinesGate: React.FC<{ onAgree: () => void }> = ({ onAgree }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif font-bold mb-2">S.H.I.T Journal 准入契约 v1.1</h2>
        <p className="text-sm text-gray-500">Admission Covenant</p>
      </div>

      <div className="bg-white border border-gray-200 p-8 shadow-sm mb-8">
        <p className="font-serif text-charcoal leading-relaxed mb-6">
          <span className="font-bold">重要提示：</span>本刊为一项面向学术去中心化、学术平权与学术自治的长期性社会实验。用户在投稿、阅读、评分与评论时，须遵守本契约及本刊发布的各类规则文件。
        </p>

        {/* 一、投稿总则 */}
        <h3 className="text-xl font-serif font-bold mb-4 border-b pb-2">一、投稿总则（适用于所有分区与标签）</h3>

        <div className="space-y-6 mb-8">
          {/* 1. 法律与伦理红线 */}
          <div>
            <h4 className="font-serif font-bold text-charcoal mb-2">1. 法律与伦理红线 (The No-Go Zone)</h4>
            <p className="text-xs text-gray-500 mb-2">以下内容属于本刊「零容忍」范围，一律拒稿或下架，并可能处罚账号：</p>
            <ul className="space-y-3 ml-4">
              <li className="text-sm text-charcoal leading-relaxed">
                <span className="font-bold block">政治与现实政务整活（非政治化）：</span>
                <span className="block opacity-80">1. 严禁围绕现实政治人物、现实政务体系、现实政治组织进行煽动、攻击、宣传、动员、或以规避为目的的变体表达;</span>
                <span className="block opacity-80">2. 严禁借“研究/整活”名义进行现实政治动员或对抗性内容扩散。</span>
              </li>
              <li className="text-sm text-charcoal leading-relaxed">
                <span className="font-bold block">危险性与违法指导（非危险性）：</span>
                <span className="block opacity-80">1. 禁止任何真实犯罪指南、规避执法、制造或获取受管制物品的方法。</span>
                <span className="block opacity-80">2. 禁止可能造成现实人身伤害或医疗纠纷的“偏方”等具可操作性的危险建议。</span>
              </li>
              <li className="text-sm text-charcoal leading-relaxed">
                <span className="font-bold block">人身攻击、隐私侵害、仇恨、歧视与引战（零容忍区）：</span>
                <span className="block opacity-80">1. 禁止开盒、人肉、泄露隐私、未经授权公开他人可识别信息；</span>
                <span className="block opacity-80">2. 禁止针对真实个人的侮辱、羞辱、骚扰、煽动网暴等“数字凌势”；</span>
                <span className="block opacity-80">3. 禁止对特定群体进行贬损、去人化表达、煽动对立或引战。</span>
              </li>
              <li className="text-xs italic text-gray-400 mt-2">
                注：以上红线同样适用于图片、附件、链接、截图与评论区。
              </li>
            </ul>
          </div>

          <hr className="border-gray-100" />

          {/* 2. 学术外观与最低格式 */}
          <div>
            <h4 className="font-serif font-bold text-charcoal mb-2">2. 学术外观与最低格式 (The Intellectual Camouflage)</h4>
            <ul className="space-y-4 ml-4">
              <li className="text-sm text-charcoal leading-relaxed">
                <span className="font-bold">高仿排版：</span>本刊允许题目荒诞，但要求形式“像论文”。所有投稿必须满足最低格式要求：1. 必须使用官方模板；2. 投稿必须使用本刊官方 LaTeX 模板或 Word 模板完成排版。
                <span className="flex gap-3 mt-2">
                  <a href="/SHIT-LaTeX-Template.zip" download className="inline-flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-charcoal text-white hover:bg-accent-gold transition-colors">
                    LaTeX Template
                  </a>
                  <a href="/SHIT_Word-Template.docx" download className="inline-flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-colors">
                    Word Template
                  </a>
                </span>
              </li>
              <li className="text-sm text-charcoal leading-relaxed">
                <span className="font-bold block mb-1">八股结构：</span>
                <p className="mb-2">投稿必须选择 1 个标签：硬核区 或 抽象区。编辑部与初审有权基于内容实际情况调整分区标签或要求作者重投。</p>
                <div className="bg-gray-50 p-3 space-y-3 border-l-2 border-gray-200">
                  <div>
                    <span className="font-bold text-xs uppercase">1) 硬核区（Hardcore）</span>
                    <p className="text-xs text-gray-600">定位：收录“可被复核、可被讨论、可被引用”的稿件。题目可以幽默或离谱，但论证必须可核查。硬核区最低要求原则：问题明确、方法明确、证据可追溯。</p>
                  </div>
                  <div>
                    <span className="font-bold text-xs uppercase">2) 抽象区（Abstractionism）</span>
                    <p className="text-xs text-gray-600">定位：收录戏仿论文体、脑洞设定、荒诞研究、整活研究、段子论文写作。抽象区允许虚构与夸张：但必须符合合规要求，原创、可读、自洽、不越线。</p>
                    <a href="/submission-guidelines" className="text-[10px] text-accent-gold mt-1 block hover:underline">
                      详情：投稿准则与要求
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <hr className="border-gray-100" />

          {/* 3. 逻辑自治与内容质量底线 */}
          <div>
            <h4 className="font-serif font-bold text-charcoal mb-2">3. 逻辑自治与内容质量底线 (Logical Integrity)</h4>
            <ul className="space-y-2 ml-4">
              <li className="text-sm text-charcoal leading-relaxed">
                <span className="font-bold">拒绝纯发泄：</span>仅低端烂梗堆叠、纯国骂、无内容输出的稿件不予收录。
              </li>
              <li className="text-sm text-charcoal leading-relaxed">
                <span className="font-bold">逻辑自洽：</span>可以离谱，但要有自洽设定或可跟随的推理链。
              </li>
              <li className="text-sm text-charcoal leading-relaxed">
                <span className="font-bold">严谨的荒谬鼓励项：</span>若主张极端或反直觉结论，须给出足够的推导、证据或戏仿式的方法论支撑，且清晰标注。
              </li>
            </ul>
          </div>
        </div>

        {/* 二、初审与放行机制 */}
        <h3 className="text-xl font-serif font-bold mb-4 border-b pb-2">二、初审与放行机制（预审）</h3>
        <p className="text-sm text-gray-600 mb-4">本刊采取“预审 + 社区自治”的组合机制：初审只做必要拦截，其余交由社区评分与讨论。</p>
        <ul className="space-y-4 ml-4 mb-8">
          <li className="text-sm text-charcoal leading-relaxed">
            <span className="font-bold block">1) 二元初筛（Yes/No）</span>
            社区守护人对稿件进行快速判定：1. 是否触碰红线或高风险敏感项；2. 是否满足最低格式与可读性。
          </li>
          <li className="text-sm text-charcoal leading-relaxed">
            <span className="font-bold block">2) 学术质量宽容</span>
            只要：1. 不触红线；2. 模板合格；3. 内容基本自洽（也请参阅分区投稿准则）。
            <a href="/submission-guidelines" className="text-[10px] text-accent-gold mt-1 block hover:underline">
              详情：初审规则及判定标准
            </a>
          </li>
        </ul>

        {/* 三、每日录用准则 */}
        <h3 className="text-xl font-serif font-bold mb-4 border-b pb-2">三、每日录用准则</h3>
        <p className="text-sm text-gray-600 mb-4">为提升读者可见性与内容质量，避免稿件因投稿量过大而被埋没，并保障每日优质作品获得充分展示，本刊制定《每日录用准则》：</p>
        <ul className="space-y-2 ml-4 mb-8">
          <li className="text-sm text-charcoal leading-relaxed">1. 每人每日限投 1 份稿件；</li>
          <li className="text-sm text-charcoal leading-relaxed">2. 每日仅限制接受前【份数】稿件，超出部分请择日上传。</li>
          <li className="text-sm text-charcoal leading-relaxed">3. AI 使用的规范（也请参阅分区投稿准则）。</li>
          <li className="mt-2">
            <a href="/daily-recruitment-guidelines" className="text-[10px] text-accent-gold hover:underline">
              详情：每日录用准则
            </a>
          </li>
        </ul>

        {/* 四、同意条款 */}
        <h3 className="text-xl font-serif font-bold mb-4 border-b pb-2">四、同意条款</h3>
        <div className="bg-gray-50 p-4 border border-gray-100">
           <p className="text-sm text-charcoal leading-relaxed mb-2">用户点击「我已阅读并同意准入契约」即表示：</p>
           <ul className="space-y-1.5 ml-4">
              <li className="text-xs text-charcoal">1. 已理解并接受本契约及相关规则文件；</li>
              <li className="text-xs text-charcoal">2. 同意本刊根据契约与规则对投稿内容进行初审、分区、展示、退回或处置；</li>
              <li className="text-xs text-charcoal">3. 若违反红线或存在恶意行为，同意接受包括但不限于拒稿、下架、限制投稿或封禁等措施。</li>
           </ul>
        </div>
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
