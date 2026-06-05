import { test } from '@playwright/test';
import type { Label, Link } from 'allure-js-commons';
import {
  MessageHolderTestRuntime,
  setGlobalTestRuntime,
} from 'allure-js-commons/sdk/runtime';

class BioratePlaywrightRuntime extends MessageHolderTestRuntime {
  async attachment(name: string, content: Buffer | string, options: any) {
    await test.info().attach(name, {
      body: content,
      contentType: options.contentType,
    });
  }

  async attachmentFromPath(name: string, path: string, options: any) {
    await test.info().attach(name, {
      path,
      contentType: options.contentType,
    });
  }

  async epic(value: string) {
    await this.sendMessage({
      type: 'metadata',
      data: { labels: [{ name: 'epic', value }] },
    });
  }

  async feature(value: string) {
    await this.sendMessage({
      type: 'metadata',
      data: { labels: [{ name: 'feature', value }] },
    });
  }

  async owner(value: string) {
    await this.sendMessage({
      type: 'metadata',
      data: { labels: [{ name: 'owner', value }] },
    });
  }

  async parentSuite(value: string) {
    await this.sendMessage({
      type: 'metadata',
      data: { labels: [{ name: 'parentSuite', value }] },
    });
  }

  async severity(value: string) {
    await this.sendMessage({
      type: 'metadata',
      data: { labels: [{ name: 'severity', value }] },
    });
  }

  async story(value: string) {
    await this.sendMessage({
      type: 'metadata',
      data: { labels: [{ name: 'story', value }] },
    });
  }

  async subSuite(value: string) {
    await this.sendMessage({
      type: 'metadata',
      data: { labels: [{ name: 'subSuite', value }] },
    });
  }

  async suite(value: string) {
    await this.sendMessage({
      type: 'metadata',
      data: { labels: [{ name: 'suite', value }] },
    });
  }

  async step<T = void>(name: string, body: () => T | PromiseLike<T>): Promise<T> {
    return test.step(name, () => body() as Promise<T>);
  }

  labels(...labels: Label[]) {
    return super.labels(...labels);
  }

  links(...links: Link[]) {
    return super.links(...links);
  }
}

setGlobalTestRuntime(new BioratePlaywrightRuntime());
