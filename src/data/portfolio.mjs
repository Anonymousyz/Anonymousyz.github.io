export const positioning = ['从分析到决策', '从技术到应用'];

export const heroCopy = '过去八年，我做过产业研究、政策分析和重大项目，也参与过产品和软件建设。这里有三个项目、七项工作方法和四个公开仓库。';

export const featuredCase = {
  index: '01',
  title: '工业绿色微电网评价软件',
  summary: '评价标准原来分散在政策文件、指标和报告中。这套软件把它们写成数据字段、计算规则和报告模板。我参与前期研究、产品设计、测试和交付检查；哪些已经验证、哪些仍需专业复核，分别记录。',
  role: '前期研究、产品设计、测试和交付检查',
  focus: '把评价标准写进数据、计算和报告',
  href: '/projects/#industrial-energy-carbon-system'
};

export const demos = [
  {
    index: '02',
    title: '工业技术改造投资管理平台项目',
    kind: '内部功能版本 · 界面快照',
    summary: '把申报材料里的项目、角色和审批关系写进台账、权限和工作台。',
    href: '/projects/#industrial-digital-public-service-platform'
  },
  {
    index: '03',
    title: '口腔小程序项目',
    kind: '受控演示版 · 界面快照',
    summary: '从家长授权开始，串起检查报告、预约、随访和门诊后台。',
    href: '/projects/#oral-care-mini-program'
  }
];

export const workLoop = [
  { index: '01', title: '问题界定', description: '说清谁要解决什么问题，现有流程又受哪些条件限制。' },
  { index: '02', title: '范围确定', description: '确定需求范围、优先顺序、主要风险和验收条件。' },
  { index: '03', title: '设计建设', description: '把业务流程、数据和专业规则写进系统功能。' },
  { index: '04', title: '验证交付', description: '完成测试与复核，并检查部署和回退安排。' },
  { index: '05', title: '整理留存', description: '把经常使用、已经验证的做法整理成工具、模板和记录。' }
];

export const evidenceStates = [
  { key: 'public', label: '可公开复查', tone: 'verified' },
  { key: 'sanitized', label: '真实项目，内容已脱敏', tone: 'sanitized' },
  { key: 'pending', label: '尚待外部验证', tone: 'pending' }
];

export const projects = [
  {
    id: 'industrial-energy-carbon-system',
    index: '01',
    title: '工业绿色微电网评价软件',
    pillar: '从分析到决策 · 从技术到应用',
    summary: '这套系统沿用分析师处理资料、Excel 和报告的顺序，覆盖数据导入、专业计算、审核、报告生成、权限和日志。',
    role: '我组织需求梳理，参与工作流程设计、架构选择、测试和部署验证。',
    deliveryPath: '资料与 Excel → 数据导入 → 专业计算 → 审核 → 报告生成',
    publicScope: ['工作流结构', '系统范围', '测试与交付范围'],
    evidence: 'sanitized',
    problem: '分析师原来要在分散的资料、Excel 和人工报告之间反复切换，团队需要一套便于追查数据来路、复核计算过程的工作流程。',
    decisions: [
      '产品范围按分析师的实际工作顺序来定，先把数据导入、计算、审核和报告生成接起来。',
      '部署方式根据交付条件确定；权限、日志、测试和回退一并列入交付检查。'
    ],
    results: [
      '完成可部署版本，并留存测试、部署和交付记录。',
      '项目数据、专业计算和报告已经接入同一条工作流程。'
    ],
    boundary: '本页不公开委托方、运行环境、账号、真实数据、合同、私有仓库和未授权代码。'
  },
  {
    id: 'industrial-digital-public-service-platform',
    index: '02',
    title: '工业技术改造投资管理平台项目',
    pillar: '从分析到决策 · 从技术到应用',
    summary: '申报阶段先把政策要求写成项目方案、建设任务和预算；建设阶段再把材料中的项目、角色和审批关系写进台账、权限、状态和工作台。',
    role: '我参与申报论证、预算和建设任务设计。进入建设阶段后，继续梳理材料，并参与产品定义、流程与权限设计、功能检查和测试。',
    deliveryPath: '政策与产业问题 → 项目方案与任务 → 角色与对象 → 审批流程 → 权限、状态与工作台',
    publicScope: ['方案结构', '对象与角色设计', '审批流程', '权限与测试范围'],
    evidence: 'sanitized',
    problem: '申报时，要把政策目标写成可以建设、可以验收的任务；建设时，还要把材料里的角色、流程和监管要求写进系统。',
    decisions: [
      '申报阶段逐项核对政策目标、建设任务、预算和验收要求。',
      '建设阶段梳理项目对象、角色、审批节点和退回路径，再据此确定页面、权限和接口。'
    ],
    results: [
      '完成项目申报与论证材料，明确建设任务和预算安排。',
      '已完成内部功能版本，覆盖项目台账、角色权限、审批状态和工作台。正式用户验收测试、预生产验证和生产验收尚未完成。'
    ],
    prototypeShowcase: {
      status: '内部功能版本 · 界面快照',
      intro: '以下是脱敏样例界面，展示项目台账、角色、风险和待办事项怎样集中到一个工作台。',
      images: [
        {
          src: '/images/projects/tech-reform-cockpit.png',
          width: 1265,
          height: 712,
          alt: '工业技术改造投资管理平台项目工作台的脱敏样例界面',
          label: '项目工作台',
          explanation: '工作台汇总项目台账、风险提示和各角色需要关注的信息，便于项目管理人员跟进。',
          boundary: '界面使用脱敏样例，不含真实项目、组织信息和运行地址。'
        },
        {
          src: '/images/projects/tech-reform-workflow.png',
          width: 1265,
          height: 712,
          alt: '工业技术改造投资管理平台项目任务队列的脱敏样例界面',
          label: '任务队列',
          explanation: '待办事项按项目阶段、角色和期限排列，申报、反馈、验收和问题处理沿着同一条工作路径推进。',
          boundary: '界面使用脱敏样例，不代表已经完成正式用户验收测试、预生产验证或生产验收。'
        }
      ]
    },
    boundary: '本页只公开脱敏后的方案结构、流程和测试范围，不公开原始材料、用户数据、账号、运行地址和私有代码。'
  },
  {
    id: 'oral-care-mini-program',
    index: '03',
    title: '口腔小程序项目',
    pillar: '从技术到应用',
    summary: '围绕家长、儿童和门诊的协作，先梳理授权关系，再把检查报告、预约、随访和后台处理接起来。',
    role: '我参与业务梳理和产品流程设计，也检查系统实现，并准备受控演示。',
    deliveryPath: '家长授权 → 检查报告 → 预约与随访 → 后台协作',
    publicScope: ['产品流程', '小程序与后台界面', '主要测试范围'],
    evidence: 'sanitized',
    problem: '家长明确授权范围并关联儿童信息后，才能查看检查报告、预约服务并继续随访。',
    decisions: [
      '先确定家长授权与儿童信息的关系，再进入报告和预约。',
      '用状态和权限分别控制报告查看、预约和后台操作。'
    ],
    results: [
      '已完成小程序和管理后台的受控演示版。',
      '主要流程和相关测试已经完成；试点前仍有运行事项需要处理。'
    ],
    prototypeShowcase: {
      status: '受控演示版 · 界面快照',
      intro: '以下界面使用样例数据，展示患者端的提醒和记录怎样与医生端的随访工作衔接。',
      images: [
        {
          src: '/images/projects/oral-care-mini-program.png',
          width: 1265,
          height: 712,
          alt: '口腔矫治依从性管理工具患者端的脱敏样例界面',
          label: '患者端流程',
          explanation: '患者端按当天任务、记录和提醒安排日常使用，不提供诊断或治疗建议。',
          boundary: '这是受控演示版的脱敏界面，不代表已经面向真实患者服务或正式上线。'
        },
        {
          src: '/images/projects/oral-care-admin.png',
          width: 1280,
          height: 720,
          alt: '口腔矫治依从性管理工具医生端工作台的脱敏样例界面',
          label: '医生端工作台',
          explanation: '医生端用于查看样例任务、随访关注事项和协作信息，并与患者端记录衔接。',
          boundary: '这是受控演示版的脱敏界面，不含真实患者资料和运行地址。'
        }
      ]
    },
    boundary: '本页不公开未成年人信息和原始健康数据。受控演示和试点准备均不等于正式上线。'
  }
];

export const tools = [
  {
    index: '01',
    title: 'Research-to-Decision Toolkit',
    question: '材料很多，怎样把问题、证据和选择说清楚？',
    summary: '把待决定的问题、证据来源、备选方案、尚不确定的事项和下一步行动整理成一份决策包。',
    homeSummary: '一组用于界定研究问题、整理证据和比较方案的模板。',
    status: '可公开复查',
    version: 'v0.6.0',
    runtime: 'Python 3.9+',
    quickStart: {
      kind: 'command',
      label: '三步试用',
      items: [
        'r2d init brief.json',
        'r2d validate brief.json',
        'r2d report brief.json --output decision_report.md'
      ]
    },
    proofTypes: ['示例', '测试', 'Release', '决策包输出'],
    methodBoundary: '工具只检查材料结构，不判断来源是否真实，也不代替负责人作决定。',
    href: 'https://github.com/Anonymousyz/research-to-decision-toolkit',
    caseHref: '/cases/research-to-decision/'
  },
  {
    index: '02',
    title: 'AI Prototype-to-Production Toolkit',
    question: 'AI 原型已经能跑，投入真实业务前还要检查什么？',
    summary: '根据项目材料列出上线前检查项和暂缓条件，帮助团队分清原型演示与真实业务使用。',
    homeSummary: '帮助团队检查 AI 原型进入真实业务前还缺什么。',
    status: '可公开复查',
    version: 'v0.6.0',
    runtime: 'Python 3.9+',
    quickStart: {
      kind: 'command',
      label: '快速试用',
      items: [
        'ai-ready example --output assessment.json',
        'ai-ready report assessment.json --format html --output report.html'
      ]
    },
    proofTypes: ['本地 CLI', 'HTML 报告', '测试', 'Release'],
    methodBoundary: '“70 分结构”和 8 项暂缓条件是作者设计的检查方法，不能据此认定系统安全、合规或获准上线。',
    href: 'https://github.com/Anonymousyz/ai-prototype-to-production-toolkit'
  },
  {
    index: '03',
    title: 'Awesome AI Production Readiness',
    question: '准备把 AI 系统用于真实业务时，哪些资料和工具值得先查？',
    summary: '按评估、可观测性、护栏、治理、安全和部署分类整理的公开资料清单。',
    homeSummary: '整理 AI 系统用于真实业务前可查的工程和治理资料。',
    status: '持续维护',
    version: '持续维护',
    runtime: '网页和机器可读清单',
    quickStart: {
      kind: 'guide',
      label: '查找顺序',
      items: [
        '打开 Quick decision map',
        '按问题类型进入对应分类',
        '采用前核对版本、许可证和维护状态'
      ]
    },
    proofTypes: ['来源链接', '分类结构', '快速决策地图', '机器可读入口'],
    methodBoundary: '这份清单只提供查找起点。采用任何工具前，仍要核对版本、适用条件和维护状态。',
    href: 'https://github.com/Anonymousyz/awesome-ai-production-readiness'
  },
  {
    index: '04',
    title: '高质量 AI 写作',
    question: '方案、报告或技术文档署名前，怎么判断它经不经得起审阅？',
    summary: '按立意、逻辑、来源、分寸、字句、文气和得体程度检查文稿，并提供脱敏改稿示例和可安装的审稿技能。',
    homeSummary: '一套供方案、报告和技术文档署名前使用的审稿标准。',
    status: '持续维护',
    version: 'v0.7.0',
    runtime: 'Markdown 标准与 Agent Skills',
    quickStart: {
      kind: 'guide',
      label: '阅读顺序',
      items: [
        '从 STANDARD.md 了解写前模式、一票否决与三层八维',
        '按 principles/ 查看每个维度的问句、病征和改法',
        '安装 pre-sign-review，在署名前做一次全检'
      ]
    },
    proofTypes: ['评审标准', '脱敏判例', '测试', 'Agent Skills'],
    methodBoundary: '它只提供审稿标准和检查顺序，不能代替事实核查、专业审核，也不能替作者承担署名责任。',
    href: 'https://github.com/Anonymousyz/quality-ai-writing'
  }
];
