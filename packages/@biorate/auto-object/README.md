# Auto object

Auto initialized object

### Examples:

```ts
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

class User extends AutoObject<User> {
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

const user = new User({
  id: 1,
  firstName: 'Vasya',
  lastName: 'Pupkin',
  address: {
    city: 'Moscow',
    street: 'Gogolya',
    postal: 123321,
    apartment: 74,
    geo: [12321, 32123],
  },
});

console.log(user); // User {
//   "address": Address {
//     "city": "Moscow",
//     "apartment": 74,
//     "geo": Array [
//       12321,
//       12323,
//     ],
//     "postal": 123321,
//     "street": "Gogolya",
//   },
//   "firstName": "Vasya",
//   "id": 1,
//   "lastName": "Pupkin",
// }
```

### AutoArray with AutoObject

For proper transformation of AutoArray fields within AutoObject, use the `@AutoArrayType` decorator:

```ts
class Pet extends AutoObject<Pet> {
  @IsString()
  public type: string;
}

class PetArray extends AutoArray<Pet> {
  protected get Class() {
    return Pet;
  }

  public test() {
    return 'Hello world!';
  }
}

class UserPets extends AutoObject<UserPets> {
  @IsString()
  public firstName: string;

  @IsArray()
  @AutoArrayType(() => PetArray)
  public pets: PetArray;
}

const userPets = new UserPets({
  firstName: 'Vasya',
  pets: [{ type: 'cat' }, { type: 'dog' }, { type: 'fox' }],
});

console.log(userPets.pets instanceof PetArray); // true
console.log(userPets.pets.test()); // 'Hello world!'
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/auto-object.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/auto-object/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/auto-object/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
