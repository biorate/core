import type { SuperTest, Test, Response } from 'supertest';
import type { ValidatorOptions } from 'class-validator';
import * as nock from 'nock';

export type IUnitOptions = {
  context: any;
  method: string;
  args?: unknown[];
  id?: string | number;
  ext?: 'ts' | 'json';
  expects?: {
    args: string | string[] | boolean;
    return: string | string[] | boolean;
    context: string | string[] | boolean;
  };
  catch?: (e: Error) => boolean;
};

export type IValidatorOptions = {
  schema: any;
  data?: any;
  field?: string;
  array?: boolean;
  validatorOptions?: ValidatorOptions;
  catch?: (e: Error) => boolean;
};

export declare class ValidationError extends Error {
  constructor(type: string, schema: any, errors: string[]);
}

export declare class ValidationSchemaWrongTypeError extends Error {
  constructor(type: string);
}

export declare class VitestSnapshotError extends Error {
  constructor();
}

export declare function api(
  request: SuperTest<Test>,
  logReq: (method: string, url: string, data: string) => unknown,
  logRes: (status: number, body: string) => unknown,
): any;

export declare function validate<T = Response>(
  schema: any,
  options?: Omit<IValidatorOptions, 'data' | 'schema'>,
): (data: any) => Promise<T>;

export declare function exactly<T = Response>(
  data: any,
  field?: string,
): (result: any) => T;

export declare class Unit {
  protected testDir: string;
  protected argsDir: string;
  constructor(testDir: string);
  process(options: IUnitOptions): Promise<void>;
}

export declare class Validator {
  protected static instance: Validator;
  static validate(options: IValidatorOptions): any;
  protected constructor();
  validate(options: IValidatorOptions): any;
  protected validateBySchema(data: any, options: IValidatorOptions): Promise<any>;
  protected validateByFunction(data: any, options: IValidatorOptions): Promise<any>;
}

export declare abstract class Spec {
  protected testDir: string;
  protected abstract get httpServer(): any;
  protected get supertest(): any;
  protected get nock(): typeof nock;
  protected get mocks(): any;
  protected get expect(): any;
  protected logReq(method: string, url: string, data: string): void;
  protected logRes(status: number, body: string): void;
  protected api(url?: string): any;
  protected unit(options: IUnitOptions): Promise<void>;
  protected validate(options: IValidatorOptions): any;
  protected exactly(result: any, exp: any, message?: string): any;
  static get nock(): typeof nock;
  static get mocks(): any;
  static get expect(): any;
  static sinon(): any;
}
