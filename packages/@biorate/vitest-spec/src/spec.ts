import * as nock from 'nock';
import supertest from 'supertest';
import { createRequire } from 'module';
import { api } from './api.js';
import { Unit } from './unit.js';
import { Validator } from './validator.js';
import { IUnitOptions, IValidatorOptions } from './interfaces.js';

const vitest = globalThis as any;
const getExpect = () => vitest.expect;
const getVi = () => vitest.vi;

/**
 * @description
 * Abstract base class for Vitest-based integration and unit test suites.
 *
 * Provides:
 * - HTTP API testing via supertest with request/response logging.
 * - Unit-testing with snapshot-based argument and return-value matching.
 * - Data validation using class-validator or custom validator functions.
 * - Nock-based HTTP mocking.
 * - Sinon / vi mocks for test doubles.
 *
 * @example
 * ```ts
 * import { Spec } from '@biorate/vitest-spec';
 * import { suite, test } from '@biorate/vitest';
 *
 * @suite('My API Suite')
 * class MyApiSpec extends Spec {
 *   protected get httpServer() {
 *     return app.listen();
 *   }
 *
 *   @test('GET /users returns 200')
 *   async 'GET /users'() {
 *     const res = await this.api().get('/users');
 *     this.expect(res.status).toBe(200);
 *   }
 * }
 * ```
 */
export abstract class Spec {
  static #mocks() {
    try {
      return createRequire(process.cwd() + '/')('sinon');
    } catch {
      return getVi();
    }
  }

  /**
   * @description Nock library reference for HTTP mocking.
   */
  public static get nock() {
    return nock;
  }

  /**
   * @description Test double library (sinon if available, otherwise vi).
   * @deprecated Use {@link Spec.mocks} instead.
   */
  public static get sinon() {
    return Spec.#mocks();
  }

  /**
   * @description Test double library (sinon if available, otherwise vi).
   */
  public static get mocks() {
    return Spec.#mocks();
  }

  /**
   * @description Vitest `expect` function reference.
   */
  public static get expect() {
    return getExpect();
  }

  /** @description Directory name for test data and argument files. */
  protected testDir = 'tests';

  /**
   * @description
   * Subclasses **must** override this getter to return the HTTP server instance
   * (e.g. an Express/NestJS app) for supertest to bind to.
   */
  protected abstract get httpServer(): any;

  #supertest: any;

  #unit = new Unit(this.testDir);

  /**
   * @description Supertest instance bound to {@link httpServer}. Lazily initialised.
   */
  protected get supertest() {
    if (!this.#supertest) this.#supertest = supertest(this.httpServer);
    return this.#supertest;
  }

  /**
   * @description Nock library reference for per-instance HTTP mocking.
   */
  protected get nock() {
    return nock;
  }

  /**
   * @description Test double library.
   * @deprecated Use {@link mocks} instead.
   */
  protected get sinon() {
    return Spec.mocks();
  }

  /**
   * @description Test double library (sinon if available, otherwise vi).
   */
  protected get mocks() {
    return Spec.mocks();
  }

  /**
   * @description Vitest `expect` function reference for per-instance use.
   */
  protected get expect() {
    return getExpect();
  }

  /**
   * @description Request-logging hook. Override to log outgoing HTTP requests.
   * Default is a no-op.
   */
  protected logReq(method: string, url: string, data: string) {}

  /**
   * @description Response-logging hook. Override to log incoming HTTP responses.
   * Default is a no-op.
   */
  protected logRes(status: number, body: string) {}

  /**
   * @description
   * Creates an API test helper (supertest proxy) with request/response logging attached.
   */
  protected api(url?: string) {
    return api(
      url ? supertest(url) : this.supertest,
      this.logReq.bind(this),
      this.logRes.bind(this),
    );
  }

  /**
   * @description
   * Run a unit test: load arguments from disk, invoke the method, and run
   * snapshot matching on args, context, and return value.
   */
  protected unit(options: IUnitOptions) {
    return this.#unit.process(options);
  }

  /**
   * @description
   * Validate data using a class-validator schema or a custom validator function.
   */
  protected validate(options: IValidatorOptions) {
    return Validator.validate(options);
  }

  /**
   * @description
   * Assert deep equality between the result and expected value.
   * Wraps Vitest's `expect(result).toEqual(exp)`.
   */
  protected exactly(result: any, exp: any, message?: string) {
    return getExpect()(result, message).toEqual(exp);
  }
}
