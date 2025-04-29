import { use } from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { IsInt, IsObject, IsString, IsNumber, IsArray } from 'class-validator';
import { AutoObject, ValueObject, Getter } from '../../src';

use(jestSnapshotPlugin());

class Geo extends Array<number> {}

export class Address extends AutoObject<Address> {
  @IsString()
  public city: string;

  @IsString()
  public street: string;

  @IsNumber()
  public flat: number;

  @IsNumber()
  public index: number;

  @IsArray()
  public geo: Geo;

  public get inline() {
    return <Getter<string>>`${this.index}, ${this.city}, ${this.street} №${this.flat}`;
  }
}

export class User extends AutoObject<User> {
  @IsInt()
  public id: number;

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  @IsObject()
  @ValueObject(Address)
  public address: Address;
}
