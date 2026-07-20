export const identityProfiles = [
  {
    key: 'long-termist',
    title: '长期主义者',
    quote: '无欲速，无见小利。欲速则不达，见小利则大事不成。',
    attribution: '孔子《论语·子路》',
    englishQuote: "It's All About the Long Term.",
    englishAttribution: 'Jeff Bezos，1997 Letter to Shareholders',
    sourceUrl: 'https://ir.aboutamazon.com/files/doc_financials/annual/2002_shareholderLetter.pdf'
  },
  {
    key: 'lifelong-learner',
    title: '终身学习者',
    quote: '学不可以已。',
    attribution: '荀子《劝学》',
    englishQuote: 'Stay hungry. Stay foolish.',
    englishAttribution: 'Whole Earth Catalog，Steve Jobs 2005 年斯坦福演讲引述',
    sourceUrl: 'https://news.stanford.edu/stories/2005/06/steve-jobs-2005-graduates-stay-hungry-stay-foolish'
  }
];

export const methodSystem = {
  learning: {
    index: '00',
    track: 'learning',
    slug: 'learning',
    title: '持续学习',
    summary: '遇到不熟悉的问题，先找可靠资料，再放进实际工作里检验。',
    href: '/methods/learning/'
  },
  tracks: [
    {
      key: 'analysis-to-decision',
      label: '主线一',
      title: '从分析到决策',
      methods: [
        { index: '01', track: 'analysis-to-decision', slug: 'research-and-judgment', title: '研究与证据', summary: '先弄清谁要做什么决定，再确定查什么、查到哪一步。', href: '/methods/research-and-judgment/' },
        { index: '02', track: 'analysis-to-decision', slug: 'plural-thinking', title: '多元思维', summary: '换一种解释、一个模型或一个专业视角，检查原来的判断。', href: '/methods/plural-thinking/' },
        { index: '03', track: 'analysis-to-decision', slug: 'writing', title: '写作与表达', summary: '把结论、依据和需要谁做什么写清楚。', href: '/methods/writing/' }
      ],
      related: [
        { label: '工业绿色微电网评价软件', href: '/projects/#industrial-energy-carbon-system' },
        { label: 'Research-to-Decision Toolkit', href: 'https://github.com/Anonymousyz/research-to-decision-toolkit', external: true }
      ]
    },
    {
      key: 'technology-to-application',
      label: '主线二',
      title: '从技术到应用',
      methods: [
        { index: '04', track: 'technology-to-application', slug: 'product-definition', title: '产品定义', summary: '从使用者、场景和流程开始定义产品。', href: '/methods/product-definition/' },
        { index: '05', track: 'technology-to-application', slug: 'visual-information-design', title: '视觉与信息设计', summary: '用层级、排版和状态帮助人更快看懂、做对。', href: '/methods/visual-information-design/' },
        { index: '06', track: 'technology-to-application', slug: 'product-and-engineering', title: '工程与交付', summary: '把规则做进数据、权限和测试，直到系统可以交付。', href: '/methods/product-and-engineering/' }
      ],
      related: [
        { label: '总体所技改平台项目', href: '/projects/#industrial-digital-public-service-platform' },
        { label: 'AI Prototype-to-Production Toolkit', href: 'https://github.com/Anonymousyz/ai-prototype-to-production-toolkit', external: true }
      ]
    }
  ]
};

const allMethodTopics = [
  methodSystem.learning,
  ...methodSystem.tracks.flatMap((track) => track.methods)
];

export const methodBySlug = Object.fromEntries(
  allMethodTopics.map((item) => [item.slug, item])
);

function article(slug, content) {
  const topic = methodBySlug[slug];
  if (!topic) throw new Error(`Unknown method slug: ${slug}`);
  const trackTitle = topic.track === 'learning'
    ? '持续学习'
    : methodSystem.tracks.find((track) => track.key === topic.track).title;
  return { ...content, ...topic, trackTitle };
}

export const methodArticles = [
  article('learning', {
    lead: '我把学习放进手头的问题里：先限定范围，回到原始来源，再用写作、讨论或实现检查是否真的理解。',
    sections: [
      {
        heading: '先把眼前的问题弄明白',
        paragraphs: [
          '接到微电网评价软件的指标梳理任务时，我先写下当天要处理的对象：一条评价标准需要哪些数据，又该怎样计算。我根据当天要完成的规则，只补这一项计算所需的知识。',
          '还要写明谁会使用这段知识。专业人员需要核对标准，开发人员需要把规则做进系统，两个人关心的细节并不相同。'
        ]
      },
      {
        heading: '回到原始材料',
        paragraphs: [
          '我先看发布机构给出的原始来源，记录标准名称、发布时间和适用范围。转述与原文不一致时，回到条文逐句核对。',
          '基础概念暂时看不懂，就沿着标准引用补资料。与眼前指标无关的内容只记出处，不把整门课程搬进当前任务。'
        ]
      },
      {
        heading: '讲得清，也要做得出来',
        paragraphs: [
          '读懂条文后，我会讲给同事听，也会写成公式、数据字段或一段实现。两种检验都会逼出输入、条件和结果。',
          '公式写不完整、数据对不上，或同事听成另一件事，就回头查看条文。做不下去或讲不清楚的地方，通常还藏着没有弄懂的定义。'
        ]
      },
      {
        heading: '留下能交接的记录',
        paragraphs: [
          '我会在项目记录中保留术语、来源、易错点和验证过的例子。指标对应哪段标准，测试用了什么输入，也一并记下。',
          '同事接手计算规则时，可以按出处重做检查；相近任务也能从这些记录起步，再核对标准的现行版本。'
        ]
      },
      {
        heading: '后来改掉的习惯',
        paragraphs: [
          '我以前习惯先收集完整课程和成套资料，动手时才发现大半用不上。现在围绕具体任务补足知识，碰到障碍再查原始材料。',
          '任务结束后再整理值得带走的内容，不预先搭一张庞大的知识清单。新版本改变了标准或工具，就在新记录中写清差异。'
        ]
      }
    ],
    related: [
      { label: '工业绿色微电网评价软件', href: '/projects/#industrial-energy-carbon-system' },
      { label: 'Awesome AI Production Readiness', href: 'https://github.com/Anonymousyz/awesome-ai-production-readiness', external: true }
    ]
  }),
  article('research-and-judgment', {
    lead: '我做研究时，先确认谁要做什么决定，再分开事实、解释、评价与建议，并把未知项和复核边界留在材料里。',
    sections: [
      {
        heading: '谁要做什么决定',
        paragraphs: [
          '负责人问“这个方向值不值得做”时，我先追问他要决定立项范围、资源安排，还是下一次试验。决定的对象和时间会改变研究范围。',
          '待决定事项写在材料首页，随后列出会影响选择的证据。只补充背景、不会改变选择的资料保留出处，不占用结论位置。'
        ]
      },
      {
        heading: '把四类内容分开',
        paragraphs: [
          '我把研究记录分成事实、解释、评价和建议。事实写原文与数据；解释说明材料之间的关系；评价交代尺度；建议写清负责人可以采取的动作。',
          '项目组可以逐栏提出异议。有人质疑建议，就回到对应事实，检查分歧来自材料、解释还是评价尺度。'
        ]
      },
      {
        heading: '核对时间、定义和来源',
        paragraphs: [
          '碰到相互矛盾的材料，我先核对发布时间、定义、统计口径和作者立场，再判断差异来自哪里。两组数字名称相同，也可能采用了不同边界。',
          '引用旁要标出来源时间和适用对象。负责人看到结论时，既能判断证据覆盖哪段时期，也能找到原文。'
        ]
      },
      {
        heading: '列出还缺的证据',
        paragraphs: [
          '材料仍有空白，我会在结论旁列出未知项，并指定下一步：访谈哪位业务人员，或核对哪组项目数据。负责人据此决定继续研究，还是先做小范围试验。',
          '新材料仍无法区分两种解释时，两种判断及其成立条件都应保留，不把缺口藏进笼统措辞。'
        ]
      },
      {
        heading: '标准怎样进入项目',
        paragraphs: [
          '工业绿色微电网评价软件把评价标准拆成指标、所需数据和计算规则，再逐项写进系统与报告。每条规则保留原始标准的位置，便于相关人员核对。',
          '自动测试检查公式、数据流和主要功能。专业人员另行复核原始标准，真实环境验收也单独进行。'
        ]
      },
      {
        heading: '记录判断成立的条件',
        paragraphs: [
          '每项判断旁再写一种说得通的解释，并注明哪项新证据会推翻原结论。条件变化后，负责人可以回到记录重新判断。',
          '项目结束后，我会再核对假设和来源。标准版本、统计口径或使用场景发生变化时，更新判断，同时保留修改原因。'
        ]
      }
    ],
    related: [
      { label: 'Research-to-Decision Toolkit', href: 'https://github.com/Anonymousyz/research-to-decision-toolkit', external: true },
      { label: '工业绿色微电网评价软件', href: '/projects/#industrial-energy-carbon-system' }
    ]
  }),
  article('plural-thinking', {
    lead: '我会用另一种解释和反方问题检查判断，再按风险请项目角色或专业人员补看关键环节。',
    sections: [
      {
        heading: '先看问题，不先找模型',
        paragraphs: [
          '项目负责人提出待决定事项后，我先写清对象、期限和可选动作。问题还含混时，套用现成说法只会掩盖缺失的材料。',
          '微电网指标能否进入系统，取决于标准条文、可取得的数据和计算条件。这些对象比模型名称更值得先查。'
        ]
      },
      {
        heading: '再找一种说得通的解释',
        paragraphs: [
          '我先把当前解释写成一句可检查的话，再补一条也能解释现有材料的假设。两条解释都要对应事实，并写明各自还缺什么证据。',
          '两组项目数据出现差异时，既核对统计口径，也请业务人员说明采集过程。哪种解释站得住，要看记录中的条件。'
        ]
      },
      {
        heading: '借谁的眼睛来看',
        paragraphs: [
          '项目负责人会追问选择影响哪项任务，专业人员会核对条文与计算规则是否一致。不同角色的问题用于发现遗漏。',
          '我把这种做法叫作“专家委员会”：分别从项目负责人、专业人员等角色出发列问题。需要专业结论时，再请相应人员复核。'
        ]
      },
      {
        heading: '留下推理，也欢迎反方问题',
        paragraphs: [
          '重要判断旁记录事实、解释和评价尺度，也记下负责人据此作出的选择。标准版本或数据口径变动后，再补写日期和受影响的规则。',
          '同事用反方问题指出未知项后，我把它写进研究清单，并指定访谈对象或测试动作。没有材料支持的质疑只保留为待查问题。'
        ]
      },
      {
        heading: '专业结论仍要复核',
        paragraphs: [
          '人物视角用于发现遗漏，相关人员负责专业结论。微电网标准由专业人员核对，技术团队用测试检查系统是否按确认后的规则运行。',
          '对外材料写明谁完成了哪类检查，也标出仍待复核的事项，负责人据此判断结论的适用范围。'
        ]
      }
    ],
    related: [
      { label: '工业绿色微电网评价软件', href: '/projects/#industrial-energy-carbon-system' },
      { label: 'Research-to-Decision Toolkit', href: 'https://github.com/Anonymousyz/research-to-decision-toolkit', external: true }
    ]
  }),
  article('writing', {
    lead: '我先看读者要用材料做什么，再决定保留探索过程，还是直接呈现结论、依据和待决定事项。',
    sections: [
      {
        heading: '先确认读者和用途',
        paragraphs: [
          '动笔前，我会写下主要读者、材料用途和待决定事项。负责人需要看到结论与选择，项目组需要找到任务和协作对象。',
          '同一份材料要兼顾不同读者时，先按主要读者的任务安排顺序，再给其他人保留可定位的章节。'
        ]
      },
      {
        heading: '探索时保留问题',
        paragraphs: [
          '核对政策或行业材料时，探索性写作保留不同解释、未知项和下一步查证动作。假设可以修改，来源不能丢。',
          '相互矛盾的来源并列放置，并标出发布时间和口径。项目组据此决定找谁访谈，或先核对哪组数据。'
        ]
      },
      {
        heading: '有结论后先写待决定事项',
        paragraphs: [
          '判断形成后改用结论性写作。材料首页先交代负责人需要审定什么、依据是什么，再补充会影响选择的条件。',
          '领导汇报和项目执行材料详略不同，但都要写清读者接下来的动作。'
        ]
      },
      {
        heading: '分开事实、解释、评价和建议',
        paragraphs: [
          '我把事实、自己的解释、采用的评价标准和给负责人的建议分开写，读者才能指出具体分歧。',
          '审稿人质疑建议时，回到对应事实和评价尺度。来源不足就补材料，解释有歧义就改句子。'
        ]
      },
      {
        heading: '写清谁在什么条件下行动',
        paragraphs: [
          '每项建议写明行动主体、开始条件和适用边界。谁在方案审定后继续办理，技术人员依据哪份规则实现，都应在段落中点明。',
          '事项仍待专业人员复核时，我在事项旁标注“待专业复核”，再写明负责人与下一步动作。'
        ]
      },
      {
        heading: '误读后先改标题和结构',
        paragraphs: [
          '同事抓错重点时，我先检查标题是否说清对象，再看结论和待办的位置。很多误读来自信息顺序，继续增加解释会让关键句更难找。',
          '负责人要决定的事项移到前面，供项目组查阅的背景放回对应章节，再请原来的读者看一遍。'
        ]
      },
      {
        heading: '项目里逐项核对口径',
        paragraphs: [
          '总体所技改平台项目沿着方案任务逐项核对预算和交付物，让不同章节使用同一口径。项目组据此查找各自负责的对象。',
          '结论页还要写清谁来审定、谁继续办理，以及哪些交付物受当前阶段限制。我在材料中写明项目边界，并留下后续可核对的依据。'
        ]
      }
    ],
    related: [
      { label: '总体所技改平台项目', href: '/projects/#industrial-digital-public-service-platform' },
      { label: 'Research-to-Decision Toolkit', href: 'https://github.com/Anonymousyz/research-to-decision-toolkit', external: true }
    ]
  }),
  article('product-definition', {
    lead: '我目前采用的做法从使用者、场景和替代方案开始，再梳理角色、流程与异常路径，用小范围 MVP 检查关键假设。',
    sections: [
      {
        heading: '还原一次真实任务',
        paragraphs: [
          '访谈时，先请使用者回忆最近一次处理任务的过程：事情怎样触发，在哪一步等待、返工或放弃。这里要记录具体经历，不用宽泛偏好代替。',
          '现有替代方案也是检查项，包括数据表格、聊天消息、电话沟通和纸面登记，以及每种做法花费的时间与转交成本。'
        ]
      },
      {
        heading: '画清角色、流程和异常',
        paragraphs: [
          '发起人、办理人、审核人和管理者分别接收什么信息、作出什么决定、把结果交给谁，需要逐项写清。负责人再确认角色边界和主流程。',
          '资料缺失、审核退回、转交失败和网络中断都要进入流程图。每条异常路径注明通知对象、可执行动作和恢复位置。'
        ]
      },
      {
        heading: '判断问题是否值得解决',
        paragraphs: [
          '现场观察可以记录找资料、复制数据和追问进度的步骤，再核对完成时间、返工和错误。公开材料没有这些记录时，不把访谈印象写成测量结果。',
          '切换成本同样重要。使用者可能已经掌握一份表格，也可能依赖熟悉的联系人；产品要减少额外录入和学习负担。'
        ]
      },
      {
        heading: '先验证关键假设',
        paragraphs: [
          '关键假设应写成可检查的句子。MVP 只覆盖核心任务，低频步骤可以暂由人工处理；试用前再约定样本、周期和指标。',
          '范围表列出本轮使用者、场景、数据和异常路径，也写明停止条件。结果低于业务阈值，负责人就暂停扩展并重新检查问题定义。'
        ]
      },
      {
        heading: '从项目问题确定功能',
        paragraphs: [
          '总体所技改平台项目最初材料包含项目申报、审批和监管等功能名称。梳理时把它们改写为具体问题：哪些信息重复录入，审核缺什么依据，管理人员在哪个状态失去进度线索。',
          '项目组再把问题对应到角色、对象、流程和衡量方式。能够解决已确认问题、覆盖异常路径并通过指标检查的功能，才进入后续范围。'
        ]
      }
    ],
    related: [
      { label: '总体所技改平台项目', href: '/projects/#industrial-digital-public-service-platform' },
      { label: 'Research-to-Decision Toolkit', href: 'https://github.com/Anonymousyz/research-to-decision-toolkit', external: true }
    ]
  }),
  article('visual-information-design', {
    lead: '我先确认读者要完成什么任务。当前检查项包括焦点、层级、状态、对比度，以及不同载体的阅读方式。',
    sections: [
      {
        heading: '先看页面要完成什么',
        paragraphs: [
          '页面任务可以是找到一项结论、核对一组数据或提交一次申请。任务所需的信息和动作放在容易找到的位置，补充说明留在读者需要的地方。',
          '可用性检查记录读者先看哪里、点击什么、在哪个词语前停住。没有实际观察记录时，只写设计假设，不把假设当作使用结果。'
        ]
      },
      {
        heading: '安排焦点和阅读顺序',
        paragraphs: [
          '标题字号、字体粗细和段落间距共同建立层级。一个区域只保留一个主焦点，次要操作降低颜色和位置权重。',
          '颜色区分含义和状态，留白划分信息组。正文行宽、行距和数字对齐方式按阅读距离调整。'
        ]
      },
      {
        heading: '用一套规则减少辨认',
        paragraphs: [
          '标题、正文、注释和关键数字采用明确的字体、字号与间距；主要色、提示色和边框色也要记录用途。',
          '按钮、输入框、表格行和提示消息复用固定组件。同一状态使用相同名称、位置和反馈，设计与开发再按状态清单核对。'
        ]
      },
      {
        heading: '不同载体有不同读法',
        paragraphs: [
          'Word 依靠多级标题、页码、图表题注和重复表头帮助查阅；PPT 每页保留一个主要判断，在听众需要时给出证据；数据表格写清字段、单位和缺失值。',
          '网页需要清楚的链接名称与内容层级，软件界面还要处理输入、确认和纠错。移动端按单列安排阅读顺序，小屏先保留关键列；无法压缩的表格允许横向滚动，并在表头说明单位。'
        ]
      },
      {
        heading: '检查状态和可访问性',
        paragraphs: [
          '检查项覆盖默认、悬停、键盘焦点、禁用、加载、空数据、错误和成功状态。每个状态都要有文字反馈，不能只靠颜色区分。',
          '主要流程还要检查标题顺序、表单标签、图片说明、正文对比度和放大后的移动端阅读。发现的问题与功能缺陷进入同一份整改清单。'
        ]
      },
      {
        heading: '从真实误读中改设计',
        paragraphs: [
          '旧版个人主页把“研究、写作、学习、产品与工程”放在同一层，读者能看见四个入口，却看不出持续学习与两条主线的关系。',
          '这次改版把“持续学习”放在通栏位置，其余六项归入两条主线。桌面端和移动端保持相同的信息顺序，主要链接也保留清晰的键盘焦点。'
        ]
      }
    ],
    related: [
      { label: '口腔小程序项目', href: '/projects/#oral-care-mini-program' },
      { label: 'AI Prototype-to-Production Toolkit', href: 'https://github.com/Anonymousyz/ai-prototype-to-production-toolkit', external: true }
    ]
  }),
  article('product-and-engineering', {
    lead: '业务规则确认后，我把它们落实为数据、状态、权限和校验。技术方案按部署环境和维护条件取舍，交付前再检查异常处理、测试、部署和维护责任。',
    sections: [
      {
        heading: '把业务规则写进系统',
        paragraphs: [
          '业务人员先确认对象、字段、状态变化和操作角色，技术人员再写入数据模型、状态机、权限矩阵与校验规则。关键规则还要记录来源、版本和负责人。',
          '规则调整时，检查受影响的数据、接口和历史记录，再安排迁移与兼容。系统拒绝操作时，界面说明触发了哪条校验和下一步处理办法。'
        ]
      },
      {
        heading: '在项目约束下选择架构',
        paragraphs: [
          '技术方案先核对部署环境、既有系统、交付期限、维护人员、数据规模和并发需求。选择标准是团队能否构建、排错和升级。',
          '关键依赖记录用途、版本和替换方案。单体模块能够隔离业务边界时保持清晰接口；确有独立扩缩容或故障隔离需求时，再拆分服务。'
        ]
      },
      {
        heading: '覆盖核心流程和恢复路径',
        paragraphs: [
          '测试要走通创建、提交、审核和结果查询，也要输入缺失字段、重复请求与越权操作。无效输入应被拒绝，并返回原因和处理办法。',
          '网络中断或外部服务失败时，检查重试、幂等和超时。任务中断后能否回到已保存状态，管理员能否依据日志处理卡住的记录，也属于恢复路径。'
        ]
      },
      {
        heading: '交付检查和运行责任',
        paragraphs: [
          '当前交付检查包括业务规则的单元测试、数据与接口的集成测试、关键角色的端到端测试，以及代码和构建检查。存在失败项时，不放行候选版本。',
          '发布前核对配置、数据迁移、依赖和回滚步骤；运行阶段写清监控、告警、备份、恢复、账号管理和维护责任。公开材料只说明实际留存的记录。'
        ]
      },
      {
        heading: '按交付阶段写清状态',
        paragraphs: [
          '内部功能版本用于实现并检查主要功能；正式 UAT 由指定业务使用者按验收用例确认流程；预生产用于核对接近生产环境的配置与数据；生产验收依据上线后的合同或项目标准确认结果。',
          '总体所技改平台项目目前可公开说明的范围是内部功能版本及相应测试记录，正式 UAT、预生产和生产验收尚未完成。口腔小程序项目保留受控 Demo 与脱敏记录，相关材料不延伸为生产验收结论。'
        ]
      }
    ],
    related: [
      { label: '总体所技改平台项目', href: '/projects/#industrial-digital-public-service-platform' },
      { label: '口腔小程序项目', href: '/projects/#oral-care-mini-program' },
      { label: 'AI Prototype-to-Production Toolkit', href: 'https://github.com/Anonymousyz/ai-prototype-to-production-toolkit', external: true },
      { label: 'Awesome AI Production Readiness', href: 'https://github.com/Anonymousyz/awesome-ai-production-readiness', external: true }
    ]
  })
];
