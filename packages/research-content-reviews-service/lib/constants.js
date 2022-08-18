import { createEnum } from '@detechworld/toolbox';

const ASSESSMENT_CRITERIA_TYPE = createEnum({
  UNKNOWN: 0,
  NOVELTY: 1,
  TECHNICAL_QUALITY: 2,
  METHODOLOGY: 3,
  IMPACT: 4,
  RATIONALITY: 5,
  REPLICATION: 6,
  COMMERCIALIZATION: 7
});

export {
  ASSESSMENT_CRITERIA_TYPE
};
