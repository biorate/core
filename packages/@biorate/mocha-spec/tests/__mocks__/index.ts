import { use } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { IsNumber, IsString, IsBoolean } from 'class-validator';
import { Spec as CommonSpec } from '../../src';

use(jestSnapshotPlugin());

export abstract class Spec extends CommonSpec {
  protected get httpServer() {
    return;
  }
}

export class UnitTests {
  protected inc = 1;
  protected dec = 1;

  public increment(value: number) {
    this.inc += value;
    return this.inc;
  }

  public passthrow(a: number, b: number) {
    return { a, b };
  }

  public throw() {
    throw new Error('Test error');
  }
}

export class TestSchema {
  @IsNumber()
  public number: number;

  @IsString()
  public string: string;

  @IsBoolean()
  public boolean: boolean;
}

export const unitTests = new UnitTests();
