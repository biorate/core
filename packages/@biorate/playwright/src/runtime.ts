import { allure as pwAllure } from 'allure-playwright';
// @ts-ignore
import { setGlobalTestRuntime } from 'allure-js-commons/sdk/runtime';

/**
 * @description
 * Sets up the global Allure runtime for Playwright so that `allure-js-commons` API
 * works correctly inside the Playwright test runner.
 */
setGlobalTestRuntime({
  attachment: (name: string, content: Buffer | string, options: any) =>
    pwAllure.attachment(name, content, options),
  attachmentFromPath: (name: string, path: string, options: any) =>
    // allure-playwright@2.x не прокидывает "fromPath" в helpers, используем no-op
    Promise.resolve(),
  description: (value: string) => pwAllure.description(value),
  descriptionHtml: (value: string) => pwAllure.descriptionHtml(value),
  displayName: (_value: string) => Promise.resolve(),
  epic: (value: string) => pwAllure.epic(value),
  feature: (value: string) => pwAllure.feature(value),
  globalAttachment: (_name: string, _content: Buffer | string, _options: any) =>
    Promise.resolve(),
  globalAttachmentFromPath: (_name: string, _path: string, _options: any) =>
    Promise.resolve(),
  globalError: (_details: any) => Promise.resolve(),
  historyId: (_value: string) => Promise.resolve(),
  labels: (...values: any[]) => pwAllure.labels(...values),
  links: (...values: any[]) => pwAllure.links(...values),
  owner: (value: string) => pwAllure.owner(value),
  parentSuite: (value: string) => pwAllure.parentSuite(value),
  parameter: (name: string, value: any, options?: any) =>
    pwAllure.parameter(name, value, options),
  severity: (value: string) => pwAllure.severity(value),
  step: (name: string, body: () => Promise<void>) => pwAllure.step(name, body),
  story: (value: string) => pwAllure.story(value),
  subSuite: (value: string) => pwAllure.subSuite(value),
  suite: (value: string) => pwAllure.suite(value),
  testCaseId: (_value: string) => Promise.resolve(),
} as any);
