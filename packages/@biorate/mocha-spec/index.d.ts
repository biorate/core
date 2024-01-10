import * as supertest from 'supertest';
import { IUnitOptions, IValidatorOptions } from './src/interfaces';

export * from './src/interfaces';

declare module '@biorate/mocha-spec' {
  export abstract class Spec {
    protected testDir: string;

    protected abstract get httpServer(): any;

    protected get supertest(): supertest.SuperTest<supertest.Test>;

    protected unit(options: IUnitOptions): Promise<void>;

    protected validate(options: IValidatorOptions): Promise<void>;
  }
}
