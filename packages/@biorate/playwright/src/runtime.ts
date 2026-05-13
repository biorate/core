import { allure as pwAllure } from 'allure-playwright';
// @ts-ignore
import { setGlobalTestRuntime } from 'allure-js-commons/sdk/runtime';

setGlobalTestRuntime({
  attachment: (name: string, content: Buffer | string, options: any) =>
    pwAllure.attachment(name, content, options),
  attachmentFromPath: (name: string, path: string, options: any) =>
    // allure-playwright@2.x не прокидывает "fromPath" в helpers, используем no-op
    Promise.resolve(),
  description: (value: string) => pwAllure.description(value),
  descriptionHtml: (value: string) => pwAllure.description(value),
  displayName: (_value: string) => Promise.resolve(),
  epic: (value: string) => pwAllure.epic(value),
  feature: (value: string) => pwAllure.feature(value),
  globalAttachment: (_name: string, _content: Buffer | string, _options: any) =>
    Promise.resolve(),
  globalAttachmentFromPath: (_name: string, _path: string, _options: any) =>
    Promise.resolve(),
  globalError: (_details: any) => Promise.resolve(),
  historyId: (_value: string) => Promise.resolve(),
  labels: (...values: any[]) => {
    pwAllure.labels(...values);
    return Promise.resolve();
  },
  links: (...values: any[]) => {
    pwAllure.links(...values);
    return Promise.resolve();
  },
  logStep: (name: string) => pwAllure.logStep(name),
  owner: (value: string) => pwAllure.owner(value),
  parentSuite: (value: string) => pwAllure.parentSuite(value),
  parameter: (name: string, value: any, options?: any) =>
    pwAllure.parameter(name, value, options),
  severity: (value: string) => pwAllure.severity(value),
  step: <T>(name: string, body: () => Promise<T>) => pwAllure.step(name, body),
  stepDisplayName: (_name: string) => Promise.resolve(),
  stepParameter: (_name: string, _value: any, _mode?: any) => Promise.resolve(),
  story: (value: string) => pwAllure.story(value),
  subSuite: (value: string) => pwAllure.subSuite(value),
  suite: (value: string) => pwAllure.suite(value),
  testCaseId: (_value: string) => Promise.resolve(),
} as any);
