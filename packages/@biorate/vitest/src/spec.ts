import * as nock from 'nock';
import * as sinon from 'sinon';
import { expect } from 'vitest';
import { api } from './api';
import { IValidatorOptions } from './interfaces';
import { Validator } from './validator';

export abstract class Spec {
  public static get nock() {
    return nock;
  }

  public static get sinon() {
    return sinon;
  }

  public static get expect() {
    return expect;
  }

  protected testDir = 'tests';

  #httpServer: any;
  #fetchMock: any;

  protected get httpServer(): any {
    if (!this.#httpServer) {
      throw new Error('httpServer must be implemented in subclass');
    }
    return this.#httpServer;
  }

  protected set httpServer(value: any) {
    this.#httpServer = value;
  }

  protected get fetchMock() {
    if (!this.#fetchMock) {
      throw new Error('fetchMock must be set via setupFetch');
    }
    return this.#fetchMock;
  }

  protected get nock() {
    return nock;
  }

  protected get sinon() {
    return sinon;
  }

  protected get expect() {
    return expect;
  }

  protected logReq(method: string, url: string, data: string) {}

  protected logRes(status: number, body: string) {}

  protected api(url?: string) {
    const request = url ? fetch(url) : this.fetchMock;
    return api(request, this.logReq.bind(this), this.logRes.bind(this));
  }

  protected setupFetch(fetchMock: any) {
    this.#fetchMock = fetchMock;
  }

  protected validate(options: IValidatorOptions) {
    return Validator.validate(options);
  }

  protected exactly(result: any, expectValue: any, message?: string) {
    return expect(result).deep.equal(expectValue, message);
  }
}
