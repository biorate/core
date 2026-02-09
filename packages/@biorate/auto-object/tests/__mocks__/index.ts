import { use } from 'chai';
import { EventEmitter } from 'events';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import {
  IsInt,
  IsObject,
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Type, Transform, Expose } from 'class-transformer';
import { AutoObject, AutoArray, Getter, PropertiesOnly, Default } from '../../src';

use(jestSnapshotPlugin());

class Geo extends Array<number> {}

class Address extends AutoObject<Address> {
  @IsString()
  public city: string;

  @IsString()
  public street: string;

  @IsNumber()
  public apartment: number;

  @IsNumber()
  @IsOptional()
  public postal?: number = 137186;

  @IsArray()
  @Type(() => Geo)
  public geo: Geo;

  public get inline() {
    return <Getter<string>>(
      `${this.postal}, ${this.city}, ${this.street} №${this.apartment}`
    );
  }
}

export class User extends AutoObject<User> {
  @IsInt()
  public id: number;

  @IsString()
  public firstName: string;

  @IsString()
  @IsOptional()
  @Default('Pupkin')
  public lastName?: string;

  @IsObject()
  @Type(() => Address)
  public address: Address;
}

export class Event extends AutoObject.extends<typeof EventEmitter, Event>(EventEmitter) {
  @IsString()
  public name: string;

  @IsObject()
  @Type(() => User)
  public payload: User;

  public constructor(data: PropertiesOnly<Event>, ...args: any[]) {
    // @ts-ignore
    super(data, ...args);
  }
}

export class Pet extends AutoObject<Pet> {
  @IsString()
  public type: string;
}

export class PetArray extends AutoArray<Pet> {
  protected get Class() {
    return Pet;
  }

  public test() {
    return 'Hello world!';
  }
}
