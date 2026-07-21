export const methodRelationships = {
  paths: [
    {
      key: 'analysis-to-decision',
      label: '主线一',
      title: '从分析到决策',
      from: '分析',
      to: '决策',
      items: [
        { title: '研究', href: '/methods/research-and-judgment/' },
        { title: '多元思维', href: '/methods/plural-thinking/' },
        { title: '写作', href: '/methods/writing/' },
      ],
    },
    {
      key: 'technology-to-application',
      label: '主线二',
      title: '从技术到应用',
      from: '技术',
      to: '应用',
      items: [
        { title: '产品', href: '/methods/product-definition/' },
        { title: '视觉', href: '/methods/visual-information-design/' },
        { title: '工程', href: '/methods/product-and-engineering/' },
      ],
    },
  ],
  learning: '持续学习：遇到新证据或实际结果时，回头修正前面的判断和做法。',
  note: '这里的顺序表示主要阅读关系。多元思维也参与产品和工程判断，写作用于产品与工程文档，视觉同时服务研究材料与软件界面。',
};

export const homepagePrinciples = [
  {
    title: '从决策问题开始',
    description: '先写清决策主体、待决定事项、可选动作、时间窗口和约束条件。',
    href: '/methods/research-and-judgment/',
  },
  {
    title: '分开事实、解释、评价和建议',
    description: '事实与推理分开，建议写清行动主体、触发条件和适用边界。',
    href: '/methods/writing/',
  },
  {
    title: '发布以后仍有工程责任',
    description: '交付时说明当前版本、已知限制、操作方式和责任人。',
    href: '/methods/product-and-engineering/',
  },
];
