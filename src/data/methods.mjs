import { analysisMethods as analysisMethodDefinitions } from './method-content/analysis.mjs';
import { applicationMethods as applicationMethodDefinitions } from './method-content/application.mjs';
import { learningMethod as learningMethodDefinition } from './method-content/learning.mjs';

export { methodRelationships } from './method-relationships.mjs';

export const identityProfiles = [
  {
    key: 'long-termist',
    title: '长期主义者',
    homeNote: '我愿意把时间放在能够积累、反复使用并接受结果检验的事情上。',
    quote: '无欲速，无见小利。欲速则不达，见小利则大事不成。',
    attribution: '孔子《论语·子路》',
    englishQuote: "It's All About the Long Term.",
    englishAttribution: 'Jeff Bezos，1997 Letter to Shareholders',
    sourceUrl: 'https://ir.aboutamazon.com/files/doc_financials/annual/2002_shareholderLetter.pdf',
  },
  {
    key: 'lifelong-learner',
    title: '终身学习者',
    homeNote: '我对陌生领域保持兴趣，也会根据新材料和实际结果修正自己的理解。',
    quote: '学不可以已。',
    attribution: '荀子《劝学》',
    englishQuote: 'Stay hungry. Stay foolish.',
    englishAttribution: 'Whole Earth Catalog，Steve Jobs 2005 年斯坦福演讲引述',
    sourceUrl: 'https://news.stanford.edu/stories/2005/06/steve-jobs-2005-graduates-stay-hungry-stay-foolish',
  },
];

export const learningMethod = learningMethodDefinition;
export const analysisMethods = analysisMethodDefinitions;
export const applicationMethods = applicationMethodDefinitions;

function withoutArticle(definition) {
  const { article: _article, ...topic } = definition;
  return topic;
}

export const methodSystem = {
  learning: withoutArticle(learningMethod),
  tracks: [
    {
      key: 'analysis-to-decision',
      label: '主线一',
      title: '从分析到决策',
      methods: analysisMethods.map(withoutArticle),
    },
    {
      key: 'technology-to-application',
      label: '主线二',
      title: '从技术到应用',
      methods: applicationMethods.map(withoutArticle),
    },
  ],
};

const trackTitles = new Map([
  ['learning', '持续学习'],
  ...methodSystem.tracks.map((track) => [track.key, track.title]),
]);

function publishArticle(definition) {
  const { article, ...topic } = definition;
  return {
    ...topic,
    ...article,
    trackTitle: trackTitles.get(topic.track),
  };
}

export const methodArticles = [
  learningMethod,
  ...analysisMethods,
  ...applicationMethods,
].map(publishArticle);

export const methodBySlug = Object.fromEntries(
  methodArticles.map((article) => [article.slug, article]),
);
