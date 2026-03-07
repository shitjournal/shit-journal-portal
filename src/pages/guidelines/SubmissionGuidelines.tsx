import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export const SubmissionGuidelines: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 lg:px-8">
        
        {/* 返回按钮 */}
        <Link to="/" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-accent-gold mb-8 inline-block">
          ← Back to Home
        </Link>

        {/* 文书主体 */}
        <div className="bg-white border border-gray-300 p-8 md:p-16 shadow-sm">
          
          {/* 标头区域 */}
          <div className="border-b-2 border-charcoal pb-8 mb-8 text-center">
            <h1 className="text-3xl font-serif font-bold text-charcoal mb-4">SHIT Journal 管理文件</h1>
            <div className="flex justify-center gap-6 text-sm text-gray-500 font-mono">
              <span>版本号: v1.0</span>
              <span>生效日期: 2026/03/06</span>
            </div>
          </div>

          {/* 正文区域 */}
          <div className="prose prose-sm md:prose-base max-w-none text-charcoal leading-relaxed">
            
            {/* 1) 硬核区投稿条件 */}
            <section className="mb-12">
              <h2 className="text-2xl font-serif font-bold border-l-4 border-charcoal pl-4 mb-6">1) 硬核区投稿条件</h2>
              
              <h3 className="text-lg font-bold mb-3">1.1 硬核区定位与基本原则</h3>
              <p className="mb-4">
                硬核区用于收录“可被复核、可被讨论、可被引用”的内容。题目可以抽象、离谱、幽默，但论证必须“硬”且具有支撑性、科学性及论证性。
              </p>
              <p className="font-bold mb-2">硬核区作品必须满足三条底线：</p>
              <ul className="list-decimal pl-5 mb-6 space-y-1">
                <li><span className="font-bold">命题问题明确：</span>你在研究、讨论什么？</li>
                <li><span className="font-bold">方法论明确：</span>你怎么得到结论？</li>
                <li><span className="font-bold">证据可核查：</span>包含数据、材料、推导、引用。</li>
              </ul>

              <hr className="my-8 border-dashed border-gray-200" />

              <h3 className="text-lg font-bold mb-3">1.2 投稿必选项与结构要求</h3>
              <p className="mb-4 text-gray-600 italic">硬核区投稿必须包含下列模块（参考本刊发布之 LaTeX 模板或 Word 模板）：</p>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold mb-2">A. 标题（必须）</h4>
                  <ul className="list-disc pl-5">
                    <li><span className="font-bold">必须：</span>准确反映研究问题、对象、范围。</li>
                    <li><span className="font-bold">禁止：</span>只有情绪或口号、完全不含研究对象。</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold mb-2">B. 摘要（必须）</h4>
                  <p className="mb-1 text-sm text-gray-500">必须包含以下 5 项：</p>
                  <ul className="list-disc pl-5">
                    <li>1. 研究问题目标（目的）</li>
                    <li>2. 简述方法（实验 / 统计 / 调查 / 文本分析 / 模型 / 综述等）</li>
                    <li>3. 结果</li>
                    <li>4. 局限及范围</li>
                    <li>5. 安全须知（本文的危险性、伦理性、研究真实性）</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold mb-2">C. 主体（Main Body）</h4>
                  <p className="mb-3 text-xs text-gray-400 italic">（主体内所有引用都需要标注 APA in-text citation）</p>
                  <div className="pl-4 space-y-4 border-l border-gray-100">
                    <p>1. <span className="font-bold">引言（Introduction）</span></p>
                    <div>
                      <p>2. <span className="font-bold">结果（Result）</span></p>
                      <ul className="list-disc pl-5 text-sm">
                        <li>2.1 必须：给出明确结果（数据表 / 图 / 统计量 / 推导结论 / 对比结论至少一种）</li>
                        <li>2.2 必须：结果与方法一致</li>
                        <li>2.3 禁止：把“感受 / 观点”当作“结果”不做区分</li>
                      </ul>
                    </div>
                    <div>
                      <p>3. <span className="font-bold">讨论（Discussion）</span></p>
                      <ul className="list-disc pl-5 text-sm">
                        <li>3.1 你的结果可能错在哪、适用范围是什么</li>
                        <li>3.2 样本偏差 / 外推风险 / 测量误差 / 混杂因素 / 不足及风险</li>
                      </ul>
                    </div>
                    <p>4. <span className="font-bold">结论（Conclusion）</span></p>
                    <div>
                      <p>5. <span className="font-bold">材料与方法（Materials & Methods）</span></p>
                      <p className="text-xs mb-2">你必须说明“你到底做了什么”。可选择覆盖以下信息并包含必需部分：</p>
                      <ul className="list-disc pl-5 text-sm grid grid-cols-1 gap-1">
                        <li>5.1.1 研究类型（必须选择并写明）</li>
                        <li>5.1.2 实验 / 调查问卷 / 观察记录 / 统计建模 / 仿真 / 文本 / 语料分析 / 系统综述 / 案例研究 / 理论推导</li>
                        <li>5.1.3 对象、样本、结构、解决的问题（必需）</li>
                        <li>5.1.4 对象是什么（人 / 文本 / 数据集 / 平台内容 / 材料 / 采用了什么方法论研究或解决了什么问题）（必需）</li>
                        <li>5.1.5 样本量（N=多少）或材料规模（多少条 / 多少页 / 多少段 / 多少轮 / 理论来源 / 原创是否有清晰推演）（必需）</li>
                        <li>5.1.6 样本来源（抽样规则 / 筛选条件 / 时间区间 / 推演过程的方法）（必需）</li>
                        <li>5.1.7 变量 / 指标 / 口径（必需）</li>
                        <li>5.1.8 你测量了什么？（指标定义）</li>
                        <li>5.1.9 如何计算 / 标注？</li>
                        <li>5.1.10 关键阈值如何设定？</li>
                        <li>5.1.11 步骤与复现要点（必需）</li>
                        <li>5.1.12 流程写清楚到“可复现、可推导出同结果”</li>
                        <li>5.1.13 若有代码 / 表格 / 问卷：说明存放方式（可选是否公开；但至少要描述结构）和通过真实性审查，公开则置于附件中。</li>
                      </ul>
                    </div>
                    <p>6. <span className="font-bold">补充材料及附件（可选）</span></p>
                    <p>7. <span className="font-bold">致谢（Acknowledgement）</span></p>
                    <p>8. <span className="font-bold">注释（Footnote）（如有，非强制）</span></p>
                    <div>
                      <p>9. <span className="font-bold">引用（APA Reference List）（使用标准 APA 7）</span></p>
                      <ul className="list-disc pl-5 text-sm">
                        <li>9.1 必须：凡引用他人成果、数据、图片、观点，都要引用；</li>
                        <li>9.2 必须：来源可追溯（链接、DOI、书刊信息、公开报告信息等）；</li>
                        <li>9.3 禁止：编造不存在的引用、用 AI 捏造参考文献。</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="my-8 border-dashed border-gray-200" />

              <h3 className="text-lg font-bold mb-3">1.3 内容与行为红线</h3>
              <p className="mb-2 text-sm font-bold text-red-600">硬核区一律禁止：</p>
              <ul className="list-decimal pl-5 space-y-2 text-sm">
                <li>违法信息、教唆违法、可造成负面社会影响之资讯（如管制类药品制备、武器制备、使用管制类药物、可造成人体伤害之行为等）</li>
                <li>色情露骨、未成年人相关及任何非学术之性内容，且需注意内容文字使用</li>
                <li>仇恨 / 歧视 / 骚扰 / 引战对立</li>
                <li>人肉与隐私泄露（含截图暴露他人信息 / 未引用公开资讯之未做去识别化之图片和未成年信息等）</li>
                <li>恶意点名挂人、以攻击具体自然人为主之信息</li>
                <li>伪造数据、伪造实验过程、伪造引用来源</li>
                <li>涉及医学类若非绝对专业和经认证文章，需于首页摘要红字备注：<span className="text-red-600 font-bold">“本内容纯属整活，不代表任何学术观点和现实指导建议。请保持理智，切勿模仿。”</span></li>
                <li>现在进行时或近期之社会事件不得作为论文内容</li>
                <li>时政评判、恶意政治性内容、马克思主义、极端主义、宗教主义、军事学、伪 / 伪造医学、伪 / 伪造心理学、伪 / 伪造社会学、伪法学（杜撰内容、不具现实法律意义或极端法学内容、传授操控及漏洞、恶意解读、侵权）等</li>
              </ul>

              <hr className="my-8 border-dashed border-gray-200" />

              <h3 className="text-lg font-bold mb-3">1.4 AI 使用规则（AI 是人类的好帮手，但硬核区需强约束）</h3>
              <p className="mb-4 font-bold italic">此部分为最大力度禁止 AI 直接生成稿件，硬核区的入库条件：</p>
              
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-bold">1. 允许（但必须披露）</p>
                  <ul className="list-disc pl-5">
                    <li>1.1 允许 AI 用于：数据清洗、统计计算、代码辅助、可视化、语法 / 错别字纠正、排版建议</li>
                    <li>1.2 允许 AI 用于：把你已完成的结果做格式化表达（例如把表格转成 LaTeX 表格）</li>
                    <li>1.3 及以下未禁止项目</li>
                    <li>1.4 以上均需提交《AI 使用声明》（见文末模板）</li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold text-red-600">2. 禁止（命中即拒稿、下架）</p>
                  <ul className="list-disc pl-5">
                    <li>2.1 AI 直接生成大段或全部正文、摘要、讨论、结论、论证链</li>
                    <li>2.2 AI 编造数据、引用、实验过程</li>
                    <li>2.3 用 AI 批量模板化生产硬核区稿件</li>
                    <li>2.4 让 AI 写完，再由作者改几个词就投的行为</li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold">3. 复核义务（硬核区可要求举证）</p>
                  <ul className="list-disc pl-5">
                    <li>3.1 如稿件被判定为疑似 AI 作品，作者需在规定期限内提供至少一种证据：
                      <ul className="list-circle pl-5 mt-1">
                        <li>3.1.1 草稿 / 修订记录（如 Overleaf history、文档修订痕迹）</li>
                        <li>3.1.2 原始数据或采集记录（可匿名化）</li>
                        <li>3.1.3 代码 / 脚本或分析过程截图</li>
                      </ul>
                    </li>
                    <li>3.2 无法提供且特征高度吻合者，直接拒稿</li>
                  </ul>
                </div>
              </div>

              <hr className="my-8 border-dashed border-gray-200" />

              <h3 className="text-lg font-bold mb-3">1.5 形式与文件要求（硬核区）</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li><span className="font-bold">必须：</span>可打开、可阅读、非空白、非损坏</li>
                <li><span className="font-bold">必须：</span>正文可复制或清晰可见（图片版 PDF 需保证清晰度）</li>
                <li><span className="font-bold text-gray-500">建议：</span>PDF 正文 ≥ 3 页</li>
                <li><span className="font-bold text-gray-500">建议：</span>图表要有标题 / 编号 / 说明（数据来源或计算方式）</li>
              </ul>
            </section>

            <hr className="my-16 border-gray-300" />

            {/* 2) 抽象区投稿条件 */}
            <section className="mb-12">
              <h2 className="text-2xl font-serif font-bold border-l-4 border-charcoal pl-4 mb-6">2) 抽象区投稿条件（规则更宽、底线更硬）</h2>
              
              <h3 className="text-lg font-bold mb-3">2.1 抽象区定位</h3>
              <p className="mb-6">
                抽象区用于收录：戏仿论文体、脑洞设定、荒诞研究、抽象研究、整活研究、段子化严肃写作。离谱在这里可被接受，但必须原创（至少想法）、可读、有逻辑、不越线。
              </p>

              <h3 className="text-lg font-bold mb-3">2.2 抽象区最低投稿结构（硬门槛）</h3>
              <p className="mb-4 text-sm">抽象区投稿必须满足以下最低结构，需满足平台提供 LaTeX 或 Word 文档之门槛及版面要求：</p>
              <ul className="list-decimal pl-5 space-y-3 mb-6">
                <li><span className="font-bold">标题（必须）：</span>请直接在标题前标注<span className="text-accent-gold">“抽象整活：论文名称”</span>，否则将直接拒稿</li>
                <li><span className="font-bold">摘要（必需）：</span>包含 1. 研究问题目标；2. 结果；3. 安全须知（危险性、伦理性、研究真实性、整活必需标注整活；伪学术需声明，否则将直接拒稿）</li>
                <li><span className="font-bold">正文（必须）：</span>至少包含完整展开（LaTeX 及 Word 文档内每一项子项都需符合要求，格式格式格式！）</li>
                <li><span className="font-bold">结论（必须）：</span>至少给出一个独立的收束（结论 / 反转 / 总结 / “本研究的启示”皆可）</li>
                <li><span className="font-bold">引用（APA Reference List）：</span>使用标准 APA 7。</li>
              </ul>

              <h3 className="text-lg font-bold mb-3">2.3 抽象区内容要求</h3>
              <p className="font-bold mb-2 text-sm">必须具有：</p>
              <ul className="list-disc pl-5 mb-6 text-sm">
                <li><span className="font-bold">可读性：</span>段落清楚、逻辑自洽；不是乱码 / 重复字符 / 无意义堆词</li>
                <li><span className="font-bold">原创性：</span>梗可以共用，但文本与设定必须是你的表达，不得搬运</li>
                <li><span className="font-bold">可讨论点：</span>至少有明确观点 / 设定 / 推理链条，读者能读懂你要传达的内容，而不是表情符号</li>
              </ul>

              <p className="font-bold mb-2 text-sm text-red-600">禁止（将会直接拒稿、多次投稿将封号停权）：</p>
              <ul className="list-decimal pl-5 text-sm space-y-1 mb-6">
                <li>任何违法、色情露骨、未成年人相关、仇恨歧视、骚扰、引战内容</li>
                <li>人肉、隐私泄露、挂人点名羞辱</li>
                <li>抄袭洗稿、盗用图片图表</li>
                <li>靠黄暴 / 歧视 / 攻击性 / 或不当社会议题、违法、教唆违法等问题当主要卖点</li>
                <li>伪造现实世界证据造成造谣风险（例如捏造某机构 / 某人真实行为并指名道姓、挂名导师、无证据性和非法取证的指责及曝光）</li>
                <li>涉及医学首页摘必需红字备注：<span className="text-red-600 font-bold">“本内容纯属整活，不代表任何学术观点和现实指导建议。请保持理智，切勿模仿。”</span></li>
                <li>现在进行时或近期之社会事件不得作为论文内容</li>
                <li>任何涉政、真实法律并且为对人而非物、真实医学、时政评判、恶意政治性内容、马克思主义、极端主义、宗教主义、军事学、心理学、伪社会学、伪法学等</li>
              </ul>

              <h3 className="text-lg font-bold mb-3">2.4 AI 使用规则（抽象区：同样严禁“纯 AI 文章”）</h3>
              <p className="mb-4 text-sm italic">抽象区允许玩梗，但仍然要执行“反纯 AI 生成”：</p>
              <p className="font-bold mb-2 text-sm">此区域仅禁止（命中即拒稿 / 下架）：</p>
              <ul className="list-disc pl-5 text-sm mb-4">
                <li>AI 一键生成整篇抽象论文并直接投稿</li>
                <li>AI 批量生产同质化段子论文</li>
                <li>AI 编造事实或社会事件当作“真实研究”</li>
              </ul>
              <p className="text-sm">
                抽象区可以“虚构”，但必须让读者能辨识为虚构和戏仿；不能把虚构包装成可造成现实伤害的事实指控；所有 AI 生成内容均需标注 AI 生成；数据等重要部分由 AI 生成则需荧光或使用不同颜色标注。
              </p>
            </section>

            <hr className="my-16 border-gray-300" />

            {/* 3) 初审标准 */}
            <section className="mb-12">
              <h2 className="text-2xl font-serif font-bold border-l-4 border-charcoal pl-4 mb-6">3) 初审标准</h2>
              
              <h3 className="text-lg font-bold mb-3">3.1 初审的目的与边界</h3>
              <p className="mb-2 text-sm">初审只做三件事：</p>
              <ul className="list-disc pl-5 text-sm mb-4">
                <li>1. <span className="font-bold">合规：</span>不触碰红线与风险内容</li>
                <li>2. <span className="font-bold">可读：</span>文件可打开、内容可阅读、格式符合</li>
                <li>3. <span className="font-bold">反滥用：</span>反 AI 纯生成、反抄袭搬运、反隐私泄露</li>
              </ul>
              <p className="text-xs text-gray-500 italic">初审限制：不做学术真伪最终裁判；不保证观点正确，只保证“可被讨论且不越线”</p>

              <hr className="my-8 border-dashed border-gray-200" />

              <h3 className="text-lg font-bold mb-3">3.2 初审处置结果（只有四类）</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
                <div className="p-3 border border-gray-200 rounded">
                  <p className="font-bold text-green-700">A 通过</p>
                  <p className="text-xs">进入对应分区 / 池子</p>
                </div>
                <div className="p-3 border border-gray-200 rounded">
                  <p className="font-bold text-accent-gold">B 退回修改</p>
                  <p className="text-xs">列出必须修改项，作者修正后可重投</p>
                </div>
                <div className="p-3 border border-gray-200 rounded">
                  <p className="font-bold text-gray-500">C 拒稿</p>
                  <p className="text-xs">未采纳返修意见、不收录，不进入库（给简短理由）</p>
                </div>
                <div className="p-3 border border-red-200 bg-red-50 rounded">
                  <p className="font-bold text-red-700">D 下架 / 处罚</p>
                  <p className="text-xs">严重违规或恶意行为（隐匿性恶意行为，含封禁、限制投稿）</p>
                </div>
              </div>

              <h3 className="text-lg font-bold mb-3">3.3 初审流程（为 2 段式）</h3>
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 border-l-4 border-red-500">
                  <h4 className="font-bold text-sm mb-2">机器 / 快速筛查（命中即 C 或 D）</h4>
                  <ul className="list-disc pl-5 text-xs space-y-1">
                    <li>1. 文件为空白 / 损坏 / 无法预览</li>
                    <li>2. 明显抄袭搬运（大段复制、盗图无来源）</li>
                    <li>3. 明显 AI 纯生成（模板化、AI 占比极高、无法提供基本创作痕迹）</li>
                    <li>4. 违反任何红线。</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 border-l-4 border-accent-gold">
                  <h4 className="font-bold text-sm mb-2">人工初审（命中则 B 或 C）</h4>
                  <p className="text-xs mb-2 italic">审核员将确定：</p>
                  <ul className="list-disc pl-5 text-xs grid grid-cols-1 md:grid-cols-2 gap-2">
                    <li>1. 可读性与可打开性</li>
                    <li>2. 模板合格性</li>
                    <li>3. 正文清晰可读（字号 / 清晰度）</li>
                    <li>4. 排除“技术性闪退 / 白屏”问题</li>
                    <li>5. 合规性（不含隐私、引战、歧视、违法黄暴内容）</li>
                    <li>6. 原创与版权（标注来源，无明显搬运特征）</li>
                    <li>7. AI 使用合规：验证声明提交、范围限制及是否存在直出迹象</li>
                    <li>8. 分区判定：判定分区合理性，不合理则退回</li>
                  </ul>
                </div>
              </div>

              <hr className="my-8 border-dashed border-gray-200" />

              <h3 className="text-lg font-bold mb-3">3.4 硬核区专属初审门槛</h3>
              <p className="text-sm italic mb-3">不满足则 B 或改投抽象区，硬核区必须满足以下所有：</p>
              <ul className="list-decimal pl-5 text-sm space-y-1">
                <li>有明确研究问题 / 目标</li>
                <li>有方法描述</li>
                <li>有数据 / 材料来源或推导过程</li>
                <li>有结果呈现（表 / 图 / 统计量 / 推导结论 / 对比结论）</li>
                <li>有局限 / 讨论</li>
                <li>引用 / 资料来源可追溯、无编造迹象（不得引用本刊或它刊抽象区文章作为学术支撑，除非作为研究对象）</li>
                <li>满足所有硬核区投稿要求</li>
              </ul>
              <p className="mt-4 text-xs text-gray-400">若作者不愿补齐上述要素，建议改投抽象区。如反复恶意投递将惩罚处置。</p>
            </section>

            <hr className="my-16 border-gray-300" />

            <div className="mt-12 text-center text-xs text-gray-400 tracking-[0.3em] font-serif uppercase">
              — END —
            </div>

          </div>
        </div>
      </div>
    </div>
);
};