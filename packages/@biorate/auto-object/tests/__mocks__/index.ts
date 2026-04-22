import { EventEmitter } from 'events';
import {
  IsInt,
  IsObject,
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  AutoObject,
  AutoArray,
  Getter,
  PropertiesOnly,
  Default,
  AutoArrayType,
} from '../../src';

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

export class Toy extends AutoObject<Toy> {
  @IsString()
  public name: string;
}

export class ToyArray extends AutoArray<Toy> {
  protected get Class() {
    return Toy;
  }

  public names() {
    return this.map((t) => t.name).join(',');
  }
}

export class PetWithToys extends AutoObject<PetWithToys> {
  @IsString()
  public type: string;

  @IsArray()
  @AutoArrayType(() => ToyArray)
  public toys: ToyArray;
}

export class PetWithToysArray extends AutoArray<PetWithToys> {
  protected get Class() {
    return PetWithToys;
  }
}

export class PetArray extends AutoArray<Pet> {
  protected get Class() {
    return Pet;
  }

  public test() {
    return 'Hello world!';
  }
}

export class UserPets extends AutoObject<UserPets> {
  @IsString()
  public firstName: string;

  @IsArray()
  @AutoArrayType(() => PetArray)
  public pets: PetArray;
}

export class UserPetsComplex extends AutoObject<UserPetsComplex> {
  @IsString()
  public firstName: string;

  @IsArray()
  @AutoArrayType(() => PetWithToysArray)
  public pets: PetWithToysArray;
}
