import { BaseError } from '@biorate/errors';

export class ElasticCantConnectError extends BaseError {
    public constructor(e: Error) {
        super(`Can't connect to Elastic: [%s]`, [e.message]);
    }
}