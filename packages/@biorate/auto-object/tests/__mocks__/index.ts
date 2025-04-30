import { use } from 'chai';
import { EventEmitter } from 'events';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';
import { IsInt, IsObject, IsString, IsNumber, IsArray } from 'class-validator';
import { AutoObject, AutoArray, ValueObject, Getter, PropertiesOnly } from '../../src';

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
  public postal: number;

  @IsArray()
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
  public lastName: string;

  @IsObject()
  @ValueObject(Address)
  public address: Address;
}

export class Event extends AutoObject.extends<typeof EventEmitter, Event>(EventEmitter) {
  @IsString()
  public name: string;

  @IsObject()
  @ValueObject(User)
  public payload: User;

  public constructor(data: PropertiesOnly<Event>, ...args: any[]) {
    super(...[data, ...args]);
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
