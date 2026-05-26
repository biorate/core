import { BaseError } from '@biorate/errors';

/** @description Thrown when a connector kind is not registered in the test harness. */
export class TestingConnectorNotBoundError extends BaseError {
  public constructor(connector: string) {
    super(`Connector [%s] is not bound in test harness`, [connector]);
  }
}
