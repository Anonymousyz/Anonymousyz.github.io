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
  learning: '持续学习：新证据或实际结果与原判断不符时，及时修改认识和做法。',
  note: '图中只列主要关系。多元思维也用于产品和工程判断，写作贯穿产品与工程文档，视觉设计同时服务研究材料和软件界面。',
};

export const homepagePrinciples = [
  {
    title: '先把要作的决定说清楚',
    description: '写清谁要作决定、决定什么、有哪些选择、何时决定，以及受到哪些限制。',
    href: '/methods/research-and-judgment/',
  },
  {
    title: '把事实、解释、评价和建议分开写',
    description: '事实与推理分开；建议写明谁来做、什么情况下做、适用于什么范围。',
    href: '/methods/writing/',
  },
  {
    title: '发布以后，问题仍要有人管',
    description: '交付时写明当前版本、已知限制、操作方法和负责人。',
    href: '/methods/product-and-engineering/',
  },
];
