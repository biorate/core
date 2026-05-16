/** @description Barrel module re-exporting vitest and allure integration */
export * from 'allure-js-commons'; // Backward capability
export * as allure from 'allure-js-commons';
export * from './interfaces';
export * from './symbols';
export * from './errors';
export { Context } from './context';
export { Scenario, Step } from './scenario';
export {
  suite,
  test,
  skip,
  only,
  todo,
  timeout,
  repeats,
  retries,
  parallel,
  slow,
  pending,
  params,
  context,
  allureStep,
  attachment,
  testCaseId,
  data,
  label,
  link,
  id,
  epic,
  feature,
  story,
  allureSuite,
  parentSuite,
  subSuite,
  owner,
  severity,
  severity as Severity, // Backward capability
  tag,
  tags,
  description,
  issue,
  Vitest,
  decorate,
  assignPmsUrl,
  assignTmsUrl,
} from './vitest';
