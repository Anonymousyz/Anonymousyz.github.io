export const positioning = ['从分析到决策', '从技术到应用'];

export const heroCopy = '过去八年，我参与产业研究、政策分析和重大项目，也参与产品与软件系统建设。这里整理了我反复使用的做法、公开工具和项目记录。';

export const featuredCase = {
  index: '01',
  title: '工业绿色微电网评价软件',
  summary: '这套软件把政策和评价标准拆成数据要求、计算规则和报告内容。我参与前期研究、产品设计和交付检查；我也会写清哪些部分已经测试，哪些仍需专业复核。',
  role: '研究、产品设计、测试与交付检查',
  focus: '从评价标准到软件功能',
  href: '/projects/#industrial-energy-carbon-system'
};

export const demos = [
  {
    index: '02',
    title: '工业技术改造投资管理平台项目',
    kind: '内部功能版本 · 原型快照',
    summary: '把项目材料、角色和审批流程做成系统中的台账、权限和工作台。',
    href: '/projects/#industrial-digital-public-service-platform'
  },
  {
    index: '03',
    title: '口腔小程序项目',
    kind: '受控 Demo · 原型快照',
    summary: '设计家长授权、检查报告、预约和后台协作流程。',
    href: '/projects/#oral-care-mini-program'
  }
];

export const workLoop = [
  { index: '01', title: '问题界定', description: '确认谁要解决什么问题，以及现有流程受哪些条件限制。' },
  { index: '02', title: '范围确定', description: '写清需求、优先级、风险和验收条件。' },
  { index: '03', title: '组织实现', description: '连接业务流程、数据、专业规则和系统功能。' },
  { index: '04', title: '验证交付', description: '通过测试、复核、部署和回退检查交付结果。' },
  { index: '05', title: '方法复用', description: '将重复使用的做法整理成工具、模板和记录。' }
];

export const evidenceStates = [
  { key: 'public', label: '公开可复验', tone: 'verified' },
  { key: 'sanitized', label: '真实项目，脱敏展示', tone: 'sanitized' },
  { key: 'pending', label: '待外部验证', tone: 'pending' }
];

export const projects = [
  {
    id: 'industrial-energy-carbon-system',
    index: '01',
    title: '工业绿色微电网评价软件',
    pillar: '从分析到决策 · 从技术到应用',
    summary: '把分析师手里的资料、Excel 和报告流程做成可部署系统，覆盖数据导入、专业计算、审核、报告生成、权限和日志。',
    role: '组织并参与需求拆解、工作流设计、架构决策、测试和部署验证。',
    deliveryPath: '资料与 Excel → 数据导入 → 专业计算 → 审核 → 报告生成',
    publicScope: ['工作流结构', '系统范围', '测试与交付范围'],
    evidence: 'sanitized',
    problem: '分析师要在分散资料、Excel 和人工报告之间来回切换，团队需要一条可追溯、可复核的工作流。',
    decisions: [
      '以分析师真实工作流确定产品边界，优先打通数据导入、计算、审核和报告生成。',
      '选择适合交付条件的部署方式，并保留权限、日志、测试和回退要求。'
    ],
    results: [
      '形成可部署版本及配套测试、部署和交付记录。',
      '把专业计算、项目数据和报告产物接入同一套流程。'
    ],
    boundary: '本页不披露委托方、运行环境、账号、真实数据、合同、私有仓库和未授权代码。'
  },
  {
    id: 'industrial-digital-public-service-platform',
    index: '02',
    title: '工业技术改造投资管理平台项目',
    pillar: '从分析到决策 · 从技术到应用',
    summary: '前期把政策和产业问题写成项目方案、任务和预算；建设期再把材料中的角色、对象和审批关系落实为台账、权限、状态和工作台。',
    role: '参与申报论证、预算与任务设计，也参与建设期的材料梳理、产品定义、流程与权限设计，以及实现检查和测试。',
    deliveryPath: '政策与产业问题 → 项目方案与任务 → 角色与对象 → 审批流程 → 权限、状态与工作台',
    publicScope: ['方案结构', '对象与角色设计', '审批流程', '权限与测试范围'],
    evidence: 'sanitized',
    problem: '项目既要把政策目标变成可以申报和建设的任务，也要把建设材料中的角色、流程和监管要求放进系统。',
    decisions: [
      '申报阶段先把政策目标、建设任务、预算和验收要求对齐。',
      '建设阶段再梳理项目对象、角色、审批节点和退回路径，确定页面、权限与接口。'
    ],
    results: [
      '形成项目申报与论证材料、建设任务和预算安排。',
      '形成内部功能版本，覆盖项目台账、角色权限、审批状态和工作台；正式 UAT、预生产与生产验收尚未完成。'
    ],
    prototypeShowcase: {
      status: '内部功能版本 · 原型快照',
      intro: '以下界面使用脱敏样例数据，说明项目台账、角色、风险和任务怎样进入同一套工作台。',
      images: [
        {
          src: '/images/projects/tech-reform-cockpit.png',
          width: 1265,
          height: 712,
          alt: '工业技术改造投资管理平台项目驾驶舱的脱敏样例界面',
          label: '项目驾驶舱',
          explanation: '把项目台账、风险信号和角色视角放进同一工作台，便于项目管理团队持续跟进。',
          boundary: '脱敏样例界面，不含真实项目、组织信息或运行地址。'
        },
        {
          src: '/images/projects/tech-reform-workflow.png',
          width: 1265,
          height: 712,
          alt: '工业技术改造投资管理平台项目任务队列的脱敏样例界面',
          label: '任务队列',
          explanation: '按项目阶段、角色和时限组织待办，把申报、反馈、验收与问题处理放到同一条工作路径上。',
          boundary: '脱敏样例界面，不代表正式 UAT、预生产或生产验收。'
        }
      ]
    },
    boundary: '本页只说明脱敏后的方案结构、流程与测试范围；不披露原始材料、用户数据、账号、运行地址或私有代码。'
  },
  {
    id: 'oral-care-mini-program',
    index: '03',
    title: '口腔小程序项目',
    pillar: '从技术到应用',
    summary: '围绕家长、儿童和门诊协作，设计授权、检查报告、预约、随访与后台流程。',
    role: '参与业务梳理、产品流程、系统实现检查和受控演示准备。',
    deliveryPath: '家长授权 → 检查报告 → 预约与随访 → 后台协作',
    publicScope: ['产品流程', '小程序与后台界面', '主要测试范围'],
    evidence: 'sanitized',
    problem: '家长、儿童和门诊需要在授权清楚的前提下查看报告、安排服务并完成后续协作。',
    decisions: [
      '把家长授权和儿童信息关系放在主要流程之前处理。',
      '用状态和权限限制报告、预约与后台操作。'
    ],
    results: [
      '形成小程序与管理后台的受控 Demo。',
      '完成主要流程和相关测试，保留试点前仍需处理的运行事项。'
    ],
    prototypeShowcase: {
      status: '受控 Demo · 原型快照',
      intro: '以下界面使用原型样例数据，说明提醒、记录与随访辅助怎样组织为患者端和医生端的协作流程。',
      images: [
        {
          src: '/images/projects/oral-care-mini-program.png',
          width: 1265,
          height: 712,
          alt: '口腔矫治依从性管理工具患者端的脱敏样例界面',
          label: '患者端流程',
          explanation: '围绕当天任务、记录和提醒组织日常使用；不输出诊断或治疗建议。',
          boundary: '受控 Demo 的脱敏样例界面，不代表真实患者服务或正式上线。'
        },
        {
          src: '/images/projects/oral-care-admin.png',
          width: 1280,
          height: 720,
          alt: '口腔矫治依从性管理工具医生端工作台的脱敏样例界面',
          label: '医生端工作台',
          explanation: '用于查看样例任务、随访关注项和协作信息，体现患者端与医生端的工作关系。',
          boundary: '受控 Demo 的脱敏样例界面，不含真实患者资料或运行地址。'
        }
      ]
    },
    boundary: '不公开未成年人和健康原始数据；受控 Demo 与试点准备不代表已经公开生产运行。'
  }
];

export const tools = [
  {
    index: '01',
    title: 'Research-to-Decision Toolkit',
    question: '资料很多，怎样整理成能支持选择的材料？',
    summary: '把问题、来源、备选方案、不确定性和下一步行动放进同一个决策包。',
    homeSummary: '从研究问题、证据整理到方案比较的一组模板。',
    status: '公开可复验',
    version: 'v0.6.0',
    runtime: 'Python 3.9+',
    quickStart: {
      kind: 'command',
      label: '60 秒检查路径',
      items: [
        'r2d init brief.json',
        'r2d validate brief.json',
        'r2d report brief.json --output decision_report.md'
      ]
    },
    proofTypes: ['示例', '测试', 'Release', '决策包输出'],
    methodBoundary: '工具检查材料结构，不验证来源真实性，也不替负责人作出决定。',
    href: 'https://github.com/Anonymousyz/research-to-decision-toolkit',
    caseHref: '/cases/research-to-decision/'
  },
  {
    index: '02',
    title: 'AI Prototype-to-Production Toolkit',
    question: 'AI Demo 已经能跑，离真实使用还差什么？',
    summary: '根据项目材料列出生产就绪检查和否决项，区分能演示和能进入真实业务流程。',
    homeSummary: '帮助团队检查 AI 原型能否进入真实业务流程。',
    status: '公开可复验',
    version: 'v0.6.0',
    runtime: 'Python 3.9+',
    quickStart: {
      kind: 'command',
      label: '最短运行路径',
      items: [
        'ai-ready example --output assessment.json',
        'ai-ready report assessment.json --format html --output report.html'
      ]
    },
    proofTypes: ['本地 CLI', 'HTML 报告', '测试', 'Release'],
    methodBoundary: '70分结构和8个否决条件属于作者设计的检查方法，不代表安全、合规或生产批准。',
    href: 'https://github.com/Anonymousyz/ai-prototype-to-production-toolkit'
  },
  {
    index: '03',
    title: 'Awesome AI Production Readiness',
    question: '生产级AI遇到具体问题时，去哪里找资料和工具？',
    summary: '按评估、可观测性、护栏、治理、安全和部署分类的公开资源清单。',
    homeSummary: '收录 AI 系统上线前需要检查的工程和治理资料。',
    status: '持续维护',
    version: '持续维护',
    runtime: '网页与机器可读资料',
    quickStart: {
      kind: 'guide',
      label: '最短检查路径',
      items: [
        '打开 Quick decision map',
        '按问题类型进入对应分类',
        '采用前核对版本、许可证和维护状态'
      ]
    },
    proofTypes: ['来源链接', '分类结构', '快速决策地图', '机器可读入口'],
    methodBoundary: '清单提供检索起点。采用工具前仍需核对当前版本、适用条件和维护状态。',
    href: 'https://github.com/Anonymousyz/awesome-ai-production-readiness'
  },
  {
    index: '04',
    title: '高质量 AI 写作',
    question: '一篇知识工作文档在署名前，怎样判断它是否经得起审阅？',
    summary: '一套面向方案、评审、报告、决策备忘和技术文档的评审标准，覆盖立意、逻辑、来源、分寸、字句、文气和得体，并配有脱敏改稿判例与可安装的审稿技能。',
    homeSummary: '一套用于方案、报告和技术文档的署名前审稿标准。',
    status: '持续维护',
    version: 'v0.7.0',
    runtime: 'Markdown 标准与 Agent Skills',
    quickStart: {
      kind: 'guide',
      label: '最短阅读路径',
      items: [
        '从 STANDARD.md 了解写前模式、一票否决与三层八维',
        '按 principles/ 查看每个维度的问句、病征和改法',
        '安装 pre-sign-review，在署名前做一次全检'
      ]
    },
    proofTypes: ['评审标准', '脱敏判例', '测试', 'Agent Skills'],
    methodBoundary: '它提供判断标准和审稿路径，不替代事实核查、专业审核或署名责任。',
    href: 'https://github.com/Anonymousyz/quality-ai-writing'
  }
];
