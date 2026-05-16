import * as supertest from 'supertest';
import * as nock from 'nock';
import * as sinon from 'sinon';
import * as chai from 'chai';
import type { Test, SuperTest } from 'supertest';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { api } from './api';
import { Unit } from './unit';
import { Validator } from './validator';
import { IUnitOptions, IValidatorOptions } from './interfaces';

chai.use(jestSnapshotPlugin());

/**
 * @description
 * Abstract base class for Mocha-based integration and unit test suites.
 *
 * Provides:
 * - HTTP API testing via supertest with request/response logging.
 * - Unit-testing with snapshot-based argument and return-value matching.
 * - Data validation using class-validator or custom validator functions.
 * - Nock-based HTTP mocking.
 * - Sinon test doubles.
 *
 * @example
 * ```ts
 * import { Spec } from '@biorate/mocha-spec';
 * import { suite, test } from '@biorate/mocha';
 *
 * @suite
 * class MyApiSpec extends Spec {
 *   protected get httpServer() {
 *     return app.listen();
 *   }
 *
 *   @test
 *   async 'GET /users'() {
 *     const res = await this.api().get('/users');
 *     this.expect(res.status).to.equal(200);
 *   }
 * }
 * ```
 */
export abstract class Spec {
  /**
   * @description Nock library reference for HTTP mocking.
   */
  public static get nock() {
    return nock;
  }

  /**
   * @description Sinon test double library reference.
   */
  public static get sinon() {
    return sinon;
  }

  /**
   * @description Chai assertion library reference.
   */
  public static get chai() {
    return chai;
  }

  /** @description Directory name for test data and argument files. */
  protected testDir = 'tests';

  /**
   * @description
   * Subclasses **must** override this getter to return the HTTP server instance
   * (e.g. an Express/NestJS app) for supertest to bind to.
   */
  protected abstract get httpServer(): any;

  #supertest: SuperTest<Test>;

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
   * @description Sinon test double library for per-instance use.
   */
  protected get sinon() {
    return sinon;
  }

  /**
   * @description Chai assertion library for per-instance use.
   */
  protected get chai() {
    return chai;
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
   * Assert deep equality between the result and expected value using chai.
   */
  protected exactly(result: any, expect: any, message?: string) {
    return chai.expect(result).is.deep.equal(expect, message);
  }
}
