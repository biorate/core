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
  public flat: number;

  @IsNumber()
  public index: number;

  @IsArray()
  public geo: Geo;

  public get inline() {
    return <Getter<string>>`${this.index}, ${this.city}, ${this.street} №${this.flat}`;
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
    index: 123321,
    flat: 74,
    geo: [12321, 32123],
  },
});

console.log(user);  // User {
                    //   "address": Address {
                    //     "city": "Moscow",
                    //     "flat": 74,
                    //     "geo": Array [
                    //       12321,
                    //       32123,
                    //     ],
                    //     "index": 123321,
                    //     "street": "Gogolya",
                    //   },
                    //   "firstName": "Vasya",
                    //   "id": 1,
                    //   "lastName": "Pupkin",
                    // }
```

### Learn

- Documentation can be found here - [docs](https://biorate.github.io/core/modules/auto-object.html).

### Release History

See the [CHANGELOG](https://github.com/biorate/core/blob/master/packages/%40biorate/auto-object/CHANGELOG.md)

### License

[MIT](https://github.com/biorate/core/blob/master/packages/%40biorate/auto-object/LICENSE)

Copyright (c) 2021-present [Leonid Levkin (llevkin)](mailto:llevkin@yandex.ru)
